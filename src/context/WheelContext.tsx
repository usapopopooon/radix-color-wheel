import { createContext, useContext } from 'react'

/** Padding factor for the inscribed square area (0.95 = 5% padding) */
const AREA_PADDING_FACTOR = 0.95

/** Thumb size ratio relative to wheel size (0.07 = 7% of wheel size, ~14px at 200px wheel) */
const THUMB_SIZE_RATIO = 0.07

/**
 * Calculate the size of the square area that fits inside the hue ring
 *
 * The largest square that fits inside a circle has diagonal = diameter.
 * For a circle with radius r, the inscribed square has side = r * sqrt(2).
 *
 * @param size - Wheel size in pixels
 * @param ringWidth - Ring width in pixels
 * @returns Area size in pixels
 */
export function calculateAreaSize(size: number, ringWidth: number): number {
  const innerRadius = size / 2 - ringWidth
  return Math.floor(innerRadius * Math.SQRT2 * AREA_PADDING_FACTOR)
}

/**
 * Calculate the thumb size based on wheel size
 *
 * @param size - Wheel size in pixels
 * @returns Thumb size in pixels
 */
export function calculateThumbSize(size: number): number {
  return Math.round(size * THUMB_SIZE_RATIO)
}

/**
 * Context value for Wheel size configuration
 */
export interface WheelContextValue {
  /** Wheel size in pixels */
  readonly size: number
  /** Ring width in pixels */
  readonly ringWidth: number
  /** Calculated area size in pixels */
  readonly areaSize: number
  /** Calculated thumb size in pixels */
  readonly thumbSize: number
}

/**
 * Context for sharing wheel size between components
 */
export const WheelContext = createContext<WheelContextValue | null>(null)

/**
 * Hook to access Wheel context
 *
 * @throws Error if used outside of ColorWheel.Wheel
 * @returns WheelContextValue
 */
export function useWheelContext(): WheelContextValue {
  const context = useContext(WheelContext)
  if (!context) {
    throw new Error('useWheelContext must be used within ColorWheel.Wheel')
  }
  return context
}
