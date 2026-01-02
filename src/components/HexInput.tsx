import { useState, useCallback, useEffect, useMemo, useId } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import type { HexInputProps } from '../types'

/**
 * Validate if a string is a valid HEX color
 *
 * @param value - The string to validate
 * @returns true if valid HEX color format
 */
function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value)
}

/**
 * Normalize HEX input value
 *
 * Adds # prefix if missing and converts to lowercase
 *
 * @param value - The input value
 * @returns Normalized HEX string
 */
function normalizeHex(value: string): string {
  let normalized = value.trim()
  if (!normalized.startsWith('#')) {
    normalized = '#' + normalized
  }
  return normalized.toLowerCase()
}

/**
 * HexInput component - Text field for direct HEX value input
 *
 * Allows users to type a HEX color code directly.
 * Validates input and updates the color on Enter or blur.
 *
 * @param props - Component props
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 * @param props.placeholder - Placeholder text
 *
 * @example
 * ```tsx
 * <ColorWheel.Root value={color} onValueChange={setColor}>
 *   <ColorWheel.Wheel>...</ColorWheel.Wheel>
 *   <ColorWheel.HexInput className="mt-2 px-2 py-1 border rounded" />
 * </ColorWheel.Root>
 * ```
 */
export function HexInput({
  className,
  style,
  placeholder = '#000000',
}: HexInputProps): React.ReactElement {
  const { hex, setHex, disabled } = useColorWheelContext()
  const hintId = useId()

  // Local state for input value (allows invalid intermediate states)
  const [inputValue, setInputValue] = useState(hex)
  const [isEditing, setIsEditing] = useState(false)

  // Sync input value with context when not editing
  useEffect(() => {
    if (!isEditing) {
      setInputValue(hex)
    }
  }, [hex, isEditing])

  // Check if current input is valid
  const isValid = useMemo(() => isValidHex(normalizeHex(inputValue)), [inputValue])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleFocus = useCallback(() => {
    setIsEditing(true)
  }, [])

  const commitValue = useCallback(() => {
    setIsEditing(false)
    const normalized = normalizeHex(inputValue)
    if (isValidHex(normalized)) {
      setHex(normalized)
      setInputValue(normalized)
    } else {
      // Revert to current context value on invalid input
      setInputValue(hex)
    }
  }, [inputValue, hex, setHex])

  const handleBlur = useCallback(() => {
    commitValue()
  }, [commitValue])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        commitValue()
        ;(e.target as HTMLInputElement).blur()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setIsEditing(false)
        setInputValue(hex)
        ;(e.target as HTMLInputElement).blur()
      }
    },
    [commitValue, hex]
  )

  const inputStyle: React.CSSProperties = useMemo(
    () => ({
      fontFamily: 'monospace',
      ...style,
    }),
    [style]
  )

  return (
    <>
      <input
        type="text"
        data-color-wheel-hex-input
        className={className}
        style={inputStyle}
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Hexadecimal color code"
        aria-invalid={!isValid}
        aria-describedby={hintId}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      <span
        id={hintId}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Enter a 6-digit hexadecimal color code starting with #
      </span>
    </>
  )
}
