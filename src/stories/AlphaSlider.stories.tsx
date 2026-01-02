import type { Meta, StoryFn } from '@storybook/react-vite'
import { useState } from 'react'
import * as ColorWheel from '../components'

const meta = {
  title: 'Components/AlphaSlider',
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
      <div style={{ width: 200 }}>
        <ColorWheel.AlphaSlider />
      </div>
    </ColorWheel.Root>
  )
}

export const Vertical: StoryFn = () => {
  const [color, setColor] = useState('#ef4444')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <div style={{ height: 150 }}>
        <ColorWheel.AlphaSlider orientation="vertical" />
      </div>
    </ColorWheel.Root>
  )
}

export const DifferentColors: StoryFn = () => {
  const colors = ['#ef4444', '#22c55e', '#3b82f6', '#8b5cf6']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {colors.map((color) => (
        <ColorWheel.Root key={color} value={color} onValueChange={() => {}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'monospace', width: 70 }}>{color}</span>
            <div style={{ width: 150 }}>
              <ColorWheel.AlphaSlider />
            </div>
          </div>
        </ColorWheel.Root>
      ))}
    </div>
  )
}

export const WithSwatch: StoryFn = () => {
  const [color, setColor] = useState('#8b5cf6')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ColorWheel.Swatch
          style={{ width: 32, height: 32, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <div style={{ width: 180 }}>
          <ColorWheel.AlphaSlider />
        </div>
      </div>
    </ColorWheel.Root>
  )
}

export const Disabled: StoryFn = () => {
  const [color, setColor] = useState('#06b6d4')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <p style={{ marginBottom: 8 }}>Enabled</p>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <div style={{ width: 180 }}>
            <ColorWheel.AlphaSlider />
          </div>
        </ColorWheel.Root>
      </div>
      <div>
        <p style={{ marginBottom: 8 }}>Disabled</p>
        <ColorWheel.Root value={color} onValueChange={setColor} disabled>
          <div style={{ width: 180 }}>
            <ColorWheel.AlphaSlider />
          </div>
        </ColorWheel.Root>
      </div>
    </div>
  )
}
