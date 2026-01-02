import { forwardRef, useMemo, useCallback, useRef, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { clamp, hsvToHex } from '../utils'
import { Thumb } from './Thumb'
import type { SaturationSliderProps } from '../types'

/**
 * SaturationSlider component - Linear slider for adjusting saturation
 *
 * Displays a horizontal or vertical slider with a gradient showing
 * saturation from 0% (gray) to 100% (full color).
 *
 * @param props - Component props
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 * @param props.orientation - 'horizontal' or 'vertical' (default: 'horizontal')
 * @param props.inverted - If true, inverts the slider direction (default: false)
 * @param props.trackSize - Track thickness in pixels (default: 12)
 * @param props.thumbSize - Thumb size in pixels (default: 16)
 *
 * @example
 * ```tsx
 * <ColorWheel.Root value={color} onValueChange={setColor}>
 *   <ColorWheel.SaturationSlider />
 * </ColorWheel.Root>
 * ```
 */
export const SaturationSlider = forwardRef<HTMLDivElement, SaturationSliderProps>(
  (
    {
      className,
      style,
      orientation = 'horizontal',
      inverted = false,
      trackSize = 12,
      thumbSize = 16,
      ...props
    },
    ref
  ) => {
    const {
      hsv,
      hex,
      setSaturation,
      disabled,
      onDragStart,
      onDrag,
      onDragEnd,
      onFocus,
      onBlur,
    } = useColorWheelContext()
    const sliderRef = useRef<HTMLDivElement>(null)

    // Forward ref to internal slider element
    useImperativeHandle(ref, () => sliderRef.current!, [])

    const isHorizontal = orientation === 'horizontal'

    // Calculate thumb position based on saturation value (0-100)
    const thumbPosition = useMemo(() => {
      const ratio = hsv.s / 100
      return `${inverted ? (1 - ratio) * 100 : ratio * 100}%`
    }, [hsv.s, inverted])

    // Current color for thumb background
    const thumbColor = useMemo(() => hsvToHex(hsv.h, hsv.s, hsv.v), [hsv.h, hsv.s, hsv.v])

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return
        e.preventDefault()
        sliderRef.current?.setPointerCapture(e.pointerId)
        onDragStart?.()

        if (sliderRef.current) {
          const rect = sliderRef.current.getBoundingClientRect()
          const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top
          const size = isHorizontal ? rect.width : rect.height
          const ratio = clamp(position / size, 0, 1)
          const newSaturation = (inverted ? 1 - ratio : ratio) * 100
          setSaturation(Math.round(newSaturation))
        }
      },
      [disabled, isHorizontal, inverted, setSaturation, onDragStart]
    )

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return
        if (!sliderRef.current?.hasPointerCapture(e.pointerId)) return

        const rect = sliderRef.current.getBoundingClientRect()
        const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top
        const size = isHorizontal ? rect.width : rect.height
        const ratio = clamp(position / size, 0, 1)
        const newSaturation = (inverted ? 1 - ratio : ratio) * 100
        setSaturation(Math.round(newSaturation))

        onDrag?.(hex)
      },
      [disabled, isHorizontal, inverted, setSaturation, onDrag, hex]
    )

    const handlePointerUp = useCallback(
      (e: React.PointerEvent) => {
        sliderRef.current?.releasePointerCapture(e.pointerId)
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
          case 'a':
          case 's':
            e.preventDefault()
            if (e.altKey) {
              setSaturation(0)
            } else {
              setSaturation(clamp(hsv.s - step, 0, 100))
            }
            break
          case 'ArrowRight':
          case 'ArrowUp':
          case 'd':
          case 'w':
            e.preventDefault()
            if (e.altKey) {
              setSaturation(100)
            } else {
              setSaturation(clamp(hsv.s + step, 0, 100))
            }
            break
        }
      },
      [disabled, hsv.s, setSaturation]
    )

    const borderRadius = trackSize / 2

    // Gray color (saturation 0) and full color (saturation 100)
    const grayColor = useMemo(() => hsvToHex(hsv.h, 0, hsv.v), [hsv.h, hsv.v])
    const fullColor = useMemo(() => hsvToHex(hsv.h, 100, hsv.v), [hsv.h, hsv.v])

    const sliderStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'relative',
        width: isHorizontal ? '100%' : trackSize,
        height: isHorizontal ? trackSize : '100%',
        minHeight: isHorizontal ? undefined : 100,
        borderRadius,
        cursor: disabled ? 'not-allowed' : 'pointer',
        touchAction: 'none',
        ...style,
      }),
      [isHorizontal, trackSize, borderRadius, disabled, style]
    )

    const gradientStyle: React.CSSProperties = useMemo(() => {
      const gradientDirection = isHorizontal
        ? inverted
          ? 'to left'
          : 'to right'
        : inverted
          ? 'to top'
          : 'to bottom'

      return {
        position: 'absolute',
        inset: 0,
        borderRadius,
        background: `linear-gradient(${gradientDirection}, ${grayColor}, ${fullColor})`,
      }
    }, [isHorizontal, inverted, borderRadius, grayColor, fullColor])

    const thumbPositionStyle: React.CSSProperties = useMemo(
      () =>
        isHorizontal ? { left: thumbPosition, top: '50%' } : { top: thumbPosition, left: '50%' },
      [isHorizontal, thumbPosition]
    )

    return (
      <div
        ref={sliderRef}
        data-color-wheel-saturation-slider
        className={className}
        style={sliderStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        {...props}
      >
        <div style={gradientStyle} aria-hidden="true" />
        <Thumb
          size={thumbSize}
          color={thumbColor}
          style={thumbPositionStyle}
          aria-label="Saturation"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={hsv.s}
          aria-valuetext={`${hsv.s}%`}
          aria-orientation={orientation}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    )
  }
)

SaturationSlider.displayName = 'SaturationSlider'
