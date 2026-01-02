# Utilities

Color conversion, manipulation, and validation functions.

## Table of Contents

- [Color Conversion Functions](#color-conversion-functions)
- [Zod Schemas](#zod-schemas)
- [Error Handling](#error-handling)
- [Safe Conversion Functions](#safe-conversion-functions)
- [Color Manipulation](#color-manipulation)
- [Accessibility](#accessibility)
- [Palette Generation](#palette-generation)
- [Additional Color Spaces](#additional-color-spaces)
- [Color Parsing](#color-parsing)

---

## Color Conversion Functions

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
} from 'react-hsv-ring'
```

### Examples

```tsx
import {
  hsvToHex, hexToHsv, hexToRgb, rgbToHex,
  hexToHsl, hslToHex, hexToCssRgb, cssRgbToHex,
  getColorNameEn
} from 'react-hsv-ring'

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

---

## Zod Schemas

All color types have corresponding Zod schemas for runtime validation:

```tsx
import {
  // Primitive schemas
  hexSchema,           // 6-digit hex (e.g., "#ff0000")
  hex8Schema,          // 8-digit hex (e.g., "#ff0000ff")
  hexOrHex8Schema,     // 6 or 8 digit hex
  hueSchema,           // 0-360
  saturationSchema,    // 0-100
  brightnessSchema,    // 0-100
  lightnessSchema,     // 0-100
  alphaSchema,         // 0-100 (percentage)
  alphaNormalizedSchema, // 0-1 (normalized)
  rgbChannelSchema,    // 0-255 integer

  // Object schemas
  rgbSchema,           // { r, g, b }
  rgbaSchema,          // { r, g, b, a }
  hsvSchema,           // { h, s, v }
  hslSchema,           // { h, s, l }
  hslaSchema,          // { h, s, l, a }

  // CSS string schemas
  cssRgbSchema,        // "rgb(...)" or "rgba(...)"
  cssHslSchema,        // "hsl(...)" or "hsla(...)"
} from 'react-hsv-ring'
```

**Example: Form validation**

```tsx
import { hexSchema, rgbSchema } from 'react-hsv-ring'

// Validate user input
const result = hexSchema.safeParse(userInput)
if (result.success) {
  // Valid hex color
  console.log(result.data)
} else {
  // Invalid - show error
  console.error(result.error.issues[0]?.message)
}

// Use with form libraries (e.g., react-hook-form + zod)
const formSchema = z.object({
  primaryColor: hexSchema,
  backgroundColor: rgbSchema,
})
```

**Note:** All conversion functions (`hexToRgb`, `rgbToHex`, etc.) validate inputs with Zod and throw `ColorValidationError` for invalid values.

---

## Error Handling

All conversion functions throw `ColorValidationError` when validation fails:

```tsx
import {
  hexToRgb,
  ColorValidationError,
} from 'react-hsv-ring'

try {
  const rgb = hexToRgb(userInput)
  console.log(rgb)
} catch (error) {
  if (error instanceof ColorValidationError) {
    console.error(error.functionName)   // "hexToRgb"
    console.error(error.receivedValue)  // The invalid input
    console.error(error.issues)         // Zod validation issues
  }
}
```

---

## Safe Conversion Functions

For a more functional approach, use the `*Safe` variants that return a `SafeResult` instead of throwing:

```tsx
import {
  hexToRgbSafe,
  rgbToHexSafe,
  hexToHslSafe,
  hslToHexSafe,
  hexToRgbaSafe,
  rgbaToHexSafe,
  hexToHslaSafe,
  hslaToHexSafe,
  hexToCssRgbSafe,
  cssRgbToHexSafe,
  hexToCssHslSafe,
  cssHslToHexSafe,
  type SafeResult,
} from 'react-hsv-ring'

// SafeResult<T> is:
// | { success: true; data: T; error: null }
// | { success: false; data: null; error: ColorValidationError }

const result = hexToRgbSafe(userInput)

if (result.success) {
  // TypeScript knows result.data is RGB
  console.log(result.data.r, result.data.g, result.data.b)
} else {
  // TypeScript knows result.error is ColorValidationError
  console.error(result.error.message)
}
```

---

## Color Manipulation

Functions for modifying colors:

```tsx
import {
  lighten,      // (hex, amount) => hex - Increase lightness
  darken,       // (hex, amount) => hex - Decrease lightness
  saturate,     // (hex, amount) => hex - Increase saturation
  desaturate,   // (hex, amount) => hex - Decrease saturation
  mix,          // (hex1, hex2, ratio?) => hex - Blend two colors
  complement,   // (hex) => hex - Get complementary color (opposite on wheel)
  invert,       // (hex) => hex - Invert color
  grayscale,    // (hex) => hex - Convert to grayscale
  rotateHue,    // (hex, degrees) => hex - Rotate hue on color wheel
  setAlpha,     // (hex, alpha) => hex8 - Set transparency (0-1)
} from 'react-hsv-ring'

// Examples
lighten('#ff0000', 20)        // Lighten red by 20%
darken('#ff0000', 20)         // Darken red by 20%
mix('#ff0000', '#0000ff', 0.5) // Mix red and blue equally => purple
complement('#ff0000')         // => "#00ffff" (cyan)
invert('#000000')             // => "#ffffff"
```

---

## Accessibility

WCAG-compliant contrast and readability utilities:

```tsx
import {
  getLuminance,      // (hex) => number - Relative luminance (0-1)
  getContrastRatio,  // (hex1, hex2) => number - Contrast ratio (1-21)
  isReadable,        // (fg, bg, options?) => boolean - WCAG readability check
  suggestTextColor,  // (bg) => "#000000" | "#ffffff" - Best text color
  getBestContrast,   // (bg, options[]) => hex - Best contrasting color
  isLight,           // (hex) => boolean
  isDark,            // (hex) => boolean
} from 'react-hsv-ring'

// Examples
getContrastRatio('#000000', '#ffffff') // => 21
isReadable('#000000', '#ffffff')       // => true (passes AA)
isReadable('#777777', '#ffffff', { level: 'AAA' }) // => false
suggestTextColor('#1a1a1a')            // => "#ffffff"
```

---

## Palette Generation

Generate harmonious color palettes:

```tsx
import {
  generateAnalogous,         // (hex, count?, angle?) => hex[] - Adjacent colors
  generateComplementary,     // (hex) => [hex, hex] - Opposite colors
  generateSplitComplementary, // (hex, angle?) => [hex, hex, hex]
  generateTriadic,           // (hex) => [hex, hex, hex] - 120° apart
  generateTetradic,          // (hex) => [hex, hex, hex, hex] - 90° apart
  generateShades,            // (hex, count?) => hex[] - Darker variations
  generateTints,             // (hex, count?) => hex[] - Lighter variations
  generateScale,             // (hex, steps?) => hex[] - Full light/dark scale
  generateMonochromatic,     // (hex, count?) => hex[] - Same hue variations
} from 'react-hsv-ring'

// Examples
generateTriadic('#ff0000')    // => ['#ff0000', '#00ff00', '#0000ff']
generateShades('#ff0000', 5)  // => 5 shades from original to dark
generateScale('#808080', 5)   // => Full scale from dark to light
```

---

## Additional Color Spaces

Support for Lab, Oklch, and CMYK:

```tsx
import {
  // CIE Lab (perceptually uniform)
  hexToLab,  // (hex) => { l, a, b }
  labToHex,  // ({ l, a, b }) => hex

  // Oklch (modern perceptual color space)
  hexToOklch,  // (hex) => { l, c, h }
  oklchToHex,  // ({ l, c, h }) => hex

  // CMYK (print colors)
  hexToCmyk,  // (hex) => { c, m, y, k }
  cmykToHex,  // ({ c, m, y, k }) => hex

  // Color difference
  getDeltaE,  // (hex1, hex2) => number - Perceptual difference
} from 'react-hsv-ring'

// Examples
hexToLab('#ff0000')   // => { l: 53.23, a: 80.11, b: 67.22 }
hexToCmyk('#ff0000')  // => { c: 0, m: 100, y: 100, k: 0 }
getDeltaE('#ff0000', '#ff0001') // => ~0.5 (very similar)
```

---

## Color Parsing

Parse and format colors in any format:

```tsx
import {
  parseColor,        // (any) => hex - Parse any format to hex
  parseColorFull,    // (any) => ParsedColor - All formats at once
  formatColor,       // (any, format) => formatted - Convert to format
  detectColorFormat, // (str) => ColorFormat | null
  isValidColor,      // (str) => boolean
  getNamedColor,     // (hex) => string | null - CSS color name
  getNamedColors,    // () => Record<string, hex> - All CSS colors
} from 'react-hsv-ring'

// Parse any format
parseColor('#f00')              // => "#ff0000"
parseColor('rgb(255, 0, 0)')    // => "#ff0000"
parseColor('hsl(0, 100%, 50%)') // => "#ff0000"
parseColor('red')               // => "#ff0000"

// Get all formats at once
const parsed = parseColorFull('red')
parsed.hex      // "#ff0000"
parsed.rgb      // { r: 255, g: 0, b: 0 }
parsed.hsl      // { h: 0, s: 100, l: 50 }
parsed.cssRgb   // "rgb(255, 0, 0)"
parsed.cmyk     // { c: 0, m: 100, y: 100, k: 0 }

// Format to specific type
formatColor('#ff0000', 'cssRgb')  // => "rgb(255, 0, 0)"
formatColor('red', 'cmyk')        // => { c: 0, m: 100, y: 100, k: 0 }

// Check validity
isValidColor('rgb(255, 0, 0)')  // => true
isValidColor('not-a-color')     // => false
```
