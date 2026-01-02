import { useMemo, useCallback, useRef } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { clamp } from '../utils'
import { cn } from '@/lib/utils'
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
export function AlphaSlider({
  className,
  style,
  orientation = 'horizontal',
}: AlphaSliderProps): React.ReactElement {
  const { hex, alpha, setAlpha, disabled, onDragStart, onDragEnd } = useColorWheelContext()
  const sliderRef = useRef<HTMLDivElement>(null)

  const isHorizontal = orientation === 'horizontal'

  // Calculate thumb position based on alpha value
  // Formula: position = alpha / 100 * size
  const thumbPosition = useMemo(() => {
    return `${alpha}%`
  }, [alpha])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
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
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return

      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect()
        const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top
        const size = isHorizontal ? rect.width : rect.height
        const newAlpha = clamp((position / size) * 100, 0, 100)
        setAlpha(Math.round(newAlpha))
      }
    },
    [disabled, isHorizontal, setAlpha]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
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

  const thumbStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      width: 16,
      height: 16,
      // Structure: color circle -> white inset shadow (as border) -> outer border -> focus ring
      boxShadow: 'inset 0 0 0 2px white, 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
      backgroundColor: hex,
      opacity: alpha / 100,
      transform: 'translate(-50%, -50%)',
      ...(isHorizontal ? { left: thumbPosition, top: '50%' } : { top: thumbPosition, left: '50%' }),
    }),
    [isHorizontal, thumbPosition, hex, alpha]
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
    >
      <div style={gradientStyle} aria-hidden="true" />
      <div
        data-color-wheel-thumb
        className={cn('rounded-full focus-visible:outline focus-visible:outline-3 focus-visible:outline-gray-500/[.75] active:cursor-grabbing')}
        style={thumbStyle}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label="Opacity"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={alpha}
        aria-valuetext={`${alpha}%`}
        aria-orientation={orientation}
        aria-disabled={disabled}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
