import { useMemo } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
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
export function Swatch({ className, style }: SwatchProps): React.ReactElement {
  const { hex } = useColorWheelContext()

  const swatchStyle: React.CSSProperties = useMemo(
    () => ({
      backgroundColor: hex,
      // Checkerboard pattern for transparency (future alpha support)
      backgroundImage: `
        linear-gradient(${hex}, ${hex}),
        linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%)
      `,
      backgroundSize: '100% 100%, 8px 8px, 8px 8px, 8px 8px, 8px 8px',
      backgroundPosition: '0 0, 0 0, 4px 0, 4px -4px, 0 4px',
      ...style,
    }),
    [hex, style]
  )

  return (
    <div
      data-color-wheel-swatch
      className={className}
      style={swatchStyle}
      role="img"
      aria-label={`Current color: ${hex}`}
    />
  )
}
