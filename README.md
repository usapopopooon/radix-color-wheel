# @usapopo/radix-color-wheel

A fully accessible color wheel component library for React, built with Radix UI design philosophy. Uses the Compound Components pattern for maximum flexibility.

## Features

- **Compound Components**: Mix and match components to build your perfect color picker
- **Full Accessibility**: Complete keyboard navigation and screen reader support
- **Alpha Support**: Optional transparency slider with 8-digit hex support
- **Customizable**: CSS variables for easy styling
- **TypeScript**: Full type safety with exported types
- **Lightweight**: Only depends on `@radix-ui/react-use-controllable-state`

## Installation

```bash
npm install @usapopo/radix-color-wheel
```

## Quick Start

### Using the Simple Preset

For a quick start, use the pre-built `ColorWheelSimple` component:

```tsx
import { ColorWheelSimple } from '@usapopo/radix-color-wheel'

function App() {
  const [color, setColor] = useState('#ff0000')

  return (
    <ColorWheelSimple
      value={color}
      onValueChange={setColor}
      size={200}
      showHexInput
      showSwatch
    />
  )
}
```

### Using Compound Components

For full control, use the individual components:

```tsx
import * as ColorWheel from '@usapopo/radix-color-wheel'

function App() {
  const [color, setColor] = useState('#ff0000')

  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <ColorWheel.Wheel size={200}>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <ColorWheel.Swatch />
        <ColorWheel.HexInput />
      </div>
      <ColorWheel.AlphaSlider />
    </ColorWheel.Root>
  )
}
```

## Components

### ColorWheel.Root

The context provider that manages color state.

```tsx
<ColorWheel.Root
  value={color}              // Controlled value (#rrggbb or #rrggbbaa)
  defaultValue="#ff0000"     // Uncontrolled initial value
  onValueChange={setColor}   // Called on every change
  onValueChangeEnd={save}    // Called when drag ends
  onHueChange={fn}           // Called when hue changes (0-360)
  onSaturationChange={fn}    // Called when saturation changes (0-100)
  onBrightnessChange={fn}    // Called when brightness changes (0-100)
  onAlphaChange={fn}         // Called when alpha changes (0-100)
  onDragStart={fn}           // Called when drag starts
  onDragEnd={fn}             // Called when drag ends
  disabled={false}           // Disable all interactions
>
  {children}
</ColorWheel.Root>
```

### ColorWheel.Wheel

Container for the hue ring and saturation/brightness area.

```tsx
<ColorWheel.Wheel
  size={200}        // Wheel diameter in pixels
  ringWidth={20}    // Hue ring width in pixels
  className=""
  style={{}}
>
  {children}
</ColorWheel.Wheel>
```

### ColorWheel.HueRing

The circular hue gradient ring (decorative, interaction handled by HueThumb).

### ColorWheel.HueThumb

Draggable thumb on the hue ring.

**Keyboard Controls:**
- `ArrowLeft` / `ArrowDown`: Decrease hue by 1
- `ArrowRight` / `ArrowUp`: Increase hue by 1
- `Shift + Arrow`: Change by 10
- `Home`: Set to 0 (red)
- `End`: Set to 359

### ColorWheel.Area

The saturation/brightness selection area.

### ColorWheel.AreaThumb

Draggable thumb in the saturation/brightness area.

**Keyboard Controls:**
- `ArrowLeft`: Decrease saturation by 1
- `ArrowRight`: Increase saturation by 1
- `ArrowUp`: Increase brightness by 1
- `ArrowDown`: Decrease brightness by 1
- `Shift + Arrow`: Change by 10
- `Home`: White (saturation 0, brightness 100)
- `End`: Pure hue color (saturation 100, brightness 100)

### ColorWheel.AlphaSlider

Optional slider for transparency.

```tsx
<ColorWheel.AlphaSlider
  orientation="horizontal"  // or "vertical"
  className=""
  style={{}}
/>
```

### ColorWheel.HexInput

Text input for direct hex color entry.

```tsx
<ColorWheel.HexInput
  placeholder="#000000"
  className=""
  style={{}}
/>
```

**Keyboard Controls:**
- `Enter`: Confirm value
- `Escape`: Cancel edit

### ColorWheel.Swatch

Displays the current color.

```tsx
<ColorWheel.Swatch
  className=""
  style={{}}
/>
```

## CSS Variables

Customize the appearance using CSS variables:

```css
[data-color-wheel-root] {
  /* Thumb */
  --cw-thumb-size: 14px;
  --cw-thumb-border-color: #ffffff;
  --cw-thumb-border-width: 2px;
  --cw-thumb-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);

  /* Focus ring */
  --cw-focus-ring-color: #3b82f6;
  --cw-focus-ring-width: 2px;
  --cw-focus-ring-offset: 2px;

  /* Alpha slider */
  --cw-slider-height: 12px;
  --cw-slider-thumb-size: 16px;
}
```

## Accessibility

This library is built with accessibility in mind:

- **ARIA roles**: All interactive elements have appropriate `role="slider"` attributes
- **Keyboard navigation**: Full keyboard support for all components
- **Screen reader support**:
  - `aria-valuetext` provides human-readable color names (e.g., "red, 0 degrees")
  - `aria-describedby` on HexInput provides usage hints
  - Live region announces color changes
- **Focus management**: Visible focus indicators on all interactive elements

## Utility Functions

Export utility functions for advanced use:

```tsx
import {
  hsvToHex,         // (h, s, v) => "#rrggbb"
  hexToHsv,         // "#rrggbb" => { h, s, v }
  getColorNameEn,   // (hue) => "red" | "orange" | ...
  clamp,            // (value, min, max) => number
} from '@usapopo/radix-color-wheel'
```

## Context Hooks

Access color state from nested components:

```tsx
import { useColorWheelContext, useWheelContext } from '@usapopo/radix-color-wheel'

function CustomComponent() {
  const { hsv, hex, setHue, disabled } = useColorWheelContext()
  const { size, ringWidth } = useWheelContext()

  return <div>Current color: {hex}</div>
}
```

## TypeScript

All types are exported:

```tsx
import type {
  RootProps,
  WheelProps,
  HueRingProps,
  HueThumbProps,
  AreaProps,
  AreaThumbProps,
  HexInputProps,
  SwatchProps,
  AlphaSliderProps,
  ColorWheelSimpleProps,
  HSV,
} from '@usapopo/radix-color-wheel'
```

## License

MIT
