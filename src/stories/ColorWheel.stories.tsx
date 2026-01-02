import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import * as ColorWheel from '../components'
import { ColorWheelSimple } from '../presets/Simple'

const meta: Meta = {
  title: 'Components/ColorWheel',
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj = {
  render: () => {
    const [color, setColor] = useState('#3b82f6')
    return (
      <div>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
        <p style={{ marginTop: 16 }}>Selected color: {color}</p>
      </div>
    )
  },
}

export const WithHexInput: StoryObj = {
  render: () => {
    const [color, setColor] = useState('#ef4444')
    return (
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
          <ColorWheel.Swatch style={{ width: 40, height: 40, borderRadius: 4, border: '1px solid #ccc' }} />
          <ColorWheel.HexInput style={{ flex: 1, padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4 }} />
        </div>
      </ColorWheel.Root>
    )
  },
}

export const WithAlphaSlider: StoryObj = {
  render: () => {
    const [color, setColor] = useState('#22c55e')
    return (
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <ColorWheel.Wheel size={250}>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
        <ColorWheel.AlphaSlider style={{ marginTop: 16 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <ColorWheel.Swatch style={{ width: 40, height: 40, borderRadius: 4, border: '1px solid #ccc' }} />
          <ColorWheel.HexInput style={{ flex: 1, padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4 }} />
        </div>
      </ColorWheel.Root>
    )
  },
}

export const Disabled: StoryObj = {
  render: () => (
    <ColorWheel.Root value="#9333ea" onValueChange={() => {}} disabled>
      <ColorWheel.Wheel>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>
    </ColorWheel.Root>
  ),
}

export const CustomSize: StoryObj = {
  render: () => {
    const [color, setColor] = useState('#f97316')
    return (
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        <div>
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
        <div>
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
  },
}

export const SimplePreset: StoryObj = {
  render: () => {
    const [color, setColor] = useState('#06b6d4')
    return (
      <div>
        <ColorWheelSimple
          value={color}
          onValueChange={setColor}
          size={200}
          showHexInput
          showSwatch
        />
        <p style={{ marginTop: 16 }}>Selected color: {color}</p>
      </div>
    )
  },
}

export const UncontrolledMode: StoryObj = {
  render: () => (
    <ColorWheelSimple defaultValue="#8b5cf6" showHexInput showSwatch />
  ),
}
