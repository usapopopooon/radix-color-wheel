import type { Meta, StoryFn } from '@storybook/react-vite'
import { useState } from 'react'
import * as ColorWheel from '../components'

const meta = {
  title: 'Components/LightnessSlider',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta

export const Default: StoryFn = () => {
  const [color, setColor] = useState('#3b82f6')
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <ColorWheel.LightnessSlider />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <ColorWheel.Swatch
            style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <ColorWheel.HexInput
            style={{ width: 80, padding: '2px 4px', border: '1px solid #ccc', borderRadius: 4 }}
          />
        </div>
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Selected: {color}</p>
    </div>
  )
}

export const Vertical: StoryFn = () => {
  const [color, setColor] = useState('#ef4444')
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div style={{ height: 200 }}>
          <ColorWheel.LightnessSlider orientation="vertical" />
        </div>
      </ColorWheel.Root>
      <div>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Swatch
            style={{ width: 40, height: 40, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </ColorWheel.Root>
        <p style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 12 }}>{color}</p>
      </div>
    </div>
  )
}

/**
 * Inverted slider direction: lightness 100% on left, 0% on right.
 */
export const Inverted: StoryFn = () => {
  const [color, setColor] = useState('#8b5cf6')
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Normal (0% → 100%):</p>
          <ColorWheel.LightnessSlider />
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Inverted (100% → 0%):</p>
          <ColorWheel.LightnessSlider inverted />
        </div>
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Selected: {color}</p>
    </div>
  )
}

/**
 * Custom track and thumb sizes.
 */
export const CustomSizes: StoryFn = () => {
  const [color, setColor] = useState('#f97316')
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Default (12px track, 16px thumb):
          </p>
          <ColorWheel.LightnessSlider />
        </div>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Larger (20px track, 24px thumb):
          </p>
          <ColorWheel.LightnessSlider trackSize={20} thumbSize={24} />
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Slim (8px track, 12px thumb):
          </p>
          <ColorWheel.LightnessSlider trackSize={8} thumbSize={12} />
        </div>
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Selected: {color}</p>
    </div>
  )
}

export const Disabled: StoryFn = () => {
  const [color, setColor] = useState('#9333ea')
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor} disabled>
        <ColorWheel.LightnessSlider />
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Selected: {color}</p>
    </div>
  )
}

/**
 * HSL control with HueSlider, SaturationSlider, and LightnessSlider.
 * Note: This mixes HSV saturation with HSL lightness, which may not
 * produce expected results. For pure HSL control, consider using
 * a dedicated HSL color picker.
 */
export const FullHSLControl: StoryFn = () => {
  const [color, setColor] = useState('#ec4899')
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <ColorWheel.Swatch
            style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <div>
            <ColorWheel.HexInput
              style={{
                width: 90,
                padding: '4px 8px',
                border: '1px solid #ccc',
                borderRadius: 4,
                fontSize: 14,
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Hue:</p>
          <ColorWheel.HueSlider trackSize={16} thumbSize={20} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Saturation:</p>
          <ColorWheel.SaturationSlider trackSize={16} thumbSize={20} />
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Lightness (HSL):</p>
          <ColorWheel.LightnessSlider trackSize={16} thumbSize={20} />
        </div>
      </ColorWheel.Root>
    </div>
  )
}

/**
 * Comparison between Brightness (HSV) and Lightness (HSL).
 */
export const BrightnessVsLightness: StoryFn = () => {
  const [color, setColor] = useState('#3b82f6')
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <ColorWheel.Swatch
            style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <div>
            <ColorWheel.HexInput
              style={{
                width: 90,
                padding: '4px 8px',
                border: '1px solid #ccc',
                borderRadius: 4,
                fontSize: 14,
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Brightness (HSV): black → full color
          </p>
          <ColorWheel.BrightnessSlider trackSize={16} thumbSize={20} />
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Lightness (HSL): black → full color → white
          </p>
          <ColorWheel.LightnessSlider trackSize={16} thumbSize={20} />
        </div>
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
        Note: Brightness ranges from black to full color, while Lightness goes through full color at
        50% and ends at white.
      </p>
    </div>
  )
}
