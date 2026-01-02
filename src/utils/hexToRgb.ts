import type { RGB } from '../types'

/**
 * Convert HEX format to RGB color space
 *
 * @param hex - HEX color code (e.g., "#ff0000" or "#ff0000ff")
 * @returns RGB color object with values 0-255
 *
 * @example
 * ```ts
 * hexToRgb('#ff0000') // => { r: 255, g: 0, b: 0 }
 * hexToRgb('#00ff00') // => { r: 0, g: 255, b: 0 }
 * hexToRgb('#ffffff') // => { r: 255, g: 255, b: 255 }
 * ```
 */
export function hexToRgb(hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return { r, g, b } as const
}
