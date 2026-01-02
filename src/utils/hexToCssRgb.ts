import { hexToRgb } from './hexToRgb'
import { hexToRgba } from './hexToRgba'
import { hexOrHex8Schema } from '../schemas'
import { ColorValidationError } from '../errors'

/**
 * Convert HEX format to CSS rgb() or rgba() string
 *
 * @param hex - HEX color code (6 or 8 digits, e.g., "#ff0000" or "#ff0000ff")
 * @returns CSS color string (e.g., "rgb(255, 0, 0)" or "rgba(255, 0, 0, 0.5)")
 * @throws {ColorValidationError} If hex is not a valid 6 or 8 digit hex color
 *
 * @example
 * ```ts
 * hexToCssRgb('#ff0000')   // => "rgb(255, 0, 0)"
 * hexToCssRgb('#ff000080') // => "rgba(255, 0, 0, 0.5)"
 * hexToCssRgb('#00ff00ff') // => "rgb(0, 255, 0)"
 * ```
 */
export function hexToCssRgb(hex: string): string {
  const result = hexOrHex8Schema.safeParse(hex)
  if (!result.success) {
    throw new ColorValidationError({
      functionName: 'hexToCssRgb',
      message: result.error.issues[0]?.message ?? 'Invalid hex color',
      receivedValue: hex,
      issues: result.error.issues,
    })
  }
  if (hex.length === 9) {
    const { r, g, b, a } = hexToRgba(hex)
    // If alpha is 1, return rgb() instead of rgba()
    if (a === 1) {
      return `rgb(${r}, ${g}, ${b})`
    }
    // Round alpha to 2 decimal places
    const alphaRounded = Math.round(a * 100) / 100
    return `rgba(${r}, ${g}, ${b}, ${alphaRounded})`
  }

  const { r, g, b } = hexToRgb(hex)
  return `rgb(${r}, ${g}, ${b})`
}
