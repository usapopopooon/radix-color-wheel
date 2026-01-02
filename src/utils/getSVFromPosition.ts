/**
 * Calculate saturation and value from coordinates
 *
 * Calculates saturation and value from mouse/touch position within the SV selection area.
 * Left edge is saturation 0, right edge is saturation 100.
 * Top edge is value 100, bottom edge is value 0.
 *
 * @param x - X coordinate (relative position from area left edge)
 * @param y - Y coordinate (relative position from area top edge)
 * @param areaSize - Size of the area (width/height)
 * @returns Saturation and value object (0-100)
 *
 * @example
 * ```ts
 * // Top-right corner (full saturation, full brightness)
 * getSVFromPosition(100, 0, 100) // => { s: 100, v: 100 }
 * // Bottom-left corner (no saturation, no brightness)
 * getSVFromPosition(0, 100, 100) // => { s: 0, v: 0 }
 * // Center
 * getSVFromPosition(50, 50, 100) // => { s: 50, v: 50 }
 * ```
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
