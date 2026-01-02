import { forwardRef, useCallback } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { Button } from './ui/button'
import type { CopyButtonProps } from '../types'

/**
 * CopyButton component - Copies the current color to clipboard
 *
 * @param props - Component props
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 * @param props.onCopy - Callback after copy (receives the copied hex value)
 * @param props.asChild - When true, renders child element instead of default button
 * @param props.children - Child elements (icon, text, etc.)
 *
 * @example
 * ```tsx
 * <ColorWheel.CopyButton onCopy={() => toast('Copied!')}>
 *   <CopyIcon />
 * </ColorWheel.CopyButton>
 * ```
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ className, style, onCopy, asChild = false, children, ...props }, ref) => {
    const { hex, disabled } = useColorWheelContext()

    const handleClick = useCallback(async () => {
      if (disabled) return
      await navigator.clipboard.writeText(hex.toUpperCase())
      onCopy?.(hex.toUpperCase())
    }, [hex, disabled, onCopy])

    return (
      <Button
        ref={ref}
        type="button"
        variant="outline"
        data-color-wheel-copy-button
        className={className}
        style={style}
        disabled={disabled}
        onClick={handleClick}
        aria-label="Copy color"
        asChild={asChild}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

CopyButton.displayName = 'CopyButton'
