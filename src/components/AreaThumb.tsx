import { forwardRef, useMemo, useCallback, useRef, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { useWheelContext } from '../context/WheelContext'
import { getSVFromPosition, hsvToHex, clamp } from '../utils'
import { Thumb } from './Thumb'
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
export const AreaThumb = forwardRef<HTMLDivElement, AreaThumbProps>(({ className, style }, ref) => {
  const {
    hsv,
    hex,
    setSaturation,
    setBrightness,
    disabled,
    onDragStart,
    onDrag,
    onDragEnd,
    onFocus,
    onBlur,
  } = useColorWheelContext()
  const { size, areaSize, thumbSize } = useWheelContext()
  const thumbRef = useRef<HTMLDivElement>(null)

  // Forward ref to internal thumb element
  useImperativeHandle(ref, () => thumbRef.current!, [])

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

  // Use the current selected color for the thumb
  const currentColor = useMemo(() => hsvToHex(hsv.h, hsv.s, hsv.v), [hsv.h, hsv.s, hsv.v])

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

      // Call onDrag with current hex
      onDrag?.(hex)
    },
    [disabled, areaOffset, areaSize, setSaturation, setBrightness, onDrag, hex]
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

      // Determine step: Shift = 10, otherwise 1
      const step = e.shiftKey ? 10 : 1

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          e.preventDefault()
          // Alt: jump to minimum saturation (0)
          if (e.altKey) {
            setSaturation(0)
          } else {
            setSaturation(clamp(hsv.s - step, 0, 100))
          }
          break
        case 'ArrowRight':
        case 'd':
          e.preventDefault()
          // Alt: jump to maximum saturation (100)
          if (e.altKey) {
            setSaturation(100)
          } else {
            setSaturation(clamp(hsv.s + step, 0, 100))
          }
          break
        case 'ArrowUp':
        case 'w':
          e.preventDefault()
          // Alt: jump to maximum brightness (100)
          if (e.altKey) {
            setBrightness(100)
          } else {
            setBrightness(clamp(hsv.v + step, 0, 100))
          }
          break
        case 'ArrowDown':
        case 's':
          e.preventDefault()
          // Alt: jump to minimum brightness (0)
          if (e.altKey) {
            setBrightness(0)
          } else {
            setBrightness(clamp(hsv.v - step, 0, 100))
          }
          break
      }
    },
    [disabled, hsv.s, hsv.v, setSaturation, setBrightness]
  )

  const positionStyle: React.CSSProperties = useMemo(
    () => ({
      left: thumbPosition.x,
      top: thumbPosition.y,
      zIndex: 1,
      ...style,
    }),
    [thumbPosition, style]
  )

  return (
    <Thumb
      ref={thumbRef}
      size={thumbSize}
      color={currentColor}
      className={className}
      style={positionStyle}
      dataAttributes={{ 'color-wheel-area-thumb': '' }}
      aria-label="Saturation and brightness"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={hsv.s}
      aria-valuetext={`Saturation ${hsv.s}%, brightness ${hsv.v}%`}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
})

AreaThumb.displayName = 'AreaThumb'
