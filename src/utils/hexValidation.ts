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
 * Check if a hex string is 8-digit format (includes alpha)
 *
 * @param hex - The hex string to check (must be valid hex)
 * @returns true if hex is 8-digit format (#rrggbbaa)
 */
export function isHex8(hex: string): boolean {
  return hex.length === 9
}

/**
 * Extract 6-digit hex from potentially 8-digit hex
 *
 * @param hex - The hex string (#rrggbb or #rrggbbaa)
 * @returns 6-digit hex (#rrggbb)
 */
export function stripAlphaFromHex(hex: string): string {
  return isHex8(hex) ? hex.slice(0, 7) : hex
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
