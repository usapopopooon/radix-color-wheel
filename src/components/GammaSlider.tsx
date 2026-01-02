import { forwardRef, useMemo, useCallback, useImperativeHandle, useState } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { clamp } from '../utils'
import { useSliderBase } from '../hooks/useSliderBase'
import { useSliderKeyboard } from '../hooks/useSliderKeyboard'
import { Thumb } from './Thumb'
import type { GammaSliderProps } from '../types'

/**
 * GammaSlider component - Slider for adjusting gamma correction
 *
 * Displays a horizontal or vertical slider for controlling gamma values.
 * Gamma < 1.0 darkens mid-tones, gamma > 1.0 brightens mid-tones,
 * gamma = 1.0 is neutral (no correction).
 *
 * This slider has its own state and does not directly affect the color
 * wheel's color value. Use the onValueChange callback to apply gamma
 * correction to your colors.
 *
 * @param props - Component props
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 * @param props.orientation - 'horizontal' or 'vertical' (default: 'horizontal')
 * @param props.inverted - If true, inverts the slider direction (default: false)
 * @param props.trackSize - Track thickness in pixels (default: 12)
 * @param props.thumbSize - Thumb size in pixels (default: 16)
 * @param props.min - Minimum gamma value (default: 0.1)
 * @param props.max - Maximum gamma value (default: 3.0)
 * @param props.step - Step increment (default: 0.1)
 * @param props.value - Controlled gamma value
 * @param props.defaultValue - Uncontrolled initial gamma value (default: 1.0)
 * @param props.onValueChange - Callback when gamma changes
 *
 * @example
 * ```tsx
 * <ColorWheel.Root value={color} onValueChange={setColor}>
 *   <ColorWheel.GammaSlider
 *     defaultValue={1.0}
 *     onValueChange={(gamma) => console.log('Gamma:', gamma)}
 *   />
 * </ColorWheel.Root>
 * ```
 */
export const GammaSlider = forwardRef<HTMLDivElement, GammaSliderProps>(
  (
    {
      className,
      style,
      orientation = 'horizontal',
      inverted = false,
      trackSize = 12,
      thumbSize = 16,
      min = 0.1,
      max = 3.0,
      step = 0.1,
      value: controlledValue,
      defaultValue = 1.0,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const { disabled, onDragStart, onDragEnd, onFocus, onBlur } = useColorWheelContext()

    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState(defaultValue)
    const isControlled = controlledValue !== undefined
    const gamma = isControlled ? controlledValue : internalValue

    const setGamma = useCallback(
      (newGamma: number) => {
        const clampedGamma = clamp(newGamma, min, max)
        // Round to step precision
        const roundedGamma = Math.round(clampedGamma / step) * step
        const finalGamma = Math.round(roundedGamma * 100) / 100 // Avoid floating point issues

        if (!isControlled) {
          setInternalValue(finalGamma)
        }
        onValueChange?.(finalGamma)
      },
      [min, max, step, isControlled, onValueChange]
    )

    const handleChange = useCallback(
      (ratio: number) => {
        const newGamma = min + ratio * (max - min)
        setGamma(newGamma)
      },
      [min, max, setGamma]
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
      value: (gamma - min) / (max - min),
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

    // Thumb color based on gamma: darker for <1, lighter for >1
    const thumbColor = useMemo(() => {
      // Grayscale range for thumb: darkest (min gamma) to lightest (max gamma)
      const GRAY_MIN = 28
      const GRAY_MAX = 228
      const GRAY_RANGE = GRAY_MAX - GRAY_MIN

      const normalized = (gamma - min) / (max - min)
      const gray = Math.round(normalized * GRAY_RANGE + GRAY_MIN)
      return `rgb(${gray}, ${gray}, ${gray})`
    }, [gamma, min, max])

    const sliderStyle: React.CSSProperties = useMemo(
      () => ({ ...baseSliderStyle, ...style }),
      [baseSliderStyle, style]
    )

    // Gradient from dark (low gamma) to light (high gamma)
    const gradientStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'absolute',
        inset: 0,
        borderRadius,
        background: `linear-gradient(${gradientDirection}, #1a1a1a, #808080 33%, #e0e0e0)`,
      }),
      [borderRadius, gradientDirection]
    )

    const handleKeyDown = useSliderKeyboard({
      value: gamma,
      min,
      max,
      step,
      disabled,
      onChange: setGamma,
      resetValue: 1.0,
    })

    return (
      <div
        ref={sliderRef}
        data-color-wheel-gamma-slider
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
          aria-label="Gamma"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={gamma}
          aria-valuetext={`${gamma.toFixed(1)}`}
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

GammaSlider.displayName = 'GammaSlider'
