import type { RGBA } from '../types'
import { parseAlphaFromHex } from './alphaConversion'
import { hexOrHex8Schema } from '../schemas'
import { ColorValidationError } from '../errors'

/**
 * Convert HEX format to RGBA color space
 *
 * @param hex - HEX color code (6 or 8 digits, e.g., "#ff0000" or "#ff0000ff")
 * @returns RGBA color object with r,g,b 0-255 and a 0-1
 * @throws {ColorValidationError} If hex is not a valid 6 or 8 digit hex color
 *
 * @example
 * ```ts
 * hexToRgba('#ff0000')   // => { r: 255, g: 0, b: 0, a: 1 }
 * hexToRgba('#ff000080') // => { r: 255, g: 0, b: 0, a: 0.5 }
 * hexToRgba('#00ff00ff') // => { r: 0, g: 255, b: 0, a: 1 }
 * ```
 */
export function hexToRgba(hex: string): RGBA {
  const result = hexOrHex8Schema.safeParse(hex)
  if (!result.success) {
    throw new ColorValidationError({
      functionName: 'hexToRgba',
      message: result.error.issues[0]?.message ?? 'Invalid hex color',
      receivedValue: hex,
      issues: result.error.issues,
    })
  }
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // If 8-digit hex, parse alpha; otherwise default to 1
  const a = hex.length === 9 ? parseAlphaFromHex(hex) / 100 : 1

  return { r, g, b, a } as const
}
