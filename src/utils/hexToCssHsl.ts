import { hexToHsl } from './hexToHsl'
import { hexToHsla } from './hexToHsla'
import { hexOrHex8Schema } from '../schemas'
import { ColorValidationError } from '../errors'

/**
 * Convert HEX format to CSS hsl() or hsla() string
 *
 * @param hex - HEX color code (6 or 8 digits, e.g., "#ff0000" or "#ff0000ff")
 * @returns CSS color string (e.g., "hsl(0, 100%, 50%)" or "hsla(0, 100%, 50%, 0.5)")
 * @throws {ColorValidationError} If hex is not a valid 6 or 8 digit hex color
 *
 * @example
 * ```ts
 * hexToCssHsl('#ff0000')   // => "hsl(0, 100%, 50%)"
 * hexToCssHsl('#ff000080') // => "hsla(0, 100%, 50%, 0.5)"
 * hexToCssHsl('#00ff00ff') // => "hsl(120, 100%, 50%)"
 * ```
 */
export function hexToCssHsl(hex: string): string {
  const result = hexOrHex8Schema.safeParse(hex)
  if (!result.success) {
    throw new ColorValidationError({
      functionName: 'hexToCssHsl',
      message: result.error.issues[0]?.message ?? 'Invalid hex color',
      receivedValue: hex,
      issues: result.error.issues,
    })
  }
  if (hex.length === 9) {
    const { h, s, l, a } = hexToHsla(hex)
    // If alpha is 1, return hsl() instead of hsla()
    if (a === 1) {
      return `hsl(${h}, ${s}%, ${l}%)`
    }
    // Round alpha to 2 decimal places
    const alphaRounded = Math.round(a * 100) / 100
    return `hsla(${h}, ${s}%, ${l}%, ${alphaRounded})`
  }

  const { h, s, l } = hexToHsl(hex)
  return `hsl(${h}, ${s}%, ${l}%)`
}
