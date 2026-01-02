import type { HSLA } from '../types'
import { hexToHsl } from './hexToHsl'
import { parseAlphaFromHex } from './alphaConversion'
import { hexOrHex8Schema } from '../schemas'
import { ColorValidationError } from '../errors'

/**
 * Convert HEX format to HSLA color space
 *
 * @param hex - HEX color code (6 or 8 digits, e.g., "#ff0000" or "#ff0000ff")
 * @returns HSLA color object with h 0-360, s,l 0-100, a 0-1
 * @throws {ColorValidationError} If hex is not a valid 6 or 8 digit hex color
 *
 * @example
 * ```ts
 * hexToHsla('#ff0000')   // => { h: 0, s: 100, l: 50, a: 1 }
 * hexToHsla('#ff000080') // => { h: 0, s: 100, l: 50, a: 0.5 }
 * hexToHsla('#00ff00ff') // => { h: 120, s: 100, l: 50, a: 1 }
 * ```
 */
export function hexToHsla(hex: string): HSLA {
  const result = hexOrHex8Schema.safeParse(hex)
  if (!result.success) {
    throw new ColorValidationError({
      functionName: 'hexToHsla',
      message: result.error.issues[0]?.message ?? 'Invalid hex color',
      receivedValue: hex,
      issues: result.error.issues,
    })
  }
  const hsl = hexToHsl(hex)

  // If 8-digit hex, parse alpha; otherwise default to 1
  const a = hex.length === 9 ? parseAlphaFromHex(hex) / 100 : 1

  return { ...hsl, a } as const
}
