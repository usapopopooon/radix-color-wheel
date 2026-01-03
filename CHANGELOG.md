# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-01-03

### Fixed

- Thumb focus/active outline now displays correctly with 50% opacity black outline
- Hue can now be adjusted even when saturation is 0 (grayscale colors)

## [0.1.0] - 2026-01-03

### Added

- **Core Components**
  - `Root` - Context provider with controlled/uncontrolled color state
  - `Wheel` - Container for hue ring and saturation/brightness area
  - `HueRing` - Circular hue gradient with drag and keyboard support
  - `HueThumb` - Draggable thumb for hue selection
  - `Area` - Saturation/brightness selection area
  - `AreaThumb` - Draggable thumb for saturation/brightness

- **Slider Components**
  - `AlphaSlider` - Transparency slider with horizontal/vertical orientation
  - `HueSlider` - Linear hue slider (alternative to HueRing)
  - `SaturationSlider` - Linear saturation adjustment
  - `BrightnessSlider` - Linear brightness/value adjustment
  - `LightnessSlider` - Linear lightness adjustment (HSL)
  - `GammaSlider` - Independent gamma correction slider

- **Input Components**
  - `HexInput` - Text input for direct hex color entry
  - `Swatch` - Color preview with alpha transparency support
  - `CopyButton` - Copy current color to clipboard
  - `PasteButton` - Paste color from clipboard

- **Color Utilities**
  - HSV, RGB, HSL, RGBA, HSLA conversions
  - CSS string conversions (`rgb()`, `hsl()`)
  - Lab, Oklch, CMYK color space support
  - Color manipulation (lighten, darken, saturate, mix, complement, invert)
  - Accessibility utilities (contrast ratio, WCAG readability)
  - Palette generation (analogous, complementary, triadic, tetradic, shades, tints)
  - Color parsing and validation with Zod schemas

- **Features**
  - Full keyboard navigation (Arrow keys, WASD, Shift/Alt modifiers)
  - WAI-ARIA compliant accessibility
  - Imperative API via ref (`ColorWheelRef`)
  - `forwardRef` support for all components
  - `asChild` pattern for CopyButton/PasteButton
  - `jumpOnClick` prop for click-to-position behavior
  - `inverted` prop for slider direction
  - Customizable `thumbSize`, `trackSize`, `hueOffset`
  - Dark mode support

- **Developer Experience**
  - Full TypeScript support with exported types
  - Zod schemas for runtime validation
  - Safe conversion functions (`*Safe` variants)
  - `ColorValidationError` for error handling
  - Storybook documentation with interactive examples

### Technical

- React 18/19 compatibility
- Radix UI Compound Components pattern
- Tailwind CSS v4 integration
- Vitest for unit and Storybook testing
- ESLint v9 flat config
