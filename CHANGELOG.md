# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.7] - 2026-01-08

### Fixed

- Hue no longer drifts when dragging in the saturation/brightness area
- Use preservedHue to avoid HSV->HEX->HSV rounding errors during S/V changes

## [0.1.6] - 2026-01-08

### Fixed

- Storybook build now works in CI environment by filtering vite-plugin-dts in viteFinal

## [0.1.5] - 2026-01-08

### Fixed

- Storybook build now works correctly by disabling vite-plugin-dts during Storybook builds

### Changed

- Added Storybook build step to CI workflow

## [0.1.4] - 2026-01-08

### Fixed

- Thumb focus/active outline styles now work without Tailwind CSS dependency
- Changed from Tailwind classes to inline styles for focus/active states

## [0.1.3] - 2026-01-08

### Fixed

- Type definition file (index.d.ts) is now properly generated with vite-plugin-dts

## [0.1.2] - 2026-01-07

### Fixed

- HueRing gradient and Area background color now match correctly
- Selected hue on the ring is now properly reflected in the saturation/brightness area

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
