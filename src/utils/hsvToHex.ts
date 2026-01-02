/**
 * Convert HSV color space to HEX format
 *
 * HSV to RGB conversion algorithm:
 * https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB
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
  // Normalize: s, v to 0-1 range
  const sNorm = s / 100
  const vNorm = v / 100

  // Formula:
  // C = V × S          (chroma)
  // X = C × (1 - |H/60 mod 2 - 1|)  (intermediate value)
  // m = V - C          (brightness offset)
  const c = vNorm * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = vNorm - c

  // Determine R', G', B' based on hue
  // H ∈ [0, 60):   (R', G', B') = (C, X, 0)
  // H ∈ [60, 120): (R', G', B') = (X, C, 0)
  // H ∈ [120, 180): (R', G', B') = (0, C, X)
  // H ∈ [180, 240): (R', G', B') = (0, X, C)
  // H ∈ [240, 300): (R', G', B') = (X, 0, C)
  // H ∈ [300, 360): (R', G', B') = (C, 0, X)
  let r = 0,
    g = 0,
    b = 0

  if (h < 60) {
    r = c
    g = x
    b = 0
  } else if (h < 120) {
    r = x
    g = c
    b = 0
  } else if (h < 180) {
    r = 0
    g = c
    b = x
  } else if (h < 240) {
    r = 0
    g = x
    b = c
  } else if (h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }

  // Final value: (R, G, B) = ((R' + m) × 255, (G' + m) × 255, (B' + m) × 255)
  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
