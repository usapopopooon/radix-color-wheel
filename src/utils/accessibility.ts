import { hexToRgb } from './hexToRgb'
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
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 specification
 *
 * @param hex - HEX color code
 * @returns Relative luminance (0-1)
 *
 * @example
 * ```ts
 * getLuminance('#ffffff') // => 1
 * getLuminance('#000000') // => 0
 * ```
 */
export function getLuminance(hex: string): number {
  validateHex(hex, 'getLuminance')

  const rgb = hexToRgb(hex)

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.1 specification
 *
 * @param hex1 - First HEX color
 * @param hex2 - Second HEX color
 * @returns Contrast ratio (1-21)
 *
 * @example
 * ```ts
 * getContrastRatio('#ffffff', '#000000') // => 21
 * getContrastRatio('#ffffff', '#ffffff') // => 1
 * ```
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  validateHex(hex1, 'getContrastRatio')
  validateHex(hex2, 'getContrastRatio')

  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

export type WCAGLevel = 'AA' | 'AAA'
export type TextSize = 'normal' | 'large'

/**
 * Check if text is readable against a background according to WCAG guidelines
 *
 * WCAG 2.1 requirements:
 * - AA normal text: 4.5:1
 * - AA large text: 3:1
 * - AAA normal text: 7:1
 * - AAA large text: 4.5:1
 *
 * @param foreground - Text color (HEX)
 * @param background - Background color (HEX)
 * @param options - WCAG level and text size
 * @returns Whether the combination passes WCAG requirements
 *
 * @example
 * ```ts
 * isReadable('#000000', '#ffffff') // => true (passes AA)
 * isReadable('#777777', '#ffffff', { level: 'AAA' }) // => false
 * isReadable('#777777', '#ffffff', { size: 'large' }) // => true
 * ```
 */
export function isReadable(
  foreground: string,
  background: string,
  options: { level?: WCAGLevel; size?: TextSize } = {}
): boolean {
  const { level = 'AA', size = 'normal' } = options

  const ratio = getContrastRatio(foreground, background)

  const thresholds = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 },
  }

  return ratio >= thresholds[level][size]
}

/**
 * Suggest a text color (black or white) for optimal readability on a background
 *
 * @param background - Background color (HEX)
 * @returns "#000000" or "#ffffff"
 *
 * @example
 * ```ts
 * suggestTextColor('#ffffff') // => "#000000"
 * suggestTextColor('#000000') // => "#ffffff"
 * suggestTextColor('#ff0000') // => "#ffffff"
 * ```
 */
export function suggestTextColor(background: string): '#000000' | '#ffffff' {
  validateHex(background, 'suggestTextColor')

  const luminance = getLuminance(background)

  // Using the WCAG relative luminance threshold
  // Dark backgrounds (luminance < 0.179) get white text
  return luminance > 0.179 ? '#000000' : '#ffffff'
}

/**
 * Find the best contrasting color from a list of options
 *
 * @param background - Background color (HEX)
 * @param options - Array of HEX colors to choose from
 * @returns The color with the best contrast ratio
 *
 * @example
 * ```ts
 * getBestContrast('#336699', ['#ffffff', '#000000', '#ffff00'])
 * // => "#ffffff"
 * ```
 */
export function getBestContrast(background: string, options: string[]): string {
  validateHex(background, 'getBestContrast')

  if (options.length === 0) {
    throw new ColorValidationError({
      functionName: 'getBestContrast',
      message: 'Options array must not be empty',
      receivedValue: options,
      issues: [],
    })
  }

  let bestColor = options[0]
  let bestRatio = 0

  for (const color of options) {
    validateHex(color, 'getBestContrast')
    const ratio = getContrastRatio(background, color)
    if (ratio > bestRatio) {
      bestRatio = ratio
      bestColor = color
    }
  }

  return bestColor
}

/**
 * Check if a color is considered "light" or "dark"
 *
 * @param hex - HEX color code
 * @returns true if the color is light, false if dark
 *
 * @example
 * ```ts
 * isLight('#ffffff') // => true
 * isLight('#000000') // => false
 * isLight('#808080') // => false (gray is considered dark)
 * ```
 */
export function isLight(hex: string): boolean {
  validateHex(hex, 'isLight')
  return getLuminance(hex) > 0.179
}

/**
 * Check if a color is considered "dark"
 *
 * @param hex - HEX color code
 * @returns true if the color is dark, false if light
 *
 * @example
 * ```ts
 * isDark('#000000') // => true
 * isDark('#ffffff') // => false
 * ```
 */
export function isDark(hex: string): boolean {
  return !isLight(hex)
}
