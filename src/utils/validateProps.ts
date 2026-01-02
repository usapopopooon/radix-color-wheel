import { hexOrHex8Schema, alphaSchema } from '../schemas'

/**
 * Validate props in development mode and log warnings
 * In production, this is a no-op for performance
 */
export function validateRootProps(props: {
  value?: string
  defaultValue?: string
  alpha?: number
  defaultAlpha?: number
}): void {
  if (process.env.NODE_ENV === 'production') return

  const { value, defaultValue, alpha, defaultAlpha } = props

  // Validate value
  if (value !== undefined) {
    const result = hexOrHex8Schema.safeParse(value)
    if (!result.success) {
      console.warn(
        `[ColorWheel] Invalid "value" prop: ${result.error.issues[0]?.message}. Received: "${value}"`
      )
    }
  }

  // Validate defaultValue
  if (defaultValue !== undefined) {
    const result = hexOrHex8Schema.safeParse(defaultValue)
    if (!result.success) {
      console.warn(
        `[ColorWheel] Invalid "defaultValue" prop: ${result.error.issues[0]?.message}. Received: "${defaultValue}"`
      )
    }
  }

  // Validate alpha
  if (alpha !== undefined) {
    const result = alphaSchema.safeParse(alpha)
    if (!result.success) {
      console.warn(
        `[ColorWheel] Invalid "alpha" prop: ${result.error.issues[0]?.message}. Received: ${alpha}`
      )
    }
  }

  // Validate defaultAlpha
  if (defaultAlpha !== undefined) {
    const result = alphaSchema.safeParse(defaultAlpha)
    if (!result.success) {
      console.warn(
        `[ColorWheel] Invalid "defaultAlpha" prop: ${result.error.issues[0]?.message}. Received: ${defaultAlpha}`
      )
    }
  }
}
