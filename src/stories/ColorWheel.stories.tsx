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

/**
 * With jumpOnClick disabled, clicking on the ring or area does not jump
 * the thumb to the clicked position. The thumb only moves when dragged.
 */
export const JumpOnClickDisabled: StoryFn = () => {
  const [color, setColor] = useState('#f43f5e')
  return (
    <div>
      <p style={{ marginBottom: 12, color: '#666' }}>
        Click on ring/area: thumb does NOT jump (drag only)
      </p>
      <ColorWheel.Root value={color} onValueChange={setColor} jumpOnClick={false}>
        <ColorWheel.Wheel size={200} ringWidth={20}>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Selected: {color}</p>
    </div>
  )
}

/**
 * Default behavior (jumpOnClick=true): clicking on the ring or area
 * immediately jumps the thumb to the clicked position.
 */
export const JumpOnClickEnabled: StoryFn = () => {
  const [color, setColor] = useState('#10b981')
  return (
    <div>
      <p style={{ marginBottom: 12, color: '#666' }}>
        Click on ring/area: thumb JUMPS to position (default)
      </p>
      <ColorWheel.Root value={color} onValueChange={setColor} jumpOnClick={true}>
        <ColorWheel.Wheel size={200} ringWidth={20}>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Selected: {color}</p>
    </div>
  )
}

/**
 * Alpha slider with inverted direction.
 * Opaque (100%) on left, transparent (0%) on right.
 */
export const AlphaSliderInverted: StoryFn = () => {
  const [color, setColor] = useState('#3b82f6')
  return (
    <div style={{ width: 300 }}>
      <p style={{ marginBottom: 12, color: '#666' }}>
        Inverted: opaque on left, transparent on right
      </p>
      <ColorWheel.Root value={color} onValueChange={setColor}>
        <ColorWheel.Wheel size={200} ringWidth={20}>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Normal:</p>
          <ColorWheel.AlphaSlider />
        </div>
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Inverted:</p>
          <ColorWheel.AlphaSlider inverted />
        </div>
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Selected: {color}</p>
    </div>
  )
}

/**
 * Vertical alpha slider with inverted direction.
 * Opaque (100%) on top, transparent (0%) on bottom.
 */
export const AlphaSliderVerticalInverted: StoryFn = () => {
  const [color, setColor] = useState('#8b5cf6')
  return (
    <div>
      <p style={{ marginBottom: 12, color: '#666' }}>
        Vertical inverted: opaque on top, transparent on bottom
      </p>
      <div style={{ display: 'flex', gap: 24 }}>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Wheel size={200} ringWidth={20}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <div style={{ display: 'flex', gap: 12, height: 200 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Normal</p>
              <ColorWheel.AlphaSlider orientation="vertical" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Inverted</p>
              <ColorWheel.AlphaSlider orientation="vertical" inverted />
            </div>
          </div>
        </ColorWheel.Root>
      </div>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Selected: {color}</p>
    </div>
  )
}

/**
 * Custom thumb size for the wheel.
 * Larger thumbs are easier to grab on touch devices.
 */
export const CustomThumbSize: StoryFn = () => {
  const [color, setColor] = useState('#3b82f6')
  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 8, color: '#666' }}>Default thumb</p>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Wheel size={200} ringWidth={20}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 8, color: '#666' }}>Large thumb (24px)</p>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Wheel size={200} ringWidth={20} thumbSize={24}>
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

/**
 * Custom track and thumb size for AlphaSlider.
 */
export const CustomAlphaSliderSize: StoryFn = () => {
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
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Default (12px track, 16px thumb):
          </p>
          <ColorWheel.AlphaSlider />
        </div>
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Larger (20px track, 24px thumb):
          </p>
          <ColorWheel.AlphaSlider trackSize={20} thumbSize={24} />
        </div>
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Slim (8px track, 12px thumb):
          </p>
          <ColorWheel.AlphaSlider trackSize={8} thumbSize={12} />
        </div>
      </ColorWheel.Root>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Selected: {color}</p>
    </div>
  )
}

/**
 * Custom hue offset to change the starting angle of the hue ring.
 * Default is -90 (red at 12 o'clock).
 */
export const CustomHueOffset: StoryFn = () => {
  const [color, setColor] = useState('#ef4444')
  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 8, color: '#666' }}>Default (-90°)</p>
        <p style={{ marginBottom: 8, fontSize: 12, color: '#999' }}>Red at top</p>
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
        <p style={{ marginBottom: 8, color: '#666' }}>Offset 0°</p>
        <p style={{ marginBottom: 8, fontSize: 12, color: '#999' }}>Red at right</p>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Wheel size={150} ringWidth={16} hueOffset={0}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 8, color: '#666' }}>Offset 90°</p>
        <p style={{ marginBottom: 8, fontSize: 12, color: '#999' }}>Red at bottom</p>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Wheel size={150} ringWidth={16} hueOffset={90}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 8, color: '#666' }}>Offset 180°</p>
        <p style={{ marginBottom: 8, fontSize: 12, color: '#999' }}>Red at left</p>
        <ColorWheel.Root value={color} onValueChange={setColor}>
          <ColorWheel.Wheel size={150} ringWidth={16} hueOffset={180}>
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
