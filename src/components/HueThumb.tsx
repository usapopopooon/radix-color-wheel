import { useMemo, useCallback, useRef } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { useWheelContext } from '../context/WheelContext'
import { getColorNameEn, getHueFromPosition, hsvToHex } from '../utils'
import { cn } from '@/lib/utils'
import type { HueThumbProps } from '../types'

/**
 * HueThumb component - Draggable thumb on the hue ring
 *
 * Allows users to select a hue by dragging around the ring.
 * Supports both pointer (mouse/touch) and keyboard interaction.
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
export function HueThumb({ className, style }: HueThumbProps): React.ReactElement {
  const { hsv, setHue, disabled, onDragStart, onDragEnd } = useColorWheelContext()
  const { size, ringWidth } = useWheelContext()
  const thumbRef = useRef<HTMLDivElement>(null)

  // Calculate thumb position on the ring
  // Formula: x = center + radius * cos(angle), y = center + radius * sin(angle)
  // Angle is adjusted: 0 degrees at top (12 o'clock), clockwise
  const thumbPosition = useMemo(() => {
    const center = size / 2
    // Radius is the middle of the ring
    const radius = center - ringWidth / 2
    // Convert hue to radians, adjusting for 0 at top
    // Formula: angle = (hue - 90) * pi / 180
    const angleRad = ((hsv.h - 90) * Math.PI) / 180
    return {
      x: center + radius * Math.cos(angleRad),
      y: center + radius * Math.sin(angleRad),
    }
  }, [hsv.h, size, ringWidth])

  // Current hue color for thumb background
  const hueColor = useMemo(() => hsvToHex(hsv.h, 100, 100), [hsv.h])

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
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const center = size / 2

      // Calculate hue from position
      const newHue = getHueFromPosition(x, y, center, center)
      setHue(Math.round(newHue))
    },
    [disabled, size, setHue]
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
        case 'ArrowDown':
          e.preventDefault()
          setHue((hsv.h - step + 360) % 360)
          break
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault()
          setHue((hsv.h + step) % 360)
          break
        case 'Home':
          e.preventDefault()
          setHue(0)
          break
        case 'End':
          e.preventDefault()
          setHue(359)
          break
      }
    },
    [disabled, hsv.h, setHue]
  )

  // Thumb size proportional to wheel size (base: 14px at 200px wheel)
  const thumbSize = useMemo(() => Math.round(size * 0.07), [size])

  const thumbStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      width: thumbSize,
      height: thumbSize,
      // Structure: color circle -> white inset shadow (as border) -> outer border -> focus ring
      boxShadow: 'inset 0 0 0 2px white, 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
      backgroundColor: hueColor,
      // Position at calculated point, centered on the thumb
      left: thumbPosition.x,
      top: thumbPosition.y,
      transform: 'translate(-50%, -50%)',
      cursor: disabled ? 'not-allowed' : 'grab',
      touchAction: 'none',
      ...style,
    }),
    [thumbSize, thumbPosition, hueColor, disabled, style]
  )

  return (
    <div
      ref={thumbRef}
      data-color-wheel-hue-thumb
      data-color-wheel-thumb
      className={cn('rounded-full focus-visible:outline focus-visible:outline-3 focus-visible:outline-gray-500/[.75] active:cursor-grabbing', className)}
      style={thumbStyle}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label="Hue"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={hsv.h}
      aria-valuetext={`${getColorNameEn(hsv.h)}, ${hsv.h} degrees`}
      aria-orientation="horizontal"
      aria-disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
    />
  )
}
