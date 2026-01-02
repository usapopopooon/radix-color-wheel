/**
 * RGB color space representation
 *
 * @property r - Red (0-255)
 * @property g - Green (0-255)
 * @property b - Blue (0-255)
 */
export interface RGB {
  /** Red (0-255) */
  readonly r: number
  /** Green (0-255) */
  readonly g: number
  /** Blue (0-255) */
  readonly b: number
}

/**
 * RGBA color space representation (RGB with alpha)
 *
 * @property r - Red (0-255)
 * @property g - Green (0-255)
 * @property b - Blue (0-255)
 * @property a - Alpha (0-1)
 */
export interface RGBA extends RGB {
  /** Alpha (0-1) */
  readonly a: number
}

/**
 * HSL color space representation
 *
 * @property h - Hue (0-360 degrees)
 * @property s - Saturation (0-100%)
 * @property l - Lightness (0-100%)
 */
export interface HSL {
  /** Hue (0-360) */
  readonly h: number
  /** Saturation (0-100) */
  readonly s: number
  /** Lightness (0-100) */
  readonly l: number
}

/**
 * HSLA color space representation (HSL with alpha)
 *
 * @property h - Hue (0-360 degrees)
 * @property s - Saturation (0-100%)
 * @property l - Lightness (0-100%)
 * @property a - Alpha (0-1)
 */
export interface HSLA extends HSL {
  /** Alpha (0-1) */
  readonly a: number
}

/**
 * HSV color space representation
 *
 * @property h - Hue (0-360 degrees)
 * @property s - Saturation (0-100%)
 * @property v - Value/Brightness (0-100%)
 */
export interface HSV {
  /** Hue (0-360) */
  readonly h: number
  /** Saturation (0-100) */
  readonly s: number
  /** Value/Brightness (0-100) */
  readonly v: number
}

/**
 * Imperative handle for ColorWheel.Root component
 *
 * Provides methods to programmatically get and set color values.
 * Useful for integrations like eyedropper tools.
 *
 * @example
 * ```tsx
 * const colorWheelRef = useRef<ColorWheelRef>(null)
 *
 * // Get current values
 * const hex = colorWheelRef.current?.getColor()
 * const alpha = colorWheelRef.current?.getAlpha()
 * const hsv = colorWheelRef.current?.getHsv()
 *
 * // Set values programmatically
 * colorWheelRef.current?.setColor('#00ff00')
 * colorWheelRef.current?.setAlpha(50)
 * colorWheelRef.current?.setHsv({ h: 120, s: 100, v: 100 })
 * ```
 */
export interface ColorWheelRef {
  /** Get current HEX color (6 digits, e.g., "#ff0000") */
  getColor: () => string
  /** Get current HEX8 color with alpha (8 digits, e.g., "#ff0000ff") */
  getColor8: () => string
  /** Get current alpha value (0-100) */
  getAlpha: () => number
  /** Get current HSV values */
  getHsv: () => HSV
  /** Set color by HEX value (6 or 8 digits) */
  setColor: (hex: string) => void
  /** Set alpha value (0-100) */
  setAlpha: (alpha: number) => void
  /** Set color by HSV values */
  setHsv: (hsv: HSV) => void
  /** Set hue value (0-360) */
  setHue: (hue: number) => void
  /** Set saturation value (0-100) */
  setSaturation: (saturation: number) => void
  /** Set brightness/value (0-100) */
  setBrightness: (brightness: number) => void
}

/**
 * Props for ColorWheel.Root component
 */
export interface RootProps {
  /**
   * Current color in HEX format
   * @example "#ff0000"
   */
  readonly value?: string

  /**
   * Initial value for uncontrolled mode
   * @default "#ff0000"
   */
  readonly defaultValue?: string

  /**
   * Current alpha value (0-100)
   * When provided, controls alpha separately from the hex value
   */
  readonly alpha?: number

  /**
   * Initial alpha value for uncontrolled mode (0-100)
   * @default 100
   */
  readonly defaultAlpha?: number

  /**
   * Callback called when color changes
   * Called in real-time during drag
   */
  readonly onValueChange?: (hex: string) => void

  /**
   * Callback called when drag ends
   * Use when only final value is needed
   */
  readonly onValueChangeEnd?: (hex: string) => void

  /**
   * Callback when hue changes
   */
  readonly onHueChange?: (hue: number) => void

  /**
   * Callback when saturation changes
   */
  readonly onSaturationChange?: (saturation: number) => void

  /**
   * Callback when brightness changes
   */
  readonly onBrightnessChange?: (brightness: number) => void

  /**
   * Callback when alpha changes
   */
  readonly onAlphaChange?: (alpha: number) => void

  /**
   * Callback when drag starts
   */
  readonly onDragStart?: () => void

  /**
   * Callback called continuously during drag
   * Receives current hex value
   */
  readonly onDrag?: (hex: string) => void

  /**
   * Callback when drag ends
   */
  readonly onDragEnd?: () => void

  /**
   * Callback when any interactive element receives focus
   */
  readonly onFocus?: () => void

  /**
   * Callback when focus leaves all interactive elements
   */
  readonly onBlur?: () => void

  /**
   * If true, disables all interactions
   * @default false
   */
  readonly disabled?: boolean

  /**
   * If true, clicking on the hue ring or saturation/brightness area
   * will jump the thumb to the clicked position immediately.
   * If false, the thumb only moves when dragged.
   * @default true
   */
  readonly jumpOnClick?: boolean

  /** Child components */
  readonly children: React.ReactNode
}

/**
 * Props for ColorWheel.Wheel component
 */
export interface WheelProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Size of the wheel in pixels */
  readonly size?: number
  /** Width of the hue ring in pixels */
  readonly ringWidth?: number
  /** Custom thumb size in pixels (default: auto-calculated based on wheel size) */
  readonly thumbSize?: number
  /**
   * Starting angle offset for the hue ring in degrees.
   * 0 = red at 3 o'clock (right), 90 = red at 6 o'clock (bottom),
   * -90 = red at 12 o'clock (top), 180 = red at 9 o'clock (left)
   * @default -90 (red at top)
   */
  readonly hueOffset?: number
  /** Child components */
  readonly children: React.ReactNode
}

/**
 * Props for ColorWheel.HueRing component
 */
export type HueRingProps = React.ComponentPropsWithoutRef<'div'>

/**
 * Props for ColorWheel.HueThumb component
 */
export type HueThumbProps = React.ComponentPropsWithoutRef<'div'>

/**
 * Props for ColorWheel.Area component
 */
export type AreaProps = React.ComponentPropsWithoutRef<'div'>

/**
 * Props for ColorWheel.AreaThumb component
 */
export type AreaThumbProps = React.ComponentPropsWithoutRef<'div'>

/**
 * Props for ColorWheel.HexInput component
 */
export interface HexInputProps extends Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'value' | 'onChange'
> {
  /** Callback when a valid hex value is committed (Enter or blur) */
  readonly onCommit?: (hex: string) => void
}

/**
 * Props for ColorWheel.Swatch component
 */
export type SwatchProps = React.ComponentPropsWithoutRef<'div'>

/**
 * Props for ColorWheel.AlphaSlider component
 */
export interface AlphaSliderProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Orientation of the slider */
  readonly orientation?: 'horizontal' | 'vertical'
  /**
   * If true, inverts the slider direction.
   * - horizontal: opaque on left, transparent on right
   * - vertical: opaque on top, transparent on bottom
   * @default false
   */
  readonly inverted?: boolean
  /**
   * Thickness of the slider track in pixels.
   * For horizontal: height of the slider
   * For vertical: width of the slider
   * @default 12
   */
  readonly trackSize?: number
  /**
   * Size of the thumb in pixels.
   * @default 16
   */
  readonly thumbSize?: number
}

/**
 * Props for ColorWheel.HueSlider component
 */
export interface HueSliderProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Orientation of the slider */
  readonly orientation?: 'horizontal' | 'vertical'
  /**
   * If true, inverts the slider direction.
   * - horizontal: hue 360 on left, 0 on right
   * - vertical: hue 360 on top, 0 on bottom
   * @default false
   */
  readonly inverted?: boolean
  /**
   * Thickness of the slider track in pixels.
   * For horizontal: height of the slider
   * For vertical: width of the slider
   * @default 12
   */
  readonly trackSize?: number
  /**
   * Size of the thumb in pixels.
   * @default 16
   */
  readonly thumbSize?: number
}

/**
 * Props for ColorWheel.CopyButton component
 */
export interface CopyButtonProps extends Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'children' | 'onCopy'
> {
  /** Callback after copy (receives the copied hex value) */
  readonly onCopy?: (hex: string) => void
  /** When true, renders child element instead of default button */
  readonly asChild?: boolean
  /** Child elements */
  readonly children?: React.ReactNode
}

/**
 * Props for ColorWheel.PasteButton component
 */
export interface PasteButtonProps extends Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'children' | 'onPaste'
> {
  /** Callback after successful paste (receives the pasted hex value) */
  readonly onPaste?: (hex: string) => void
  /** Callback when paste fails (invalid format) */
  readonly onError?: () => void
  /** When true, renders child element instead of default button */
  readonly asChild?: boolean
  /** Child elements */
  readonly children?: React.ReactNode
}
