import { forwardRef, useMemo, useCallback, useRef, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { clamp } from '../utils'
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
 *
 * @example
 * ```tsx
 * <ColorWheel.Root value={color} onValueChange={setColor}>
 *   <ColorWheel.Wheel>...</ColorWheel.Wheel>
 *   <ColorWheel.AlphaSlider className="mt-4" />
 * </ColorWheel.Root>
 * ```
 */
export const AlphaSlider = forwardRef<HTMLDivElement, AlphaSliderProps>(
  ({ className, style, orientation = 'horizontal', ...props }, ref) => {
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
    const sliderRef = useRef<HTMLDivElement>(null)

    // Forward ref to internal slider element
    useImperativeHandle(ref, () => sliderRef.current!, [])

    const isHorizontal = orientation === 'horizontal'

    // Calculate thumb position based on alpha value
    const thumbPosition = useMemo(() => `${alpha}%`, [alpha])

    // Convert hex to rgba with current alpha for thumb background
    const thumbColor = useMemo(() => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`
    }, [hex, alpha])

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return
        e.preventDefault()
        // Capture pointer on the slider container, not the clicked element
        sliderRef.current?.setPointerCapture(e.pointerId)
        onDragStart?.()

        // Calculate alpha from click position
        if (sliderRef.current) {
          const rect = sliderRef.current.getBoundingClientRect()
          const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top
          const size = isHorizontal ? rect.width : rect.height
          const newAlpha = clamp((position / size) * 100, 0, 100)
          setAlpha(Math.round(newAlpha))
        }
      },
      [disabled, isHorizontal, setAlpha, onDragStart]
    )

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return
        if (!sliderRef.current?.hasPointerCapture(e.pointerId)) return

        const rect = sliderRef.current.getBoundingClientRect()
        const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top
        const size = isHorizontal ? rect.width : rect.height
        const newAlpha = clamp((position / size) * 100, 0, 100)
        setAlpha(Math.round(newAlpha))

        // Call onDrag with current hex8
        onDrag?.(hex8)
      },
      [disabled, isHorizontal, setAlpha, onDrag, hex8]
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
            e.preventDefault()
            setAlpha(clamp(alpha - step, 0, 100))
            break
          case 'ArrowRight':
          case 'ArrowUp':
            e.preventDefault()
            setAlpha(clamp(alpha + step, 0, 100))
            break
          case 'Home':
            e.preventDefault()
            setAlpha(0)
            break
          case 'End':
            e.preventDefault()
            setAlpha(100)
            break
        }
      },
      [disabled, alpha, setAlpha]
    )

    const sliderStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'relative',
        width: isHorizontal ? '100%' : 12,
        height: isHorizontal ? 12 : '100%',
        minHeight: isHorizontal ? undefined : 100,
        borderRadius: 6,
        // Checkerboard pattern
        backgroundImage: `
          linear-gradient(45deg, #ccc 25%, transparent 25%),
          linear-gradient(-45deg, #ccc 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #ccc 75%),
          linear-gradient(-45deg, transparent 75%, #ccc 75%)
        `,
        backgroundSize: '8px 8px',
        backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        touchAction: 'none',
        ...style,
      }),
      [isHorizontal, disabled, style]
    )

    const gradientStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'absolute',
        inset: 0,
        borderRadius: 6,
        background: isHorizontal
          ? `linear-gradient(to right, transparent, ${hex})`
          : `linear-gradient(to bottom, transparent, ${hex})`,
      }),
      [isHorizontal, hex]
    )

    const thumbPositionStyle: React.CSSProperties = useMemo(
      () =>
        isHorizontal ? { left: thumbPosition, top: '50%' } : { top: thumbPosition, left: '50%' },
      [isHorizontal, thumbPosition]
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
          size={16}
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
