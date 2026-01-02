import type { RGBA } from '../types'
import { rgbaSchema } from '../schemas'
import { ColorValidationError } from '../errors'

/**
 * Convert RGBA color space to HEX format (8 digits)
 *
 * @param rgba - RGBA color object with r,g,b 0-255 and a 0-1
 * @returns HEX8 color code (e.g., "#ff0000ff")
 * @throws {ColorValidationError} If rgba values are not valid
 *
 * @example
 * ```ts
 * rgbaToHex({ r: 255, g: 0, b: 0, a: 1 })   // => "#ff0000ff"
 * rgbaToHex({ r: 255, g: 0, b: 0, a: 0.5 }) // => "#ff000080"
 * rgbaToHex({ r: 0, g: 255, b: 0, a: 0 })   // => "#00ff0000"
 * ```
 */
export function rgbaToHex(rgba: RGBA): string {
  const result = rgbaSchema.safeParse(rgba)
  if (!result.success) {
    throw new ColorValidationError({
      functionName: 'rgbaToHex',
      message: result.error.issues[0]?.message ?? 'Invalid RGBA color',
      receivedValue: rgba,
      issues: result.error.issues,
    })
  }
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, '0')

  const alphaHex = Math.round(Math.max(0, Math.min(1, rgba.a)) * 255)
    .toString(16)
    .padStart(2, '0')

  return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${alphaHex}`
}
