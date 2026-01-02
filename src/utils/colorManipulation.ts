import { hexToHsl } from './hexToHsl'
import { hslToHex } from './hslToHex'
import { hexToRgb } from './hexToRgb'
import { rgbToHex } from './rgbToHex'
import { clamp } from './clamp'
import { hexOrHex8Schema } from '../schemas'
import { ColorValidationError } from '../errors'
import { z } from 'zod'

const amountSchema = z.number().min(0).max(100)

function validateHex(hex: string, functionName: string): void {
  const result = hexOrHex8Schema.safeParse(hex)
  if (!result.success) {
    throw new ColorValidationError({
      functionName,
      message: result.error.issues[0]?.message ?? 'Invalid hex color',
      receivedValue: hex,
      issues: result.error.issues,
    })
  }
}

function validateAmount(amount: number, functionName: string): void {
  const result = amountSchema.safeParse(amount)
  if (!result.success) {
    throw new ColorValidationError({
      functionName,
      message: 'Amount must be between 0 and 100',
      receivedValue: amount,
      issues: result.error.issues,
    })
  }
}

/**
 * Lighten a color by increasing its lightness
 *
 * @param hex - HEX color code
 * @param amount - Amount to lighten (0-100)
 * @returns Lightened HEX color
 *
 * @example
 * ```ts
 * lighten('#ff0000', 20) // => "#ff6666"
 * ```
 */
export function lighten(hex: string, amount: number): string {
  validateHex(hex, 'lighten')
  validateAmount(amount, 'lighten')

  const hsl = hexToHsl(hex)
  const newL = clamp(hsl.l + amount, 0, 100)
  return hslToHex({ ...hsl, l: newL })
}

/**
 * Darken a color by decreasing its lightness
 *
 * @param hex - HEX color code
 * @param amount - Amount to darken (0-100)
 * @returns Darkened HEX color
 *
 * @example
 * ```ts
 * darken('#ff0000', 20) // => "#990000"
 * ```
 */
export function darken(hex: string, amount: number): string {
  validateHex(hex, 'darken')
  validateAmount(amount, 'darken')

  const hsl = hexToHsl(hex)
  const newL = clamp(hsl.l - amount, 0, 100)
  return hslToHex({ ...hsl, l: newL })
}

/**
 * Increase saturation of a color
 *
 * @param hex - HEX color code
 * @param amount - Amount to increase saturation (0-100)
 * @returns More saturated HEX color
 *
 * @example
 * ```ts
 * saturate('#cc6666', 20) // => "#d94d4d"
 * ```
 */
export function saturate(hex: string, amount: number): string {
  validateHex(hex, 'saturate')
  validateAmount(amount, 'saturate')

  const hsl = hexToHsl(hex)
  const newS = clamp(hsl.s + amount, 0, 100)
  return hslToHex({ ...hsl, s: newS })
}

/**
 * Decrease saturation of a color
 *
 * @param hex - HEX color code
 * @param amount - Amount to decrease saturation (0-100)
 * @returns Less saturated HEX color
 *
 * @example
 * ```ts
 * desaturate('#ff0000', 50) // => "#bf4040"
 * ```
 */
export function desaturate(hex: string, amount: number): string {
  validateHex(hex, 'desaturate')
  validateAmount(amount, 'desaturate')

  const hsl = hexToHsl(hex)
  const newS = clamp(hsl.s - amount, 0, 100)
  return hslToHex({ ...hsl, s: newS })
}

/**
 * Mix two colors together
 *
 * @param hex1 - First HEX color
 * @param hex2 - Second HEX color
 * @param ratio - Mix ratio (0 = all hex1, 1 = all hex2, 0.5 = equal mix)
 * @returns Mixed HEX color
 *
 * @example
 * ```ts
 * mix('#ff0000', '#0000ff', 0.5) // => "#800080" (purple)
 * ```
 */
export function mix(hex1: string, hex2: string, ratio: number = 0.5): string {
  validateHex(hex1, 'mix')
  validateHex(hex2, 'mix')

  if (ratio < 0 || ratio > 1) {
    throw new ColorValidationError({
      functionName: 'mix',
      message: 'Ratio must be between 0 and 1',
      receivedValue: ratio,
      issues: [],
    })
  }

  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)

  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio)
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio)
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio)

  return rgbToHex({ r, g, b })
}

/**
 * Get the complementary color (opposite on color wheel)
 *
 * @param hex - HEX color code
 * @returns Complementary HEX color
 *
 * @example
 * ```ts
 * complement('#ff0000') // => "#00ffff" (cyan)
 * complement('#0000ff') // => "#ffff00" (yellow)
 * ```
 */
export function complement(hex: string): string {
  validateHex(hex, 'complement')

  const hsl = hexToHsl(hex)
  const newH = (hsl.h + 180) % 360
  return hslToHex({ ...hsl, h: newH })
}

/**
 * Invert a color
 *
 * @param hex - HEX color code
 * @returns Inverted HEX color
 *
 * @example
 * ```ts
 * invert('#ff0000') // => "#00ffff"
 * invert('#000000') // => "#ffffff"
 * ```
 */
export function invert(hex: string): string {
  validateHex(hex, 'invert')

  const rgb = hexToRgb(hex)
  return rgbToHex({
    r: 255 - rgb.r,
    g: 255 - rgb.g,
    b: 255 - rgb.b,
  })
}

/**
 * Convert a color to grayscale
 *
 * @param hex - HEX color code
 * @returns Grayscale HEX color
 *
 * @example
 * ```ts
 * grayscale('#ff0000') // => "#808080"
 * ```
 */
export function grayscale(hex: string): string {
  validateHex(hex, 'grayscale')

  const hsl = hexToHsl(hex)
  return hslToHex({ ...hsl, s: 0 })
}

/**
 * Rotate the hue of a color
 *
 * @param hex - HEX color code
 * @param degrees - Degrees to rotate (-360 to 360)
 * @returns HEX color with rotated hue
 *
 * @example
 * ```ts
 * rotateHue('#ff0000', 120) // => "#00ff00" (green)
 * rotateHue('#ff0000', -120) // => "#0000ff" (blue)
 * ```
 */
export function rotateHue(hex: string, degrees: number): string {
  validateHex(hex, 'rotateHue')

  const hsl = hexToHsl(hex)
  let newH = (hsl.h + degrees) % 360
  if (newH < 0) newH += 360
  return hslToHex({ ...hsl, h: newH })
}

/**
 * Adjust the opacity/alpha of a color
 *
 * @param hex - HEX color code (6 or 8 digits)
 * @param alpha - New alpha value (0-1)
 * @returns HEX8 color with new alpha
 *
 * @example
 * ```ts
 * setAlpha('#ff0000', 0.5) // => "#ff000080"
 * ```
 */
export function setAlpha(hex: string, alpha: number): string {
  validateHex(hex, 'setAlpha')

  if (alpha < 0 || alpha > 1) {
    throw new ColorValidationError({
      functionName: 'setAlpha',
      message: 'Alpha must be between 0 and 1',
      receivedValue: alpha,
      issues: [],
    })
  }

  const rgb = hexToRgb(hex)
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')

  return `${rgbToHex(rgb)}${alphaHex}`
}
