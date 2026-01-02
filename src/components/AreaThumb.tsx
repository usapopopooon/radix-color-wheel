import { useMemo, useCallback, useRef } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { useWheelContext } from '../context/WheelContext'
import { getSVFromPosition, hsvToHex, clamp } from '../utils'
import type { AreaThumbProps } from '../types'

/**
 * AreaThumb component - Draggable thumb in the saturation/brightness area
 *
 * Allows users to select saturation (x-axis) and brightness (y-axis)
 * by dragging within the area. Supports both pointer and keyboard interaction.
 *
 * @param props - Component props
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 *
 * @example
 * ```tsx
 * <ColorWheel.Wheel>
 *   <ColorWheel.Area />
 *   <ColorWheel.AreaThumb />
 * </ColorWheel.Wheel>
 * ```
 */
export function AreaThumb({ className, style }: AreaThumbProps): React.ReactElement {
  const { hsv, setSaturation, setBrightness, disabled, onDragStart, onDragEnd } =
    useColorWheelContext()
  const { size, ringWidth } = useWheelContext()
  const thumbRef = useRef<HTMLDivElement>(null)

  // Calculate area size (same as in Area component)
  const areaSize = useMemo(() => {
    const innerRadius = size / 2 - ringWidth
    return Math.floor(innerRadius * Math.SQRT2 * 0.95)
  }, [size, ringWidth])

  // Calculate area offset from wheel center
  const areaOffset = useMemo(() => {
    return (size - areaSize) / 2
  }, [size, areaSize])

  // Calculate thumb position within the area
  // Formula: x = saturation% * areaSize, y = (100 - brightness%) * areaSize
  const thumbPosition = useMemo(() => {
    return {
      x: areaOffset + (hsv.s / 100) * areaSize,
      y: areaOffset + ((100 - hsv.v) / 100) * areaSize,
    }
  }, [hsv.s, hsv.v, areaSize, areaOffset])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      e.preventDefault()
      e.stopPropagation()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      onDragStart?.()
    },
    [disabled, onDragStart]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return

      // Get wheel container bounds
      const wheelElement = thumbRef.current?.parentElement
      if (!wheelElement) return

      const rect = wheelElement.getBoundingClientRect()
      const x = e.clientX - rect.left - areaOffset
      const y = e.clientY - rect.top - areaOffset

      // Calculate saturation and brightness from position
      const { s, v } = getSVFromPosition(x, y, areaSize)
      setSaturation(Math.round(s))
      setBrightness(Math.round(v))
    },
    [disabled, areaOffset, areaSize, setSaturation, setBrightness]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      onDragEnd?.()
    },
    [onDragEnd]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      const step = e.shiftKey ? 10 : 1

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setSaturation(clamp(hsv.s - step, 0, 100))
          break
        case 'ArrowRight':
          e.preventDefault()
          setSaturation(clamp(hsv.s + step, 0, 100))
          break
        case 'ArrowUp':
          e.preventDefault()
          setBrightness(clamp(hsv.v + step, 0, 100))
          break
        case 'ArrowDown':
          e.preventDefault()
          setBrightness(clamp(hsv.v - step, 0, 100))
          break
        case 'Home':
          e.preventDefault()
          setSaturation(0)
          setBrightness(100) // White
          break
        case 'End':
          e.preventDefault()
          setSaturation(100)
          setBrightness(100) // Pure hue color
          break
      }
    },
    [disabled, hsv.s, hsv.v, setSaturation, setBrightness]
  )

  // Use the current selected color for the thumb
  const currentColor = useMemo(() => hsvToHex(hsv.h, hsv.s, hsv.v), [hsv.h, hsv.s, hsv.v])

  const thumbStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      width: 14,
      height: 14,
      borderRadius: '50%',
      border: '2px solid #fff',
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
      backgroundColor: currentColor,
      // Position at calculated point, centered on the thumb
      left: thumbPosition.x,
      top: thumbPosition.y,
      transform: 'translate(-50%, -50%)',
      cursor: disabled ? 'not-allowed' : 'grab',
      touchAction: 'none',
      outline: 'none',
      zIndex: 1,
      ...style,
    }),
    [thumbPosition, currentColor, disabled, style]
  )

  return (
    <div
      ref={thumbRef}
      data-color-wheel-area-thumb
      data-color-wheel-thumb
      className={className}
      style={thumbStyle}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label="Saturation and brightness"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={hsv.s}
      aria-valuetext={`Saturation ${hsv.s}%, brightness ${hsv.v}%`}
      aria-disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
    />
  )
}
