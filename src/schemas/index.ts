import { z } from 'zod'

/**
 * Zod schema for hex color (6 digits, e.g., "#ff0000")
 */
export const hexSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid 6-digit hex color (e.g., "#ff0000")')

/**
 * Zod schema for hex8 color with alpha (8 digits, e.g., "#ff0000ff")
 */
export const hex8Schema = z
  .string()
  .regex(/^#[0-9a-fA-F]{8}$/, 'Must be a valid 8-digit hex color (e.g., "#ff0000ff")')

/**
 * Zod schema for hex color (6 or 8 digits)
 */
export const hexOrHex8Schema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/, 'Must be a valid hex color (6 or 8 digits)')

/**
 * Zod schema for hue value (0-360)
 */
export const hueSchema = z
  .number()
  .min(0, 'Hue must be at least 0')
  .max(360, 'Hue must be at most 360')

/**
 * Zod schema for saturation value (0-100)
 */
export const saturationSchema = z
  .number()
  .min(0, 'Saturation must be at least 0')
  .max(100, 'Saturation must be at most 100')

/**
 * Zod schema for brightness/value (0-100)
 */
export const brightnessSchema = z
  .number()
  .min(0, 'Brightness must be at least 0')
  .max(100, 'Brightness must be at most 100')

/**
 * Zod schema for lightness value (0-100)
 */
export const lightnessSchema = z
  .number()
  .min(0, 'Lightness must be at least 0')
  .max(100, 'Lightness must be at most 100')

/**
 * Zod schema for alpha value (0-100)
 */
export const alphaSchema = z
  .number()
  .min(0, 'Alpha must be at least 0')
  .max(100, 'Alpha must be at most 100')

/**
 * Zod schema for normalized alpha value (0-1)
 */
export const alphaNormalizedSchema = z
  .number()
  .min(0, 'Alpha must be at least 0')
  .max(1, 'Alpha must be at most 1')

/**
 * Zod schema for RGB channel value (0-255)
 */
export const rgbChannelSchema = z
  .number()
  .int('RGB value must be an integer')
  .min(0, 'RGB value must be at least 0')
  .max(255, 'RGB value must be at most 255')

/**
 * Zod schema for RGB color
 */
export const rgbSchema = z.object({
  r: rgbChannelSchema,
  g: rgbChannelSchema,
  b: rgbChannelSchema,
})

/**
 * Zod schema for RGBA color
 */
export const rgbaSchema = rgbSchema.extend({
  a: alphaNormalizedSchema,
})

/**
 * Zod schema for HSV color
 */
export const hsvSchema = z.object({
  h: hueSchema,
  s: saturationSchema,
  v: brightnessSchema,
})

/**
 * Zod schema for HSL color
 */
export const hslSchema = z.object({
  h: hueSchema,
  s: saturationSchema,
  l: lightnessSchema,
})

/**
 * Zod schema for HSLA color
 */
export const hslaSchema = hslSchema.extend({
  a: alphaNormalizedSchema,
})

/**
 * Zod schema for CSS rgb() string
 * Supports both legacy (comma) and modern (space) syntax
 */
export const cssRgbSchema = z
  .string()
  .regex(
    /^rgba?\(\s*\d{1,3}\s*[,\s]\s*\d{1,3}\s*[,\s]\s*\d{1,3}\s*(?:[,/]\s*[\d.]+\s*)?\)$/i,
    'Must be a valid CSS rgb() or rgba() string'
  )

/**
 * Zod schema for CSS hsl() string
 * Supports both legacy (comma) and modern (space) syntax
 */
export const cssHslSchema = z
  .string()
  .regex(
    /^hsla?\(\s*\d{1,3}\s*[,\s]\s*\d{1,3}%?\s*[,\s]\s*\d{1,3}%?\s*(?:[,/]\s*[\d.]+\s*)?\)$/i,
    'Must be a valid CSS hsl() or hsla() string'
  )

// Type exports inferred from schemas
export type HexColor = z.infer<typeof hexSchema>
export type Hex8Color = z.infer<typeof hex8Schema>
export type HexOrHex8Color = z.infer<typeof hexOrHex8Schema>
export type Hue = z.infer<typeof hueSchema>
export type Saturation = z.infer<typeof saturationSchema>
export type Brightness = z.infer<typeof brightnessSchema>
export type Lightness = z.infer<typeof lightnessSchema>
export type Alpha = z.infer<typeof alphaSchema>
export type AlphaNormalized = z.infer<typeof alphaNormalizedSchema>
export type RgbChannel = z.infer<typeof rgbChannelSchema>
export type RgbColor = z.infer<typeof rgbSchema>
export type RgbaColor = z.infer<typeof rgbaSchema>
export type HsvColor = z.infer<typeof hsvSchema>
export type HslColor = z.infer<typeof hslSchema>
export type HslaColor = z.infer<typeof hslaSchema>
export type CssRgb = z.infer<typeof cssRgbSchema>
export type CssHsl = z.infer<typeof cssHslSchema>
