# API Reference

Context hooks, imperative API, TypeScript types, accessibility, and browser support.

## Table of Contents

- [Context Hooks](#context-hooks)
  - [useColorWheelContext](#usecolorwheelcontext)
  - [useWheelContext](#usewheelcontext)
- [Imperative API (Ref)](#imperative-api-ref)
- [forwardRef Support](#forwardref-support)
- [TypeScript](#typescript)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)

---

## Context Hooks

### useColorWheelContext

Access color state from custom components:

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

---

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

---

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

---

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
  HueSliderProps,
  SaturationSliderProps,
  BrightnessSliderProps,
  LightnessSliderProps,
  GammaSliderProps,
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

---

## Accessibility

This component follows WAI-ARIA best practices:

- **HueRing**: `role="slider"`, `aria-label="Hue"`, `aria-valuemin/max/now/text`
- **Area**: `role="slider"`, `aria-label="Saturation and brightness"`, `aria-valuetext`
- **AlphaSlider**: `role="slider"`, `aria-label="Opacity"`, `aria-valuemin/max/now/text`
- **HueSlider**: `role="slider"`, `aria-label="Hue"`, `aria-valuemin/max/now/text`
- **SaturationSlider**: `role="slider"`, `aria-label="Saturation"`, `aria-valuemin/max/now/text`
- **BrightnessSlider**: `role="slider"`, `aria-label="Brightness"`, `aria-valuemin/max/now/text`
- **LightnessSlider**: `role="slider"`, `aria-label="Lightness"`, `aria-valuemin/max/now/text`
- **GammaSlider**: `role="slider"`, `aria-label="Gamma"`, `aria-valuemin/max/now/text`
- **HexInput**: `aria-label="Hexadecimal color code"`, `aria-invalid` for validation
- **CopyButton**: `aria-label="Copy color"`
- **PasteButton**: `aria-label="Paste color"`
- Full keyboard navigation support
- Focus management

---

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
