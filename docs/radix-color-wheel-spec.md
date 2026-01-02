# @usapopo/radix-color-wheel 実装方針

## Overview

Color wheel component based on Radix UI design philosophy. Uses Compound Components pattern, allowing you to combine only the parts you need.

## Tech Stack

- React 18+
- TypeScript
- Vite (build & dev server)
- Tailwind CSS (styling)
- Radix UI internal utilities (`@radix-ui/react-use-controllable-state`, etc.)
- CSS variables for style customization

---

## Coding Standards

### One Function Per File, One Component Per File

Files follow the single responsibility principle, containing only one function or one component.

```
src/
├── utils/
│   ├── hsvToHex.ts          # 1関数
│   ├── hexToHsv.ts          # 1関数
│   ├── getHueFromPosition.ts
│   ├── getSVFromPosition.ts
│   └── getColorName.ts
├── hooks/
│   ├── useDrag.ts           # 1フック
│   └── useColorWheel.ts
├── components/
│   ├── Root.tsx             # 1コンポーネント
│   ├── Wheel.tsx
│   ├── HueRing.tsx
│   ├── HueThumb.tsx
│   ├── Area.tsx
│   ├── AreaThumb.tsx
│   ├── AlphaSlider.tsx
│   ├── HexInput.tsx
│   └── Swatch.tsx
└── context/
    └── ColorWheelContext.tsx
```

### No `any` Type

TypeScript's `any` type is prohibited. Define appropriate types instead.

```ts
// ❌ NG
function processValue(value: any): any {
  return value
}

// ✅ OK
function processValue<T>(value: T): T {
  return value
}

// ❌ NG
const handler = (e: any) => { ... }

// ✅ OK
const handler = (e: React.PointerEvent<HTMLDivElement>) => { ... }
```

Enable `@typescript-eslint/no-explicit-any` in ESLint to enforce this.

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### Functional Programming / Immutability

Follow these principles as much as possible:

- **Pure functions**: Always return the same output for the same input, no side effects
- **Immutable**: Utilize `readonly`, `as const`, `Readonly<T>` to maintain immutability
- **Declarative**: Describe what to do, abstract how to do it

```ts
// ❌ NG: Destructive modification
function addColor(colors: string[], color: string): string[] {
  colors.push(color)  // Mutates the original array
  return colors
}

// ✅ OK: Immutable
function addColor(colors: readonly string[], color: string): readonly string[] {
  return [...colors, color]  // Returns a new array
}
```

```ts
// ✅ OK: Explicit immutability with readonly
interface HSV {
  readonly h: number
  readonly s: number
  readonly v: number
}

// ✅ OK: Treat as constant with as const
const COLOR_NAMES = [
  { min: 0, max: 15, name: '赤' },
  { min: 15, max: 45, name: 'オレンジ' },
  // ...
] as const

// ✅ OK: Make entire object immutable with Readonly<T>
type ColorWheelState = Readonly<{
  hsv: HSV
  alpha: number
  hex: string
}>
```

```ts
// ✅ OK: Pure function example
export function hsvToHex(h: number, s: number, v: number): string {
  // Depends only on input, does not modify external state
  const s_norm = s / 100
  const v_norm = v / 100
  // ...
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
```

**Exceptions:**

These principles may be deviated from when readability or maintainability would be significantly compromised.

```ts
// Allow reassignment of local variables when it improves readability (e.g., conversion calculations)
export function hsvToHex(h: number, s: number, v: number): string {
  let r = 0, g = 0, b = 0  // Local variable reassignment is acceptable
  
  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  // ...
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
```

```ts
// Mutation in performance-critical sections
// Document the reason in comments
function buildNestedObject(entries: readonly [string, string][]): Record<string, unknown> {
  // Using mutable object here for performance reasons
  const result: Record<string, unknown> = {}
  for (const [key, value] of entries) {
    result[key] = value
  }
  return result
}
```

### Comments in English

All comments (JSDoc, inline comments, formula comments) must be written in English.

```ts
// ❌ NG: Japanese comment
/**
 * HSV色空間からHEX形式に変換する
 * @param h - 色相 (0-360)
 */

// ✅ OK: English comment
/**
 * Convert HSV color space to HEX format
 * @param h - Hue (0-360)
 */
```

```ts
// ❌ NG
// 12時方向を0度として時計回りにするため +90度

// ✅ OK
// Add 90 degrees to make 12 o'clock position as 0 degrees (clockwise)
```

### Tests: `it` + `should` in English

Test cases must use the `it` function and start with `should` in English.

```ts
// ❌ NG
describe('hsvToHex', () => {
  test('converts red correctly', () => { ... })
  it('赤を正しく変換する', () => { ... })
  it('red conversion', () => { ... })
})

// ✅ OK
describe('hsvToHex', () => {
  it('should convert red (0, 100, 100) to #ff0000', () => { ... })
  it('should convert white (0, 0, 100) to #ffffff', () => { ... })
  it('should convert black (0, 0, 0) to #000000', () => { ... })
})
```

```ts
// ✅ OK: Component test examples
describe('ColorWheel', () => {
  it('should render without crashing', () => { ... })
  it('should call onValueChange when hue is changed via keyboard', () => { ... })
  it('should disable all interactions when disabled prop is true', () => { ... })
  it('should update color when dragging on hue ring', () => { ... })
})
```

```ts
// ✅ OK: Edge cases and error handling
describe('hexToHsv', () => {
  it('should handle lowercase hex values', () => { ... })
  it('should handle uppercase hex values', () => { ... })
  it('should throw error for invalid hex format', () => { ... })
})
```

### Formula Comments Required for Calculation Logic

All mathematical calculation functions must include formula documentation in comments.

```ts
// src/utils/getHueFromPosition.ts

/**
 * Calculate hue from coordinates
 */
export function getHueFromPosition(
  x: number,
  y: number,
  centerX: number,
  centerY: number
): number {
  // Formula: θ = atan2(y - cy, x - cx)
  // atan2 returns -π to π, so convert to 0-360
  // Add 90 degrees to make 12 o'clock position as 0 degrees (clockwise)
  //
  // hue = ((θ × 180 / π) + 90 + 360) mod 360
  const angle = Math.atan2(y - centerY, x - centerX)
  const hue = ((angle * 180) / Math.PI + 90 + 360) % 360
  return hue
}
```

```ts
// src/utils/hsvToHex.ts

/**
 * Convert HSV color space to HEX format
 *
 * HSV to RGB conversion algorithm:
 * https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB
 */
export function hsvToHex(h: number, s: number, v: number): string {
  // Normalize: s, v to 0-1 range
  const s_norm = s / 100
  const v_norm = v / 100
  
  // Formula:
  // C = V × S          (chroma)
  // X = C × (1 - |H/60 mod 2 - 1|)  (intermediate value)
  // m = V - C          (brightness offset)
  const c = v_norm * s_norm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v_norm - c
  
  // Determine R', G', B' based on hue
  // H ∈ [0, 60):   (R', G', B') = (C, X, 0)
  // H ∈ [60, 120): (R', G', B') = (X, C, 0)
  // H ∈ [120, 180): (R', G', B') = (0, C, X)
  // H ∈ [180, 240): (R', G', B') = (0, X, C)
  // H ∈ [240, 300): (R', G', B') = (X, 0, C)
  // H ∈ [300, 360): (R', G', B') = (C, 0, X)
  let r = 0, g = 0, b = 0
  
  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }
  
  // Final value: (R, G, B) = ((R' + m) × 255, (G' + m) × 255, (B' + m) × 255)
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
```

```ts
// src/utils/getSVFromPosition.ts

/**
 * Calculate saturation and value from coordinates
 */
export function getSVFromPosition(
  x: number,
  y: number,
  areaSize: number
): Readonly<{ s: number; v: number }> {
  // Formula:
  // S = (x / areaSize) × 100   (left edge=0%, right edge=100%)
  // V = (1 - y / areaSize) × 100  (top edge=100%, bottom edge=0%)
  //
  // Clamp to 0-100 range
  const s = Math.max(0, Math.min(100, (x / areaSize) * 100))
  const v = Math.max(0, Math.min(100, (1 - y / areaSize) * 100))
  return { s, v } as const
}
```

### Performance Considerations

Be performance-conscious within a range that doesn't affect functionality.

**Memoization**

```tsx
// ❌ NG: Recalculates on every render
function HueThumb() {
  const { hsv } = useColorWheelContext()
  
  // Calculated every time
  const position = calculateThumbPosition(hsv.h)
  const colorName = getColorName(hsv.h)
  
  return <div style={position}>{colorName}</div>
}

// ✅ OK: Recalculate only when dependencies change with useMemo
function HueThumb() {
  const { hsv } = useColorWheelContext()
  
  const position = useMemo(
    () => calculateThumbPosition(hsv.h),
    [hsv.h]
  )
  
  const colorName = useMemo(
    () => getColorName(hsv.h),
    [hsv.h]
  )
  
  return <div style={position}>{colorName}</div>
}
```

**useCallback**

```tsx
// ❌ NG: New function created on every render
function Root({ onValueChange, children }: RootProps) {
  const handleChange = (hex: string) => {
    onValueChange?.(hex)
  }
  
  return <Context.Provider value={{ handleChange }}>{children}</Context.Provider>
}

// ✅ OK: Memoize function with useCallback
function Root({ onValueChange, children }: RootProps) {
  const handleChange = useCallback((hex: string) => {
    onValueChange?.(hex)
  }, [onValueChange])
  
  return <Context.Provider value={{ handleChange }}>{children}</Context.Provider>
}
```

**Context Splitting**

```tsx
// ❌ NG: Managing everything in one giant Context
// → All child components re-render when any value changes

// ✅ OK: Split Context by concern
const ColorValueContext = createContext<ColorValue | null>(null)  // Values only
const ColorActionsContext = createContext<ColorActions | null>(null)  // Update functions only
const WheelConfigContext = createContext<WheelConfig | null>(null)  // Config only

// Components using only update functions won't re-render on value changes
function HexInput() {
  const { setHex } = useContext(ColorActionsContext)!
  // ...
}
```

**Avoid Over-optimization**

```tsx
// ❌ NG: Over-optimization (reduces readability)
const colorName = useMemo(() => getColorName(hsv.h), [hsv.h])
const colorNameEn = useMemo(() => getColorNameEn(hsv.h), [hsv.h])
const formattedHue = useMemo(() => `${hsv.h}°`, [hsv.h])
const ariaLabel = useMemo(() => `Hue: ${colorName}`, [colorName])

// ✅ OK: Keep light calculations as-is, memoize only heavy calculations
const colorName = getColorName(hsv.h)  // Light calculation
const position = useMemo(  // Heavy calculation (trigonometry)
  () => calculateThumbPosition(hsv.h, size, ringWidth),
  [hsv.h, size, ringWidth]
)
```

**Decision Criteria:**

1. **Memoize**: Trigonometry, object creation, array operations, DOM calculations
2. **Don't memoize**: String concatenation, simple arithmetic, property access
3. **Measure first**: When uncertain, check with React DevTools Profiler

### JSDoc Comments Required

All public functions, components, and types must have JSDoc comments.

```ts
// utils/hsvToHex.ts

/**
 * Convert HSV color space to HEX format
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param v - Value/Brightness (0-100)
 * @returns HEX color code (e.g., "#ff0000")
 *
 * @example
 * ```ts
 * hsvToHex(0, 100, 100)   // => "#ff0000" (red)
 * hsvToHex(120, 100, 100) // => "#00ff00" (green)
 * hsvToHex(0, 0, 100)     // => "#ffffff" (white)
 * ```
 */
export function hsvToHex(h: number, s: number, v: number): string {
  // ...
}
```

```ts
// hooks/useDrag.ts

/**
 * Custom hook for managing drag operations
 *
 * Provides mouse and touch compatible drag handling using Pointer Events.
 * Manages pointerdown → pointermove → pointerup event flow.
 *
 * @param onMove - Callback called during drag with coordinates
 * @param options - Optional settings
 * @param options.disabled - If true, disables drag
 * @returns Drag state and event handlers
 *
 * @example
 * ```tsx
 * const { containerRef, isDragging, handlers } = useDrag(
 *   (x, y) => console.log(x, y),
 *   { disabled: false }
 * )
 *
 * return <div ref={containerRef} {...handlers} />
 * ```
 */
export function useDrag(
  onMove: (x: number, y: number) => void,
  options?: { disabled?: boolean }
): UseDragReturn {
  // ...
}
```

```tsx
// components/Root.tsx

/**
 * Root component for ColorWheel
 *
 * Acts as a Context Provider, sharing color state and
 * update functions with all child components.
 *
 * @param props - Component props
 * @param props.value - Current color (HEX format, e.g., "#ff0000")
 * @param props.defaultValue - Initial value for uncontrolled mode
 * @param props.onValueChange - Callback when color changes
 * @param props.onValueChangeEnd - Callback when drag ends
 * @param props.disabled - If true, disables all interactions
 * @param props.children - Child components
 *
 * @example
 * ```tsx
 * <ColorWheel.Root value={color} onValueChange={setColor}>
 *   <ColorWheel.Wheel>
 *     <ColorWheel.HueRing />
 *     <ColorWheel.HueThumb />
 *     <ColorWheel.Area />
 *     <ColorWheel.AreaThumb />
 *   </ColorWheel.Wheel>
 * </ColorWheel.Root>
 * ```
 */
export function Root({
  value,
  defaultValue = '#ff0000',
  onValueChange,
  onValueChangeEnd,
  disabled = false,
  children,
}: RootProps): JSX.Element {
  // ...
}
```

```ts
// types.ts

/**
 * HSV color space representation
 *
 * @property h - Hue (0-360 degrees)
 * @property s - Saturation (0-100%)
 * @property v - Value/Brightness (0-100%)
 */
export interface HSV {
  /** Hue (0-360) */
  readonly h: number
  /** Saturation (0-100) */
  readonly s: number
  /** Value/Brightness (0-100) */
  readonly v: number
}

/**
 * Props for ColorWheel.Root component
 */
export interface RootProps {
  /**
   * Current color in HEX format
   * @example "#ff0000"
   */
  readonly value?: string

  /**
   * Initial value for uncontrolled mode
   * @default "#ff0000"
   */
  readonly defaultValue?: string

  /**
   * Callback called when color changes
   * Called in real-time during drag
   */
  readonly onValueChange?: (hex: string) => void

  /**
   * Callback called when drag ends
   * Use when only final value is needed
   */
  readonly onValueChangeEnd?: (hex: string) => void

  /**
   * If true, disables all interactions
   * @default false
   */
  readonly disabled?: boolean

  /** Child components */
  readonly children: React.ReactNode
}
```

## Component Structure

```
ColorWheel.Root          # Context Provider, value management
├── ColorWheel.Wheel     # Container for entire wheel
│   ├── ColorWheel.HueRing    # Hue ring (circular gradient)
│   ├── ColorWheel.HueThumb   # Hue thumb
│   ├── ColorWheel.Area       # SV selection area (square)
│   └── ColorWheel.AreaThumb  # SV thumb
├── ColorWheel.AlphaSlider    # Alpha slider (optional)
├── ColorWheel.HexInput       # HEX input field (optional)
├── ColorWheel.Swatch         # Color preview (optional)
├── ColorWheel.CopyButton     # Copy color to clipboard (optional)
└── ColorWheel.PasteButton    # Paste color from clipboard (optional)
```

---

## API設計

### ColorWheel.Root

Acts as Context Provider, sharing state with all child components.

```tsx
interface RootProps {
  // Value (controlled/uncontrolled)
  value?: string                          // HEX value "#ff0000" or "#ff000080" (with alpha)
  defaultValue?: string                   // Initial value for uncontrolled mode
  
  // Value change callbacks
  onValueChange?: (hex: string) => void   // Real-time update
  onValueChangeEnd?: (hex: string) => void // Called only when drag ends
  
  // Individual HSV callbacks
  onHueChange?: (hue: number) => void           // 0-360
  onSaturationChange?: (saturation: number) => void  // 0-100
  onBrightnessChange?: (brightness: number) => void  // 0-100
  onAlphaChange?: (alpha: number) => void       // 0-100
  
  // Drag state
  onDragStart?: () => void
  onDragEnd?: () => void
  
  // State
  disabled?: boolean
  
  // Children
  children: React.ReactNode
}
```

### ColorWheel.Wheel

Container for the entire wheel. Specify size here.

```tsx
interface WheelProps {
  size?: number        // default: 200
  ringWidth?: number   // default: 20
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}
```

### ColorWheel.HueRing

Hue ring. Displays circular gradient.

```tsx
interface HueRingProps {
  className?: string
  style?: React.CSSProperties
}
```

### ColorWheel.HueThumb

Thumb on the hue ring. Draggable.

```tsx
interface HueThumbProps {
  className?: string
  style?: React.CSSProperties
}
```

### ColorWheel.Area

Square area for selecting saturation and brightness.

```tsx
interface AreaProps {
  className?: string
  style?: React.CSSProperties
}
```

### ColorWheel.AreaThumb

Thumb on the SV selection area. Draggable.

```tsx
interface AreaThumbProps {
  className?: string
  style?: React.CSSProperties
}
```

### ColorWheel.AlphaSlider

Alpha slider. Uses Radix Slider internally.

```tsx
interface AlphaSliderProps {
  className?: string
  style?: React.CSSProperties
  orientation?: 'horizontal' | 'vertical'  // default: 'horizontal'
}
```

### ColorWheel.HexInput

Text field for direct HEX value input.

```tsx
interface HexInputProps {
  className?: string
  style?: React.CSSProperties
  placeholder?: string
}
```

### ColorWheel.Swatch

Element that displays current color preview.

```tsx
interface SwatchProps {
  className?: string
  style?: React.CSSProperties
}
```

### ColorWheel.CopyButton

Button to copy current color to clipboard.

```tsx
interface CopyButtonProps {
  className?: string
  style?: React.CSSProperties
  onCopy?: (hex: string) => void  // Callback after copy
  asChild?: boolean               // Render child element instead of default button
  children?: React.ReactNode
}
```

### ColorWheel.PasteButton

Button to paste color from clipboard.

```tsx
interface PasteButtonProps {
  className?: string
  style?: React.CSSProperties
  onPaste?: (hex: string) => void  // Callback after successful paste
  onError?: () => void             // Callback when paste fails (invalid format)
  asChild?: boolean                // Render child element instead of default button
  children?: React.ReactNode
}
```

---

## 使用例

### 最小構成

```tsx
import * as ColorWheel from '@usapopo/radix-color-wheel'

function App() {
  const [color, setColor] = useState('#ff0000')

  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <ColorWheel.Wheel>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>
    </ColorWheel.Root>
  )
}
```

### HEX入力付き

```tsx
<ColorWheel.Root value={color} onValueChange={setColor}>
  <ColorWheel.Wheel>
    <ColorWheel.HueRing />
    <ColorWheel.HueThumb />
    <ColorWheel.Area />
    <ColorWheel.AreaThumb />
  </ColorWheel.Wheel>
  <ColorWheel.HexInput className="mt-2 px-2 py-1 border rounded" />
</ColorWheel.Root>
```

### フル装備

```tsx
<ColorWheel.Root value={color} onValueChange={setColor}>
  <ColorWheel.Wheel size={250} ringWidth={24}>
    <ColorWheel.HueRing />
    <ColorWheel.HueThumb />
    <ColorWheel.Area />
    <ColorWheel.AreaThumb />
  </ColorWheel.Wheel>

  <div className="flex items-center gap-2 mt-4">
    <ColorWheel.Swatch className="w-6 h-6 rounded border" />
    <ColorWheel.HexInput className="w-20 px-2 py-1 border rounded" />
    <ColorWheel.CopyButton
      className="p-1 border rounded"
      onCopy={() => toast('Copied!')}
    >
      <CopyIcon />
    </ColorWheel.CopyButton>
    <ColorWheel.PasteButton
      className="p-1 border rounded"
      onPaste={() => toast('Pasted!')}
      onError={() => toast.error('Invalid format')}
    >
      <PasteIcon />
    </ColorWheel.PasteButton>
  </div>

  <ColorWheel.AlphaSlider className="mt-2" />
</ColorWheel.Root>
```

### Drag State Management

```tsx
<ColorWheel.Root
  value={color}
  onValueChange={setColor}
  onValueChangeEnd={(hex) => saveToServer(hex)}
  onDragStart={() => setIsDragging(true)}
  onDragEnd={() => setIsDragging(false)}
>
  {/* ... */}
</ColorWheel.Root>
```

### Integration with Radix Popover

```tsx
import * as Popover from '@radix-ui/react-popover'
import * as ColorWheel from '@usapopo/radix-color-wheel'

function ColorPickerPopover() {
  const [color, setColor] = useState('#3b82f6')

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="w-10 h-10 rounded border-2 border-gray-300"
          style={{ backgroundColor: color }}
          aria-label="Select color"
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bg-white p-4 rounded-lg shadow-lg">
          <ColorWheel.Root value={color} onValueChange={setColor}>
            <ColorWheel.Wheel>
              <ColorWheel.HueRing />
              <ColorWheel.HueThumb />
              <ColorWheel.Area />
              <ColorWheel.AreaThumb />
            </ColorWheel.Wheel>
            <ColorWheel.HexInput className="mt-2 w-full px-2 py-1 border rounded" />
          </ColorWheel.Root>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
```

### 無効状態

```tsx
<ColorWheel.Root value={color} onValueChange={setColor} disabled>
  {/* All child components will be disabled */}
</ColorWheel.Root>
```

---

## CSS変数

Default styles can be overridden via CSS variables.

```css
[data-color-wheel-root] {
  /* Thumb */
  --cw-thumb-size: 14px;
  --cw-thumb-border-color: #ffffff;
  --cw-thumb-border-width: 2px;
  --cw-thumb-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
  
  /* フォーカスリング */
  --cw-focus-ring-color: #3b82f6;
  --cw-focus-ring-width: 2px;
  --cw-focus-ring-offset: 2px;
  
  /* AlphaSlider */
  --cw-slider-height: 12px;
  --cw-slider-thumb-size: 16px;
}
```

---

## アクセシビリティ

### キーボード操作

**HueThumb:**
- `ArrowLeft` / `ArrowDown`: 色相 -1
- `ArrowRight` / `ArrowUp`: 色相 +1
- `Shift + Arrow`: 色相 ±10
- `Home`: 色相 0（赤）
- `End`: 色相 359

**AreaThumb:**
- `ArrowLeft`: 彩度 -1
- `ArrowRight`: 彩度 +1
- `ArrowUp`: 明度 +1
- `ArrowDown`: 明度 -1
- `Shift + Arrow`: ±10

**HexInput:**
- `Enter`: Confirm value
- `Escape`: Cancel edit

### ARIA属性

```tsx
// HueRing
<div role="slider" aria-label="Hue" aria-valuemin={0} aria-valuemax={360} aria-valuenow={hue} />

// Area
<div role="slider" aria-label="彩度と明度" />

// AreaThumb
<div aria-valuetext={`彩度 ${saturation}%、明度 ${brightness}%`} />

// AlphaSlider
<div role="slider" aria-label="Opacity" aria-valuemin={0} aria-valuemax={100} aria-valuenow={alpha} />
```

---

## 内部実装

### Context構造

```tsx
interface ColorWheelContextValue {
  // 値（readonly）
  readonly hsv: Readonly<{ h: number; s: number; v: number }>
  readonly alpha: number
  readonly hex: string
  
  // 更新関数
  readonly setHue: (hue: number) => void
  readonly setSaturation: (saturation: number) => void
  readonly setBrightness: (brightness: number) => void
  readonly setAlpha: (alpha: number) => void
  readonly setHex: (hex: string) => void
  
  // 状態
  readonly disabled: boolean
  readonly isDragging: boolean
  readonly setIsDragging: (dragging: boolean) => void
  
  // Wheel設定
  readonly size: number
  readonly ringWidth: number
}
```

### HSV ↔ HEX変換

```ts
// src/utils/hsvToHex.ts

/**
 * Convert HSV color space to HEX format
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param v - Value/Brightness (0-100)
 * @returns HEX color code (e.g., "#ff0000")
 */
export function hsvToHex(h: number, s: number, v: number): string {
  const s_norm = s / 100
  const v_norm = v / 100
  
  const c = v_norm * s_norm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v_norm - c
  
  let r = 0, g = 0, b = 0
  
  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }
  
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
```

```ts
// src/utils/hexToHsv.ts

/**
 * Convert HEX format to HSV color space
 *
 * @param hex - HEX color code (e.g., "#ff0000")
 * @returns HSV color space object
 */
export function hexToHsv(hex: string): Readonly<{ h: number; s: number; v: number }> {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  
  const s = max === 0 ? 0 : Math.round((d / max) * 100)
  const v = Math.round(max * 100)
  
  return { h, s, v } as const
}
```

```ts
// src/utils/hsvToHex8.ts

import { hsvToHex } from './hsvToHex'

/**
 * Convert HSV color space + Alpha to HEX8 format
 *
 * @param h - 色相 (0-360)
 * @param s - 彩度 (0-100)
 * @param v - 明度 (0-100)
 * @param a - Alpha/Opacity (0-100)
 * @returns HEX8 color code (e.g., "#ff000080")
 */
export function hsvToHex8(h: number, s: number, v: number, a: number): string {
  const hex6 = hsvToHex(h, s, v)
  const alphaHex = Math.round((a / 100) * 255).toString(16).padStart(2, '0')
  return `${hex6}${alphaHex}`
}
```

### ドラッグ処理

Uses Pointer Events. `pointerdown` → `pointermove` → `pointerup` pattern.

```ts
// src/utils/getHueFromPosition.ts

/**
 * Calculate hue from coordinates
 *
 * Calculates angle on hue ring from mouse/touch position,
 * converting to hue value 0-360. 12 o'clock position is 0 degrees, clockwise.
 *
 * @param x - X座標
 * @param y - Y座標
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @returns 色相値 (0-360)
 */
export function getHueFromPosition(
  x: number,
  y: number,
  centerX: number,
  centerY: number
): number {
  const angle = Math.atan2(y - centerY, x - centerX)
  const hue = ((angle * 180) / Math.PI + 90 + 360) % 360
  return hue
}
```

```ts
// src/utils/getSVFromPosition.ts

/**
 * Calculate saturation and value from coordinates
 *
 * Calculates saturation and value from mouse/touch position within the SV selection area.
 * Left edge is saturation 0, right edge is saturation 100. Top edge is value 100, bottom edge is value 0.
 *
 * @param x - X coordinate (relative position from area left edge)
 * @param y - Y coordinate (relative position from area top edge)
 * @param areaSize - Size of the area (width/height)
 * @returns Saturation and value object (0-100)
 */
export function getSVFromPosition(
  x: number,
  y: number,
  areaSize: number
): Readonly<{ s: number; v: number }> {
  const s = Math.max(0, Math.min(100, (x / areaSize) * 100))
  const v = Math.max(0, Math.min(100, (1 - y / areaSize) * 100))
  return { s, v } as const
}
```

```ts
// src/hooks/useDrag.ts

import { useState, useRef, useCallback } from 'react'

/**
 * Return type for drag operations
 */
export interface UseDragReturn {
  /** Ref to container element */
  readonly containerRef: React.RefObject<HTMLDivElement>
  /** ドラッグ中かどうか */
  readonly isDragging: boolean
  /** イベントハンドラー */
  readonly handlers: Readonly<{
    onPointerDown: (e: React.PointerEvent) => void
    onPointerMove: (e: React.PointerEvent) => void
    onPointerUp: (e: React.PointerEvent) => void
  }>
}

/**
 * Custom hook for managing drag operations
 *
 * @param onMove - Callback called during drag
 * @param options - オプション設定
 * @returns ドラッグ状態とイベントハンドラー
 */
export function useDrag(
  onMove: (x: number, y: number) => void,
  options?: Readonly<{ disabled?: boolean }>
): UseDragReturn {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const disabled = options?.disabled ?? false

  const updatePosition = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    onMove(x, y)
  }, [onMove])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updatePosition(e)
  }, [disabled, updatePosition])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    updatePosition(e)
  }, [isDragging, updatePosition])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  return {
    containerRef,
    isDragging,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    }
  }
}
```

---

## 初期スタイル（CSS）

### HueRing（色相リング）

Circular conic-gradient representing the HSL hue wheel.

```css
[data-color-wheel-hue-ring] {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  
  /* 色相環グラデーション */
  background: conic-gradient(
    from 0deg,
    hsl(0, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(360, 100%, 50%)
  );
  
  /* Cut out center to create ring shape */
  mask: radial-gradient(
    circle,
    transparent calc(100% - var(--cw-ring-width, 20px)),
    black calc(100% - var(--cw-ring-width, 20px))
  );
  -webkit-mask: radial-gradient(
    circle,
    transparent calc(100% - var(--cw-ring-width, 20px)),
    black calc(100% - var(--cw-ring-width, 20px))
  );
}
```

### Area（SV選択エリア）

Overlays two gradients to represent saturation and brightness.

```css
[data-color-wheel-area] {
  position: absolute;
  /* Position inside the ring (square) */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  /* Size calculated in JS: (size - ringWidth * 2) * 0.707 (inscribed square of diagonal) */
  width: var(--cw-area-size);
  height: var(--cw-area-size);
  
  /* Set current hue as background color (dynamically changed via JS) */
  background-color: var(--cw-current-hue-color, hsl(0, 100%, 50%));
  
  /* 彩度グラデーション: 左(白) → 右(色相色) */
  /* Brightness gradient: top (bright) → bottom (dark) */
}

[data-color-wheel-area]::before {
  content: '';
  position: absolute;
  inset: 0;
  /* White to transparent gradient (saturation) */
  background: linear-gradient(to right, #fff, transparent);
}

[data-color-wheel-area]::after {
  content: '';
  position: absolute;
  inset: 0;
  /* Transparent to black gradient (brightness) */
  background: linear-gradient(to bottom, transparent, #000);
}
```

### Thumb Common Styles

```css
[data-color-wheel-thumb] {
  position: absolute;
  width: var(--cw-thumb-size, 14px);
  height: var(--cw-thumb-size, 14px);
  border-radius: 50%;
  border: var(--cw-thumb-border-width, 2px) solid var(--cw-thumb-border-color, #fff);
  box-shadow: var(--cw-thumb-shadow, 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2));
  
  /* Position relative to center */
  transform: translate(-50%, -50%);
  
  /* As click target */
  cursor: grab;
  touch-action: none;
}

[data-color-wheel-thumb]:active {
  cursor: grabbing;
}

/* HueThumb uses current hue color as background */
[data-color-wheel-hue-thumb] {
  background-color: var(--cw-current-hue-color, hsl(0, 100%, 50%));
}

/* AreaThumb uses selected color as background */
[data-color-wheel-area-thumb] {
  background-color: var(--cw-current-color, #ff0000);
  /* Display above Area */
  z-index: 1;
}
```

### フォーカススタイル

```css
[data-color-wheel-thumb]:focus {
  outline: none;
}

[data-color-wheel-thumb]:focus-visible {
  outline: var(--cw-focus-ring-width, 2px) solid var(--cw-focus-ring-color, #3b82f6);
  outline-offset: var(--cw-focus-ring-offset, 2px);
}
```

### AlphaSlider

```css
[data-color-wheel-alpha-slider] {
  position: relative;
  width: 100%;
  height: var(--cw-slider-height, 12px);
  border-radius: 6px;
  
  /* Checkerboard pattern to indicate transparency */
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0;
}

[data-color-wheel-alpha-slider]::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  /* Transparent → current color gradient (color set via JS) */
  background: linear-gradient(to right, transparent, var(--cw-current-color, #ff0000));
}
```

### 無効状態

```css
[data-color-wheel-root][data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}

[data-color-wheel-root][data-disabled] [data-color-wheel-thumb] {
  cursor: not-allowed;
}
```

---

## Keyboard Operation Implementation

### HueThumb

```tsx
function HueThumb() {
  const { hsv, setHue, disabled } = useColorWheelContext()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    
    const step = e.shiftKey ? 10 : 1
    
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault()
        setHue((hsv.h - step + 360) % 360)
        break
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault()
        setHue((hsv.h + step) % 360)
        break
      case 'Home':
        e.preventDefault()
        setHue(0)
        break
      case 'End':
        e.preventDefault()
        setHue(359)
        break
    }
  }

  return (
    <div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label="Hue"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={hsv.h}
      aria-valuetext={getColorName(hsv.h)}
      aria-disabled={disabled}
      onKeyDown={handleKeyDown}
      data-color-wheel-hue-thumb
      // ... position style
    />
  )
}
```

### AreaThumb

```tsx
function AreaThumb() {
  const { hsv, setSaturation, setBrightness, disabled } = useColorWheelContext()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    
    const step = e.shiftKey ? 10 : 1
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        setSaturation(Math.max(0, hsv.s - step))
        break
      case 'ArrowRight':
        e.preventDefault()
        setSaturation(Math.min(100, hsv.s + step))
        break
      case 'ArrowUp':
        e.preventDefault()
        setBrightness(Math.min(100, hsv.v + step))
        break
      case 'ArrowDown':
        e.preventDefault()
        setBrightness(Math.max(0, hsv.v - step))
        break
      case 'Home':
        e.preventDefault()
        setSaturation(0)
        setBrightness(100) // 白
        break
      case 'End':
        e.preventDefault()
        setSaturation(100)
        setBrightness(100) // 純色
        break
    }
  }

  return (
    <div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label="彩度と明度"
      aria-valuetext={`彩度 ${hsv.s}%、明度 ${hsv.v}%`}
      aria-disabled={disabled}
      onKeyDown={handleKeyDown}
      data-color-wheel-area-thumb
      // ... position style
    />
  )
}
```

---

## スクリーンリーダー対応

### aria-valuetext for Color Name Announcement

```ts
// src/utils/getColorName.ts

/**
 * Get color name from hue (Japanese)
 *
 * For screen readers, converts hue value to human-readable color name.
 *
 * @param hue - Hue (0-360)
 * @returns Color name (Japanese)
 *
 * @example
 * ```ts
 * getColorName(0)   // => '赤'
 * getColorName(120) // => '緑'
 * getColorName(240) // => '青'
 * ```
 */
export function getColorName(hue: number): string {
  if (hue < 15) return '赤'
  if (hue < 45) return 'オレンジ'
  if (hue < 75) return '黄色'
  if (hue < 105) return '黄緑'
  if (hue < 135) return '緑'
  if (hue < 165) return '青緑'
  if (hue < 195) return 'シアン'
  if (hue < 225) return '青'
  if (hue < 255) return '青紫'
  if (hue < 285) return '紫'
  if (hue < 315) return 'マゼンタ'
  if (hue < 345) return '赤紫'
  return '赤'
}
```

```ts
// src/utils/getColorNameEn.ts

/**
 * Get color name from hue (English)
 *
 * For screen readers, converts hue value to human-readable color name.
 *
 * @param hue - Hue (0-360)
 * @returns Color name (English)
 *
 * @example
 * ```ts
 * getColorNameEn(0)   // => 'red'
 * getColorNameEn(120) // => 'green'
 * getColorNameEn(240) // => 'blue'
 * ```
 */
export function getColorNameEn(hue: number): string {
  if (hue < 15) return 'red'
  if (hue < 45) return 'orange'
  if (hue < 75) return 'yellow'
  if (hue < 105) return 'yellow-green'
  if (hue < 135) return 'green'
  if (hue < 165) return 'teal'
  if (hue < 195) return 'cyan'
  if (hue < 225) return 'blue'
  if (hue < 255) return 'indigo'
  if (hue < 285) return 'purple'
  if (hue < 315) return 'magenta'
  if (hue < 345) return 'pink'
  return 'red'
}
```

### Live Region for Change Notifications

```tsx
function Root({ children, ...props }) {
  const [announcement, setAnnouncement] = useState('')
  
  // Notify when value changes
  const announceChange = useCallback((hex: string) => {
    setAnnouncement(`Color changed to ${hex}`)
    // Clear after a short delay
    setTimeout(() => setAnnouncement(''), 1000)
  }, [])

  return (
    <ColorWheelContext.Provider value={{ ...context, announceChange }}>
      <div data-color-wheel-root {...props}>
        {children}
        {/* Screen reader notification area */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          {announcement}
        </div>
      </div>
    </ColorWheelContext.Provider>
  )
}
```

### Complete ARIA Attributes

```tsx
// HueRing (decorative when not interactive)
<div
  data-color-wheel-hue-ring
  aria-hidden="true"  // Ring itself is decorative, Thumb handles interaction
/>

// HueThumb
<div
  data-color-wheel-hue-thumb
  role="slider"
  tabIndex={0}
  aria-label="Hue"
  aria-valuemin={0}
  aria-valuemax={360}
  aria-valuenow={hsv.h}
  aria-valuetext={`${getColorNameEn(hsv.h)}, ${hsv.h} degrees`}
  aria-orientation="horizontal"
  aria-disabled={disabled}
/>

// Area (decorative)
<div
  data-color-wheel-area
  aria-hidden="true"
/>

// AreaThumb
<div
  data-color-wheel-area-thumb
  role="slider"
  tabIndex={0}
  aria-label="Saturation and brightness"
  aria-valuetext={`Saturation ${hsv.s}%, brightness ${hsv.v}%`}
  aria-disabled={disabled}
/>

// AlphaSlider
<div
  data-color-wheel-alpha-slider
  role="slider"
  tabIndex={0}
  aria-label="Opacity"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={alpha}
  aria-valuetext={`${alpha}%`}
  aria-orientation="horizontal"
  aria-disabled={disabled}
/>

// HexInput
<input
  data-color-wheel-hex-input
  type="text"
  aria-label="Hexadecimal color code"
  aria-invalid={!isValidHex(inputValue)}
  aria-describedby="hex-input-hint"
/>
<span id="hex-input-hint" className="sr-only">
  Enter a 6-digit hexadecimal number starting with #
</span>

// Swatch
<div
  data-color-wheel-swatch
  role="img"
  aria-label={`Current color: ${hex}`}
/>
```

### Focus Management

```tsx
// Manage focusable elements in Root
function Root({ children }) {
  const rootRef = useRef<HTMLDivElement>(null)
  
  // Allow external focus
  useImperativeHandle(ref, () => ({
    focus: () => {
      // Focus on first focusable element (HueThumb)
      const firstFocusable = rootRef.current?.querySelector('[tabindex="0"]')
      ;(firstFocusable as HTMLElement)?.focus()
    }
  }))

  return (
    <div ref={rootRef} data-color-wheel-root>
      {children}
    </div>
  )
}
```

---

## ファイル構成

```
src/
├── index.ts                      # エクスポート
├── types.ts                      # 型定義
├── styles.css                    # デフォルトスタイル
│
├── context/
│   └── ColorWheelContext.tsx     # Context定義
│
├── components/
│   ├── Root.tsx
│   ├── Wheel.tsx
│   ├── HueRing.tsx
│   ├── HueThumb.tsx
│   ├── Area.tsx
│   ├── AreaThumb.tsx
│   ├── AlphaSlider.tsx
│   ├── HexInput.tsx
│   ├── Swatch.tsx
│   ├── CopyButton.tsx
│   └── PasteButton.tsx
│
├── hooks/
│   ├── useDrag.ts
│   └── useColorWheel.ts
│
├── utils/
│   ├── hsvToHex.ts
│   ├── hexToHsv.ts
│   ├── hsvToHex8.ts
│   ├── getHueFromPosition.ts
│   ├── getSVFromPosition.ts
│   ├── getColorName.ts
│   ├── getColorNameEn.ts
│   └── clamp.ts
│
├── presets/
│   └── Simple.tsx
│
├── stories/
│   └── ColorWheel.stories.tsx
│
└── test/
    ├── setup.ts
    └── __tests__/
        ├── hsvToHex.test.ts
        ├── hexToHsv.test.ts
        └── ColorWheel.test.tsx

e2e/
└── color-wheel.spec.ts
```

---

## 簡易版プリセット

For those who find it tedious to write Compound Components every time.

```tsx
// src/presets/Simple.tsx
export function ColorWheelSimple({
  value,
  defaultValue,
  onValueChange,
  size = 200,
  showHexInput = true,
  showSwatch = true,
  showCopyButton = true,
  showPasteButton = true,
  disabled,
  onCopy,
  onPaste,
  onPasteError,
}: ColorWheelSimpleProps) {
  return (
    <ColorWheel.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <ColorWheel.Wheel size={size}>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>
      {(showHexInput || showSwatch || showCopyButton || showPasteButton) && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
          {showSwatch && <ColorWheel.Swatch />}
          {showHexInput && <ColorWheel.HexInput />}
          {showCopyButton && (
            <ColorWheel.CopyButton onCopy={onCopy}>
              <CopyIcon />
            </ColorWheel.CopyButton>
          )}
          {showPasteButton && (
            <ColorWheel.PasteButton onPaste={onPaste} onError={onPasteError}>
              <PasteIcon />
            </ColorWheel.PasteButton>
          )}
        </div>
      )}
    </ColorWheel.Root>
  )
}
```

使用例:

```tsx
import { ColorWheelSimple } from '@usapopo/radix-color-wheel'

<ColorWheelSimple value={color} onValueChange={setColor} />
```

---

## エクスポート

```ts
// index.ts
export {
  Root,
  Wheel,
  HueRing,
  HueThumb,
  Area,
  AreaThumb,
  AlphaSlider,
  HexInput,
  Swatch,
  CopyButton,
  PasteButton,
} from './components'

export type {
  RootProps,
  WheelProps,
  HueRingProps,
  // ...
} from './types'

// presets
export { ColorWheelSimple } from './presets/Simple'
```

---

## 依存関係

```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "dependencies": {
    "@radix-ui/react-use-controllable-state": "^1.0.0"
  }
}
```

---

## 開発環境

### Vite

Build in library mode.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RadixColorWheel',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
```

### Tailwind CSS

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{ts,tsx}',
    './stories/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```css
/* src/styles.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

※ The library itself provides CSS variable-based styles, and Tailwind is used for demo/Storybook. Users can style freely with either Tailwind or vanilla CSS.

### ESLint

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### Prettier

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "jsxSingleQuote": false
}
```

### cspell

```json
// cspell.json
{
  "version": "0.2",
  "language": "en",
  "words": [
    "radix",
    "usapopo",
    "tanstack",
    "colorwheel",
    "hsv",
    "hsl",
    "rgba",
    "hexa",
    "conic",
    "saturation",
    "lightness",
    "tabindex",
    "focusable",
    "valuetext",
    "valuemin",
    "valuemax",
    "valuenow",
    "pointerdown",
    "pointermove",
    "pointerup",
    "controllable",
    "immutable",
    "readonly",
    "clamp"
  ],
  "ignorePaths": [
    "node_modules",
    "dist",
    "coverage",
    "*.min.js",
    "pnpm-lock.yaml"
  ]
}
```

### devDependencies

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "cspell": "^8.6.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.0",
    "prettier": "^3.2.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vite-plugin-dts": "^3.8.0"
  }
}
```

### package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write 'src/**/*.{ts,tsx,css}'",
    "format:check": "prettier --check 'src/**/*.{ts,tsx,css}'",
    "spell": "cspell 'src/**/*.{ts,tsx}'",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build",
    "check": "pnpm typecheck && pnpm lint && pnpm format:check && pnpm spell && pnpm test:run",
    "prepare": "husky",
    "prepublishOnly": "pnpm check && pnpm build"
  }
}
```

---

## CI/CD Configuration

### GitHub Actions Workflow

Automated tests on push. Verbose output is required for all test runs.

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Get pnpm store directory
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run TypeScript check
        run: pnpm typecheck

      - name: Run ESLint
        run: pnpm lint

      - name: Check Prettier formatting
        run: pnpm format:check

      - name: Run cspell
        run: pnpm spell

  unit-test:
    runs-on: ubuntu-latest
    needs: lint

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Get pnpm store directory
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Run unit tests with verbose output
        run: pnpm test:run -- --reporter=verbose

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 14

  e2e-test:
    runs-on: ubuntu-latest
    needs: unit-test
    container:
      image: mcr.microsoft.com/playwright:v1.42.0-jammy

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build library
        run: pnpm build

      - name: Build Storybook
        run: pnpm storybook:build

      - name: Run E2E tests with verbose output
        run: pnpm test:e2e -- --reporter=list
        env:
          HOME: /root

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  build:
    runs-on: ubuntu-latest
    needs: [lint, unit-test]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Get pnpm store directory
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build library
        run: pnpm build

      - name: Verify dist output
        run: |
          ls -la dist/
          test -f dist/index.js
          test -f dist/index.d.ts
```

### Pre-commit Hooks (Husky + lint-staged)

tsc, lint, Prettier, and spell check are required before every commit.

```json
// .lintstagedrc.json
{
  "src/**/*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "cspell --no-must-find-files"
  ],
  "src/**/*.css": [
    "prettier --write"
  ]
}
```

```bash
# .husky/pre-commit
pnpm typecheck
pnpm lint-staged
```

### Husky Setup Commands

```bash
# Initialize husky
pnpm add -D husky lint-staged
pnpm exec husky init

# Create pre-commit hook
echo "pnpm typecheck" > .husky/pre-commit
echo "pnpm lint-staged" >> .husky/pre-commit
chmod +x .husky/pre-commit
```

### Additional devDependencies for CI

```json
{
  "devDependencies": {
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  }
}
```

---

## Git Configuration Rules

### Commit User Configuration

Commits must use local default user. Claude-generated user signatures are prohibited.

```bash
# Verify local git user before committing
git config user.name   # Must return YOUR name, not "Claude" or AI-related names
git config user.email  # Must return YOUR email

# If not set, configure locally
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Commit Message Guidelines

- **No AI-generated signatures** in commit messages
- **No mention of Claude or AI** in commit messages
- Use conventional commits format

```bash
# Good commit messages
git commit -m "feat: add HueThumb keyboard navigation"
git commit -m "fix: correct HSV to HEX conversion for edge cases"
git commit -m "test: add unit tests for color conversion utils"
git commit -m "docs: update README with usage examples"
git commit -m "refactor: extract drag handling into useDrag hook"

# BAD commit messages (DO NOT USE)
git commit -m "feat: add feature (generated by Claude)"
git commit -m "fix: bug fix - Co-authored-by: Claude"
git commit --author="Claude <claude@anthropic.com>" -m "..."
```

### Conventional Commits Format

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no code change |
| `refactor:` | Code refactoring |
| `test:` | Adding or updating tests |
| `chore:` | Build, CI, dependencies |
| `perf:` | Performance improvement |

### .gitignore Additions

```gitignore
# Test output
coverage/
playwright-report/
test-results/

# Storybook build
storybook-static/

# IDE
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

---

## Testing

### Vitest (Unit Tests)

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.stories.tsx'],
    },
  },
})
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom'
```

Test targets:
- HSV ↔ HEX conversion accuracy
- Keyboard operations (arrow keys, Home/End)
- Drag operations (coordinate → hue/saturation/brightness conversion)
- Disabled state handling
- Value propagation via Context

```tsx
// src/utils/__tests__/hsvToHex.test.ts
import { describe, it, expect } from 'vitest'
import { hsvToHex } from '../hsvToHex'

describe('hsvToHex', () => {
  it('should convert red (0, 100, 100) to #ff0000', () => {
    expect(hsvToHex(0, 100, 100)).toBe('#ff0000')
  })

  it('should convert white (0, 0, 100) to #ffffff', () => {
    expect(hsvToHex(0, 0, 100)).toBe('#ffffff')
  })

  it('should convert black (0, 0, 0) to #000000', () => {
    expect(hsvToHex(0, 0, 0)).toBe('#000000')
  })

  it('should convert green (120, 100, 100) to #00ff00', () => {
    expect(hsvToHex(120, 100, 100)).toBe('#00ff00')
  })

  it('should convert blue (240, 100, 100) to #0000ff', () => {
    expect(hsvToHex(240, 100, 100)).toBe('#0000ff')
  })
})
```

```tsx
// src/utils/__tests__/hexToHsv.test.ts
import { describe, it, expect } from 'vitest'
import { hexToHsv } from '../hexToHsv'

describe('hexToHsv', () => {
  it('should convert #ff0000 to red (0, 100, 100)', () => {
    expect(hexToHsv('#ff0000')).toEqual({ h: 0, s: 100, v: 100 } as const)
  })

  it('should convert #ffffff to white (0, 0, 100)', () => {
    expect(hexToHsv('#ffffff')).toEqual({ h: 0, s: 0, v: 100 } as const)
  })

  it('should convert #000000 to black (0, 0, 0)', () => {
    expect(hexToHsv('#000000')).toEqual({ h: 0, s: 0, v: 0 } as const)
  })

  it('should handle lowercase hex values', () => {
    expect(hexToHsv('#ff0000')).toEqual({ h: 0, s: 100, v: 100 } as const)
  })

  it('should handle uppercase hex values', () => {
    expect(hexToHsv('#FF0000')).toEqual({ h: 0, s: 100, v: 100 } as const)
  })
})
```

```tsx
// src/test/__tests__/ColorWheel.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as ColorWheel from '../../components'

describe('ColorWheel', () => {
  it('should render without crashing', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )
    expect(screen.getByRole('slider', { name: /hue/i })).toBeInTheDocument()
  })

  it('should call onValueChange when hue is changed via keyboard', async () => {
    const onValueChange = vi.fn()
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    hueThumb.focus()
    await userEvent.keyboard('{ArrowRight}')
    
    expect(onValueChange).toHaveBeenCalled()
  })

  it('should disable all interactions when disabled prop is true', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    expect(hueThumb).toHaveAttribute('aria-disabled', 'true')
  })
})
```

### Playwright (E2E Tests)

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
  },
})
```

Test targets:
- Color selection via mouse drag
- Drag via touch operation
- Cross-browser functionality
- Accessibility (axe-core)

```ts
// e2e/color-wheel.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('ColorWheel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=colorwheel--default')
  })

  test('should change color when dragging on hue ring', async ({ page }) => {
    const hueThumb = page.getByRole('slider', { name: /hue/i })
    const box = await hueThumb.boundingBox()
    
    // Drag operation
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + 50, box!.y + 50)
    await page.mouse.up()

    // Verify color changed (e.g., check Swatch background color)
  })

  test('should update hue value when pressing arrow keys', async ({ page }) => {
    const hueThumb = page.getByRole('slider', { name: /hue/i })
    await hueThumb.focus()
    
    const initialValue = await hueThumb.getAttribute('aria-valuenow')
    await page.keyboard.press('ArrowRight')
    const newValue = await hueThumb.getAttribute('aria-valuenow')
    
    expect(Number(newValue)).toBe(Number(initialValue) + 1)
  })

  test('should have no accessibility violations', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
})
```

### Storybook

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
```

```ts
// .storybook/preview.ts
import type { Preview } from '@storybook/react'
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

```tsx
// src/stories/ColorWheel.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import * as ColorWheel from '../'

const meta: Meta = {
  title: 'Components/ColorWheel',
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj = {
  render: () => {
    const [color, setColor] = useState('#3b82f6')
    return (
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )
  },
}

export const WithHexInput: StoryObj = {
  render: () => {
    const [color, setColor] = useState('#ef4444')
    return (
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
        <div className="flex items-center gap-2 mt-4">
          <ColorWheel.Swatch className="w-10 h-10 rounded border" />
          <ColorWheel.HexInput className="flex-1 px-2 py-1 border rounded" />
        </div>
      </ColorWheel.Root>
    )
  },
}

export const WithAlphaSlider: StoryObj = {
  render: () => {
    const [color, setColor] = useState('#22c55e')
    return (
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <ColorWheel.Wheel size={250}>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
        <ColorWheel.AlphaSlider className="mt-4" />
        <div className="flex items-center gap-2 mt-2">
          <ColorWheel.Swatch className="w-10 h-10 rounded border" />
          <ColorWheel.HexInput className="flex-1 px-2 py-1 border rounded" />
        </div>
      </ColorWheel.Root>
    )
  },
}

export const Disabled: StoryObj = {
  render: () => (
    <ColorWheel.Root value="#9333ea" onValueChange={() => {}} disabled>
      <ColorWheel.Wheel>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>
    </ColorWheel.Root>
  ),
}

export const CustomSize: StoryObj = {
  render: () => {
    const [color, setColor] = useState('#f97316')
    return (
      <div className="flex gap-8">
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Wheel size={150} ringWidth={16}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Wheel size={300} ringWidth={28}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      </div>
    )
  },
}
```

### テスト関連 devDependencies

```json
{
  "devDependencies": {
    "@axe-core/playwright": "^4.8.0",
    "@playwright/test": "^1.42.0",
    "@storybook/addon-a11y": "^8.0.0",
    "@storybook/addon-essentials": "^8.0.0",
    "@storybook/addon-interactions": "^8.0.0",
    "@storybook/addon-links": "^8.0.0",
    "@storybook/react": "^8.0.0",
    "@storybook/react-vite": "^8.0.0",
    "@storybook/test": "^8.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^14.2.0",
    "@testing-library/user-event": "^14.5.0",
    "@vitest/coverage-v8": "^1.3.0",
    "jsdom": "^24.0.0",
    "vitest": "^1.3.0"
  }
}
```

---

## 実装優先度

1. **Phase 1（MVP）**
   - Root, Wheel, HueRing, HueThumb, Area, AreaThumb
   - 基本的なPointer Events
   - HSV ↔ HEX変換

2. **Phase 2**
   - HexInput
   - Swatch
   - キーボード操作

3. **Phase 3**
   - AlphaSlider
   - CSS変数カスタマイズ
   - ColorWheelSimple プリセット

4. **Phase 4**
   - Complete ARIA attribute support
   - ドキュメント・README
