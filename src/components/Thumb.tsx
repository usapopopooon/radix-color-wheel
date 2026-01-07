import { forwardRef, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

/** Common box-shadow for all thumbs */
export const THUMB_BOX_SHADOW =
  'inset 0 0 0 2px white, 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'

/** Focus/active outline style */
const FOCUS_OUTLINE = '3px solid rgba(0, 0, 0, 0.5)'

/** Common className for all thumbs (only non-state-dependent styles) */
export const THUMB_CLASS_NAME = 'rounded-full'

export interface ThumbProps {
  /** Size of the thumb in pixels */
  readonly size: number
  /** Background color of the thumb */
  readonly color: string
  /** Additional CSS class */
  readonly className?: string
  /** Inline styles (merged with base styles) */
  readonly style?: React.CSSProperties
  /** Data attributes */
  readonly dataAttributes?: Record<string, string>
  /** ARIA label */
  readonly 'aria-label': string
  /** ARIA value min */
  readonly 'aria-valuemin': number
  /** ARIA value max */
  readonly 'aria-valuemax': number
  /** ARIA current value */
  readonly 'aria-valuenow': number
  /** ARIA value text */
  readonly 'aria-valuetext'?: string
  /** ARIA orientation */
  readonly 'aria-orientation'?: 'horizontal' | 'vertical'
  /** Whether disabled */
  readonly disabled?: boolean
  /** Pointer down handler */
  readonly onPointerDown?: (e: React.PointerEvent) => void
  /** Pointer move handler */
  readonly onPointerMove?: (e: React.PointerEvent) => void
  /** Pointer up handler */
  readonly onPointerUp?: (e: React.PointerEvent) => void
  /** Key down handler */
  readonly onKeyDown?: (e: React.KeyboardEvent) => void
  /** Focus handler */
  readonly onFocus?: (e: React.FocusEvent) => void
  /** Blur handler */
  readonly onBlur?: (e: React.FocusEvent) => void
}

/**
 * Thumb component - Reusable draggable thumb for color wheel controls
 *
 * Used by HueThumb, AreaThumb, and AlphaSlider.
 * Provides consistent styling and accessibility attributes.
 */
export const Thumb = forwardRef<HTMLDivElement, ThumbProps>(
  (
    {
      size,
      color,
      className,
      style,
      dataAttributes,
      'aria-label': ariaLabel,
      'aria-valuemin': ariaValueMin,
      'aria-valuemax': ariaValueMax,
      'aria-valuenow': ariaValueNow,
      'aria-valuetext': ariaValueText,
      'aria-orientation': ariaOrientation,
      disabled,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onKeyDown,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [isActive, setIsActive] = useState(false)

    const thumbStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'absolute',
        width: size,
        height: size,
        boxShadow: THUMB_BOX_SHADOW,
        backgroundColor: color,
        transform: 'translate(-50%, -50%)',
        cursor: disabled ? 'not-allowed' : isActive ? 'grabbing' : 'grab',
        touchAction: 'none',
        outline: isFocused || isActive ? FOCUS_OUTLINE : 'none',
        ...style,
      }),
      [size, color, disabled, style, isFocused, isActive]
    )

    // Memoize data attributes transformation to avoid recreating on every render
    const dataAttributeProps = useMemo(() => {
      if (!dataAttributes) return undefined
      return Object.fromEntries(
        Object.entries(dataAttributes).map(([key, value]) => [`data-${key}`, value])
      )
    }, [dataAttributes])

    const handleFocus = (e: React.FocusEvent) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const handlePointerDown = (e: React.PointerEvent) => {
      setIsActive(true)
      onPointerDown?.(e)
    }

    const handlePointerUp = (e: React.PointerEvent) => {
      setIsActive(false)
      onPointerUp?.(e)
    }

    return (
      <div
        ref={ref}
        data-color-wheel-thumb
        {...dataAttributeProps}
        className={cn(THUMB_CLASS_NAME, className)}
        style={thumbStyle}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-valuemin={ariaValueMin}
        aria-valuemax={ariaValueMax}
        aria-valuenow={ariaValueNow}
        aria-valuetext={ariaValueText}
        aria-orientation={ariaOrientation}
        aria-disabled={disabled}
        onPointerDown={handlePointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={onKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    )
  }
)

Thumb.displayName = 'Thumb'
