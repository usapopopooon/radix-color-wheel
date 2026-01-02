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
   * Callback when drag ends
   */
  readonly onDragEnd?: () => void

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
export interface WheelProps {
  /** Size of the wheel in pixels */
  readonly size?: number
  /** Width of the hue ring in pixels */
  readonly ringWidth?: number
  /** Additional CSS class */
  readonly className?: string
  /** Inline styles */
  readonly style?: React.CSSProperties
  /** Child components */
  readonly children: React.ReactNode
}

/**
 * Props for ColorWheel.HueRing component
 */
export interface HueRingProps {
  /** Additional CSS class */
  readonly className?: string
  /** Inline styles */
  readonly style?: React.CSSProperties
}

/**
 * Props for ColorWheel.HueThumb component
 */
export interface HueThumbProps {
  /** Additional CSS class */
  readonly className?: string
  /** Inline styles */
  readonly style?: React.CSSProperties
}

/**
 * Props for ColorWheel.Area component
 */
export interface AreaProps {
  /** Additional CSS class */
  readonly className?: string
  /** Inline styles */
  readonly style?: React.CSSProperties
}

/**
 * Props for ColorWheel.AreaThumb component
 */
export interface AreaThumbProps {
  /** Additional CSS class */
  readonly className?: string
  /** Inline styles */
  readonly style?: React.CSSProperties
}

/**
 * Props for ColorWheel.HexInput component
 */
export interface HexInputProps {
  /** Additional CSS class */
  readonly className?: string
  /** Inline styles */
  readonly style?: React.CSSProperties
  /** Placeholder text */
  readonly placeholder?: string
  /**
   * When true, renders the child element instead of the default input.
   * The child must accept all input props (value, onChange, etc.)
   */
  readonly asChild?: boolean
  /** Child element for asChild mode */
  readonly children?: React.ReactNode
}

/**
 * Props for ColorWheel.Swatch component
 */
export interface SwatchProps {
  /** Additional CSS class */
  readonly className?: string
  /** Inline styles */
  readonly style?: React.CSSProperties
}

/**
 * Props for ColorWheel.AlphaSlider component
 */
export interface AlphaSliderProps {
  /** Additional CSS class */
  readonly className?: string
  /** Inline styles */
  readonly style?: React.CSSProperties
  /** Orientation of the slider */
  readonly orientation?: 'horizontal' | 'vertical'
}

/**
 * Props for ColorWheel.CopyButton component
 */
export interface CopyButtonProps {
  /** Additional CSS class */
  readonly className?: string
  /** Inline styles */
  readonly style?: React.CSSProperties
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
export interface PasteButtonProps {
  /** Additional CSS class */
  readonly className?: string
  /** Inline styles */
  readonly style?: React.CSSProperties
  /** Callback after successful paste (receives the pasted hex value) */
  readonly onPaste?: (hex: string) => void
  /** Callback when paste fails (invalid format) */
  readonly onError?: () => void
  /** When true, renders child element instead of default button */
  readonly asChild?: boolean
  /** Child elements */
  readonly children?: React.ReactNode
}

/**
 * Props for ColorWheelSimple preset component
 */
export interface ColorWheelSimpleProps {
  /** Current color in HEX format */
  readonly value?: string
  /** Initial value for uncontrolled mode */
  readonly defaultValue?: string
  /** Callback when color changes */
  readonly onValueChange?: (hex: string) => void
  /** Size of the wheel in pixels */
  readonly size?: number
  /** Whether to show HexInput */
  readonly showHexInput?: boolean
  /** Whether to show Swatch */
  readonly showSwatch?: boolean
  /** Whether to show copy button */
  readonly showCopyButton?: boolean
  /** Whether to show paste button */
  readonly showPasteButton?: boolean
  /** If true, disables all interactions */
  readonly disabled?: boolean
  /** Callback after copy */
  readonly onCopy?: (hex: string) => void
  /** Callback after paste */
  readonly onPaste?: (hex: string) => void
  /** Callback when paste fails */
  readonly onPasteError?: () => void
}
