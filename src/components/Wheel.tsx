import { forwardRef, useMemo } from 'react'
import {
  WheelContext,
  calculateAreaSize,
  calculateThumbSize,
  type WheelContextValue,
} from '../context/WheelContext'
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
export const Wheel = forwardRef<HTMLDivElement, WheelProps>(
  (
    {
      size = 200,
      ringWidth = 20,
      thumbSize: customThumbSize,
      hueOffset = -90,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const areaSize = useMemo(() => calculateAreaSize(size, ringWidth), [size, ringWidth])
    const thumbSize = useMemo(
      () => customThumbSize ?? calculateThumbSize(size),
      [customThumbSize, size]
    )

    const contextValue = useMemo<WheelContextValue>(
      () => ({
        size,
        ringWidth,
        areaSize,
        thumbSize,
        hueOffset,
      }),
      [size, ringWidth, areaSize, thumbSize, hueOffset]
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
        <div
          ref={ref}
          data-color-wheel-wheel
          role="group"
          aria-label="Color wheel"
          {...props}
          className={className}
          style={wheelStyle}
        >
          {children}
        </div>
      </WheelContext.Provider>
    )
  }
)

Wheel.displayName = 'Wheel'
