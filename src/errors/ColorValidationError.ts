import type { ZodIssue } from 'zod'

/**
 * Error thrown when color validation fails
 *
 * @example
 * ```ts
 * try {
 *   hexToRgb('invalid')
 * } catch (error) {
 *   if (error instanceof ColorValidationError) {
 *     console.log(error.functionName)  // 'hexToRgb'
 *     console.log(error.receivedValue) // 'invalid'
 *     console.log(error.issues)        // Zod validation issues
 *   }
 * }
 * ```
 */
export class ColorValidationError extends Error {
  /** The name of the function that threw the error */
  readonly functionName: string

  /** The value that failed validation */
  readonly receivedValue: unknown

  /** Zod validation issues (if available) */
  readonly issues: ZodIssue[]

  constructor(options: {
    functionName: string
    message: string
    receivedValue: unknown
    issues?: ZodIssue[]
  }) {
    super(
      `[${options.functionName}] ${options.message}. Received: ${formatValue(options.receivedValue)}`
    )
    this.name = 'ColorValidationError'
    this.functionName = options.functionName
    this.receivedValue = options.receivedValue
    this.issues = options.issues ?? []

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ColorValidationError)
    }
  }
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    return `"${value}"`
  }
  return JSON.stringify(value)
}
