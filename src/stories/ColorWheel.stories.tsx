import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import * as ColorWheel from '../components'
import { ColorWheelSimple } from '../presets/Simple'

/**
 * ColorWheel is a compound component library for building accessible color pickers.
 * It follows the Radix UI design philosophy with composable primitives.
 */
const meta: Meta<typeof ColorWheelSimple> = {
  title: 'Components/ColorWheel',
  component: ColorWheelSimple,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible color wheel component built with React. Supports HSV color selection with hue ring, saturation/value area, alpha slider, and hex input.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'number', min: 100, max: 400, step: 10 },
      description: 'Size of the color wheel in pixels',
      table: { defaultValue: { summary: '200' } },
    },
    showHexInput: {
      control: 'boolean',
      description: 'Show hex color input field',
      table: { defaultValue: { summary: 'true' } },
    },
    showSwatch: {
      control: 'boolean',
      description: 'Show color swatch preview',
      table: { defaultValue: { summary: 'true' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the color wheel',
      table: { defaultValue: { summary: 'false' } },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default color wheel with basic configuration.
 */
export const Default: Story = {
  args: {
    defaultValue: '#3b82f6',
    size: 200,
  },
}

/**
 * Color wheel with hex input and swatch preview.
 */
export const WithHexInput: Story = {
  args: {
    defaultValue: '#ef4444',
    size: 200,
    showHexInput: true,
    showSwatch: true,
  },
}

/**
 * Larger color wheel with all options enabled.
 */
export const LargeWithAllOptions: Story = {
  args: {
    defaultValue: '#22c55e',
    size: 250,
    showHexInput: true,
    showSwatch: true,
  },
}

/**
 * Disabled state - the color wheel is non-interactive.
 */
export const Disabled: Story = {
  args: {
    defaultValue: '#9333ea',
    size: 200,
    disabled: true,
  },
}

/**
 * Demonstrates controlled mode with external state management.
 */
function ControlledStory(): React.ReactElement {
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
  parameters: {
    docs: {
      description: {
        story:
          'Use `value` and `onValueChange` for controlled mode with external state management.',
      },
    },
  },
}

/**
 * Demonstrates different sizes of the color wheel.
 */
function CustomSizeStory(): React.ReactElement {
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
  parameters: {
    docs: {
      description: {
        story: 'The color wheel can be customized with different sizes and ring widths.',
      },
    },
  },
}

/**
 * Demonstrates the compound component API for full customization.
 */
function CompoundComponentStory(): React.ReactElement {
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
          style={{ width: 40, height: 40, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <ColorWheel.HexInput
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4 }}
        />
      </div>
      <ColorWheel.AlphaSlider style={{ marginTop: 12 }} />
    </ColorWheel.Root>
  )
}

export const CompoundComponent: Story = {
  render: () => <CompoundComponentStory />,
  parameters: {
    docs: {
      description: {
        story:
          'Use the compound component API (`ColorWheel.Root`, `ColorWheel.Wheel`, etc.) for full customization of the color picker layout.',
      },
    },
  },
}
