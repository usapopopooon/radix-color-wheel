import { rgbToHex } from './rgbToHex'
import { rgbaToHex } from './rgbaToHex'

/**
 * Convert CSS rgb() or rgba() string to HEX format
 *
 * @param cssRgb - CSS color string (e.g., "rgb(255, 0, 0)" or "rgba(255, 0, 0, 0.5)")
 * @returns HEX color code (6 or 8 digits)
 * @throws Error if the input format is invalid
 *
 * @example
 * ```ts
 * cssRgbToHex('rgb(255, 0, 0)')        // => "#ff0000"
 * cssRgbToHex('rgba(255, 0, 0, 0.5)')  // => "#ff000080"
 * cssRgbToHex('rgb(0, 255, 0)')        // => "#00ff00"
 * ```
 */
export function cssRgbToHex(cssRgb: string): string {
  // Match rgb(r, g, b) or rgba(r, g, b, a)
  // Also support modern syntax: rgb(r g b) or rgb(r g b / a)
  const rgbaMatch = cssRgb.match(
    /rgba?\(\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)\s*(?:[,/]\s*([\d.]+)\s*)?\)/i
  )

  if (!rgbaMatch) {
    throw new Error(`Invalid CSS RGB format: ${cssRgb}`)
  }

  const r = parseInt(rgbaMatch[1], 10)
  const g = parseInt(rgbaMatch[2], 10)
  const b = parseInt(rgbaMatch[3], 10)
  const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : undefined

  if (a !== undefined && a !== 1) {
    return rgbaToHex({ r, g, b, a })
  }

  return rgbToHex({ r, g, b })
}
