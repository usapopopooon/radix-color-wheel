import { forwardRef, useMemo, useCallback, useRef, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { clamp, hexToHsl, hslToHex } from '../utils'
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
    const {
      hex,
      setHex,
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

    // Get current HSL values
    const hsl = useMemo(() => hexToHsl(hex), [hex])

    // Calculate thumb position based on lightness value (0-100)
    const thumbPosition = useMemo(() => {
      const ratio = hsl.l / 100
      return `${inverted ? (1 - ratio) * 100 : ratio * 100}%`
    }, [hsl.l, inverted])

    // Current color for thumb background
    const thumbColor = hex

    const setLightness = useCallback(
      (lightness: number) => {
        const newHex = hslToHex({ h: hsl.h, s: hsl.s, l: lightness })
        setHex(newHex)
      },
      [hsl.h, hsl.s, setHex]
    )

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
          const newLightness = (inverted ? 1 - ratio : ratio) * 100
          setLightness(Math.round(newLightness))
        }
      },
      [disabled, isHorizontal, inverted, setLightness, onDragStart]
    )

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return
        if (!sliderRef.current?.hasPointerCapture(e.pointerId)) return

        const rect = sliderRef.current.getBoundingClientRect()
        const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top
        const size = isHorizontal ? rect.width : rect.height
        const ratio = clamp(position / size, 0, 1)
        const newLightness = (inverted ? 1 - ratio : ratio) * 100
        setLightness(Math.round(newLightness))

        onDrag?.(hex)
      },
      [disabled, isHorizontal, inverted, setLightness, onDrag, hex]
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
              setLightness(0)
            } else {
              setLightness(clamp(hsl.l - step, 0, 100))
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
              setLightness(clamp(hsl.l + step, 0, 100))
            }
            break
        }
      },
      [disabled, hsl.l, setLightness]
    )

    const borderRadius = trackSize / 2

    // Colors for the gradient: black -> pure color at 50% -> white
    const pureColor = useMemo(() => hslToHex({ h: hsl.h, s: hsl.s, l: 50 }), [hsl.h, hsl.s])

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
        background: `linear-gradient(${gradientDirection}, #000000, ${pureColor} 50%, #ffffff)`,
      }
    }, [isHorizontal, inverted, borderRadius, pureColor])

    const thumbPositionStyle: React.CSSProperties = useMemo(
      () =>
        isHorizontal ? { left: thumbPosition, top: '50%' } : { top: thumbPosition, left: '50%' },
      [isHorizontal, thumbPosition]
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
