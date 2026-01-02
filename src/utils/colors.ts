/**
 * Common color constants used across slider and wheel components.
 * Centralizing these values makes theming and maintenance easier.
 */

/** Standard black color */
export const COLOR_BLACK = '#000000'

/** Standard white color */
export const COLOR_WHITE = '#ffffff'

/** Transparent keyword */
export const COLOR_TRANSPARENT = 'transparent'

/**
 * Gamma slider gradient colors.
 * Represents the visual range from darkened (low gamma) to brightened (high gamma).
 */
export const GAMMA_GRADIENT = {
  DARK: '#1a1a1a',
  MID: '#808080',
  LIGHT: '#e0e0e0',
} as const

/**
 * Grayscale range for gamma thumb color.
 * Maps gamma value to a grayscale color for visual feedback.
 */
export const GAMMA_THUMB_GRAY = {
  MIN: 28,
  MAX: 228,
} as const

/**
 * Checkerboard pattern for alpha/transparency backgrounds.
 * Creates a standard transparency indicator pattern.
 */
export const CHECKERBOARD = {
  /** Color for the checkerboard squares */
  COLOR: '#ccc',
  /** Size of each checker square */
  SIZE: 8,
  /** CSS background-image for checkerboard pattern */
  BACKGROUND_IMAGE: `
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%)
  `,
  /** CSS background-size for checkerboard pattern */
  BACKGROUND_SIZE: '8px 8px',
  /** CSS background-position for checkerboard pattern */
  BACKGROUND_POSITION: '0 0, 0 4px, 4px -4px, -4px 0',
} as const

/**
 * Creates CSS properties for a checkerboard transparency pattern.
 * Used for alpha sliders and color swatches.
 */
export function getCheckerboardStyle(): React.CSSProperties {
  return {
    backgroundImage: CHECKERBOARD.BACKGROUND_IMAGE,
    backgroundSize: CHECKERBOARD.BACKGROUND_SIZE,
    backgroundPosition: CHECKERBOARD.BACKGROUND_POSITION,
  }
}
