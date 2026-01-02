import { useMemo } from 'react'
import { WheelContext, type WheelContextValue } from '../context/WheelContext'
import type { WheelProps } from '../types'

/**
 * Wheel component - Container for the entire color wheel
 *
 * Provides size configuration for child components via context.
 * Specify size and ringWidth here.
 *
 * @param props - Component props
 * @param props.size - Size of the wheel in pixels (default: 200)
 * @param props.ringWidth - Width of the hue ring in pixels (default: 20)
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 * @param props.children - Child components (HueRing, HueThumb, Area, AreaThumb)
 *
 * @example
 * ```tsx
 * <ColorWheel.Wheel size={250} ringWidth={24}>
 *   <ColorWheel.HueRing />
 *   <ColorWheel.HueThumb />
 *   <ColorWheel.Area />
 *   <ColorWheel.AreaThumb />
 * </ColorWheel.Wheel>
 * ```
 */
export function Wheel({
  size = 200,
  ringWidth = 20,
  className,
  style,
  children,
}: WheelProps): JSX.Element {
  const contextValue = useMemo<WheelContextValue>(
    () => ({
      size,
      ringWidth,
    }),
    [size, ringWidth]
  )

  const wheelStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'relative',
      width: size,
      height: size,
      ...style,
    }),
    [size, style]
  )

  return (
    <WheelContext.Provider value={contextValue}>
      <div data-color-wheel-wheel className={className} style={wheelStyle}>
        {children}
      </div>
    </WheelContext.Provider>
  )
}
