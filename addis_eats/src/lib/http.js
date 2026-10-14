/** One error envelope for every failed dishes (and other) API response. */
export function jsonError(error, status) {
  return Response.json({ error }, { status });
}
