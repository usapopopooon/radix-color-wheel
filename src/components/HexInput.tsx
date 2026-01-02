import { useState, useCallback, useMemo, useId } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'
import { isValidHex6, normalizeHex } from '../utils'
import type { HexInputProps } from '../types'

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
 * <ColorWheel.HexInput className="w-24" />
 * ```
 */
export function HexInput({
  className,
  style,
  placeholder = '#000000',
}: HexInputProps): React.ReactElement {
  const { hex, setHex, disabled } = useColorWheelContext()
  const hintId = useId()

  // Local state for editing
  const [isEditing, setIsEditing] = useState(false)
  const [editingValue, setEditingValue] = useState('')

  // Display value: show editing value when editing, otherwise show hex from context
  const displayValue = isEditing ? editingValue : hex

  // Check if current input is valid
  const isValid = useMemo(() => isValidHex6(normalizeHex(displayValue)), [displayValue])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingValue(e.target.value)
  }, [])

  const handleFocus = useCallback(() => {
    setEditingValue(hex)
    setIsEditing(true)
  }, [hex])

  const commitValue = useCallback(() => {
    const normalized = normalizeHex(editingValue)
    if (isValidHex6(normalized)) {
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

  return (
    <>
      <Input
        type="text"
        data-color-wheel-hex-input
        className={cn('w-24 font-mono', className)}
        style={style}
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
