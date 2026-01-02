import type { HSL } from '../types'

/**
 * Convert HSL color space to HEX format
 *
 * HSL to RGB conversion algorithm:
 * https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
 *
 * @param hsl - HSL color object
 * @returns HEX color code (e.g., "#ff0000")
 *
 * @example
 * ```ts
 * hslToHex({ h: 0, s: 100, l: 50 })   // => "#ff0000"
 * hslToHex({ h: 120, s: 100, l: 50 }) // => "#00ff00"
 * hslToHex({ h: 0, s: 0, l: 100 })    // => "#ffffff"
 * hslToHex({ h: 0, s: 0, l: 50 })     // => "#808080"
 * ```
 */
export function hslToHex(hsl: HSL): string {
  const { h, s, l } = hsl

  // Normalize to 0-1
  const sNorm = s / 100
  const lNorm = l / 100

  // Calculate chroma
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lNorm - c / 2

  let r = 0,
    g = 0,
    b = 0

  if (h < 60) {
    r = c
    g = x
    b = 0
  } else if (h < 120) {
    r = x
    g = c
    b = 0
  } else if (h < 180) {
    r = 0
    g = c
    b = x
  } else if (h < 240) {
    r = 0
    g = x
    b = c
  } else if (h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
