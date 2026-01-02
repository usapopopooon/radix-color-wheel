import { useMemo } from 'react'
import { useWheelContext } from '../context/WheelContext'
import type { HueRingProps } from '../types'

/**
 * HueRing component - Displays the circular hue gradient
 *
 * Renders a ring-shaped element with a conic gradient representing all hues.
 * This component is decorative and non-interactive (use HueThumb for interaction).
 *
 * @param props - Component props
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 *
 * @example
 * ```tsx
 * <ColorWheel.Wheel>
 *   <ColorWheel.HueRing />
 *   <ColorWheel.HueThumb />
 * </ColorWheel.Wheel>
 * ```
 */
export function HueRing({ className, style }: HueRingProps): React.ReactElement {
  const { size, ringWidth } = useWheelContext()

  // Inner mask size (to cut out the center)
  const innerSize = size - ringWidth * 2

  const ringStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      // Conic gradient for hue wheel
      // Start from top (-90deg) and go clockwise through all hues
      background: `conic-gradient(
        from -90deg,
        hsl(0, 100%, 50%),
        hsl(60, 100%, 50%),
        hsl(120, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(240, 100%, 50%),
        hsl(300, 100%, 50%),
        hsl(360, 100%, 50%)
      )`,
      ...style,
    }),
    [style]
  )

  const maskStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      top: ringWidth,
      left: ringWidth,
      width: innerSize,
      height: innerSize,
      borderRadius: '50%',
      background: 'var(--cw-wheel-bg, #ffffff)',
    }),
    [ringWidth, innerSize]
  )

  return (
    <div data-color-wheel-hue-ring className={className} style={ringStyle} aria-hidden="true">
      <div data-color-wheel-hue-ring-mask style={maskStyle} />
    </div>
  )
}
