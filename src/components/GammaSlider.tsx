import { forwardRef, useMemo, useCallback, useRef, useImperativeHandle, useState } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { clamp } from '../utils'
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
    const sliderRef = useRef<HTMLDivElement>(null)

    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState(defaultValue)
    const isControlled = controlledValue !== undefined
    const gamma = isControlled ? controlledValue : internalValue

    // Forward ref to internal slider element
    useImperativeHandle(ref, () => sliderRef.current!, [])

    const isHorizontal = orientation === 'horizontal'

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

    // Calculate thumb position based on gamma value
    const thumbPosition = useMemo(() => {
      const ratio = (gamma - min) / (max - min)
      return `${inverted ? (1 - ratio) * 100 : ratio * 100}%`
    }, [gamma, min, max, inverted])

    // Thumb color based on gamma: darker for <1, lighter for >1
    const thumbColor = useMemo(() => {
      // Create a grayscale color representing gamma effect
      // gamma 1.0 = 50% gray, <1 = darker, >1 = lighter
      const normalized = (gamma - min) / (max - min)
      const gray = Math.round(normalized * 200 + 28) // Range 28-228
      return `rgb(${gray}, ${gray}, ${gray})`
    }, [gamma, min, max])

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
          const adjustedRatio = inverted ? 1 - ratio : ratio
          const newGamma = min + adjustedRatio * (max - min)
          setGamma(newGamma)
        }
      },
      [disabled, isHorizontal, inverted, min, max, setGamma, onDragStart]
    )

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return
        if (!sliderRef.current?.hasPointerCapture(e.pointerId)) return

        const rect = sliderRef.current.getBoundingClientRect()
        const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top
        const size = isHorizontal ? rect.width : rect.height
        const ratio = clamp(position / size, 0, 1)
        const adjustedRatio = inverted ? 1 - ratio : ratio
        const newGamma = min + adjustedRatio * (max - min)
        setGamma(newGamma)
      },
      [disabled, isHorizontal, inverted, min, max, setGamma]
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

        const bigStep = step * 10

        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowDown':
          case 'a':
          case 's':
            e.preventDefault()
            if (e.altKey) {
              setGamma(min)
            } else if (e.shiftKey) {
              setGamma(gamma - bigStep)
            } else {
              setGamma(gamma - step)
            }
            break
          case 'ArrowRight':
          case 'ArrowUp':
          case 'd':
          case 'w':
            e.preventDefault()
            if (e.altKey) {
              setGamma(max)
            } else if (e.shiftKey) {
              setGamma(gamma + bigStep)
            } else {
              setGamma(gamma + step)
            }
            break
          case 'Home':
            e.preventDefault()
            setGamma(1.0) // Reset to neutral
            break
        }
      },
      [disabled, gamma, min, max, step, setGamma]
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
      const gradientDirection = isHorizontal
        ? inverted
          ? 'to left'
          : 'to right'
        : inverted
          ? 'to top'
          : 'to bottom'

      // Gradient from dark (low gamma) to light (high gamma)
      return {
        position: 'absolute',
        inset: 0,
        borderRadius,
        background: `linear-gradient(${gradientDirection}, #1a1a1a, #808080 33%, #e0e0e0)`,
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
