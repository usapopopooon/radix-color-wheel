import type { Meta, StoryFn } from '@storybook/react-vite'
import { useState } from 'react'
import * as ColorWheel from '../components'

const meta = {
  title: 'Components/Swatch',
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
      <ColorWheel.Swatch
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          border: '1px solid #ccc',
        }}
      />
      <p style={{ marginTop: 12, fontFamily: 'monospace' }}>Selected: {color}</p>
    </ColorWheel.Root>
  )
}

export const Sizes: StoryFn = () => {
  const [color, setColor] = useState('#ef4444')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <ColorWheel.Swatch
          style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <ColorWheel.Swatch
          style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <ColorWheel.Swatch
          style={{ width: 72, height: 72, borderRadius: 12, border: '1px solid #ccc' }}
        />
      </div>
      <p style={{ marginTop: 12, fontFamily: 'monospace' }}>Selected: {color}</p>
    </ColorWheel.Root>
  )
}

/**
 * Swatch with transparency shows a checkerboard pattern.
 */
export const WithTransparency: StoryFn = () => {
  const [color, setColor] = useState('#3b82f680')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ textAlign: 'center' }}>
          <ColorWheel.Swatch
            style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <p style={{ marginTop: 4, fontSize: 12, color: '#666' }}>50% Alpha</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <ColorWheel.Root value="#ef4444cc" onValueChange={() => {}}>
            <ColorWheel.Swatch
              style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid #ccc' }}
            />
          </ColorWheel.Root>
          <p style={{ marginTop: 4, fontSize: 12, color: '#666' }}>80% Alpha</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <ColorWheel.Root value="#22c55e40" onValueChange={() => {}}>
            <ColorWheel.Swatch
              style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid #ccc' }}
            />
          </ColorWheel.Root>
          <p style={{ marginTop: 4, fontSize: 12, color: '#666' }}>25% Alpha</p>
        </div>
      </div>
    </ColorWheel.Root>
  )
}

/**
 * Swatch updates in real-time with color wheel.
 */
export const WithColorWheel: StoryFn = () => {
  const [color, setColor] = useState('#8b5cf6')
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
            style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <ColorWheel.HexInput
            style={{ width: 90, padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4 }}
          />
        </div>
      </ColorWheel.Root>
    </div>
  )
}

/**
 * Different shapes for swatches.
 */
export const Shapes: StoryFn = () => {
  const [color, setColor] = useState('#f97316')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <ColorWheel.Swatch
          style={{ width: 48, height: 48, borderRadius: 0, border: '1px solid #ccc' }}
        />
        <ColorWheel.Swatch
          style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <ColorWheel.Swatch
          style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <p style={{ width: 48, textAlign: 'center', fontSize: 12, color: '#666' }}>Square</p>
        <p style={{ width: 48, textAlign: 'center', fontSize: 12, color: '#666' }}>Rounded</p>
        <p style={{ width: 48, textAlign: 'center', fontSize: 12, color: '#666' }}>Circle</p>
      </div>
    </ColorWheel.Root>
  )
}

/**
 * Complete example with all controls.
 */
export const FullExample: StoryFn = () => {
  const [color, setColor] = useState('#06b6d4')
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            background: '#f5f5f5',
            borderRadius: 8,
          }}
        >
          <ColorWheel.Swatch
            style={{ width: 64, height: 64, borderRadius: 8, border: '2px solid #ccc' }}
          />
          <div style={{ flex: 1 }}>
            <ColorWheel.HexInput
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ccc',
                borderRadius: 4,
                fontSize: 14,
                marginBottom: 8,
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <ColorWheel.CopyButton
                style={{
                  flex: 1,
                  padding: '4px 8px',
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
                  flex: 1,
                  padding: '4px 8px',
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
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Hue:</p>
          <ColorWheel.HueSlider />
        </div>
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Alpha:</p>
          <ColorWheel.AlphaSlider />
        </div>
      </ColorWheel.Root>
    </div>
  )
}
