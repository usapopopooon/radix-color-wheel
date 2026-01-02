import { useState, useCallback, useMemo, useId } from 'react'
import { Primitive } from '@radix-ui/react-primitive'
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
 * Supports asChild pattern for custom input components (e.g., shadcn/ui Input).
 *
 * @param props - Component props
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 * @param props.placeholder - Placeholder text
 * @param props.asChild - When true, renders child element instead of default input
 * @param props.children - Child element for asChild mode
 *
 * @example
 * ```tsx
 * // Default usage
 * <ColorWheel.HexInput className="mt-2 px-2 py-1 border rounded" />
 *
 * // With asChild and shadcn/ui Input
 * <ColorWheel.HexInput asChild>
 *   <Input placeholder="#000000" />
 * </ColorWheel.HexInput>
 * ```
 */
export function HexInput({
  className,
  style,
  placeholder = '#000000',
  asChild = false,
  children,
}: HexInputProps): React.ReactElement {
  const { hex, setHex, disabled } = useColorWheelContext()
  const hintId = useId()

  // Local state for editing
  const [isEditing, setIsEditing] = useState(false)
  const [editingValue, setEditingValue] = useState('')

  // Display value: show editing value when editing, otherwise show hex from context
  const displayValue = isEditing ? editingValue : hex

  // Check if current input is valid
  const isValid = useMemo(() => isValidHex(normalizeHex(displayValue)), [displayValue])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingValue(e.target.value)
  }, [])

  const handleFocus = useCallback(() => {
    setEditingValue(hex)
    setIsEditing(true)
  }, [hex])

  const commitValue = useCallback(() => {
    const normalized = normalizeHex(editingValue)
    if (isValidHex(normalized)) {
      setHex(normalized)
    }
    setIsEditing(false)
  }, [editingValue, setHex])

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
        ;(e.target as HTMLInputElement).blur()
      }
    },
    [commitValue]
  )

  const inputStyle: React.CSSProperties = useMemo(
    () => ({
      fontFamily: 'monospace',
      backgroundColor: 'var(--cw-input-bg)',
      color: 'var(--cw-input-text)',
      borderColor: 'var(--cw-input-border)',
      ...style,
    }),
    [style]
  )

  return (
    <>
      <Primitive.input
        type="text"
        data-color-wheel-hex-input
        className={className}
        style={inputStyle}
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Hexadecimal color code"
        aria-invalid={!isValid}
        aria-describedby={hintId}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        asChild={asChild}
      >
        {asChild ? children : undefined}
      </Primitive.input>
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
