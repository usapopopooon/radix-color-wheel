import type { RGB } from '../types'
import { hexOrHex8Schema } from '../schemas'
import { ColorValidationError } from '../errors'

/**
 * Convert HEX format to RGB color space
 *
 * @param hex - HEX color code (e.g., "#ff0000" or "#ff0000ff")
 * @returns RGB color object with values 0-255
 * @throws {ColorValidationError} If hex is not a valid 6 or 8 digit hex color
 *
 * @example
 * ```ts
 * hexToRgb('#ff0000') // => { r: 255, g: 0, b: 0 }
 * hexToRgb('#00ff00') // => { r: 0, g: 255, b: 0 }
 * hexToRgb('#ffffff') // => { r: 255, g: 255, b: 255 }
 * ```
 */
export function hexToRgb(hex: string): RGB {
  const result = hexOrHex8Schema.safeParse(hex)
  if (!result.success) {
    throw new ColorValidationError({
      functionName: 'hexToRgb',
      message: result.error.issues[0]?.message ?? 'Invalid hex color',
      receivedValue: hex,
      issues: result.error.issues,
    })
  }

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return { r, g, b } as const
}
