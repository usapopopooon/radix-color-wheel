import { useCallback } from 'react'
import { Primitive } from '@radix-ui/react-primitive'
import { useColorWheelContext } from '../context/ColorWheelContext'
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
export function CopyButton({
  className,
  style,
  onCopy,
  asChild = false,
  children,
}: CopyButtonProps): React.ReactElement {
  const { hex, disabled } = useColorWheelContext()

  const handleClick = useCallback(async () => {
    if (disabled) return
    await navigator.clipboard.writeText(hex.toUpperCase())
    onCopy?.(hex.toUpperCase())
  }, [hex, disabled, onCopy])

  return (
    <Primitive.button
      type="button"
      data-color-wheel-copy-button
      className={className}
      style={style}
      disabled={disabled}
      onClick={handleClick}
      aria-label="Copy color"
      asChild={asChild}
    >
      {children}
    </Primitive.button>
  )
}
