export function getSafeRedirectPath(value) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/checkout";
  }

  const destination = new URL(value, "http://localhost");
  if (destination.origin !== "http://localhost") return "/checkout";

  return `${destination.pathname}${destination.search}${destination.hash}`;
}
