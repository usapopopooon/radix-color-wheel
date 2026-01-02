import { hslToHex } from './hslToHex'
import { hslaToHex } from './hslaToHex'

/**
 * Convert CSS hsl() or hsla() string to HEX format
 *
 * @param cssHsl - CSS color string (e.g., "hsl(0, 100%, 50%)" or "hsla(0, 100%, 50%, 0.5)")
 * @returns HEX color code (6 or 8 digits)
 * @throws Error if the input format is invalid
 *
 * @example
 * ```ts
 * cssHslToHex('hsl(0, 100%, 50%)')        // => "#ff0000"
 * cssHslToHex('hsla(0, 100%, 50%, 0.5)')  // => "#ff000080"
 * cssHslToHex('hsl(120, 100%, 50%)')      // => "#00ff00"
 * ```
 */
export function cssHslToHex(cssHsl: string): string {
  // Match hsl(h, s%, l%) or hsla(h, s%, l%, a)
  // Also support modern syntax: hsl(h s% l%) or hsl(h s% l% / a)
  const hslaMatch = cssHsl.match(
    /hsla?\(\s*(\d+)\s*[,\s]\s*(\d+)%?\s*[,\s]\s*(\d+)%?\s*(?:[,/]\s*([\d.]+)\s*)?\)/i
  )

  if (!hslaMatch) {
    throw new Error(`Invalid CSS HSL format: ${cssHsl}`)
  }

  const h = parseInt(hslaMatch[1], 10)
  const s = parseInt(hslaMatch[2], 10)
  const l = parseInt(hslaMatch[3], 10)
  const a = hslaMatch[4] !== undefined ? parseFloat(hslaMatch[4]) : undefined

  if (a !== undefined && a !== 1) {
    return hslaToHex({ h, s, l, a })
  }

  return hslToHex({ h, s, l })
}
