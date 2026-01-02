# @usapopo/react-color-wheel

[![CI](https://github.com/usapopopooon/react-color-wheel/actions/workflows/ci.yml/badge.svg)](https://github.com/usapopopooon/react-color-wheel/actions/workflows/ci.yml) ![coverage](https://usapopopooon.github.io/react-color-wheel/coverage-badge.svg) [![Storybook](https://img.shields.io/badge/Storybook-open-ff4785?logo=storybook&logoColor=white)](https://usapopopooon.github.io/react-color-wheel/storybook/) [![npm](https://img.shields.io/npm/v/@usapopo/react-color-wheel)](https://www.npmjs.com/package/@usapopo/react-color-wheel) [![license](https://img.shields.io/npm/l/@usapopo/react-color-wheel)](./LICENSE)

A fully accessible color wheel component for React, following the [Radix UI](https://www.radix-ui.com/) Compound Components pattern.

## Features

- **Compound Components** - Compose your own color picker with full control
- **Accessible** - Keyboard navigation, ARIA attributes, screen reader support
- **Alpha Support** - Optional transparency slider
- **Copy/Paste** - Built-in clipboard functionality
- **TypeScript** - Full type definitions included
- **Unstyled** - Bring your own styles or use with Tailwind CSS
- **forwardRef Support** - All components support ref forwarding
- **HTML Attribute Spreading** - Pass any HTML attributes to components

## Installation

```bash
npm install @usapopo/react-color-wheel
```

**Peer Dependencies:** React 18 or 19

## Quick Start

```tsx
import { useState } from 'react'
import * as ColorWheel from '@usapopo/react-color-wheel'

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

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled color value (`#rrggbb` or `#rrggbbaa`) |
| `defaultValue` | `string` | `"#ff0000"` | Initial value for uncontrolled mode |
| `alpha` | `number` | - | Controlled alpha value (0-100) |
| `defaultAlpha` | `number` | `100` | Initial alpha value for uncontrolled mode |
| `onValueChange` | `(hex: string) => void` | - | Called on every change (real-time during drag) |
| `onValueChangeEnd` | `(hex: string) => void` | - | Called when drag ends (final value only) |
| `onHueChange` | `(hue: number) => void` | - | Called when hue changes (0-360) |
| `onSaturationChange` | `(saturation: number) => void` | - | Called when saturation changes (0-100) |
| `onBrightnessChange` | `(brightness: number) => void` | - | Called when brightness changes (0-100) |
| `onAlphaChange` | `(alpha: number) => void` | - | Called when alpha changes (0-100) |
| `onDragStart` | `() => void` | - | Called when drag interaction starts |
| `onDrag` | `(hex: string) => void` | - | Called continuously during drag |
| `onDragEnd` | `() => void` | - | Called when drag interaction ends |
| `onFocus` | `() => void` | - | Called when any interactive element receives focus |
| `onBlur` | `() => void` | - | Called when focus leaves an interactive element |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `children` | `ReactNode` | - | Child components |

### Wheel

Container for the hue ring and saturation/brightness area.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `200` | Wheel diameter in pixels |
| `ringWidth` | `number` | `20` | Hue ring width in pixels |
| `children` | `ReactNode` | - | Child components (HueRing, HueThumb, Area, AreaThumb) |

Supports `ref` forwarding and all standard `div` attributes.

### HueRing

The circular hue gradient ring. Must be placed inside `Wheel`.

Supports `ref` forwarding and all standard `div` attributes.

**Keyboard Navigation:**

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowDown` / `A` / `S` | Decrease hue by 1° |
| `ArrowRight` / `ArrowUp` / `D` / `W` | Increase hue by 1° |
| `Shift + Arrow` | Change hue by 10° |
| `Alt + ArrowLeft` / `Alt + ArrowDown` | Set hue to 0° |
| `Alt + ArrowRight` / `Alt + ArrowUp` | Set hue to 359° |

### HueThumb

Draggable thumb for hue selection. Must be placed inside `Wheel`.

Supports `ref` forwarding and all standard `div` attributes.

### Area

The saturation/brightness selection area. Must be placed inside `Wheel`.

Supports `ref` forwarding and all standard `div` attributes.

**Keyboard Navigation:**

| Key | Action |
|-----|--------|
| `ArrowLeft` / `A` | Decrease saturation by 1% |
| `ArrowRight` / `D` | Increase saturation by 1% |
| `ArrowUp` / `W` | Increase brightness by 1% |
| `ArrowDown` / `S` | Decrease brightness by 1% |
| `Shift + Arrow` | Change by 10% |
| `Alt + ArrowLeft` | Set saturation to 0% |
| `Alt + ArrowRight` | Set saturation to 100% |
| `Alt + ArrowUp` | Set brightness to 100% |
| `Alt + ArrowDown` | Set brightness to 0% |

### AreaThumb

Draggable thumb for saturation/brightness selection. Must be placed inside `Wheel`.

Supports `ref` forwarding and all standard `div` attributes.

### AlphaSlider

Optional transparency slider.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |

Supports `ref` forwarding and all standard `div` attributes.

**Keyboard Navigation:**

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowDown` / `A` / `S` | Decrease alpha by 1% |
| `ArrowRight` / `ArrowUp` / `D` / `W` | Increase alpha by 1% |
| `Shift + Arrow` | Change alpha by 10% |
| `Alt + ArrowLeft` / `Alt + ArrowDown` | Set alpha to 0% |
| `Alt + ArrowRight` / `Alt + ArrowUp` | Set alpha to 100% |

### HexInput

Text input for direct hex color entry.

| Prop | Type | Description |
|------|------|-------------|
| `onCommit` | `(hex: string) => void` | Called when a valid hex is committed (Enter or blur) |

Supports `ref` forwarding (to `HTMLInputElement`) and all standard `input` attributes except `value` and `onChange`.

**Behavior:**
- Validates input on Enter key or blur
- Reverts to previous value on Escape key
- Accepts with or without `#` prefix
- Normalizes to lowercase

### Swatch

Displays the current color with alpha transparency support.

Supports `ref` forwarding and all standard `div` attributes.

### CopyButton

Copies the current color to clipboard.

| Prop | Type | Description |
|------|------|-------------|
| `onCopy` | `(hex: string) => void` | Called after successful copy |
| `asChild` | `boolean` | When true, renders child element instead of default button |
| `children` | `ReactNode` | Button content |

Supports `ref` forwarding (to `HTMLButtonElement`) and all standard `button` attributes except `onCopy`.

### PasteButton

Pastes color from clipboard.

| Prop | Type | Description |
|------|------|-------------|
| `onPaste` | `(hex: string) => void` | Called after successful paste |
| `onError` | `() => void` | Called when paste fails (invalid format) |
| `asChild` | `boolean` | When true, renders child element instead of default button |
| `children` | `ReactNode` | Button content |

Supports `ref` forwarding (to `HTMLButtonElement`) and all standard `button` attributes except `onPaste`.

## Data Attributes

All components have data attributes for styling:

| Component | Data Attribute |
|-----------|---------------|
| `Wheel` | `data-color-wheel-wheel` |
| `HueRing` | `data-color-wheel-hue-ring` |
| `HueThumb` | `data-color-wheel-thumb` |
| `Area` | `data-color-wheel-area` |
| `AreaThumb` | `data-color-wheel-thumb` |
| `AlphaSlider` | `data-color-wheel-alpha-slider` |
| `HexInput` | `data-color-wheel-hex-input` |
| `Swatch` | `data-color-wheel-swatch` |
| `CopyButton` | `data-color-wheel-copy-button` |
| `PasteButton` | `data-color-wheel-paste-button` |

**State attributes:**

| Attribute | Components | Description |
|-----------|------------|-------------|
| `data-disabled` | All interactive | Present when disabled |
| `data-dragging` | HueRing, Area | Present during drag |

## forwardRef Support

All components support ref forwarding:

```tsx
import { useRef } from 'react'
import * as ColorWheel from '@usapopo/react-color-wheel'

function App() {
  const wheelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
      <ColorWheel.Wheel ref={wheelRef}>
        <ColorWheel.HueRing />
      </ColorWheel.Wheel>
      <ColorWheel.HexInput ref={inputRef} />
    </ColorWheel.Root>
  )
}
```

## Full Example

```tsx
import { useState } from 'react'
import * as ColorWheel from '@usapopo/react-color-wheel'

function ColorPicker() {
  const [color, setColor] = useState('#3b82f6')

  return (
    <ColorWheel.Root
      value={color}
      onValueChange={setColor}
      onValueChangeEnd={(hex) => console.log('Final:', hex)}
      onHueChange={(hue) => console.log('Hue:', hue)}
    >
      <ColorWheel.Wheel size={240} ringWidth={24}>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>

      <div className="flex items-center gap-2 mt-3">
        <ColorWheel.Swatch className="w-8 h-8 rounded" />
        <ColorWheel.HexInput
          className="w-20 px-2 py-1 border rounded"
          onCommit={(hex) => console.log('Committed:', hex)}
        />
        <ColorWheel.CopyButton onCopy={() => alert('Copied!')}>
          Copy
        </ColorWheel.CopyButton>
        <ColorWheel.PasteButton
          onPaste={() => alert('Pasted!')}
          onError={() => alert('Invalid color')}
        >
          Paste
        </ColorWheel.PasteButton>
      </div>

      <ColorWheel.AlphaSlider className="mt-3" />
    </ColorWheel.Root>
  )
}
```

## Context Hooks

Access color state from custom components:

### useColorWheelContext

```tsx
import { useColorWheelContext } from '@usapopo/react-color-wheel'

function CustomDisplay() {
  const {
    hsv,           // { h: number, s: number, v: number }
    alpha,         // number (0-100)
    hex,           // string ("#rrggbb")
    hex8,          // string ("#rrggbbaa")
    isDragging,    // boolean
    disabled,      // boolean
    setHsv,        // (hsv: HSV) => void
    setHue,        // (hue: number) => void
    setSaturation, // (saturation: number) => void
    setBrightness, // (brightness: number) => void
    setAlpha,      // (alpha: number) => void
    setHex,        // (hex: string) => void
    startDrag,     // () => void
    endDrag,       // () => void
  } = useColorWheelContext()

  return (
    <div>
      <p>HSV: {hsv.h}°, {hsv.s}%, {hsv.v}%</p>
      <p>Alpha: {alpha}%</p>
      <p>HEX: {hex}</p>
      <p>HEX8: {hex8}</p>
    </div>
  )
}
```

### useWheelContext

Access wheel dimensions (must be inside `Wheel`):

```tsx
import { useWheelContext } from '@usapopo/react-color-wheel'

function CustomComponent() {
  const {
    size,       // number - Wheel diameter
    ringWidth,  // number - Hue ring width
    areaSize,   // number - Inner area size (size - ringWidth * 2)
    thumbSize,  // number - Calculated thumb size
  } = useWheelContext()

  return <div>Wheel size: {size}px</div>
}
```

## Utilities

### Color Conversion Functions

```tsx
import {
  // HSV conversions
  hsvToHex,        // (h, s, v) => "#rrggbb"
  hexToHsv,        // (hex) => { h, s, v }

  // RGB conversions
  hexToRgb,        // (hex) => { r, g, b }
  rgbToHex,        // ({ r, g, b }) => "#rrggbb"
  hexToRgba,       // (hex) => { r, g, b, a }
  rgbaToHex,       // ({ r, g, b, a }) => "#rrggbbaa"

  // HSL conversions
  hexToHsl,        // (hex) => { h, s, l }
  hslToHex,        // ({ h, s, l }) => "#rrggbb"
  hexToHsla,       // (hex) => { h, s, l, a }
  hslaToHex,       // ({ h, s, l, a }) => "#rrggbbaa"

  // CSS string conversions
  hexToCssRgb,     // (hex) => "rgb(r, g, b)" or "rgba(r, g, b, a)"
  cssRgbToHex,     // (cssRgb) => "#rrggbb" or "#rrggbbaa"
  hexToCssHsl,     // (hex) => "hsl(h, s%, l%)" or "hsla(h, s%, l%, a)"
  cssHslToHex,     // (cssHsl) => "#rrggbb" or "#rrggbbaa"

  // Other utilities
  isValidHex,      // (hex) => boolean
  normalizeHex,    // (hex) => string (adds # if missing, lowercase)
  getColorNameEn,  // (hue) => "red" | "orange" | ...
  clamp,           // (value, min, max) => number
} from '@usapopo/react-color-wheel'
```

### Examples

```tsx
import {
  hsvToHex, hexToHsv, hexToRgb, rgbToHex,
  hexToHsl, hslToHex, hexToCssRgb, cssRgbToHex,
  getColorNameEn
} from '@usapopo/react-color-wheel'

// HSV <-> HEX
const hex = hsvToHex(0, 100, 100) // "#ff0000"
const hsv = hexToHsv('#00ff00') // { h: 120, s: 100, v: 100 }

// RGB <-> HEX
const rgb = hexToRgb('#ff0000') // { r: 255, g: 0, b: 0 }
const hex2 = rgbToHex({ r: 0, g: 255, b: 0 }) // "#00ff00"

// HSL <-> HEX
const hsl = hexToHsl('#ff0000') // { h: 0, s: 100, l: 50 }
const hex3 = hslToHex({ h: 120, s: 100, l: 50 }) // "#00ff00"

// CSS strings <-> HEX
const css = hexToCssRgb('#ff000080') // "rgba(255, 0, 0, 0.5)"
const hex4 = cssRgbToHex('rgb(0, 255, 0)') // "#00ff00"

// Get color name
const name = getColorNameEn(30) // "orange"
```

## Imperative API (Ref)

The `Root` component exposes an imperative API via ref for programmatic control. This is useful for implementing features like eyedropper tools.

```tsx
import { useRef } from 'react'
import * as ColorWheel from '@usapopo/react-color-wheel'
import type { ColorWheelRef } from '@usapopo/react-color-wheel'

function EyedropperExample() {
  const colorWheelRef = useRef<ColorWheelRef>(null)

  const handleEyedropper = async () => {
    // Use the EyeDropper API (if supported)
    if ('EyeDropper' in window) {
      const eyeDropper = new (window as any).EyeDropper()
      const result = await eyeDropper.open()
      colorWheelRef.current?.setColor(result.sRGBHex)
    }
  }

  return (
    <div>
      <ColorWheel.Root ref={colorWheelRef} defaultValue="#ff0000">
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
      <button onClick={handleEyedropper}>Pick Color</button>
    </div>
  )
}
```

### ColorWheelRef Methods

| Method | Type | Description |
|--------|------|-------------|
| `getColor()` | `() => string` | Get current HEX color (6 digits, e.g., `"#ff0000"`) |
| `getColor8()` | `() => string` | Get current HEX8 color with alpha (e.g., `"#ff0000ff"`) |
| `getAlpha()` | `() => number` | Get current alpha value (0-100) |
| `getHsv()` | `() => HSV` | Get current HSV values (`{ h, s, v }`) |
| `setColor(hex)` | `(hex: string) => void` | Set color by HEX value (6 or 8 digits) |
| `setAlpha(alpha)` | `(alpha: number) => void` | Set alpha value (0-100) |
| `setHsv(hsv)` | `(hsv: HSV) => void` | Set color by HSV values |
| `setHue(hue)` | `(hue: number) => void` | Set hue value (0-360) |
| `setSaturation(s)` | `(s: number) => void` | Set saturation value (0-100) |
| `setBrightness(v)` | `(v: number) => void` | Set brightness/value (0-100) |

## TypeScript

All types are exported:

```tsx
import type {
  // Component Props
  RootProps,
  WheelProps,
  HueRingProps,
  HueThumbProps,
  AreaProps,
  AreaThumbProps,
  HexInputProps,
  SwatchProps,
  AlphaSliderProps,
  CopyButtonProps,
  PasteButtonProps,

  // Color Types
  RGB,  // { r: number, g: number, b: number }
  RGBA, // { r, g, b, a: number }
  HSL,  // { h: number, s: number, l: number }
  HSLA, // { h, s, l, a: number }
  HSV,  // { h: number, s: number, v: number }
  ColorWheelRef, // Imperative API ref type
} from '@usapopo/react-color-wheel'
```

## Accessibility

This component follows WAI-ARIA best practices:

- **HueRing**: `role="slider"`, `aria-label="Hue"`, `aria-valuemin/max/now/text`
- **Area**: `role="slider"`, `aria-label="Saturation and brightness"`, `aria-valuetext`
- **AlphaSlider**: `role="slider"`, `aria-label="Opacity"`, `aria-valuemin/max/now/text`
- **HexInput**: `aria-label="Hexadecimal color code"`, `aria-invalid` for validation
- **CopyButton**: `aria-label="Copy color"`
- **PasteButton**: `aria-label="Paste color"`
- Full keyboard navigation support
- Focus management

## Browser Support

### Recommended (Full Support)

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | 86+ | 86+ |
| Firefox | 85+ | 85+ |
| Safari | 15.4+ | 15.4+ |
| Edge | 86+ | - |

### Minimum (Core Features)

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | 69+ | 69+ | conic-gradient support |
| Firefox | 83+ | 83+ | conic-gradient support |
| Safari | 13.1+ | 13.4+ | Clipboard API support |
| Edge | 79+ | - | Chromium-based |

### Not Supported

- Internet Explorer (all versions)
- Legacy Edge (pre-Chromium)

### Required Browser Features

| Feature | Usage |
|---------|-------|
| Pointer Events | Drag interactions |
| Clipboard API | Copy/Paste buttons |
| CSS conic-gradient | Hue ring gradient |
| CSS Custom Properties | Theming |
| CSS mask | Ring shape |

### React Compatibility

- React 18.x
- React 19.x

## License

[MIT](./LICENSE)
