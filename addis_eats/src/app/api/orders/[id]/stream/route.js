import { getAuthenticatedUser } from "@/lib/auth";
import { getOrderForUser } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });

  const { id } = await params;
  const order = await getOrderForUser(id, user.id);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

  const encoder = new TextEncoder();
  let timer;
  let closed = false;
  let lastStatus = order.status;
  let lastCheck = 0;
  let controllerRef;
  const close = (controller) => {
    if (closed) return;
    closed = true;
    clearInterval(timer);
    request.signal.removeEventListener("abort", onAbort);
    try { controller.close(); } catch { /* The client may have disconnected. */ }
  };
  const onAbort = () => {
    if (controllerRef) close(controllerRef);
  };
  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller;
      const send = (status) => controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status })}\n\n`));
      send(lastStatus);
      if (["delivered", "cancelled"].includes(lastStatus)) {
        close(controller);
        return;
      }
      timer = setInterval(async () => {
        if (closed) return;
        try {
          const current = await getOrderForUser(id, user.id);
          if (!current) return close(controller);
          if (current.status !== lastStatus) {
            lastStatus = current.status;
            send(lastStatus);
            if (["delivered", "cancelled"].includes(lastStatus)) close(controller);
          } else if (Date.now() - lastCheck > 15000) {
            controller.enqueue(encoder.encode(": keep-alive\n\n"));
          }
          lastCheck = Date.now();
        } catch {
          close(controller);
        }
      }, 1000);
      request.signal.addEventListener("abort", onAbort, { once: true });
    },
    cancel() {
      closed = true;
      clearInterval(timer);
      request.signal.removeEventListener("abort", onAbort);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
