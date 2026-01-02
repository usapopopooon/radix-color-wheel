import { useMemo, useCallback, useRef } from 'react'
import { clamp } from '../utils'

export interface UseSliderBaseOptions {
  /** Current value (0-1 normalized) */
  value: number
  /** Callback when value changes (receives 0-1 normalized value) */
  onChange: (value: number) => void
  /** Whether the slider is disabled */
  disabled?: boolean
  /** Slider orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Whether the slider direction is inverted */
  inverted?: boolean
  /** Track thickness in pixels */
  trackSize?: number
  /** Callback when drag starts */
  onDragStart?: () => void
  /** Callback when drag ends */
  onDragEnd?: () => void
}

export interface SliderBaseResult {
  /** Ref to attach to the slider container */
  sliderRef: React.RefObject<HTMLDivElement>
  /** Whether orientation is horizontal */
  isHorizontal: boolean
  /** Thumb position as percentage string (e.g., "50%") */
  thumbPosition: string
  /** Border radius based on track size */
  borderRadius: number
  /** Base slider container styles */
  sliderStyle: React.CSSProperties
  /** Thumb position styles */
  thumbPositionStyle: React.CSSProperties
  /** Get gradient direction string based on orientation and inversion */
  gradientDirection: string
  /** Pointer down handler */
  handlePointerDown: (e: React.PointerEvent) => void
  /** Pointer move handler */
  handlePointerMove: (e: React.PointerEvent) => void
  /** Pointer up handler */
  handlePointerUp: (e: React.PointerEvent) => void
}

/**
 * Base hook for slider components that provides common functionality:
 * - Pointer event handling for drag interactions
 * - Position calculation based on orientation and inversion
 * - Common styles for slider container and thumb position
 *
 * @param options - Slider configuration options
 * @returns Common slider functionality and styles
 */
export function useSliderBase(options: UseSliderBaseOptions): SliderBaseResult {
  const {
    value,
    onChange,
    disabled = false,
    orientation = 'horizontal',
    inverted = false,
    trackSize = 12,
    onDragStart,
    onDragEnd,
  } = options

  const sliderRef = useRef<HTMLDivElement>(null)
  const isHorizontal = orientation === 'horizontal'
  const borderRadius = trackSize / 2

  // Calculate thumb position as percentage
  const thumbPosition = useMemo(() => {
    return `${inverted ? (1 - value) * 100 : value * 100}%`
  }, [value, inverted])

  // Calculate ratio from pointer position
  const getRatioFromEvent = useCallback(
    (e: React.PointerEvent): number => {
      if (!sliderRef.current) return 0
      const rect = sliderRef.current.getBoundingClientRect()
      const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top
      const size = isHorizontal ? rect.width : rect.height
      const ratio = clamp(position / size, 0, 1)
      return inverted ? 1 - ratio : ratio
    },
    [isHorizontal, inverted]
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      e.preventDefault()
      sliderRef.current?.setPointerCapture(e.pointerId)
      onDragStart?.()
      onChange(getRatioFromEvent(e))
    },
    [disabled, getRatioFromEvent, onChange, onDragStart]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      if (!sliderRef.current?.hasPointerCapture(e.pointerId)) return
      onChange(getRatioFromEvent(e))
    },
    [disabled, getRatioFromEvent, onChange]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      sliderRef.current?.releasePointerCapture(e.pointerId)
      onDragEnd?.()
    },
    [onDragEnd]
  )

  // Base slider container styles
  const sliderStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'relative',
      width: isHorizontal ? '100%' : trackSize,
      height: isHorizontal ? trackSize : '100%',
      minHeight: isHorizontal ? undefined : 100,
      borderRadius,
      cursor: disabled ? 'not-allowed' : 'pointer',
      touchAction: 'none',
    }),
    [isHorizontal, trackSize, borderRadius, disabled]
  )

  // Thumb position styles
  const thumbPositionStyle: React.CSSProperties = useMemo(
    () =>
      isHorizontal ? { left: thumbPosition, top: '50%' } : { top: thumbPosition, left: '50%' },
    [isHorizontal, thumbPosition]
  )

  // Gradient direction based on orientation and inversion
  const gradientDirection = useMemo(() => {
    if (isHorizontal) {
      return inverted ? 'to left' : 'to right'
    }
    return inverted ? 'to top' : 'to bottom'
  }, [isHorizontal, inverted])

  return {
    sliderRef,
    isHorizontal,
    thumbPosition,
    borderRadius,
    sliderStyle,
    thumbPositionStyle,
    gradientDirection,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}
