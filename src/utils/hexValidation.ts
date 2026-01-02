/**
 * Validate if a string is a valid 6-digit HEX color
 *
 * @param value - The string to validate
 * @returns true if valid HEX color format (#rrggbb)
 */
export function isValidHex6(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value)
}

/**
 * Validate if a string is a valid HEX color (6 or 8 digits)
 *
 * @param value - The string to validate
 * @returns true if valid HEX color format (#rrggbb or #rrggbbaa)
 */
export function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value)
}

/**
 * Normalize HEX input value
 *
 * Adds # prefix if missing and converts to lowercase
 *
 * @param value - The input value
 * @returns Normalized HEX string
 */
export function normalizeHex(value: string): string {
  let normalized = value.trim()
  if (!normalized.startsWith('#')) {
    normalized = '#' + normalized
  }
  return normalized.toLowerCase()
}
