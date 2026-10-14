export function isAdminEmail(email, configuredAdmins = process.env.ADMIN_EMAILS ?? "") {
  if (!email) return false;
  const allowedEmails = new Set(
    configuredAdmins.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean),
  );
  return allowedEmails.has(email.trim().toLowerCase());
}
