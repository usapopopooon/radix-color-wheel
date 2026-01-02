import { createContext, useContext } from 'react'
import type { HSV } from '../types'

/**
 * Context value for ColorWheel components
 */
export interface ColorWheelContextValue {
  /** Current HSV values (readonly) */
  readonly hsv: HSV
  /** Current HEX value */
  readonly hex: string

  /** Set hue value (0-360) */
  readonly setHue: (hue: number) => void
  /** Set saturation value (0-100) */
  readonly setSaturation: (saturation: number) => void
  /** Set brightness/value (0-100) */
  readonly setBrightness: (brightness: number) => void
  /** Set hex value directly */
  readonly setHex: (hex: string) => void

  /** Whether component is disabled */
  readonly disabled: boolean
  /** Whether currently dragging */
  readonly isDragging: boolean
  /** Set dragging state */
  readonly setIsDragging: (dragging: boolean) => void

  /** Callback when drag starts */
  readonly onDragStart?: () => void
  /** Callback when drag ends */
  readonly onDragEnd?: () => void
}

/**
 * Context for sharing state between ColorWheel components
 */
export const ColorWheelContext = createContext<ColorWheelContextValue | null>(null)

/**
 * Hook to access ColorWheel context
 *
 * @throws Error if used outside of ColorWheel.Root
 * @returns ColorWheelContextValue
 *
 * @example
 * ```tsx
 * function CustomComponent() {
 *   const { hsv, setHue } = useColorWheelContext()
 *   return <div>Hue: {hsv.h}</div>
 * }
 * ```
 */
export function useColorWheelContext(): ColorWheelContextValue {
  const context = useContext(ColorWheelContext)
  if (!context) {
    throw new Error('useColorWheelContext must be used within ColorWheel.Root')
  }
  return context
}
