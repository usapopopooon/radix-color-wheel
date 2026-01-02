import { hexToRgb } from './hexToRgb'
import { hexToRgba } from './hexToRgba'

/**
 * Convert HEX format to CSS rgb() or rgba() string
 *
 * @param hex - HEX color code (6 or 8 digits, e.g., "#ff0000" or "#ff0000ff")
 * @returns CSS color string (e.g., "rgb(255, 0, 0)" or "rgba(255, 0, 0, 0.5)")
 *
 * @example
 * ```ts
 * hexToCssRgb('#ff0000')   // => "rgb(255, 0, 0)"
 * hexToCssRgb('#ff000080') // => "rgba(255, 0, 0, 0.5)"
 * hexToCssRgb('#00ff00ff') // => "rgb(0, 255, 0)"
 * ```
 */
export function hexToCssRgb(hex: string): string {
  if (hex.length === 9) {
    const { r, g, b, a } = hexToRgba(hex)
    // If alpha is 1, return rgb() instead of rgba()
    if (a === 1) {
      return `rgb(${r}, ${g}, ${b})`
    }
    // Round alpha to 2 decimal places
    const alphaRounded = Math.round(a * 100) / 100
    return `rgba(${r}, ${g}, ${b}, ${alphaRounded})`
  }

  const { r, g, b } = hexToRgb(hex)
  return `rgb(${r}, ${g}, ${b})`
}
