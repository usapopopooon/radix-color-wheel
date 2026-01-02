import type { Meta, StoryFn } from '@storybook/react-vite'
import { useState } from 'react'
import * as ColorWheel from '../components'

const meta = {
  title: 'Components/ColorWheel',
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
      <ColorWheel.Wheel size={200} ringWidth={20}>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>
    </ColorWheel.Root>
  )
}

export const WithHexInput: StoryFn = () => {
  const [color, setColor] = useState('#ef4444')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <ColorWheel.Wheel size={200} ringWidth={20}>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <ColorWheel.Swatch
          style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <ColorWheel.HexInput
          style={{ width: 80, padding: '2px 4px', border: '1px solid #ccc', borderRadius: 4 }}
        />
      </div>
    </ColorWheel.Root>
  )
}

export const WithCopyPaste: StoryFn = () => {
  const [color, setColor] = useState('#22c55e')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <ColorWheel.Wheel size={220} ringWidth={22}>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <ColorWheel.Swatch
          style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <ColorWheel.HexInput
          style={{ width: 80, padding: '2px 4px', border: '1px solid #ccc', borderRadius: 4 }}
        />
        <ColorWheel.CopyButton
          onCopy={(hex) => console.log('Copied:', hex)}
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Copy
        </ColorWheel.CopyButton>
        <ColorWheel.PasteButton
          onPaste={(hex) => console.log('Pasted:', hex)}
          onError={() => console.log('Invalid color')}
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
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

export const WithAlphaSlider: StoryFn = () => {
  const [color, setColor] = useState('#8b5cf6')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <ColorWheel.Wheel size={200} ringWidth={20}>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <ColorWheel.Swatch
          style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <ColorWheel.HexInput
          style={{ width: 80, padding: '2px 4px', border: '1px solid #ccc', borderRadius: 4 }}
        />
      </div>
      <ColorWheel.AlphaSlider style={{ marginTop: 12 }} />
    </ColorWheel.Root>
  )
}

export const Disabled: StoryFn = () => {
  const [color, setColor] = useState('#9333ea')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor} disabled>
      <ColorWheel.Wheel size={200} ringWidth={20}>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>
    </ColorWheel.Root>
  )
}

export const CustomSize: StoryFn = () => {
  const [color, setColor] = useState('#f97316')
  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 8 }}>Small (150px)</p>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Wheel size={150} ringWidth={16}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 8 }}>Large (300px)</p>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Wheel size={300} ringWidth={28}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      </div>
    </div>
  )
}

export const FullFeatured: StoryFn = () => {
  const [color, setColor] = useState('#06b6d4')
  return (
    <div>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <ColorWheel.Wheel size={240} ringWidth={24}>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <ColorWheel.Swatch
            style={{ width: 28, height: 28, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <ColorWheel.HexInput
            style={{ width: 90, padding: '4px 6px', border: '1px solid #ccc', borderRadius: 4 }}
          />
          <ColorWheel.CopyButton
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Copy
          </ColorWheel.CopyButton>
          <ColorWheel.PasteButton
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Paste
          </ColorWheel.PasteButton>
        </div>
        <ColorWheel.AlphaSlider style={{ marginTop: 12 }} />
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Selected: {color}</p>
    </div>
  )
}
