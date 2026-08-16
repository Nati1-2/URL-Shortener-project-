import crypto from "crypto";

const BASE62_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Generates a cryptographically secure random shortcode of specified length.
 * Uses crypto.randomBytes rather than Math.random() for collision resistance and security.
 */
export function generateShortCode(length: number = 7): string {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += BASE62_ALPHABET[bytes[i] % BASE62_ALPHABET.length];
  }
  return result;
}

/**
 * Validates whether a custom slug matches URL-safe character conventions (alphanumeric and dashes).
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length < 2 || slug.length > 60) return false;
  return /^[a-zA-Z0-9_-]+$/.test(slug);
}

/**
 * Validates whether a destination URL is formatted as a valid http or https address.
 */
export function isValidUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
