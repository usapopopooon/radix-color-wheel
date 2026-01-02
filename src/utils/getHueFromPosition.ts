/**
 * Calculate hue from coordinates
 *
 * Calculates angle on hue ring from mouse/touch position,
 * converting to hue value 0-360. 12 o'clock position is 0 degrees, clockwise.
 *
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @returns Hue value (0-360)
 *
 * @example
 * ```ts
 * // At 12 o'clock position (top center)
 * getHueFromPosition(100, 0, 100, 100) // => 0
 * // At 3 o'clock position (right center)
 * getHueFromPosition(200, 100, 100, 100) // => 90
 * ```
 */
export function getHueFromPosition(
  x: number,
  y: number,
  centerX: number,
  centerY: number
): number {
  // Formula: theta = atan2(y - cy, x - cx)
  // atan2 returns -pi to pi, so convert to 0-360
  // Add 90 degrees to make 12 o'clock position as 0 degrees (clockwise)
  //
  // hue = ((theta × 180 / pi) + 90 + 360) mod 360
  const angle = Math.atan2(y - centerY, x - centerX)
  const hue = ((angle * 180) / Math.PI + 90 + 360) % 360
  return hue
}
