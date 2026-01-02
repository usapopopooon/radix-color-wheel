/** Maximum value for alpha channel in hex (255 = 0xff) */
const ALPHA_MAX = 255

/**
 * Convert alpha value (0-100) to hex string (00-ff)
 *
 * @param alpha - Alpha value from 0 to 100
 * @returns Two-digit hex string
 */
export function alphaToHex(alpha: number): string {
  return Math.round((alpha / 100) * ALPHA_MAX)
    .toString(16)
    .padStart(2, '0')
}

/**
 * Parse alpha from 8-digit hex string
 * Returns 100 if hex is 6 digits (no alpha)
 *
 * @param hex - Hex color string (#rrggbb or #rrggbbaa)
 * @returns Alpha value from 0 to 100
 */
export function parseAlphaFromHex(hex: string): number {
  if (hex.length === 9) {
    // #rrggbbaa format
    const alphaHex = hex.slice(7, 9)
    return Math.round((parseInt(alphaHex, 16) / ALPHA_MAX) * 100)
  }
  return 100
}

/**
 * Combine a 6-digit hex color with an alpha value
 *
 * @param hex - 6-digit hex color (#rrggbb)
 * @param alpha - Alpha value from 0 to 100
 * @returns Hex color, with alpha suffix if alpha < 100
 */
export function combineHexWithAlpha(hex: string, alpha: number): string {
  return alpha < 100 ? `${hex}${alphaToHex(alpha)}` : hex
}
