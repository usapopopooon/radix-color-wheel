import { forwardRef, useMemo, useCallback, useRef, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { clamp, hsvToHex, getColorNameEn } from '../utils'
import { Thumb } from './Thumb'
import type { HueSliderProps } from '../types'

/**
 * HueSlider component - Linear slider for adjusting hue
 *
 * Displays a horizontal or vertical slider with a gradient showing
 * all hues from 0 to 360 degrees.
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
 *   <ColorWheel.HueSlider className="mt-4" />
 *   {/* Vertical hue slider *\/}
 *   <ColorWheel.HueSlider orientation="vertical" />
 * </ColorWheel.Root>
 * ```
 */
export const HueSlider = forwardRef<HTMLDivElement, HueSliderProps>(
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
      setHue,
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

    // Calculate thumb position based on hue value (0-360)
    // When inverted, 360 is at 0% position and 0 is at 100% position
    const thumbPosition = useMemo(() => {
      const ratio = hsv.h / 360
      return `${inverted ? (1 - ratio) * 100 : ratio * 100}%`
    }, [hsv.h, inverted])

    // Current hue color for thumb background (full saturation and brightness)
    const thumbColor = useMemo(() => hsvToHex(hsv.h, 100, 100), [hsv.h])

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return
        e.preventDefault()
        // Capture pointer on the slider container
        sliderRef.current?.setPointerCapture(e.pointerId)
        onDragStart?.()

        // Calculate hue from click position
        if (sliderRef.current) {
          const rect = sliderRef.current.getBoundingClientRect()
          const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top
          const size = isHorizontal ? rect.width : rect.height
          const ratio = clamp(position / size, 0, 1)
          // When inverted, flip the ratio
          const newHue = (inverted ? 1 - ratio : ratio) * 360
          setHue(Math.round(newHue) % 360)
        }
      },
      [disabled, isHorizontal, inverted, setHue, onDragStart]
    )

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return
        if (!sliderRef.current?.hasPointerCapture(e.pointerId)) return

        const rect = sliderRef.current.getBoundingClientRect()
        const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top
        const size = isHorizontal ? rect.width : rect.height
        const ratio = clamp(position / size, 0, 1)
        // When inverted, flip the ratio
        const newHue = (inverted ? 1 - ratio : ratio) * 360
        setHue(Math.round(newHue) % 360)

        // Call onDrag with current hex
        onDrag?.(hex)
      },
      [disabled, isHorizontal, inverted, setHue, onDrag, hex]
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

        // Determine step: Shift = 10, otherwise 1
        const step = e.shiftKey ? 10 : 1

        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowDown':
          case 'a':
          case 's':
            e.preventDefault()
            // Alt: jump to minimum (0)
            if (e.altKey) {
              setHue(0)
            } else {
              setHue((hsv.h - step + 360) % 360)
            }
            break
          case 'ArrowRight':
          case 'ArrowUp':
          case 'd':
          case 'w':
            e.preventDefault()
            // Alt: jump to maximum (359)
            if (e.altKey) {
              setHue(359)
            } else {
              setHue((hsv.h + step) % 360)
            }
            break
        }
      },
      [disabled, hsv.h, setHue]
    )

    const borderRadius = trackSize / 2

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
      // Hue gradient from 0 (red) to 360 (red)
      // Default: 0 on left/top, 360 on right/bottom
      // Inverted: 360 on left/top, 0 on right/bottom
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
        background: `linear-gradient(${gradientDirection},
          hsl(0, 100%, 50%),
          hsl(60, 100%, 50%),
          hsl(120, 100%, 50%),
          hsl(180, 100%, 50%),
          hsl(240, 100%, 50%),
          hsl(300, 100%, 50%),
          hsl(360, 100%, 50%)
        )`,
      }
    }, [isHorizontal, inverted, borderRadius])

    const thumbPositionStyle: React.CSSProperties = useMemo(
      () =>
        isHorizontal ? { left: thumbPosition, top: '50%' } : { top: thumbPosition, left: '50%' },
      [isHorizontal, thumbPosition]
    )

    return (
      <div
        ref={sliderRef}
        data-color-wheel-hue-slider
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
          aria-label="Hue"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={hsv.h}
          aria-valuetext={`${getColorNameEn(hsv.h)}, ${hsv.h} degrees`}
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

HueSlider.displayName = 'HueSlider'
