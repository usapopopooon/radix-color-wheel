import { forwardRef, useMemo } from 'react'
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
export const Area = forwardRef<HTMLDivElement, AreaProps>(({ className, style, ...props }, ref) => {
  const { hsv } = useColorWheelContext()
  const { areaSize } = useWheelContext()

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
      ref={ref}
      data-color-wheel-area
      className={className}
      style={areaStyle}
      aria-hidden="true"
      {...props}
    />
  )
})

Area.displayName = 'Area'
