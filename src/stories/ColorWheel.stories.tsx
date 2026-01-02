import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import * as ColorWheel from '../components'
import { ColorWheelSimple } from '../presets/Simple'

const meta = {
  title: 'Components/ColorWheel',
  component: ColorWheelSimple,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'number', min: 100, max: 400, step: 10 },
    },
    showHexInput: {
      control: 'boolean',
    },
    showSwatch: {
      control: 'boolean',
    },
    showCopyButton: {
      control: 'boolean',
    },
    showPasteButton: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ColorWheelSimple>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: '#3b82f6',
    size: 200,
  },
}

export const WithHexInput: Story = {
  args: {
    defaultValue: '#ef4444',
    size: 200,
    showHexInput: true,
    showSwatch: true,
  },
}

export const LargeWithAllOptions: Story = {
  args: {
    defaultValue: '#22c55e',
    size: 250,
    showHexInput: true,
    showSwatch: true,
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: '#9333ea',
    size: 200,
    disabled: true,
  },
}

const ControlledStory = () => {
  const [color, setColor] = useState('#06b6d4')
  return (
    <div>
      <ColorWheelSimple value={color} onValueChange={setColor} size={200} showHexInput showSwatch />
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Selected: {color}</p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledStory />,
}

const CustomSizeStory = () => {
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

export const CustomSize: Story = {
  render: () => <CustomSizeStory />,
}

const CompoundComponentStory = () => {
  const [color, setColor] = useState('#8b5cf6')
  return (
    <ColorWheel.Root value={color} onValueChange={setColor}>
      <ColorWheel.Wheel size={220} ringWidth={22}>
        <ColorWheel.HueRing />
        <ColorWheel.HueThumb />
        <ColorWheel.Area />
        <ColorWheel.AreaThumb />
      </ColorWheel.Wheel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
        <ColorWheel.Swatch
          style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <ColorWheel.HexInput
          style={{ width: 80, padding: '2px 4px', border: '1px solid #ccc', borderRadius: 4 }}
        />
        <ColorWheel.CopyButton
          onCopy={() => console.log('Copied!')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            border: '1px solid #ccc',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Copy
        </ColorWheel.CopyButton>
        <ColorWheel.PasteButton
          onPaste={() => console.log('Pasted!')}
          onError={() => console.log('Invalid color')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
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
  )
}

export const CompoundComponent: Story = {
  render: () => <CompoundComponentStory />,
}
