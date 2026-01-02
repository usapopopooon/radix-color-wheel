import type { RGB } from '../types'

/**
 * Convert RGB color space to HEX format
 *
 * @param rgb - RGB color object with values 0-255
 * @returns HEX color code (e.g., "#ff0000")
 *
 * @example
 * ```ts
 * rgbToHex({ r: 255, g: 0, b: 0 })   // => "#ff0000"
 * rgbToHex({ r: 0, g: 255, b: 0 })   // => "#00ff00"
 * rgbToHex({ r: 255, g: 255, b: 255 }) // => "#ffffff"
 * ```
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}
