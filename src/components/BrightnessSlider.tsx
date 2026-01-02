import { forwardRef, useMemo, useCallback, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { hsvToHex } from '../utils'
import { useSliderBase } from '../hooks/useSliderBase'
import { useSliderKeyboard } from '../hooks/useSliderKeyboard'
import { Thumb } from './Thumb'
import type { BrightnessSliderProps } from '../types'

/**
 * BrightnessSlider component - Linear slider for adjusting brightness (value)
 *
 * Displays a horizontal or vertical slider with a gradient showing
 * brightness from 0% (black) to 100% (full brightness).
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
 *   <ColorWheel.BrightnessSlider />
 * </ColorWheel.Root>
 * ```
 */
export const BrightnessSlider = forwardRef<HTMLDivElement, BrightnessSliderProps>(
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
    const { hsv, hex, setBrightness, disabled, onDragStart, onDrag, onDragEnd, onFocus, onBlur } =
      useColorWheelContext()

    const handleChange = useCallback(
      (ratio: number) => {
        setBrightness(Math.round(ratio * 100))
        onDrag?.(hex)
      },
      [setBrightness, onDrag, hex]
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
      value: hsv.v / 100,
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

    // Black (brightness 0) and full brightness color
    const darkColor = '#000000'
    const brightColor = useMemo(() => hsvToHex(hsv.h, hsv.s, 100), [hsv.h, hsv.s])

    const sliderStyle: React.CSSProperties = useMemo(
      () => ({ ...baseSliderStyle, ...style }),
      [baseSliderStyle, style]
    )

    const gradientStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'absolute',
        inset: 0,
        borderRadius,
        background: `linear-gradient(${gradientDirection}, ${darkColor}, ${brightColor})`,
      }),
      [borderRadius, gradientDirection, brightColor]
    )

    const handleKeyDown = useSliderKeyboard({
      value: hsv.v,
      min: 0,
      max: 100,
      disabled,
      onChange: setBrightness,
    })

    return (
      <div
        ref={sliderRef}
        data-color-wheel-brightness-slider
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
          aria-label="Brightness"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={hsv.v}
          aria-valuetext={`${hsv.v}%`}
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

BrightnessSlider.displayName = 'BrightnessSlider'
