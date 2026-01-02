import { forwardRef, useMemo, useCallback, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { clamp } from '../utils'
import { useSliderBase } from '../hooks/useSliderBase'
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
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`
    }, [hex, alpha])

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
              setAlpha(0)
            } else {
              setAlpha(clamp(alpha - step, 0, 100))
            }
            break
          case 'ArrowRight':
          case 'ArrowUp':
          case 'd':
          case 'w':
            e.preventDefault()
            // Alt: jump to maximum (100)
            if (e.altKey) {
              setAlpha(100)
            } else {
              setAlpha(clamp(alpha + step, 0, 100))
            }
            break
        }
      },
      [disabled, alpha, setAlpha]
    )

    // AlphaSlider needs checkerboard background, so we extend the base style
    const sliderStyle: React.CSSProperties = useMemo(
      () => ({
        ...baseSliderStyle,
        backgroundImage: `
          linear-gradient(45deg, #ccc 25%, transparent 25%),
          linear-gradient(-45deg, #ccc 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #ccc 75%),
          linear-gradient(-45deg, transparent 75%, #ccc 75%)
        `,
        backgroundSize: '8px 8px',
        backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
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
