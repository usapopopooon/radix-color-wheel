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
  const { ringWidth } = useWheelContext()

  const ringStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      // Use border with conic-gradient for hue ring
      // This creates a transparent center naturally
      border: `${ringWidth}px solid transparent`,
      backgroundImage: `conic-gradient(
        from -90deg,
        hsl(0, 100%, 50%),
        hsl(60, 100%, 50%),
        hsl(120, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(240, 100%, 50%),
        hsl(300, 100%, 50%),
        hsl(360, 100%, 50%)
      )`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'border-box',
      // Mask to show only the border area (ring)
      // Add 1px gradient transition for anti-aliasing (smoother edge)
      mask: `radial-gradient(farthest-side, transparent calc(100% - ${ringWidth}px - 1px), black calc(100% - ${ringWidth}px))`,
      WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ringWidth}px - 1px), black calc(100% - ${ringWidth}px))`,
      boxSizing: 'border-box',
      ...style,
    }),
    [ringWidth, style]
  )

  return (
    <div data-color-wheel-hue-ring className={className} style={ringStyle} aria-hidden="true" />
  )
}
