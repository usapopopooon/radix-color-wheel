import type { HSL } from '../types'
import { hexOrHex8Schema } from '../schemas'
import { ColorValidationError } from '../errors'

/**
 * Convert HEX format to HSL color space
 *
 * RGB to HSL conversion algorithm:
 * https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
 *
 * @param hex - HEX color code (e.g., "#ff0000")
 * @returns HSL color object
 * @throws {ColorValidationError} If hex is not a valid 6 or 8 digit hex color
 *
 * @example
 * ```ts
 * hexToHsl('#ff0000') // => { h: 0, s: 100, l: 50 }
 * hexToHsl('#00ff00') // => { h: 120, s: 100, l: 50 }
 * hexToHsl('#ffffff') // => { h: 0, s: 0, l: 100 }
 * hexToHsl('#808080') // => { h: 0, s: 0, l: 50 }
 * ```
 */
export function hexToHsl(hex: string): HSL {
  const result = hexOrHex8Schema.safeParse(hex)
  if (!result.success) {
    throw new ColorValidationError({
      functionName: 'hexToHsl',
      message: result.error.issues[0]?.message ?? 'Invalid hex color',
      receivedValue: hex,
      issues: result.error.issues,
    })
  }
  // Parse hex to RGB (0-1 range)
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min

  // Calculate Lightness
  const l = (max + min) / 2

  // Calculate Saturation
  let s = 0
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
  }

  // Calculate Hue
  let h = 0
  if (d !== 0) {
    if (max === r) {
      h = ((g - b) / d) % 6
    } else if (max === g) {
      h = (b - r) / d + 2
    } else {
      h = (r - g) / d + 4
    }
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  } as const
}
