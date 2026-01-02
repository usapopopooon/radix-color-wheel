import { forwardRef, useMemo } from 'react'
import { cn } from '@/lib/utils'

/** Common box-shadow for all thumbs */
export const THUMB_BOX_SHADOW =
  'inset 0 0 0 2px white, 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'

/** Common className for all thumbs */
export const THUMB_CLASS_NAME =
  'rounded-full focus-visible:outline focus-visible:outline-3 focus-visible:outline-gray-500/[.75] active:cursor-grabbing'

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
    },
    ref
  ) => {
    const thumbStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'absolute',
        width: size,
        height: size,
        boxShadow: THUMB_BOX_SHADOW,
        backgroundColor: color,
        transform: 'translate(-50%, -50%)',
        cursor: disabled ? 'not-allowed' : 'grab',
        touchAction: 'none',
        ...style,
      }),
      [size, color, disabled, style]
    )

    return (
      <div
        ref={ref}
        data-color-wheel-thumb
        {...(dataAttributes &&
          Object.fromEntries(
            Object.entries(dataAttributes).map(([key, value]) => [`data-${key}`, value])
          ))}
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
      />
    )
  }
)

Thumb.displayName = 'Thumb'
