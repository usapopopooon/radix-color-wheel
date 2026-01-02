import { forwardRef, useMemo, useCallback, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { hsvToHex } from '../utils'
import { useSliderBase } from '../hooks/useSliderBase'
import { useSliderKeyboard } from '../hooks/useSliderKeyboard'
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
    const { hsv, hex, setSaturation, disabled, onDragStart, onDrag, onDragEnd, onFocus, onBlur } =
      useColorWheelContext()

    const handleChange = useCallback(
      (ratio: number) => {
        setSaturation(Math.round(ratio * 100))
        onDrag?.(hex)
      },
      [setSaturation, onDrag, hex]
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
      value: hsv.s / 100,
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

    // Current color for thumb background
    const thumbColor = useMemo(() => hsvToHex(hsv.h, hsv.s, hsv.v), [hsv.h, hsv.s, hsv.v])

    // Gray color (saturation 0) and full color (saturation 100)
    const grayColor = useMemo(() => hsvToHex(hsv.h, 0, hsv.v), [hsv.h, hsv.v])
    const fullColor = useMemo(() => hsvToHex(hsv.h, 100, hsv.v), [hsv.h, hsv.v])

    const sliderStyle: React.CSSProperties = useMemo(
      () => ({ ...baseSliderStyle, ...style }),
      [baseSliderStyle, style]
    )

    const gradientStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'absolute',
        inset: 0,
        borderRadius,
        background: `linear-gradient(${gradientDirection}, ${grayColor}, ${fullColor})`,
      }),
      [borderRadius, gradientDirection, grayColor, fullColor]
    )

    const handleKeyDown = useSliderKeyboard({
      value: hsv.s,
      min: 0,
      max: 100,
      disabled,
      onChange: setSaturation,
    })

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
