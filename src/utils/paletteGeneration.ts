import { hexToHsl } from './hexToHsl'
import { hslToHex } from './hslToHex'
import { clamp } from './clamp'
import { hexOrHex8Schema } from '../schemas'
import { ColorValidationError } from '../errors'

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

/**
 * Generate analogous colors (adjacent on the color wheel)
 *
 * @param hex - Base HEX color
 * @param count - Number of colors to generate (default: 3)
 * @param angle - Angle between colors in degrees (default: 30)
 * @returns Array of HEX colors
 *
 * @example
 * ```ts
 * generateAnalogous('#ff0000', 3) // => ['#ff0080', '#ff0000', '#ff8000']
 * ```
 */
export function generateAnalogous(hex: string, count: number = 3, angle: number = 30): string[] {
  validateHex(hex, 'generateAnalogous')

  if (count < 1) {
    throw new ColorValidationError({
      functionName: 'generateAnalogous',
      message: 'Count must be at least 1',
      receivedValue: count,
      issues: [],
    })
  }

  const hsl = hexToHsl(hex)
  const colors: string[] = []
  const half = Math.floor(count / 2)

  for (let i = -half; i <= count - half - 1; i++) {
    let newH = (hsl.h + i * angle) % 360
    if (newH < 0) newH += 360
    colors.push(hslToHex({ ...hsl, h: newH }))
  }

  return colors
}

/**
 * Generate complementary colors (opposite on the color wheel)
 *
 * @param hex - Base HEX color
 * @returns Array of 2 HEX colors [original, complement]
 *
 * @example
 * ```ts
 * generateComplementary('#ff0000') // => ['#ff0000', '#00ffff']
 * ```
 */
export function generateComplementary(hex: string): [string, string] {
  validateHex(hex, 'generateComplementary')

  const hsl = hexToHsl(hex)
  const complementH = (hsl.h + 180) % 360

  return [hex.slice(0, 7).toLowerCase(), hslToHex({ ...hsl, h: complementH })]
}

/**
 * Generate split-complementary colors
 *
 * @param hex - Base HEX color
 * @param angle - Split angle from complement (default: 30)
 * @returns Array of 3 HEX colors
 *
 * @example
 * ```ts
 * generateSplitComplementary('#ff0000')
 * // => ['#ff0000', '#00ffbf', '#00bfff']
 * ```
 */
export function generateSplitComplementary(
  hex: string,
  angle: number = 30
): [string, string, string] {
  validateHex(hex, 'generateSplitComplementary')

  const hsl = hexToHsl(hex)
  const complementH = (hsl.h + 180) % 360

  let h1 = (complementH - angle) % 360
  let h2 = (complementH + angle) % 360
  if (h1 < 0) h1 += 360
  if (h2 < 0) h2 += 360

  return [hex.slice(0, 7).toLowerCase(), hslToHex({ ...hsl, h: h1 }), hslToHex({ ...hsl, h: h2 })]
}

/**
 * Generate triadic colors (evenly spaced, 120° apart)
 *
 * @param hex - Base HEX color
 * @returns Array of 3 HEX colors
 *
 * @example
 * ```ts
 * generateTriadic('#ff0000') // => ['#ff0000', '#00ff00', '#0000ff']
 * ```
 */
export function generateTriadic(hex: string): [string, string, string] {
  validateHex(hex, 'generateTriadic')

  const hsl = hexToHsl(hex)

  return [
    hex.slice(0, 7).toLowerCase(),
    hslToHex({ ...hsl, h: (hsl.h + 120) % 360 }),
    hslToHex({ ...hsl, h: (hsl.h + 240) % 360 }),
  ]
}

/**
 * Generate tetradic/square colors (evenly spaced, 90° apart)
 *
 * @param hex - Base HEX color
 * @returns Array of 4 HEX colors
 *
 * @example
 * ```ts
 * generateTetradic('#ff0000')
 * // => ['#ff0000', '#80ff00', '#00ffff', '#8000ff']
 * ```
 */
export function generateTetradic(hex: string): [string, string, string, string] {
  validateHex(hex, 'generateTetradic')

  const hsl = hexToHsl(hex)

  return [
    hex.slice(0, 7).toLowerCase(),
    hslToHex({ ...hsl, h: (hsl.h + 90) % 360 }),
    hslToHex({ ...hsl, h: (hsl.h + 180) % 360 }),
    hslToHex({ ...hsl, h: (hsl.h + 270) % 360 }),
  ]
}

/**
 * Generate shades (darker versions) of a color
 *
 * @param hex - Base HEX color
 * @param count - Number of shades to generate (default: 5)
 * @returns Array of HEX colors from light to dark
 *
 * @example
 * ```ts
 * generateShades('#ff0000', 5)
 * // => ['#ff0000', '#cc0000', '#990000', '#660000', '#330000']
 * ```
 */
export function generateShades(hex: string, count: number = 5): string[] {
  validateHex(hex, 'generateShades')

  if (count < 1) {
    throw new ColorValidationError({
      functionName: 'generateShades',
      message: 'Count must be at least 1',
      receivedValue: count,
      issues: [],
    })
  }

  const hsl = hexToHsl(hex)
  const colors: string[] = []
  const step = hsl.l / count

  for (let i = 0; i < count; i++) {
    const newL = clamp(hsl.l - step * i, 0, 100)
    colors.push(hslToHex({ ...hsl, l: Math.round(newL) }))
  }

  return colors
}

/**
 * Generate tints (lighter versions) of a color
 *
 * @param hex - Base HEX color
 * @param count - Number of tints to generate (default: 5)
 * @returns Array of HEX colors from original to lightest
 *
 * @example
 * ```ts
 * generateTints('#ff0000', 5)
 * // => ['#ff0000', '#ff3333', '#ff6666', '#ff9999', '#ffcccc']
 * ```
 */
export function generateTints(hex: string, count: number = 5): string[] {
  validateHex(hex, 'generateTints')

  if (count < 1) {
    throw new ColorValidationError({
      functionName: 'generateTints',
      message: 'Count must be at least 1',
      receivedValue: count,
      issues: [],
    })
  }

  const hsl = hexToHsl(hex)
  const colors: string[] = []
  const remaining = 100 - hsl.l
  const step = remaining / count

  for (let i = 0; i < count; i++) {
    const newL = clamp(hsl.l + step * i, 0, 100)
    colors.push(hslToHex({ ...hsl, l: Math.round(newL) }))
  }

  return colors
}

/**
 * Generate a full color scale (shades and tints)
 *
 * @param hex - Base HEX color
 * @param steps - Number of steps on each side (default: 5)
 * @returns Array of HEX colors from darkest to lightest
 *
 * @example
 * ```ts
 * generateScale('#ff0000', 3)
 * // => ['#330000', '#990000', '#ff0000', '#ff6666', '#ffcccc']
 * ```
 */
export function generateScale(hex: string, steps: number = 5): string[] {
  validateHex(hex, 'generateScale')

  if (steps < 1) {
    throw new ColorValidationError({
      functionName: 'generateScale',
      message: 'Steps must be at least 1',
      receivedValue: steps,
      issues: [],
    })
  }

  const shades = generateShades(hex, steps).reverse().slice(0, -1)
  const tints = generateTints(hex, steps)

  return [...shades, ...tints]
}

/**
 * Generate a monochromatic palette (same hue, varying saturation/lightness)
 *
 * @param hex - Base HEX color
 * @param count - Number of colors to generate (default: 5)
 * @returns Array of HEX colors
 *
 * @example
 * ```ts
 * generateMonochromatic('#ff0000', 5)
 * ```
 */
export function generateMonochromatic(hex: string, count: number = 5): string[] {
  validateHex(hex, 'generateMonochromatic')

  if (count < 1) {
    throw new ColorValidationError({
      functionName: 'generateMonochromatic',
      message: 'Count must be at least 1',
      receivedValue: count,
      issues: [],
    })
  }

  const hsl = hexToHsl(hex)
  const colors: string[] = []

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1 || 1)
    const newL = 20 + t * 60 // Lightness from 20% to 80%
    const newS = 40 + (1 - Math.abs(t - 0.5) * 2) * 60 // Saturation peaks at middle
    colors.push(hslToHex({ h: hsl.h, s: Math.round(newS), l: Math.round(newL) }))
  }

  return colors
}
