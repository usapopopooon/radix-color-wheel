import type { HSLA } from '../types'
import { hslToHex } from './hslToHex'

/**
 * Convert HSLA color space to HEX format (8 digits)
 *
 * @param hsla - HSLA color object with h 0-360, s,l 0-100, a 0-1
 * @returns HEX8 color code (e.g., "#ff0000ff")
 *
 * @example
 * ```ts
 * hslaToHex({ h: 0, s: 100, l: 50, a: 1 })   // => "#ff0000ff"
 * hslaToHex({ h: 0, s: 100, l: 50, a: 0.5 }) // => "#ff000080"
 * hslaToHex({ h: 120, s: 100, l: 50, a: 0 }) // => "#00ff0000"
 * ```
 */
export function hslaToHex(hsla: HSLA): string {
  const hex6 = hslToHex(hsla)

  const alphaHex = Math.round(Math.max(0, Math.min(1, hsla.a)) * 255)
    .toString(16)
    .padStart(2, '0')

  return `${hex6}${alphaHex}`
}
