import type { RGB, RGBA, HSL, HSLA } from '../types'
import { ColorValidationError } from '../errors'
import { hexToRgb } from './hexToRgb'
import { rgbToHex } from './rgbToHex'
import { hexToHsl } from './hexToHsl'
import { hslToHex } from './hslToHex'
import { hexToRgba } from './hexToRgba'
import { rgbaToHex } from './rgbaToHex'
import { hexToHsla } from './hexToHsla'
import { hslaToHex } from './hslaToHex'
import { hexToCssRgb } from './hexToCssRgb'
import { cssRgbToHex } from './cssRgbToHex'
import { hexToCssHsl } from './hexToCssHsl'
import { cssHslToHex } from './cssHslToHex'

/**
 * Result type for safe conversion functions
 */
export type SafeResult<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: ColorValidationError }

/**
 * Wraps a conversion function to return a SafeResult instead of throwing
 */
function createSafe<TInput, TOutput>(
  fn: (input: TInput) => TOutput
): (input: TInput) => SafeResult<TOutput> {
  return (input: TInput) => {
    try {
      const data = fn(input)
      return { success: true, data, error: null }
    } catch (error) {
      if (error instanceof ColorValidationError) {
        return { success: false, data: null, error }
      }
      // Re-throw unexpected errors
      throw error
    }
  }
}

/**
 * Safe version of hexToRgb - returns Result instead of throwing
 *
 * @example
 * ```ts
 * const result = hexToRgbSafe('#ff0000')
 * if (result.success) {
 *   console.log(result.data) // { r: 255, g: 0, b: 0 }
 * } else {
 *   console.error(result.error.message)
 * }
 * ```
 */
export const hexToRgbSafe = createSafe<string, RGB>(hexToRgb)

/**
 * Safe version of rgbToHex - returns Result instead of throwing
 */
export const rgbToHexSafe = createSafe<RGB, string>(rgbToHex)

/**
 * Safe version of hexToHsl - returns Result instead of throwing
 */
export const hexToHslSafe = createSafe<string, HSL>(hexToHsl)

/**
 * Safe version of hslToHex - returns Result instead of throwing
 */
export const hslToHexSafe = createSafe<HSL, string>(hslToHex)

/**
 * Safe version of hexToRgba - returns Result instead of throwing
 */
export const hexToRgbaSafe = createSafe<string, RGBA>(hexToRgba)

/**
 * Safe version of rgbaToHex - returns Result instead of throwing
 */
export const rgbaToHexSafe = createSafe<RGBA, string>(rgbaToHex)

/**
 * Safe version of hexToHsla - returns Result instead of throwing
 */
export const hexToHslaSafe = createSafe<string, HSLA>(hexToHsla)

/**
 * Safe version of hslaToHex - returns Result instead of throwing
 */
export const hslaToHexSafe = createSafe<HSLA, string>(hslaToHex)

/**
 * Safe version of hexToCssRgb - returns Result instead of throwing
 */
export const hexToCssRgbSafe = createSafe<string, string>(hexToCssRgb)

/**
 * Safe version of cssRgbToHex - returns Result instead of throwing
 */
export const cssRgbToHexSafe = createSafe<string, string>(cssRgbToHex)

/**
 * Safe version of hexToCssHsl - returns Result instead of throwing
 */
export const hexToCssHslSafe = createSafe<string, string>(hexToCssHsl)

/**
 * Safe version of cssHslToHex - returns Result instead of throwing
 */
export const cssHslToHexSafe = createSafe<string, string>(cssHslToHex)
