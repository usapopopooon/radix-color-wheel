# Components

All components with props, examples, and links to live demos.

## Table of Contents

- [Root](#root)
- [Wheel](#wheel)
- [HueRing](#huering)
- [HueThumb](#huethumb)
- [Area](#area)
- [AreaThumb](#areathumb)
- [AlphaSlider](#alphaslider)
- [HueSlider](#hueslider)
- [SaturationSlider](#saturationslider)
- [BrightnessSlider](#brightnessslider)
- [LightnessSlider](#lightnessslider)
- [GammaSlider](#gammaslider)
- [HexInput](#hexinput)
- [Swatch](#swatch)
- [CopyButton](#copybutton)
- [PasteButton](#pastebutton)
- [Data Attributes](#data-attributes)

---

## Root

Context provider that manages color state.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-colorwheel)

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
| `jumpOnClick` | `boolean` | `true` | When true, clicking on hue ring or area jumps thumb to position |
| `children` | `ReactNode` | - | Child components |

---

## Wheel

Container for the hue ring and saturation/brightness area.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-colorwheel)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `200` | Wheel diameter in pixels |
| `ringWidth` | `number` | `20` | Hue ring width in pixels |
| `thumbSize` | `number` | auto | Custom thumb size in pixels (default: auto-calculated based on wheel size) |
| `hueOffset` | `number` | `-90` | Starting angle for hue ring in degrees (0=right, -90=top, 90=bottom, 180=left) |
| `children` | `ReactNode` | - | Child components (HueRing, HueThumb, Area, AreaThumb) |

Supports `ref` forwarding and all standard `div` attributes.

---

## HueRing

The circular hue gradient ring. Must be placed inside `Wheel`.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-colorwheel)

Supports `ref` forwarding and all standard `div` attributes.

**Keyboard Navigation:**

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowDown` / `A` / `S` | Decrease hue by 1° |
| `ArrowRight` / `ArrowUp` / `D` / `W` | Increase hue by 1° |
| `Shift + Arrow` | Change hue by 10° |
| `Alt + ArrowLeft` / `Alt + ArrowDown` | Set hue to 0° |
| `Alt + ArrowRight` / `Alt + ArrowUp` | Set hue to 359° |

---

## HueThumb

Draggable thumb for hue selection. Must be placed inside `Wheel`.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-colorwheel)

Supports `ref` forwarding and all standard `div` attributes.

---

## Area

The saturation/brightness selection area. Must be placed inside `Wheel`.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-colorwheel)

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

---

## AreaThumb

Draggable thumb for saturation/brightness selection. Must be placed inside `Wheel`.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-colorwheel)

Supports `ref` forwarding and all standard `div` attributes.

---

## AlphaSlider

Optional transparency slider.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-alphaslider)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |
| `inverted` | `boolean` | `false` | Inverts slider direction (opaque on left/top) |
| `trackSize` | `number` | `12` | Track thickness in pixels |
| `thumbSize` | `number` | `16` | Thumb size in pixels |

Supports `ref` forwarding and all standard `div` attributes.

**Keyboard Navigation:**

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowDown` / `A` / `S` | Decrease alpha by 1% |
| `ArrowRight` / `ArrowUp` / `D` / `W` | Increase alpha by 1% |
| `Shift + Arrow` | Change alpha by 10% |
| `Alt + ArrowLeft` / `Alt + ArrowDown` | Set alpha to 0% |
| `Alt + ArrowRight` / `Alt + ArrowUp` | Set alpha to 100% |

---

## HueSlider

Optional linear hue slider (alternative to circular HueRing).

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-hueslider)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |
| `inverted` | `boolean` | `false` | Inverts slider direction (360 on left/top) |
| `trackSize` | `number` | `12` | Track thickness in pixels |
| `thumbSize` | `number` | `16` | Thumb size in pixels |

Supports `ref` forwarding and all standard `div` attributes.

**Keyboard Navigation:**

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowDown` / `A` / `S` | Decrease hue by 1° |
| `ArrowRight` / `ArrowUp` / `D` / `W` | Increase hue by 1° |
| `Shift + Arrow` | Change hue by 10° |
| `Alt + ArrowLeft` / `Alt + ArrowDown` | Set hue to 0° |
| `Alt + ArrowRight` / `Alt + ArrowUp` | Set hue to 359° |

---

## SaturationSlider

Linear slider for adjusting saturation (HSV).

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-saturationslider)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |
| `inverted` | `boolean` | `false` | Inverts slider direction (100% on left/top) |
| `trackSize` | `number` | `12` | Track thickness in pixels |
| `thumbSize` | `number` | `16` | Thumb size in pixels |

Supports `ref` forwarding and all standard `div` attributes.

**Keyboard Navigation:**

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowDown` / `A` / `S` | Decrease saturation by 1% |
| `ArrowRight` / `ArrowUp` / `D` / `W` | Increase saturation by 1% |
| `Shift + Arrow` | Change saturation by 10% |
| `Alt + ArrowLeft` / `Alt + ArrowDown` | Set saturation to 0% |
| `Alt + ArrowRight` / `Alt + ArrowUp` | Set saturation to 100% |

---

## BrightnessSlider

Linear slider for adjusting brightness/value (HSV).

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-brightnessslider)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |
| `inverted` | `boolean` | `false` | Inverts slider direction (100% on left/top) |
| `trackSize` | `number` | `12` | Track thickness in pixels |
| `thumbSize` | `number` | `16` | Thumb size in pixels |

Supports `ref` forwarding and all standard `div` attributes.

**Keyboard Navigation:**

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowDown` / `A` / `S` | Decrease brightness by 1% |
| `ArrowRight` / `ArrowUp` / `D` / `W` | Increase brightness by 1% |
| `Shift + Arrow` | Change brightness by 10% |
| `Alt + ArrowLeft` / `Alt + ArrowDown` | Set brightness to 0% |
| `Alt + ArrowRight` / `Alt + ArrowUp` | Set brightness to 100% |

---

## LightnessSlider

Linear slider for adjusting lightness (HSL). Displays a gradient from black through pure color (50%) to white.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-lightnessslider)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |
| `inverted` | `boolean` | `false` | Inverts slider direction (100% on left/top) |
| `trackSize` | `number` | `12` | Track thickness in pixels |
| `thumbSize` | `number` | `16` | Thumb size in pixels |

Supports `ref` forwarding and all standard `div` attributes.

**Note:** This slider modifies the color by converting to HSL, adjusting lightness, and converting back. This may result in slight color shifts when used with HSV-based color pickers.

**Keyboard Navigation:**

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowDown` / `A` / `S` | Decrease lightness by 1% |
| `ArrowRight` / `ArrowUp` / `D` / `W` | Increase lightness by 1% |
| `Shift + Arrow` | Change lightness by 10% |
| `Alt + ArrowLeft` / `Alt + ArrowDown` | Set lightness to 0% |
| `Alt + ArrowRight` / `Alt + ArrowUp` | Set lightness to 100% |

---

## GammaSlider

Independent slider for gamma correction. Unlike other sliders, GammaSlider manages its own state and is not tied to the color wheel's color value.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-gammaslider)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Controlled gamma value |
| `defaultValue` | `number` | `1.0` | Initial gamma value for uncontrolled mode |
| `min` | `number` | `0.1` | Minimum gamma value |
| `max` | `number` | `3.0` | Maximum gamma value |
| `step` | `number` | `0.1` | Step size for keyboard navigation |
| `onValueChange` | `(gamma: number) => void` | - | Called when gamma value changes |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |
| `inverted` | `boolean` | `false` | Inverts slider direction |
| `trackSize` | `number` | `12` | Track thickness in pixels |
| `thumbSize` | `number` | `16` | Thumb size in pixels |

Supports `ref` forwarding and all standard `div` attributes.

**Keyboard Navigation:**

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowDown` / `A` / `S` | Decrease gamma by step |
| `ArrowRight` / `ArrowUp` / `D` / `W` | Increase gamma by step |
| `Alt + ArrowLeft` / `Alt + ArrowDown` | Set gamma to min |
| `Alt + ArrowRight` / `Alt + ArrowUp` | Set gamma to max |
| `Home` | Reset gamma to 1.0 (neutral) |

---

## HexInput

Text input for direct hex color entry.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-hexinput)

| Prop | Type | Description |
|------|------|-------------|
| `onCommit` | `(hex: string) => void` | Called when a valid hex is committed (Enter or blur) |

Supports `ref` forwarding (to `HTMLInputElement`) and all standard `input` attributes except `value` and `onChange`.

**Behavior:**
- Validates input on Enter key or blur
- Reverts to previous value on Escape key
- Accepts with or without `#` prefix
- Normalizes to lowercase

---

## Swatch

Displays the current color with alpha transparency support.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-swatch)

Supports `ref` forwarding and all standard `div` attributes.

---

## CopyButton

Copies the current color to clipboard.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-clipboardbuttons)

| Prop | Type | Description |
|------|------|-------------|
| `onCopy` | `(hex: string) => void` | Called after successful copy |
| `asChild` | `boolean` | When true, renders child element instead of default button |
| `children` | `ReactNode` | Button content |

Supports `ref` forwarding (to `HTMLButtonElement`) and all standard `button` attributes except `onCopy`.

---

## PasteButton

Pastes color from clipboard.

[View in Storybook](https://usapopopooon.github.io/react-color-wheel/storybook/?path=/docs/components-clipboardbuttons)

| Prop | Type | Description |
|------|------|-------------|
| `onPaste` | `(hex: string) => void` | Called after successful paste |
| `onError` | `() => void` | Called when paste fails (invalid format) |
| `asChild` | `boolean` | When true, renders child element instead of default button |
| `children` | `ReactNode` | Button content |

Supports `ref` forwarding (to `HTMLButtonElement`) and all standard `button` attributes except `onPaste`.

---

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
| `HueSlider` | `data-color-wheel-hue-slider` |
| `SaturationSlider` | `data-color-wheel-saturation-slider` |
| `BrightnessSlider` | `data-color-wheel-brightness-slider` |
| `LightnessSlider` | `data-color-wheel-lightness-slider` |
| `GammaSlider` | `data-color-wheel-gamma-slider` |
| `HexInput` | `data-color-wheel-hex-input` |
| `Swatch` | `data-color-wheel-swatch` |
| `CopyButton` | `data-color-wheel-copy-button` |
| `PasteButton` | `data-color-wheel-paste-button` |

**State attributes:**

| Attribute | Components | Description |
|-----------|------------|-------------|
| `data-disabled` | All interactive | Present when disabled |
| `data-dragging` | HueRing, Area | Present during drag |
