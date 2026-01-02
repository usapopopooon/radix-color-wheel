import type { HSLA } from '../types'
import { hexToHsl } from './hexToHsl'
import { parseAlphaFromHex } from './alphaConversion'

/**
 * Convert HEX format to HSLA color space
 *
 * @param hex - HEX color code (6 or 8 digits, e.g., "#ff0000" or "#ff0000ff")
 * @returns HSLA color object with h 0-360, s,l 0-100, a 0-1
 *
 * @example
 * ```ts
 * hexToHsla('#ff0000')   // => { h: 0, s: 100, l: 50, a: 1 }
 * hexToHsla('#ff000080') // => { h: 0, s: 100, l: 50, a: 0.5 }
 * hexToHsla('#00ff00ff') // => { h: 120, s: 100, l: 50, a: 1 }
 * ```
 */
export function hexToHsla(hex: string): HSLA {
  const hsl = hexToHsl(hex)

  // If 8-digit hex, parse alpha; otherwise default to 1
  const a = hex.length === 9 ? parseAlphaFromHex(hex) / 100 : 1

  return { ...hsl, a } as const
}
