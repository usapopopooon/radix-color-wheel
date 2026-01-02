import type { Meta, StoryFn } from '@storybook/react-vite'
import { useState } from 'react'
import * as ColorWheel from '../components'

const meta = {
  title: 'Components/GammaSlider',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta

export const Default: StoryFn = () => {
  const [color, setColor] = useState('#3b82f6')
  const [gamma, setGamma] = useState(1.0)
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <ColorWheel.GammaSlider onValueChange={setGamma} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <ColorWheel.Swatch
            style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <ColorWheel.HexInput
            style={{ width: 80, padding: '2px 4px', border: '1px solid #ccc', borderRadius: 4 }}
          />
        </div>
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>
        Color: {color}, Gamma: {gamma.toFixed(1)}
      </p>
    </div>
  )
}

export const Vertical: StoryFn = () => {
  const [color, setColor] = useState('#ef4444')
  const [gamma, setGamma] = useState(1.0)
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div style={{ height: 200 }}>
          <ColorWheel.GammaSlider orientation="vertical" onValueChange={setGamma} />
        </div>
      </ColorWheel.Root>
      <div>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Swatch
            style={{ width: 40, height: 40, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </ColorWheel.Root>
        <p style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 12 }}>γ = {gamma.toFixed(1)}</p>
      </div>
    </div>
  )
}

/**
 * Controlled mode: the gamma value is controlled externally.
 */
export const Controlled: StoryFn = () => {
  const [color, setColor] = useState('#3b82f6')
  const [gamma, setGamma] = useState(2.2) // sRGB gamma
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <ColorWheel.GammaSlider value={gamma} onValueChange={setGamma} />
      </ColorWheel.Root>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button
          onClick={() => setGamma(1.0)}
          style={{
            padding: '4px 8px',
            borderRadius: 4,
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          Linear (1.0)
        </button>
        <button
          onClick={() => setGamma(2.2)}
          style={{
            padding: '4px 8px',
            borderRadius: 4,
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          sRGB (2.2)
        </button>
        <button
          onClick={() => setGamma(1.8)}
          style={{
            padding: '4px 8px',
            borderRadius: 4,
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          Mac (1.8)
        </button>
      </div>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Gamma: {gamma.toFixed(1)}</p>
    </div>
  )
}

/**
 * Custom range and step values.
 */
export const CustomRange: StoryFn = () => {
  const [color, setColor] = useState('#f97316')
  const [gamma, setGamma] = useState(1.0)
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Default (0.1 - 3.0, step 0.1):
          </p>
          <ColorWheel.GammaSlider onValueChange={setGamma} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Narrow range (0.5 - 2.0, step 0.05):
          </p>
          <ColorWheel.GammaSlider min={0.5} max={2.0} step={0.05} onValueChange={setGamma} />
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Wide range (0.1 - 5.0, step 0.2):
          </p>
          <ColorWheel.GammaSlider min={0.1} max={5.0} step={0.2} onValueChange={setGamma} />
        </div>
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Gamma: {gamma.toFixed(2)}</p>
    </div>
  )
}

/**
 * Custom track and thumb sizes.
 */
export const CustomSizes: StoryFn = () => {
  const [color, setColor] = useState('#22c55e')
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Default (12px track, 16px thumb):
          </p>
          <ColorWheel.GammaSlider />
        </div>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Larger (20px track, 24px thumb):
          </p>
          <ColorWheel.GammaSlider trackSize={20} thumbSize={24} />
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Slim (8px track, 12px thumb):
          </p>
          <ColorWheel.GammaSlider trackSize={8} thumbSize={12} />
        </div>
      </ColorWheel.Root>
    </div>
  )
}

export const Disabled: StoryFn = () => {
  const [color, setColor] = useState('#9333ea')
  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor} disabled>
        <ColorWheel.GammaSlider />
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Color: {color}</p>
    </div>
  )
}

/**
 * Full example showing gamma correction alongside color controls.
 */
export const FullExample: StoryFn = () => {
  const [color, setColor] = useState('#ec4899')
  const [gamma, setGamma] = useState(1.0)

  // Apply gamma correction to display
  const applyGamma = (hex: string, g: number) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const gVal = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const correctedR = Math.round(Math.pow(r, 1 / g) * 255)
    const correctedG = Math.round(Math.pow(gVal, 1 / g) * 255)
    const correctedB = Math.round(Math.pow(b, 1 / g) * 255)

    return `#${correctedR.toString(16).padStart(2, '0')}${correctedG.toString(16).padStart(2, '0')}${correctedB.toString(16).padStart(2, '0')}`
  }

  const correctedColor = applyGamma(color, gamma)

  return (
    <div style={{ width: 300 }}>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <ColorWheel.Swatch
              style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid #ccc' }}
            />
            <p style={{ fontSize: 10, color: '#666', marginTop: 4 }}>Original</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                border: '1px solid #ccc',
                backgroundColor: correctedColor,
              }}
            />
            <p style={{ fontSize: 10, color: '#666', marginTop: 4 }}>Corrected</p>
          </div>
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
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Brightness:</p>
          <ColorWheel.BrightnessSlider trackSize={16} thumbSize={20} />
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Gamma: {gamma.toFixed(1)} (Home key to reset)
          </p>
          <ColorWheel.GammaSlider trackSize={16} thumbSize={20} onValueChange={setGamma} />
        </div>
      </ColorWheel.Root>
    </div>
  )
}
