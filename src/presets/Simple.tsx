import { Root } from '../components/Root'
import { Wheel } from '../components/Wheel'
import { HueRing } from '../components/HueRing'
import { HueThumb } from '../components/HueThumb'
import { Area } from '../components/Area'
import { AreaThumb } from '../components/AreaThumb'
import { HexInput } from '../components/HexInput'
import { Swatch } from '../components/Swatch'
import type { ColorWheelSimpleProps } from '../types'

/**
 * ColorWheelSimple - A preset component with sensible defaults
 *
 * Provides a complete color wheel with optional HexInput and Swatch
 * in a single component for easy integration.
 *
 * @param props - Component props
 * @param props.value - Current color in HEX format
 * @param props.defaultValue - Initial value for uncontrolled mode
 * @param props.onValueChange - Callback when color changes
 * @param props.size - Size of the wheel in pixels (default: 200)
 * @param props.showHexInput - Whether to show HexInput (default: true)
 * @param props.showSwatch - Whether to show Swatch (default: true)
 * @param props.disabled - If true, disables all interactions
 *
 * @example
 * ```tsx
 * import { ColorWheelSimple } from '@usapopo/radix-color-wheel'
 *
 * function App() {
 *   const [color, setColor] = useState('#ff0000')
 *   return <ColorWheelSimple value={color} onValueChange={setColor} />
 * }
 * ```
 */
export function ColorWheelSimple({
  value,
  defaultValue,
  onValueChange,
  size = 200,
  showHexInput = true,
  showSwatch = true,
  disabled,
}: ColorWheelSimpleProps): React.ReactElement {
  return (
    <Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Wheel size={size}>
        <HueRing />
        <HueThumb />
        <Area />
        <AreaThumb />
      </Wheel>
      {(showHexInput || showSwatch) && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
          {showSwatch && (
            <Swatch
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                border: '1px solid rgba(0, 0, 0, 0.2)',
                flexShrink: 0,
              }}
            />
          )}
          {showHexInput && (
            <HexInput
              style={{
                flex: 1,
                padding: '4px 8px',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                borderRadius: 4,
                fontSize: 14,
              }}
            />
          )}
        </div>
      )}
    </Root>
  )
}
