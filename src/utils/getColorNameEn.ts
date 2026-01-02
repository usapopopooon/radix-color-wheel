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
