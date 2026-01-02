import type { Meta, StoryFn } from '@storybook/react-vite'
import { useState } from 'react'
import * as ColorWheel from '../components'

const meta = {
  title: 'Components/ClipboardButtons',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta

export const CopyButton: StoryFn = () => {
  const [color, setColor] = useState('#3b82f6')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ColorWheel.Swatch
          style={{ width: 40, height: 40, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <ColorWheel.HexInput
          style={{
            width: 100,
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        />
        <ColorWheel.CopyButton
          style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Copy
        </ColorWheel.CopyButton>
      </div>
      <p style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
        Click "Copy" to copy the color to clipboard
      </p>
    </ColorWheel.Root>
  )
}

export const PasteButton: StoryFn = () => {
  const [color, setColor] = useState('#ef4444')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ColorWheel.Swatch
          style={{ width: 40, height: 40, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <ColorWheel.HexInput
          style={{
            width: 100,
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        />
        <ColorWheel.PasteButton
          style={{
            padding: '8px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Paste
        </ColorWheel.PasteButton>
      </div>
      <p style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
        Copy a hex color and click "Paste" to apply it
      </p>
    </ColorWheel.Root>
  )
}

/**
 * Both buttons together for a complete workflow.
 */
export const CopyAndPaste: StoryFn = () => {
  const [color, setColor] = useState('#8b5cf6')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ColorWheel.Swatch
          style={{ width: 40, height: 40, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <ColorWheel.HexInput
          style={{
            width: 100,
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        />
        <ColorWheel.CopyButton
          style={{
            padding: '8px 12px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Copy
        </ColorWheel.CopyButton>
        <ColorWheel.PasteButton
          style={{
            padding: '8px 12px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Paste
        </ColorWheel.PasteButton>
      </div>
    </ColorWheel.Root>
  )
}

/**
 * Icon-only buttons for compact layouts.
 */
export const IconButtons: StoryFn = () => {
  const [color, setColor] = useState('#f97316')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ColorWheel.Swatch
          style={{ width: 40, height: 40, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <ColorWheel.HexInput
          style={{
            width: 100,
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        />
        <ColorWheel.CopyButton
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f3f4f6',
            border: '1px solid #ccc',
            borderRadius: 4,
            cursor: 'pointer',
          }}
          aria-label="Copy color"
        >
          📋
        </ColorWheel.CopyButton>
        <ColorWheel.PasteButton
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f3f4f6',
            border: '1px solid #ccc',
            borderRadius: 4,
            cursor: 'pointer',
          }}
          aria-label="Paste color"
        >
          📥
        </ColorWheel.PasteButton>
      </div>
    </ColorWheel.Root>
  )
}

/**
 * Disabled state for buttons.
 */
export const Disabled: StoryFn = () => {
  const [color, setColor] = useState('#06b6d4')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor} disabled>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ColorWheel.Swatch
          style={{ width: 40, height: 40, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <ColorWheel.HexInput
          style={{
            width: 100,
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: 4,
            opacity: 0.5,
          }}
        />
        <ColorWheel.CopyButton
          style={{
            padding: '8px 12px',
            background: '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'not-allowed',
            opacity: 0.5,
          }}
        >
          Copy
        </ColorWheel.CopyButton>
        <ColorWheel.PasteButton
          style={{
            padding: '8px 12px',
            background: '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'not-allowed',
            opacity: 0.5,
          }}
        >
          Paste
        </ColorWheel.PasteButton>
      </div>
    </ColorWheel.Root>
  )
}

/**
 * Complete example with color wheel.
 */
export const FullExample: StoryFn = () => {
  const [color, setColor] = useState('#ec4899')
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <ColorWheel.Wheel size={200} ringWidth={20}>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
            padding: 12,
            background: '#f5f5f5',
            borderRadius: 8,
          }}
        >
          <ColorWheel.Swatch
            style={{ width: 40, height: 40, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <ColorWheel.HexInput
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: 4,
              fontSize: 14,
            }}
          />
          <ColorWheel.CopyButton
            style={{
              padding: '8px 12px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            Copy
          </ColorWheel.CopyButton>
          <ColorWheel.PasteButton
            style={{
              padding: '8px 12px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            Paste
          </ColorWheel.PasteButton>
        </div>
      </ColorWheel.Root>
    </div>
  )
}
