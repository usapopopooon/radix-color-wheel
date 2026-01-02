import { forwardRef, useMemo, useCallback, useRef, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { useWheelContext } from '../context/WheelContext'
import { hsvToHex, getSVFromPosition } from '../utils'
import type { AreaProps } from '../types'

/**
 * Area component - Square area for selecting saturation and brightness
 *
 * Displays a square gradient area inside the hue ring where users can
 * select saturation (x-axis) and value/brightness (y-axis).
 * When jumpOnClick is true (default), clicking on the area will jump
 * the thumb to the clicked position.
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
  const {
    hsv,
    hex,
    setSaturationAndBrightness,
    disabled,
    jumpOnClick,
    onDragStart,
    onDrag,
    onDragEnd,
  } = useColorWheelContext()
  const { areaSize } = useWheelContext()
  const areaRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => areaRef.current!, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || !jumpOnClick) return
      e.preventDefault()

      const rect = areaRef.current?.getBoundingClientRect()
      if (!rect) return

      // Capture pointer on the area for continued dragging
      areaRef.current?.setPointerCapture(e.pointerId)
      onDragStart?.()

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Calculate and set saturation/brightness atomically
      const { s, v } = getSVFromPosition(x, y, areaSize)
      setSaturationAndBrightness(Math.round(s), Math.round(v))
    },
    [disabled, jumpOnClick, areaSize, setSaturationAndBrightness, onDragStart]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      if (!areaRef.current?.hasPointerCapture(e.pointerId)) return

      const rect = areaRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const { s, v } = getSVFromPosition(x, y, areaSize)
      setSaturationAndBrightness(Math.round(s), Math.round(v))
      onDrag?.(hex)
    },
    [disabled, areaSize, setSaturationAndBrightness, onDrag, hex]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (areaRef.current?.hasPointerCapture(e.pointerId)) {
        areaRef.current.releasePointerCapture(e.pointerId)
        onDragEnd?.()
      }
    },
    [onDragEnd]
  )

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
      cursor: disabled ? 'default' : 'crosshair',
      touchAction: 'none',
      ...style,
    }),
    [areaSize, hueColor, style, disabled]
  )

  return (
    <div
      ref={areaRef}
      data-color-wheel-area
      className={className}
      style={areaStyle}
      aria-hidden="true"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      {...props}
    />
  )
})

Area.displayName = 'Area'
