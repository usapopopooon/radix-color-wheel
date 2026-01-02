import { forwardRef, useCallback } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { Button } from './ui/button'
import { isValidHex, normalizeHex } from '../utils'
import type { PasteButtonProps } from '../types'

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
export const PasteButton = forwardRef<HTMLButtonElement, PasteButtonProps>(
  ({ className, style, onPaste, onError, asChild = false, children, ...props }, ref) => {
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
        ref={ref}
        type="button"
        variant="outline"
        data-color-wheel-paste-button
        className={className}
        style={style}
        disabled={disabled}
        onClick={handleClick}
        aria-label="Paste color"
        asChild={asChild}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

PasteButton.displayName = 'PasteButton'
