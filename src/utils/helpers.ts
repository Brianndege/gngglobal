/**
 * Formats a date string to a human-readable format.
 *
 * @param dateString - ISO date string or parseable date
 * @param locale - BCP 47 locale (default: "en-AU")
 */
export function formatDate(
  dateString: string,
  locale: string = "en-AU",
): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Truncates text to the given character limit, appending "…" if needed.
 *
 * @param text - The source string
 * @param limit - Maximum character count (default: 160)
 */
export function truncate(text: string, limit: number = 160): string {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}…`;
}

/**
 * Converts a string to a URL-friendly slug.
 *
 * @param text - Source string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns initials from a full name (up to 2 characters).
 *
 * @param name - Full name string
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Validates an email address.
 *
 * @param email - Email string to validate
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates an Australian phone number.
 *
 * @param phone - Phone string to validate
 */
export function isValidPhone(phone: string): boolean {
  return /^(\+?61|0)[2-9]\d{8}$/.test(phone.replace(/\s/g, ""));
}
