import { forwardRef, useMemo, useCallback, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { hsvToHex, getColorNameEn } from '../utils'
import { useSliderBase } from '../hooks/useSliderBase'
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
    const { hsv, hex, setHue, disabled, onDragStart, onDrag, onDragEnd, onFocus, onBlur } =
      useColorWheelContext()

    const handleChange = useCallback(
      (ratio: number) => {
        setHue(Math.round(ratio * 360) % 360)
        onDrag?.(hex)
      },
      [setHue, onDrag, hex]
    )

    const {
      sliderRef,
      borderRadius,
      sliderStyle: baseSliderStyle,
      thumbPositionStyle,
      gradientDirection,
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
    } = useSliderBase({
      value: hsv.h / 360,
      onChange: handleChange,
      disabled,
      orientation,
      inverted,
      trackSize,
      onDragStart,
      onDragEnd,
    })

    // Forward ref to internal slider element
    useImperativeHandle(ref, () => sliderRef.current!, [sliderRef])

    // Current hue color for thumb background (full saturation and brightness)
    const thumbColor = useMemo(() => hsvToHex(hsv.h, 100, 100), [hsv.h])

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

    const sliderStyle: React.CSSProperties = useMemo(
      () => ({ ...baseSliderStyle, ...style }),
      [baseSliderStyle, style]
    )

    const gradientStyle: React.CSSProperties = useMemo(
      () => ({
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
      }),
      [borderRadius, gradientDirection]
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
