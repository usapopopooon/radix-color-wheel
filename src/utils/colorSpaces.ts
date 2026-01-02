import { hexToRgb } from './hexToRgb'
import { rgbToHex } from './rgbToHex'
import { hexOrHex8Schema } from '../schemas'
import { ColorValidationError } from '../errors'
import { clamp } from './clamp'
import { z } from 'zod'

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

// ============================================================================
// LAB Color Space
// ============================================================================

export interface Lab {
  l: number // Lightness: 0-100
  a: number // Green-Red: typically -128 to 127
  b: number // Blue-Yellow: typically -128 to 127
}

export const labSchema = z.object({
  l: z.number().min(0).max(100),
  a: z.number().min(-128).max(127),
  b: z.number().min(-128).max(127),
})

// D65 illuminant reference values
const D65 = { x: 95.047, y: 100.0, z: 108.883 }

function rgbToXyz(r: number, g: number, b: number): { x: number; y: number; z: number } {
  // Normalize RGB to 0-1
  let rNorm = r / 255
  let gNorm = g / 255
  let bNorm = b / 255

  // Apply gamma correction (sRGB)
  rNorm = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92
  gNorm = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92
  bNorm = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92

  // Convert to XYZ using D65 matrix
  return {
    x: (rNorm * 0.4124564 + gNorm * 0.3575761 + bNorm * 0.1804375) * 100,
    y: (rNorm * 0.2126729 + gNorm * 0.7151522 + bNorm * 0.072175) * 100,
    z: (rNorm * 0.0193339 + gNorm * 0.119192 + bNorm * 0.9503041) * 100,
  }
}

function xyzToRgb(x: number, y: number, z: number): { r: number; g: number; b: number } {
  // Convert from XYZ to linear RGB
  const xNorm = x / 100
  const yNorm = y / 100
  const zNorm = z / 100

  let r = xNorm * 3.2404542 + yNorm * -1.5371385 + zNorm * -0.4985314
  let g = xNorm * -0.969266 + yNorm * 1.8760108 + zNorm * 0.041556
  let b = xNorm * 0.0556434 + yNorm * -0.2040259 + zNorm * 1.0572252

  // Apply gamma correction (sRGB)
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b

  return {
    r: Math.round(clamp(r * 255, 0, 255)),
    g: Math.round(clamp(g * 255, 0, 255)),
    b: Math.round(clamp(b * 255, 0, 255)),
  }
}

function xyzToLab(x: number, y: number, z: number): Lab {
  let xNorm = x / D65.x
  let yNorm = y / D65.y
  let zNorm = z / D65.z

  const epsilon = 0.008856
  const kappa = 903.3

  xNorm = xNorm > epsilon ? Math.pow(xNorm, 1 / 3) : (kappa * xNorm + 16) / 116
  yNorm = yNorm > epsilon ? Math.pow(yNorm, 1 / 3) : (kappa * yNorm + 16) / 116
  zNorm = zNorm > epsilon ? Math.pow(zNorm, 1 / 3) : (kappa * zNorm + 16) / 116

  return {
    l: Math.round((116 * yNorm - 16) * 100) / 100,
    a: Math.round(500 * (xNorm - yNorm) * 100) / 100,
    b: Math.round(200 * (yNorm - zNorm) * 100) / 100,
  }
}

function labToXyz(l: number, a: number, b: number): { x: number; y: number; z: number } {
  const fy = (l + 16) / 116
  const fx = a / 500 + fy
  const fz = fy - b / 200

  const epsilon = 0.008856
  const kappa = 903.3

  const xr = Math.pow(fx, 3) > epsilon ? Math.pow(fx, 3) : (116 * fx - 16) / kappa
  const yr = l > kappa * epsilon ? Math.pow((l + 16) / 116, 3) : l / kappa
  const zr = Math.pow(fz, 3) > epsilon ? Math.pow(fz, 3) : (116 * fz - 16) / kappa

  return {
    x: xr * D65.x,
    y: yr * D65.y,
    z: zr * D65.z,
  }
}

/**
 * Convert HEX to CIE Lab color space
 *
 * @param hex - HEX color code
 * @returns Lab color object
 *
 * @example
 * ```ts
 * hexToLab('#ff0000') // => { l: 53.23, a: 80.11, b: 67.22 }
 * ```
 */
export function hexToLab(hex: string): Lab {
  validateHex(hex, 'hexToLab')

  const rgb = hexToRgb(hex)
  const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b)
  return xyzToLab(xyz.x, xyz.y, xyz.z)
}

/**
 * Convert CIE Lab color space to HEX
 *
 * @param lab - Lab color object
 * @returns HEX color code
 *
 * @example
 * ```ts
 * labToHex({ l: 53.23, a: 80.11, b: 67.22 }) // => "#ff0000"
 * ```
 */
export function labToHex(lab: Lab): string {
  const result = labSchema.safeParse(lab)
  if (!result.success) {
    throw new ColorValidationError({
      functionName: 'labToHex',
      message: result.error.issues[0]?.message ?? 'Invalid Lab color',
      receivedValue: lab,
      issues: result.error.issues,
    })
  }

  const xyz = labToXyz(lab.l, lab.a, lab.b)
  const rgb = xyzToRgb(xyz.x, xyz.y, xyz.z)
  return rgbToHex(rgb)
}

// ============================================================================
// OKLCH Color Space
// ============================================================================

export interface Oklch {
  l: number // Lightness: 0-1
  c: number // Chroma: 0-0.4 (approximately)
  h: number // Hue: 0-360
}

export const oklchSchema = z.object({
  l: z.number().min(0).max(1),
  c: z.number().min(0).max(0.5),
  h: z.number().min(0).max(360),
})

function rgbToOklab(r: number, g: number, b: number): { l: number; a: number; b: number } {
  // Normalize RGB to 0-1
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  // Convert to linear RGB
  const rLin = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92
  const gLin = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92
  const bLin = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92

  // Convert to Oklab
  const l = Math.cbrt(0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin)
  const m = Math.cbrt(0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin)
  const s = Math.cbrt(0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin)

  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  }
}

function oklabToRgb(l: number, a: number, b: number): { r: number; g: number; b: number } {
  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b

  const lCubed = lPrime * lPrime * lPrime
  const mCubed = mPrime * mPrime * mPrime
  const sCubed = sPrime * sPrime * sPrime

  const rLin = 4.0767416621 * lCubed - 3.3077115913 * mCubed + 0.2309699292 * sCubed
  const gLin = -1.2684380046 * lCubed + 2.6097574011 * mCubed - 0.3413193965 * sCubed
  const bLin = -0.0041960863 * lCubed - 0.7034186147 * mCubed + 1.707614701 * sCubed

  // Convert to sRGB
  const rNorm = rLin > 0.0031308 ? 1.055 * Math.pow(rLin, 1 / 2.4) - 0.055 : 12.92 * rLin
  const gNorm = gLin > 0.0031308 ? 1.055 * Math.pow(gLin, 1 / 2.4) - 0.055 : 12.92 * gLin
  const bNorm = bLin > 0.0031308 ? 1.055 * Math.pow(bLin, 1 / 2.4) - 0.055 : 12.92 * bLin

  return {
    r: Math.round(clamp(rNorm * 255, 0, 255)),
    g: Math.round(clamp(gNorm * 255, 0, 255)),
    b: Math.round(clamp(bNorm * 255, 0, 255)),
  }
}

/**
 * Convert HEX to OKLCH color space
 *
 * OKLCH is a perceptually uniform color space that's great for
 * creating consistent color palettes.
 *
 * @param hex - HEX color code
 * @returns OKLCH color object
 *
 * @example
 * ```ts
 * hexToOklch('#ff0000') // => { l: 0.63, c: 0.26, h: 29 }
 * ```
 */
export function hexToOklch(hex: string): Oklch {
  validateHex(hex, 'hexToOklch')

  const rgb = hexToRgb(hex)
  const oklab = rgbToOklab(rgb.r, rgb.g, rgb.b)

  const c = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b)
  let h = (Math.atan2(oklab.b, oklab.a) * 180) / Math.PI
  if (h < 0) h += 360

  return {
    l: Math.round(oklab.l * 1000) / 1000,
    c: Math.round(c * 1000) / 1000,
    h: Math.round(h * 10) / 10,
  }
}

/**
 * Convert OKLCH color space to HEX
 *
 * @param oklch - OKLCH color object
 * @returns HEX color code
 *
 * @example
 * ```ts
 * oklchToHex({ l: 0.63, c: 0.26, h: 29 }) // => "#ff0000"
 * ```
 */
export function oklchToHex(oklch: Oklch): string {
  const result = oklchSchema.safeParse(oklch)
  if (!result.success) {
    throw new ColorValidationError({
      functionName: 'oklchToHex',
      message: result.error.issues[0]?.message ?? 'Invalid OKLCH color',
      receivedValue: oklch,
      issues: result.error.issues,
    })
  }

  const hRad = (oklch.h * Math.PI) / 180
  const a = oklch.c * Math.cos(hRad)
  const b = oklch.c * Math.sin(hRad)

  const rgb = oklabToRgb(oklch.l, a, b)
  return rgbToHex(rgb)
}

// ============================================================================
// CMYK Color Space
// ============================================================================

export interface CMYK {
  c: number // Cyan: 0-100
  m: number // Magenta: 0-100
  y: number // Yellow: 0-100
  k: number // Key (Black): 0-100
}

export const cmykSchema = z.object({
  c: z.number().min(0).max(100),
  m: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  k: z.number().min(0).max(100),
})

/**
 * Convert HEX to CMYK color space
 *
 * Note: This is a simple conversion and may not match
 * professional printing CMYK values exactly.
 *
 * @param hex - HEX color code
 * @returns CMYK color object
 *
 * @example
 * ```ts
 * hexToCmyk('#ff0000') // => { c: 0, m: 100, y: 100, k: 0 }
 * ```
 */
export function hexToCmyk(hex: string): CMYK {
  validateHex(hex, 'hexToCmyk')

  const rgb = hexToRgb(hex)
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const k = 1 - Math.max(r, g, b)

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 }
  }

  const c = ((1 - r - k) / (1 - k)) * 100
  const m = ((1 - g - k) / (1 - k)) * 100
  const y = ((1 - b - k) / (1 - k)) * 100

  return {
    c: Math.round(c),
    m: Math.round(m),
    y: Math.round(y),
    k: Math.round(k * 100),
  }
}

/**
 * Convert CMYK color space to HEX
 *
 * @param cmyk - CMYK color object
 * @returns HEX color code
 *
 * @example
 * ```ts
 * cmykToHex({ c: 0, m: 100, y: 100, k: 0 }) // => "#ff0000"
 * ```
 */
export function cmykToHex(cmyk: CMYK): string {
  const result = cmykSchema.safeParse(cmyk)
  if (!result.success) {
    throw new ColorValidationError({
      functionName: 'cmykToHex',
      message: result.error.issues[0]?.message ?? 'Invalid CMYK color',
      receivedValue: cmyk,
      issues: result.error.issues,
    })
  }

  const c = cmyk.c / 100
  const m = cmyk.m / 100
  const y = cmyk.y / 100
  const k = cmyk.k / 100

  const r = Math.round(255 * (1 - c) * (1 - k))
  const g = Math.round(255 * (1 - m) * (1 - k))
  const b = Math.round(255 * (1 - y) * (1 - k))

  return rgbToHex({ r, g, b })
}

/**
 * Calculate the Delta E (color difference) between two colors using CIE76
 *
 * @param hex1 - First HEX color
 * @param hex2 - Second HEX color
 * @returns Delta E value (0 = identical, 2.3 = just noticeable difference)
 *
 * @example
 * ```ts
 * getDeltaE('#ff0000', '#ff0001') // => ~0.5 (very similar)
 * getDeltaE('#ff0000', '#00ff00') // => ~86 (very different)
 * ```
 */
export function getDeltaE(hex1: string, hex2: string): number {
  validateHex(hex1, 'getDeltaE')
  validateHex(hex2, 'getDeltaE')

  const lab1 = hexToLab(hex1)
  const lab2 = hexToLab(hex2)

  const deltaL = lab1.l - lab2.l
  const deltaA = lab1.a - lab2.a
  const deltaB = lab1.b - lab2.b

  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB)
}
