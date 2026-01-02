import { useMemo } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { useWheelContext } from '../context/WheelContext'
import { hsvToHex } from '../utils'
import type { AreaProps } from '../types'

/**
 * Area component - Square area for selecting saturation and brightness
 *
 * Displays a square gradient area inside the hue ring where users can
 * select saturation (x-axis) and value/brightness (y-axis).
 * This component is decorative and non-interactive (use AreaThumb for interaction).
 *
 * @param props - Component props
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 *
 * @example
 * ```tsx
 * <ColorWheel.Wheel>
 *   <ColorWheel.HueRing />
 *   <ColorWheel.Area />
 *   <ColorWheel.AreaThumb />
 * </ColorWheel.Wheel>
 * ```
 */
export function Area({ className, style }: AreaProps): React.ReactElement {
  const { hsv } = useColorWheelContext()
  const { size, ringWidth } = useWheelContext()

  // Calculate the size of the square area that fits inside the ring
  // The largest square that fits inside a circle has diagonal = diameter
  // For a circle with radius r, the inscribed square has side = r * sqrt(2)
  // Inner radius = (size/2 - ringWidth)
  // Area size = inner radius * sqrt(2) * 0.9 (with some padding)
  const areaSize = useMemo(() => {
    const innerRadius = size / 2 - ringWidth
    // Using 0.707 (1/sqrt(2)) to get inscribed square, then reducing slightly for padding
    return Math.floor(innerRadius * Math.SQRT2 * 0.95)
  }, [size, ringWidth])

  // Current hue color for the area background
  const hueColor = useMemo(() => hsvToHex(hsv.h, 100, 100), [hsv.h])

  const areaStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      // Center the area in the wheel
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: areaSize,
      height: areaSize,
      // Base color is the current hue at full saturation and brightness
      backgroundColor: hueColor,
      // Overlay gradients for saturation and brightness
      // These are applied via pseudo-elements in CSS, but we can use multiple backgrounds
      backgroundImage: `
        linear-gradient(to bottom, transparent 0%, #000 100%),
        linear-gradient(to right, #fff 0%, transparent 100%)
      `,
      ...style,
    }),
    [areaSize, hueColor, style]
  )

  return (
    <div
      data-color-wheel-area
      className={className}
      style={areaStyle}
      aria-hidden="true" // Decorative, interaction handled by AreaThumb
    />
  )
}
