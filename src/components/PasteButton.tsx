import { useCallback } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { Button } from './ui/button'
import type { PasteButtonProps } from '../types'

/**
 * Validate if a string is a valid HEX color (6 or 8 digits)
 */
function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value)
}

/**
 * Normalize HEX input value
 */
function normalizeHex(value: string): string {
  let normalized = value.trim()
  if (!normalized.startsWith('#')) {
    normalized = '#' + normalized
  }
  return normalized.toLowerCase()
}

/**
 * PasteButton component - Pastes color from clipboard
 *
 * @param props - Component props
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 * @param props.onPaste - Callback after successful paste (receives the pasted hex value)
 * @param props.onError - Callback when paste fails (invalid format)
 * @param props.asChild - When true, renders child element instead of default button
 * @param props.children - Child elements (icon, text, etc.)
 *
 * @example
 * ```tsx
 * <ColorWheel.PasteButton
 *   onPaste={() => toast('Pasted!')}
 *   onError={() => toast.error('Invalid color format')}
 * >
 *   <PasteIcon />
 * </ColorWheel.PasteButton>
 * ```
 */
export function PasteButton({
  className,
  style,
  onPaste,
  onError,
  asChild = false,
  children,
}: PasteButtonProps): React.ReactElement {
  const { setHex, disabled } = useColorWheelContext()

  const handleClick = useCallback(async () => {
    if (disabled) return
    try {
      const text = await navigator.clipboard.readText()
      const normalized = normalizeHex(text)
      if (isValidHex(normalized)) {
        setHex(normalized)
        onPaste?.(normalized)
      } else {
        onError?.()
      }
    } catch {
      onError?.()
    }
  }, [disabled, setHex, onPaste, onError])

  return (
    <Button
      type="button"
      variant="outline"
      data-color-wheel-paste-button
      className={className}
      style={style}
      disabled={disabled}
      onClick={handleClick}
      aria-label="Paste color"
      asChild={asChild}
    >
      {children}
    </Button>
  )
}
