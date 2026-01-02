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
