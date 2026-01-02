import { forwardRef, useMemo, useCallback, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { getCheckerboardStyle, hexToRgb } from '../utils'
import { useSliderBase } from '../hooks/useSliderBase'
import { useSliderKeyboard } from '../hooks/useSliderKeyboard'
import { Thumb } from './Thumb'
import type { AlphaSliderProps } from '../types'

/**
 * AlphaSlider component - Slider for adjusting opacity/alpha
 *
 * Displays a horizontal or vertical slider with a gradient showing
 * the current color from transparent to opaque.
 *
 * @param props - Component props
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 * @param props.orientation - 'horizontal' or 'vertical' (default: 'horizontal')
 * @param props.inverted - If true, inverts the slider direction (default: false)
 *
 * @example
 * ```tsx
 * <ColorWheel.Root value={color} onValueChange={setColor}>
 *   <ColorWheel.Wheel>...</ColorWheel.Wheel>
 *   <ColorWheel.AlphaSlider className="mt-4" />
 *   {/* Inverted: opaque on left, transparent on right *\/}
 *   <ColorWheel.AlphaSlider inverted />
 * </ColorWheel.Root>
 * ```
 */
export const AlphaSlider = forwardRef<HTMLDivElement, AlphaSliderProps>(
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
      hex,
      hex8,
      alpha,
      setAlpha,
      disabled,
      onDragStart,
      onDrag,
      onDragEnd,
      onFocus,
      onBlur,
    } = useColorWheelContext()

    const handleChange = useCallback(
      (ratio: number) => {
        setAlpha(Math.round(ratio * 100))
        onDrag?.(hex8)
      },
      [setAlpha, onDrag, hex8]
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
      value: alpha / 100,
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

    // Convert hex to rgba with current alpha for thumb background
    const thumbColor = useMemo(() => {
      const { r, g, b } = hexToRgb(hex)
      return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`
    }, [hex, alpha])

    const handleKeyDown = useSliderKeyboard({
      value: alpha,
      min: 0,
      max: 100,
      disabled,
      onChange: setAlpha,
    })

    // AlphaSlider needs checkerboard background, so we extend the base style
    const sliderStyle: React.CSSProperties = useMemo(
      () => ({
        ...baseSliderStyle,
        ...getCheckerboardStyle(),
        ...style,
      }),
      [baseSliderStyle, style]
    )

    const gradientStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'absolute',
        inset: 0,
        borderRadius,
        background: `linear-gradient(${gradientDirection}, transparent, ${hex})`,
      }),
      [borderRadius, gradientDirection, hex]
    )

    return (
      <div
        ref={sliderRef}
        data-color-wheel-alpha-slider
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
          aria-label="Opacity"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={alpha}
          aria-valuetext={`${alpha}%`}
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

AlphaSlider.displayName = 'AlphaSlider'
