import type { Meta, StoryFn } from '@storybook/react-vite'
import { useState } from 'react'
import { Thumb } from '../components/Thumb'

const meta = {
  title: 'Components/Thumb',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta

export const Default: StoryFn = () => {
  const [value, setValue] = useState(50)
  return (
    <div style={{ position: 'relative', width: 200, height: 100 }}>
      <Thumb
        size={16}
        color="#3b82f6"
        style={{ left: `${value}%`, top: '50%' }}
        aria-label="Value"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value}%`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') setValue(Math.min(100, value + 1))
          if (e.key === 'ArrowLeft') setValue(Math.max(0, value - 1))
        }}
      />
    </div>
  )
}

export const DifferentSizes: StoryFn = () => {
  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 50, height: 50 }}>
          <Thumb
            size={12}
            color="#ef4444"
            style={{ left: '50%', top: '50%' }}
            aria-label="Small"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
          />
        </div>
        <p style={{ marginTop: 8, fontSize: 12 }}>12px</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 50, height: 50 }}>
          <Thumb
            size={16}
            color="#22c55e"
            style={{ left: '50%', top: '50%' }}
            aria-label="Medium"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
          />
        </div>
        <p style={{ marginTop: 8, fontSize: 12 }}>16px</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 50, height: 50 }}>
          <Thumb
            size={24}
            color="#3b82f6"
            style={{ left: '50%', top: '50%' }}
            aria-label="Large"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
          />
        </div>
        <p style={{ marginTop: 8, fontSize: 12 }}>24px</p>
      </div>
    </div>
  )
}

export const DifferentColors: StoryFn = () => {
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {colors.map((color, i) => (
        <div key={color} style={{ position: 'relative', width: 30, height: 30 }}>
          <Thumb
            size={20}
            color={color}
            style={{ left: '50%', top: '50%' }}
            aria-label={`Color ${i + 1}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
          />
        </div>
      ))}
    </div>
  )
}

export const Disabled: StoryFn = () => {
  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 50, height: 50 }}>
          <Thumb
            size={16}
            color="#3b82f6"
            style={{ left: '50%', top: '50%' }}
            aria-label="Enabled"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
          />
        </div>
        <p style={{ marginTop: 8, fontSize: 12 }}>Enabled</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 50, height: 50 }}>
          <Thumb
            size={16}
            color="#3b82f6"
            style={{ left: '50%', top: '50%' }}
            aria-label="Disabled"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
            disabled
          />
        </div>
        <p style={{ marginTop: 8, fontSize: 12 }}>Disabled</p>
      </div>
    </div>
  )
}

export const WithTransparency: StoryFn = () => {
  const [alpha, setAlpha] = useState(70)
  const r = 59,
    g = 130,
    b = 246
  return (
    <div>
      <div style={{ position: 'relative', width: 200, height: 50 }}>
        <Thumb
          size={18}
          color={`rgba(${r}, ${g}, ${b}, ${alpha / 100})`}
          style={{ left: `${alpha}%`, top: '50%' }}
          aria-label="Alpha"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={alpha}
          aria-valuetext={`${alpha}%`}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') setAlpha(Math.min(100, alpha + 1))
            if (e.key === 'ArrowLeft') setAlpha(Math.max(0, alpha - 1))
          }}
        />
      </div>
      <p style={{ marginTop: 16, fontFamily: 'monospace' }}>Alpha: {alpha}%</p>
    </div>
  )
}
