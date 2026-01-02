import type { RGB, RGBA, HSL, HSLA } from '../types'
import { hexToRgb } from './hexToRgb'
import { hexToRgba } from './hexToRgba'
import { hexToHsl } from './hexToHsl'
import { hexToHsla } from './hexToHsla'
import { cssRgbToHex } from './cssRgbToHex'
import { cssHslToHex } from './cssHslToHex'
import { hexToCssRgb } from './hexToCssRgb'
import { hexToCssHsl } from './hexToCssHsl'
import { ColorValidationError } from '../errors'
import { hexToLab, hexToOklch, hexToCmyk } from './colorSpaces'
import type { Lab, Oklch, CMYK } from './colorSpaces'

export type ColorFormat =
  | 'hex'
  | 'hex8'
  | 'rgb'
  | 'rgba'
  | 'hsl'
  | 'hsla'
  | 'cssRgb'
  | 'cssRgba'
  | 'cssHsl'
  | 'cssHsla'
  | 'lab'
  | 'oklch'
  | 'cmyk'

export interface ParsedColor {
  hex: string
  hex8: string
  rgb: RGB
  rgba: RGBA
  hsl: HSL
  hsla: HSLA
  cssRgb: string
  cssHsl: string
  lab: Lab
  oklch: Oklch
  cmyk: CMYK
  format: ColorFormat
  original: string
}

// CSS named colors
const CSS_NAMED_COLORS: Record<string, string> = {
  black: '#000000',
  silver: '#c0c0c0',
  gray: '#808080',
  white: '#ffffff',
  maroon: '#800000',
  red: '#ff0000',
  purple: '#800080',
  fuchsia: '#ff00ff',
  green: '#008000',
  lime: '#00ff00',
  olive: '#808000',
  yellow: '#ffff00',
  navy: '#000080',
  blue: '#0000ff',
  teal: '#008080',
  aqua: '#00ffff',
  orange: '#ffa500',
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  blanchedalmond: '#ffebcd',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  oldlace: '#fdf5e6',
  olivedrab: '#6b8e23',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  whitesmoke: '#f5f5f5',
  yellowgreen: '#9acd32',
  rebeccapurple: '#663399',
  transparent: '#00000000',
}

/**
 * Detect the format of a color string
 *
 * @param color - Color string in any format
 * @returns Detected format or null if unknown
 */
export function detectColorFormat(color: string): ColorFormat | null {
  const trimmed = color.trim().toLowerCase()

  // Named color
  if (CSS_NAMED_COLORS[trimmed]) {
    return 'hex'
  }

  // HEX formats
  if (/^#[0-9a-f]{8}$/i.test(trimmed)) {
    return 'hex8'
  }
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) {
    return 'hex'
  }
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    return 'hex'
  }

  // CSS RGB/RGBA
  if (/^rgba?\s*\(/i.test(trimmed)) {
    return trimmed.includes(',') || trimmed.includes('/')
      ? /[\d.]+\s*[,/]\s*[\d.]+\s*[,/]\s*[\d.]+\s*[,/]\s*[\d.]+/.test(trimmed)
        ? 'cssRgba'
        : 'cssRgb'
      : 'cssRgb'
  }

  // CSS HSL/HSLA
  if (/^hsla?\s*\(/i.test(trimmed)) {
    return /[\d.]+\s*[,/]\s*[\d.]+%?\s*[,/]\s*[\d.]+%?\s*[,/]\s*[\d.]+/.test(trimmed)
      ? 'cssHsla'
      : 'cssHsl'
  }

  return null
}

/**
 * Parse any color format to a normalized hex value
 *
 * Supports:
 * - HEX: #rgb, #rrggbb, #rrggbbaa
 * - CSS: rgb(), rgba(), hsl(), hsla()
 * - Named colors: red, blue, etc.
 *
 * @param color - Color string in any supported format
 * @returns Normalized 6-digit HEX color (or 8-digit if alpha < 1)
 * @throws {ColorValidationError} If color format is not recognized
 *
 * @example
 * ```ts
 * parseColor('#f00')              // => "#ff0000"
 * parseColor('rgb(255, 0, 0)')    // => "#ff0000"
 * parseColor('hsl(0, 100%, 50%)') // => "#ff0000"
 * parseColor('red')               // => "#ff0000"
 * ```
 */
export function parseColor(color: string): string {
  const trimmed = color.trim().toLowerCase()

  // Check for named colors
  if (CSS_NAMED_COLORS[trimmed]) {
    return CSS_NAMED_COLORS[trimmed]
  }

  // Short hex (#rgb -> #rrggbb)
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    const r = trimmed[1]
    const g = trimmed[2]
    const b = trimmed[3]
    return `#${r}${r}${g}${g}${b}${b}`
  }

  // Short hex with alpha (#rgba -> #rrggbbaa)
  if (/^#[0-9a-f]{4}$/i.test(trimmed)) {
    const r = trimmed[1]
    const g = trimmed[2]
    const b = trimmed[3]
    const a = trimmed[4]
    return `#${r}${r}${g}${g}${b}${b}${a}${a}`
  }

  // Full hex
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) {
    return trimmed
  }

  // Full hex with alpha
  if (/^#[0-9a-f]{8}$/i.test(trimmed)) {
    return trimmed
  }

  // CSS RGB/RGBA
  if (/^rgba?\s*\(/i.test(trimmed)) {
    return cssRgbToHex(trimmed)
  }

  // CSS HSL/HSLA
  if (/^hsla?\s*\(/i.test(trimmed)) {
    return cssHslToHex(trimmed)
  }

  throw new ColorValidationError({
    functionName: 'parseColor',
    message: 'Unrecognized color format',
    receivedValue: color,
    issues: [],
  })
}

/**
 * Parse a color and return all format representations
 *
 * @param color - Color string in any supported format
 * @returns Object containing all color representations
 *
 * @example
 * ```ts
 * const parsed = parseColorFull('red')
 * console.log(parsed.hex)     // "#ff0000"
 * console.log(parsed.rgb)     // { r: 255, g: 0, b: 0 }
 * console.log(parsed.cssRgb)  // "rgb(255, 0, 0)"
 * console.log(parsed.format)  // "hex"
 * ```
 */
export function parseColorFull(color: string): ParsedColor {
  const hex = parseColor(color)
  const hex6 = hex.slice(0, 7)
  const hasAlpha = hex.length === 9 && hex.slice(7) !== 'ff'

  return {
    hex: hex6,
    hex8: hasAlpha ? hex : `${hex6}ff`,
    rgb: hexToRgb(hex6),
    rgba: hexToRgba(hex),
    hsl: hexToHsl(hex6),
    hsla: hexToHsla(hex),
    cssRgb: hexToCssRgb(hex),
    cssHsl: hexToCssHsl(hex),
    lab: hexToLab(hex6),
    oklch: hexToOklch(hex6),
    cmyk: hexToCmyk(hex6),
    format: detectColorFormat(color) ?? 'hex',
    original: color,
  }
}

/**
 * Format a color to a specific format
 *
 * @param color - Color string in any format
 * @param format - Target format
 * @returns Formatted color string
 *
 * @example
 * ```ts
 * formatColor('#ff0000', 'cssRgb')  // => "rgb(255, 0, 0)"
 * formatColor('red', 'hsl')         // => { h: 0, s: 100, l: 50 }
 * formatColor('#ff000080', 'cssRgba') // => "rgba(255, 0, 0, 0.5)"
 * ```
 */
export function formatColor(
  color: string,
  format: ColorFormat
): string | RGB | RGBA | HSL | HSLA | Lab | Oklch | CMYK {
  const hex = parseColor(color)
  const hex6 = hex.slice(0, 7)

  switch (format) {
    case 'hex':
      return hex6
    case 'hex8':
      return hex.length === 9 ? hex : `${hex6}ff`
    case 'rgb':
      return hexToRgb(hex6)
    case 'rgba':
      return hexToRgba(hex)
    case 'hsl':
      return hexToHsl(hex6)
    case 'hsla':
      return hexToHsla(hex)
    case 'cssRgb':
    case 'cssRgba':
      return hexToCssRgb(hex)
    case 'cssHsl':
    case 'cssHsla':
      return hexToCssHsl(hex)
    case 'lab':
      return hexToLab(hex6)
    case 'oklch':
      return hexToOklch(hex6)
    case 'cmyk':
      return hexToCmyk(hex6)
    default:
      return hex6
  }
}

/**
 * Check if a string is a valid color in any supported format
 *
 * @param color - String to check
 * @returns true if the string is a valid color
 *
 * @example
 * ```ts
 * isValidColor('#ff0000')          // => true
 * isValidColor('rgb(255, 0, 0)')   // => true
 * isValidColor('red')              // => true
 * isValidColor('not a color')      // => false
 * ```
 */
export function isValidColor(color: string): boolean {
  try {
    parseColor(color)
    return true
  } catch {
    return false
  }
}

/**
 * Get the CSS named color name if the color matches one
 *
 * @param hex - HEX color code
 * @returns Named color or null if no match
 *
 * @example
 * ```ts
 * getNamedColor('#ff0000') // => "red"
 * getNamedColor('#123456') // => null
 * ```
 */
export function getNamedColor(hex: string): string | null {
  const normalized = hex.toLowerCase().slice(0, 7)

  for (const [name, value] of Object.entries(CSS_NAMED_COLORS)) {
    if (value === normalized) {
      return name
    }
  }

  return null
}

/**
 * Get all CSS named colors
 *
 * @returns Object mapping color names to HEX values
 */
export function getNamedColors(): Record<string, string> {
  return { ...CSS_NAMED_COLORS }
}
