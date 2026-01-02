export {
  Root,
  Wheel,
  HueRing,
  HueThumb,
  Area,
  AreaThumb,
  HexInput,
  Swatch,
  AlphaSlider,
  HueSlider,
  CopyButton,
  PasteButton,
} from './components'

export type {
  RootProps,
  WheelProps,
  HueRingProps,
  HueThumbProps,
  AreaProps,
  AreaThumbProps,
  HexInputProps,
  SwatchProps,
  AlphaSliderProps,
  HueSliderProps,
  CopyButtonProps,
  PasteButtonProps,
  // Color types
  RGB,
  RGBA,
  HSL,
  HSLA,
  HSV,
  ColorWheelRef,
} from './types'

// Re-export context hooks for advanced usage
export { useColorWheelContext } from './context/ColorWheelContext'
export { useWheelContext } from './context/WheelContext'

// Re-export utility functions
export {
  hsvToHex,
  hexToHsv,
  getHueFromPosition,
  getSVFromPosition,
  getColorNameEn,
  clamp,
  // RGB conversions
  hexToRgb,
  rgbToHex,
  hexToRgba,
  rgbaToHex,
  // HSL conversions
  hexToHsl,
  hslToHex,
  hexToHsla,
  hslaToHex,
  // CSS string conversions
  hexToCssRgb,
  cssRgbToHex,
  hexToCssHsl,
  cssHslToHex,
  // Safe versions (return Result instead of throwing)
  hexToRgbSafe,
  rgbToHexSafe,
  hexToHslSafe,
  hslToHexSafe,
  hexToRgbaSafe,
  rgbaToHexSafe,
  hexToHslaSafe,
  hslaToHexSafe,
  hexToCssRgbSafe,
  cssRgbToHexSafe,
  hexToCssHslSafe,
  cssHslToHexSafe,
  // Color manipulation
  lighten,
  darken,
  saturate,
  desaturate,
  mix,
  complement,
  invert,
  grayscale,
  rotateHue,
  setAlpha,
  // Accessibility
  getLuminance,
  getContrastRatio,
  isReadable,
  suggestTextColor,
  getBestContrast,
  isLight,
  isDark,
  // Palette generation
  generateAnalogous,
  generateComplementary,
  generateSplitComplementary,
  generateTriadic,
  generateTetradic,
  generateShades,
  generateTints,
  generateScale,
  generateMonochromatic,
  // Additional color spaces
  hexToLab,
  labToHex,
  hexToOklch,
  oklchToHex,
  hexToCmyk,
  cmykToHex,
  getDeltaE,
  labSchema,
  oklchSchema,
  cmykSchema,
  // Color parsing and formatting
  parseColor,
  parseColorFull,
  formatColor,
  detectColorFormat,
  isValidColor,
  getNamedColor,
  getNamedColors,
} from './utils'

export type {
  SafeResult,
  WCAGLevel,
  TextSize,
  Lab,
  Oklch,
  CMYK,
  ColorFormat,
  ParsedColor,
} from './utils'

// Re-export error class
export { ColorValidationError } from './errors'

// Re-export Zod schemas for validation
export {
  // Primitive schemas
  hexSchema,
  hex8Schema,
  hexOrHex8Schema,
  hueSchema,
  saturationSchema,
  brightnessSchema,
  lightnessSchema,
  alphaSchema,
  alphaNormalizedSchema,
  rgbChannelSchema,
  // Object schemas
  rgbSchema,
  rgbaSchema,
  hsvSchema,
  hslSchema,
  hslaSchema,
  // CSS string schemas
  cssRgbSchema,
  cssHslSchema,
} from './schemas'
