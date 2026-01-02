import { useCallback } from 'react'

export interface UseSliderKeyboardOptions {
  /** Current value */
  value: number
  /** Minimum value */
  min: number
  /** Maximum value */
  max: number
  /** Step size for normal key press */
  step?: number
  /** Step size for Shift+key (defaults to step * 10) */
  largeStep?: number
  /** Whether the slider is disabled */
  disabled?: boolean
  /** Callback to set the new value */
  onChange: (value: number) => void
  /** Whether value wraps around (for hue: 0-360) */
  wrap?: boolean
  /** Value to set when Home key is pressed (e.g., 1.0 for gamma) */
  resetValue?: number
}

/**
 * Hook for common slider keyboard navigation.
 *
 * Supports:
 * - Arrow keys and WASD for increment/decrement
 * - Shift modifier for large steps
 * - Alt modifier to jump to min/max
 *
 * @param options - Keyboard slider options
 * @returns Keyboard event handler
 */
export function useSliderKeyboard(options: UseSliderKeyboardOptions) {
  const {
    value,
    min,
    max,
    step = 1,
    largeStep = step * 10,
    disabled = false,
    onChange,
    wrap = false,
    resetValue,
  } = options

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      const currentStep = e.shiftKey ? largeStep : step

      const increment = (delta: number) => {
        if (wrap) {
          // Wrap around (e.g., hue 0-360)
          const range = max - min
          onChange(((value - min + delta + range) % range) + min)
        } else {
          // Clamp to range
          onChange(Math.max(min, Math.min(max, value + delta)))
        }
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'a':
        case 's':
          e.preventDefault()
          if (e.altKey) {
            onChange(min)
          } else {
            increment(-currentStep)
          }
          break
        case 'ArrowRight':
        case 'ArrowUp':
        case 'd':
        case 'w':
          e.preventDefault()
          if (e.altKey) {
            onChange(wrap ? max - 1 : max)
          } else {
            increment(currentStep)
          }
          break
        case 'Home':
          if (resetValue !== undefined) {
            e.preventDefault()
            onChange(resetValue)
          }
          break
      }
    },
    [disabled, value, min, max, step, largeStep, onChange, wrap, resetValue]
  )

  return handleKeyDown
}
