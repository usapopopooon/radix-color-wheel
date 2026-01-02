import type { HSV } from '../types'

/**
 * Convert HEX format to HSV color space
 *
 * RGB to HSV conversion algorithm:
 * https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
 *
 * @param hex - HEX color code (e.g., "#ff0000")
 * @returns HSV color space object
 *
 * @example
 * ```ts
 * hexToHsv('#ff0000') // => { h: 0, s: 100, v: 100 } (red)
 * hexToHsv('#00ff00') // => { h: 120, s: 100, v: 100 } (green)
 * hexToHsv('#ffffff') // => { h: 0, s: 0, v: 100 } (white)
 * ```
 */
export function hexToHsv(hex: string): HSV {
  // Parse hex to RGB (0-1 range)
  // Formula: R = parseInt(hex[1:3], 16) / 255
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  // Find max and min values
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min

  // Calculate Hue
  // Formula:
  // If max == min: H = 0 (undefined, achromatic)
  // If max == R: H = 60 × ((G - B) / d mod 6)
  // If max == G: H = 60 × ((B - R) / d + 2)
  // If max == B: H = 60 × ((R - G) / d + 4)
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

  // Calculate Saturation
  // Formula: S = max == 0 ? 0 : d / max
  const s = max === 0 ? 0 : Math.round((d / max) * 100)

  // Calculate Value
  // Formula: V = max
  const v = Math.round(max * 100)

  return { h, s, v } as const
}
