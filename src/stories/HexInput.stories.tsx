import type { Meta, StoryFn } from '@storybook/react-vite'
import { useState } from 'react'
import * as ColorWheel from '../components'

const meta = {
  title: 'Components/HexInput',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta

export const Default: StoryFn = () => {
  const [color, setColor] = useState('#3b82f6')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <ColorWheel.HexInput
        style={{
          width: 100,
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: 4,
          fontSize: 14,
        }}
      />
      <p style={{ marginTop: 12, fontFamily: 'monospace' }}>Selected: {color}</p>
    </ColorWheel.Root>
  )
}

/**
 * HexInput with swatch preview.
 */
export const WithSwatch: StoryFn = () => {
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
            fontSize: 14,
          }}
        />
      </div>
    </ColorWheel.Root>
  )
}

/**
 * HexInput updates color wheel in real-time.
 */
export const WithColorWheel: StoryFn = () => {
  const [color, setColor] = useState('#22c55e')
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <ColorWheel.Wheel size={200} ringWidth={20}>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <ColorWheel.Swatch
            style={{ width: 32, height: 32, borderRadius: 4, border: '1px solid #ccc' }}
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
        </div>
      </ColorWheel.Root>
    </div>
  )
}

/**
 * HexInput in disabled state.
 */
export const Disabled: StoryFn = () => {
  const [color, setColor] = useState('#8b5cf6')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor} disabled>
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
            fontSize: 14,
            opacity: 0.5,
            cursor: 'not-allowed',
          }}
        />
      </div>
    </ColorWheel.Root>
  )
}

/**
 * Custom styling for HexInput.
 */
export const CustomStyles: StoryFn = () => {
  const [color, setColor] = useState('#f97316')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Default:</p>
          <ColorWheel.HexInput
            style={{
              width: 100,
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: 4,
            }}
          />
        </div>
      </ColorWheel.Root>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Rounded:</p>
          <ColorWheel.HexInput
            style={{
              width: 100,
              padding: '8px 12px',
              border: '2px solid #3b82f6',
              borderRadius: 20,
            }}
          />
        </div>
      </ColorWheel.Root>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Underline:</p>
          <ColorWheel.HexInput
            style={{
              width: 100,
              padding: '8px 4px',
              border: 'none',
              borderBottom: '2px solid #333',
              borderRadius: 0,
              background: 'transparent',
            }}
          />
        </div>
      </ColorWheel.Root>
    </div>
  )
}

/**
 * Full example with copy/paste buttons.
 */
export const WithCopyPaste: StoryFn = () => {
  const [color, setColor] = useState('#06b6d4')
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
 * Complete color picker with all sliders.
 */
export const FullExample: StoryFn = () => {
  const [color, setColor] = useState('#ec4899')
  return (
    <div style={{ width: 280 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <ColorWheel.Swatch
            style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid #ccc' }}
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
        </div>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Hue:</p>
          <ColorWheel.HueSlider />
        </div>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Saturation:</p>
          <ColorWheel.SaturationSlider />
        </div>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Brightness:</p>
          <ColorWheel.BrightnessSlider />
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Alpha:</p>
          <ColorWheel.AlphaSlider />
        </div>
      </ColorWheel.Root>
    </div>
  )
}
