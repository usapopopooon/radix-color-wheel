export { Root, Wheel, HueRing, HueThumb, Area, AreaThumb, HexInput, Swatch } from './components'

export type {
  RootProps,
  WheelProps,
  HueRingProps,
  HueThumbProps,
  AreaProps,
  AreaThumbProps,
  HexInputProps,
  SwatchProps,
  HSV,
} from './types'

// Re-export context hooks for advanced usage
export { useColorWheelContext } from './context/ColorWheelContext'
export { useWheelContext } from './context/WheelContext'

// Re-export utility functions
export { hsvToHex, hexToHsv, getHueFromPosition, getSVFromPosition, clamp } from './utils'
