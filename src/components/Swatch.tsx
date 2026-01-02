import { forwardRef, useMemo } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { CHECKERBOARD, hexToRgb } from '../utils'
import type { SwatchProps } from '../types'

/**
 * Swatch component - Element that displays current color preview
 *
 * Shows a color preview box with the currently selected color.
 * Includes a checkerboard pattern background for transparency visualization.
 *
 * @param props - Component props
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 *
 * @example
 * ```tsx
 * <ColorWheel.Root value={color} onValueChange={setColor}>
 *   <ColorWheel.Wheel>...</ColorWheel.Wheel>
 *   <div className="flex items-center gap-2 mt-4">
 *     <ColorWheel.Swatch className="w-10 h-10 rounded border" />
 *     <ColorWheel.HexInput />
 *   </div>
 * </ColorWheel.Root>
 * ```
 */
export const Swatch = forwardRef<HTMLDivElement, SwatchProps>(
  ({ className, style, ...props }, ref) => {
    const { hex } = useColorWheelContext()

    const swatchStyle: React.CSSProperties = useMemo(
      () => ({
        borderRadius: 4,
        backgroundColor: hex,
        // Checkerboard pattern for transparency visualization
        backgroundImage: `linear-gradient(${hex}, ${hex}), ${CHECKERBOARD.BACKGROUND_IMAGE}`,
        backgroundSize: `100% 100%, ${CHECKERBOARD.BACKGROUND_SIZE}`,
        backgroundPosition: `0 0, ${CHECKERBOARD.BACKGROUND_POSITION}`,
        ...style,
      }),
      [hex, style]
    )

    // Provide detailed color info for screen readers
    const ariaLabel = useMemo(() => {
      const { r, g, b } = hexToRgb(hex)
      return `Current color: ${hex}, RGB ${r}, ${g}, ${b}`
    }, [hex])

    return (
      <div
        ref={ref}
        data-color-wheel-swatch
        className={className}
        style={swatchStyle}
        role="img"
        aria-label={ariaLabel}
        {...props}
      />
    )
  }
)

Swatch.displayName = 'Swatch'
