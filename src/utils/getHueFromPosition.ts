/**
 * Calculate hue from coordinates
 *
 * Calculates angle on hue ring from mouse/touch position,
 * converting to hue value 0-360.
 *
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @param hueOffset - Offset angle in degrees (default: -90, which places red at 12 o'clock)
 * @returns Hue value (0-360)
 *
 * @example
 * ```ts
 * // At 12 o'clock position (top center) with default offset
 * getHueFromPosition(100, 0, 100, 100) // => 0
 * // At 3 o'clock position (right center) with default offset
 * getHueFromPosition(200, 100, 100, 100) // => 90
 * ```
 */
export function getHueFromPosition(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  hueOffset: number = -90
): number {
  // Formula: theta = atan2(y - cy, x - cx)
  // atan2 returns -pi to pi, so convert to 0-360
  // Subtract hueOffset to convert from visual angle to hue value
  //
  // hue = ((theta × 180 / pi) - hueOffset + 360) mod 360
  const angle = Math.atan2(y - centerY, x - centerX)
  const hue = ((angle * 180) / Math.PI - hueOffset + 360) % 360
  return hue
}
