# @usapopo/radix-color-wheel

[![CI](https://github.com/usapopopooon/radix-color-wheel/actions/workflows/ci.yml/badge.svg)](https://github.com/usapopopooon/radix-color-wheel/actions/workflows/ci.yml) ![coverage](https://usapopopooon.github.io/radix-color-wheel/coverage-badge.svg) [![Storybook](https://img.shields.io/badge/Storybook-open-ff4785?logo=storybook&logoColor=white)](https://usapopopooon.github.io/radix-color-wheel/storybook/) [![npm](https://img.shields.io/npm/v/@usapopo/radix-color-wheel)](https://www.npmjs.com/package/@usapopo/radix-color-wheel) [![license](https://img.shields.io/npm/l/@usapopo/radix-color-wheel)](./LICENSE)

A fully accessible color wheel component for React, following the [Radix UI](https://www.radix-ui.com/) Compound Components pattern.

## Features

- **Compound Components** - Compose your own color picker with full control
- **Accessible** - Keyboard navigation, ARIA attributes, screen reader support
- **Alpha Support** - Optional transparency slider
- **Copy/Paste** - Built-in clipboard functionality
- **TypeScript** - Full type definitions included
- **Unstyled** - Bring your own styles or use with Tailwind CSS

## Installation

```bash
npm install @usapopo/radix-color-wheel
```

**Peer Dependencies:** React 18 or 19

## Quick Start

```tsx
import { useState } from 'react'
import * as ColorWheel from '@usapopo/radix-color-wheel'

function App() {
  const [color, setColor] = useState('#3b82f6')

  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <ColorWheel.Wheel size={200} ringWidth={20}>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>
    </ColorWheel.Root>
  )
}
```

## Components

### Root

Context provider that manages color state.

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Controlled color value (`#rrggbb` or `#rrggbbaa`) |
| `defaultValue` | `string` | Initial value for uncontrolled mode |
| `onValueChange` | `(hex: string) => void` | Called on every change |
| `onValueChangeEnd` | `(hex: string) => void` | Called when drag ends |
| `disabled` | `boolean` | Disable all interactions |

### Wheel

Container for the hue ring and saturation/brightness area.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `200` | Wheel diameter in pixels |
| `ringWidth` | `number` | `20` | Hue ring width in pixels |

### HueRing / HueThumb

The circular hue gradient and its draggable thumb.

**Keyboard:** Arrow keys (±1), Shift+Arrow (±10), Home (0°), End (359°)

### Area / AreaThumb

The saturation/brightness selection area and its draggable thumb.

**Keyboard:** Left/Right (saturation), Up/Down (brightness), Shift (±10)

### AlphaSlider

Optional transparency slider.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |

### HexInput

Text input for direct hex color entry. Validates on Enter, reverts on Escape.

### Swatch

Displays the current color with alpha transparency support.

### CopyButton / PasteButton

Clipboard operations for the current color.

```tsx
<ColorWheel.CopyButton onCopy={(hex) => toast('Copied!')}>
  Copy
</ColorWheel.CopyButton>

<ColorWheel.PasteButton
  onPaste={(hex) => toast('Pasted!')}
  onError={() => toast.error('Invalid color')}
>
  Paste
</ColorWheel.PasteButton>
```

## Full Example

```tsx
<ColorWheel.Root value={color} onValueChange={setColor}>
  <ColorWheel.Wheel size={240} ringWidth={24}>
    <ColorWheel.HueRing />
    <ColorWheel.HueThumb />
    <ColorWheel.Area />
    <ColorWheel.AreaThumb />
  </ColorWheel.Wheel>

  <div className="flex items-center gap-2 mt-3">
    <ColorWheel.Swatch className="w-8 h-8 rounded" />
    <ColorWheel.HexInput className="w-20 px-2 py-1 border rounded" />
    <ColorWheel.CopyButton>Copy</ColorWheel.CopyButton>
    <ColorWheel.PasteButton>Paste</ColorWheel.PasteButton>
  </div>

  <ColorWheel.AlphaSlider className="mt-3" />
</ColorWheel.Root>
```

## Context Hooks

Access color state from custom components:

```tsx
import { useColorWheelContext, useWheelContext } from '@usapopo/radix-color-wheel'

function CustomDisplay() {
  const { hsv, hex, alpha } = useColorWheelContext()
  const { size, ringWidth } = useWheelContext()

  return <div>H: {hsv.h}° S: {hsv.s}% V: {hsv.v}%</div>
}
```

## Utilities

```tsx
import {
  hsvToHex,        // (h, s, v) => "#rrggbb"
  hexToHsv,        // "#rrggbb" => { h, s, v }
  getColorNameEn,  // (hue) => "red" | "orange" | ...
  clamp,           // (value, min, max) => number
} from '@usapopo/radix-color-wheel'
```

## TypeScript

All types are exported:

```tsx
import type {
  RootProps,
  WheelProps,
  HexInputProps,
  AlphaSliderProps,
  CopyButtonProps,
  PasteButtonProps,
  HSV,
} from '@usapopo/radix-color-wheel'
```

## Browser Support

- Chrome, Edge, Firefox, Safari (latest)
- React 18.x, 19.x

## License

[MIT](./LICENSE)
