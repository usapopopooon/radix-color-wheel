/**
 * Clamp a value between min and max
 *
 * @param value - The value to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped value
 *
 * @example
 * ```ts
 * clamp(150, 0, 100) // => 100
 * clamp(-10, 0, 100) // => 0
 * clamp(50, 0, 100)  // => 50
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
