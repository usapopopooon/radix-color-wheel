import { Root } from '../components/Root'
import { Wheel } from '../components/Wheel'
import { HueRing } from '../components/HueRing'
import { HueThumb } from '../components/HueThumb'
import { Area } from '../components/Area'
import { AreaThumb } from '../components/AreaThumb'
import { HexInput } from '../components/HexInput'
import { Swatch } from '../components/Swatch'
import { CopyButton } from '../components/CopyButton'
import { PasteButton } from '../components/PasteButton'
import type { ColorWheelSimpleProps } from '../types'

const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const PasteIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z" />
    <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M15 12h5" />
    <path d="m18 9 3 3-3 3" />
  </svg>
)

export function ColorWheelSimple({
  value,
  defaultValue,
  onValueChange,
  size = 200,
  showHexInput = true,
  showSwatch = true,
  showCopyButton = true,
  showPasteButton = true,
  disabled,
  onCopy,
  onPaste,
  onPasteError,
}: ColorWheelSimpleProps): React.ReactElement {
  return (
    <Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Wheel size={size}>
        <HueRing />
        <HueThumb />
        <Area />
        <AreaThumb />
      </Wheel>
      {(showHexInput || showSwatch || showCopyButton || showPasteButton) && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
          {showSwatch && (
            <Swatch
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                border: '1px solid var(--cw-swatch-border)',
                flexShrink: 0,
              }}
            />
          )}
          {showHexInput && (
            <HexInput
              style={{
                width: 80,
                padding: '2px 4px',
                border: '1px solid var(--cw-input-border)',
                borderRadius: 4,
                fontSize: 14,
              }}
            />
          )}
          {showCopyButton && (
            <CopyButton
              onCopy={onCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                padding: 0,
                border: '1px solid var(--cw-input-border)',
                borderRadius: 4,
                backgroundColor: 'var(--cw-input-bg)',
                color: 'var(--cw-input-text)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <CopyIcon />
            </CopyButton>
          )}
          {showPasteButton && (
            <PasteButton
              onPaste={onPaste}
              onError={onPasteError}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                padding: 0,
                border: '1px solid var(--cw-input-border)',
                borderRadius: 4,
                backgroundColor: 'var(--cw-input-bg)',
                color: 'var(--cw-input-text)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <PasteIcon />
            </PasteButton>
          )}
        </div>
      )}
    </Root>
  )
}
