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
} from './utils'
