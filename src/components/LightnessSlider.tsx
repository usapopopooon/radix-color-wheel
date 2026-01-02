import { forwardRef, useMemo, useCallback, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { hexToHsl, hslToHex } from '../utils'
import { useSliderBase } from '../hooks/useSliderBase'
import { Thumb } from './Thumb'
import type { LightnessSliderProps } from '../types'

/**
 * LightnessSlider component - Linear slider for adjusting lightness (HSL)
 *
 * Displays a horizontal or vertical slider with a gradient showing
 * lightness from 0% (black) through 50% (pure color) to 100% (white).
 *
 * Note: This slider modifies the color by converting to HSL, adjusting
 * lightness, and converting back. This may result in slight color shifts
 * when used with HSV-based color pickers.
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
 *   <ColorWheel.LightnessSlider />
 * </ColorWheel.Root>
 * ```
 */
export const LightnessSlider = forwardRef<HTMLDivElement, LightnessSliderProps>(
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
    const { hex, setHex, disabled, onDragStart, onDrag, onDragEnd, onFocus, onBlur } =
      useColorWheelContext()

    // Get current HSL values
    const hsl = useMemo(() => hexToHsl(hex), [hex])

    const setLightness = useCallback(
      (lightness: number) => {
        const newHex = hslToHex({ h: hsl.h, s: hsl.s, l: lightness })
        setHex(newHex)
      },
      [hsl.h, hsl.s, setHex]
    )

    const handleChange = useCallback(
      (ratio: number) => {
        setLightness(Math.round(ratio * 100))
        onDrag?.(hex)
      },
      [setLightness, onDrag, hex]
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
      value: hsl.l / 100,
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
    const thumbColor = hex

    // Colors for the gradient: black -> pure color at 50% -> white
    const pureColor = useMemo(() => hslToHex({ h: hsl.h, s: hsl.s, l: 50 }), [hsl.h, hsl.s])

    const sliderStyle: React.CSSProperties = useMemo(
      () => ({ ...baseSliderStyle, ...style }),
      [baseSliderStyle, style]
    )

    const gradientStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'absolute',
        inset: 0,
        borderRadius,
        background: `linear-gradient(${gradientDirection}, #000000, ${pureColor} 50%, #ffffff)`,
      }),
      [borderRadius, gradientDirection, pureColor]
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
              setLightness(0)
            } else {
              setLightness(Math.max(0, hsl.l - step))
            }
            break
          case 'ArrowRight':
          case 'ArrowUp':
          case 'd':
          case 'w':
            e.preventDefault()
            if (e.altKey) {
              setLightness(100)
            } else {
              setLightness(Math.min(100, hsl.l + step))
            }
            break
        }
      },
      [disabled, hsl.l, setLightness]
    )

    return (
      <div
        ref={sliderRef}
        data-color-wheel-lightness-slider
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
          aria-label="Lightness"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={hsl.l}
          aria-valuetext={`${hsl.l}%`}
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

LightnessSlider.displayName = 'LightnessSlider'
