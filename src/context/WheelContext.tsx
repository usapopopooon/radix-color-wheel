import { createContext, useContext } from 'react'

/**
 * Context value for Wheel size configuration
 */
export interface WheelContextValue {
  /** Wheel size in pixels */
  readonly size: number
  /** Ring width in pixels */
  readonly ringWidth: number
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
