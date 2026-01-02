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
export function HueRing({ className, style }: HueRingProps): JSX.Element {
  const { size, ringWidth } = useWheelContext()

  const ringStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      // Conic gradient for hue wheel
      // Start from top (0deg) and go clockwise through all hues
      background: `conic-gradient(
        from 0deg,
        hsl(0, 100%, 50%),
        hsl(60, 100%, 50%),
        hsl(120, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(240, 100%, 50%),
        hsl(300, 100%, 50%),
        hsl(360, 100%, 50%)
      )`,
      // Cut out center to create ring shape using CSS mask
      // Formula: inner radius = (size/2 - ringWidth) / (size/2) * 100%
      WebkitMask: `radial-gradient(
        circle,
        transparent ${((size / 2 - ringWidth) / (size / 2)) * 100}%,
        black ${((size / 2 - ringWidth) / (size / 2)) * 100}%
      )`,
      mask: `radial-gradient(
        circle,
        transparent ${((size / 2 - ringWidth) / (size / 2)) * 100}%,
        black ${((size / 2 - ringWidth) / (size / 2)) * 100}%
      )`,
      ...style,
    }),
    [size, ringWidth, style]
  )

  return (
    <div
      data-color-wheel-hue-ring
      className={className}
      style={ringStyle}
      aria-hidden="true" // Decorative, interaction handled by HueThumb
    />
  )
}
