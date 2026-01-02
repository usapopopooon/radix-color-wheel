import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, act } from '@testing-library/react'
import * as ColorWheel from '../../components'
import type { ColorWheelRef } from '../../types'

describe('forwardRef support', () => {
  describe('Root', () => {
    it('should expose imperative API via ref', () => {
      const ref = createRef<ColorWheelRef>()

      render(
        <ColorWheel.Root ref={ref} value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      expect(ref.current).not.toBeNull()
      expect(typeof ref.current?.getColor).toBe('function')
      expect(typeof ref.current?.getColor8).toBe('function')
      expect(typeof ref.current?.getAlpha).toBe('function')
      expect(typeof ref.current?.getHsv).toBe('function')
      expect(typeof ref.current?.setColor).toBe('function')
      expect(typeof ref.current?.setAlpha).toBe('function')
      expect(typeof ref.current?.setHsv).toBe('function')
      expect(typeof ref.current?.setHue).toBe('function')
      expect(typeof ref.current?.setSaturation).toBe('function')
      expect(typeof ref.current?.setBrightness).toBe('function')
    })

    it('should get current color values via ref', () => {
      const ref = createRef<ColorWheelRef>()

      render(
        <ColorWheel.Root ref={ref} defaultValue="#00ff00" defaultAlpha={50}>
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      expect(ref.current?.getColor()).toBe('#00ff00')
      expect(ref.current?.getAlpha()).toBe(50)
      expect(ref.current?.getColor8()).toBe('#00ff0080')

      const hsv = ref.current?.getHsv()
      expect(hsv?.h).toBe(120)
      expect(hsv?.s).toBe(100)
      expect(hsv?.v).toBe(100)
    })

    it('should set color via ref', () => {
      const ref = createRef<ColorWheelRef>()

      render(
        <ColorWheel.Root ref={ref} defaultValue="#ff0000">
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      act(() => {
        ref.current?.setColor('#0000ff')
      })
      expect(ref.current?.getColor()).toBe('#0000ff')
    })

    it('should set alpha via ref', () => {
      const ref = createRef<ColorWheelRef>()

      render(
        <ColorWheel.Root ref={ref} defaultValue="#ff0000">
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      act(() => {
        ref.current?.setAlpha(25)
      })
      expect(ref.current?.getAlpha()).toBe(25)
    })

    it('should set HSV via ref', () => {
      const ref = createRef<ColorWheelRef>()

      render(
        <ColorWheel.Root ref={ref} defaultValue="#ff0000">
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      act(() => {
        ref.current?.setHsv({ h: 240, s: 100, v: 100 })
      })
      expect(ref.current?.getColor()).toBe('#0000ff')
    })
  })

  describe('Wheel', () => {
    it('should forward ref to div element', () => {
      const ref = createRef<HTMLDivElement>()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel ref={ref}>
            <ColorWheel.HueRing />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveAttribute('data-color-wheel-wheel')
    })
  })

  describe('HueRing', () => {
    it('should forward ref to div element', () => {
      const ref = createRef<HTMLDivElement>()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel>
            <ColorWheel.HueRing ref={ref} />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveAttribute('data-color-wheel-hue-ring')
    })
  })

  describe('HueThumb', () => {
    it('should forward ref to div element', () => {
      const ref = createRef<HTMLDivElement>()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel>
            <ColorWheel.HueThumb ref={ref} />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveAttribute('data-color-wheel-thumb')
    })
  })

  describe('Area', () => {
    it('should forward ref to div element', () => {
      const ref = createRef<HTMLDivElement>()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel>
            <ColorWheel.Area ref={ref} />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveAttribute('data-color-wheel-area')
    })
  })

  describe('AreaThumb', () => {
    it('should forward ref to div element', () => {
      const ref = createRef<HTMLDivElement>()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel>
            <ColorWheel.AreaThumb ref={ref} />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveAttribute('data-color-wheel-thumb')
    })
  })

  describe('Swatch', () => {
    it('should forward ref to div element', () => {
      const ref = createRef<HTMLDivElement>()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Swatch ref={ref} />
        </ColorWheel.Root>
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveAttribute('data-color-wheel-swatch')
    })
  })

  describe('HexInput', () => {
    it('should forward ref to input element', () => {
      const ref = createRef<HTMLInputElement>()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.HexInput ref={ref} />
        </ColorWheel.Root>
      )

      expect(ref.current).toBeInstanceOf(HTMLInputElement)
      expect(ref.current).toHaveAttribute('data-color-wheel-hex-input')
    })
  })

  describe('AlphaSlider', () => {
    it('should forward ref to div element', () => {
      const ref = createRef<HTMLDivElement>()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.AlphaSlider ref={ref} />
        </ColorWheel.Root>
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveAttribute('data-color-wheel-alpha-slider')
    })
  })

  describe('CopyButton', () => {
    it('should forward ref to button element', () => {
      const ref = createRef<HTMLButtonElement>()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.CopyButton ref={ref}>Copy</ColorWheel.CopyButton>
        </ColorWheel.Root>
      )

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current).toHaveAttribute('data-color-wheel-copy-button')
    })
  })

  describe('PasteButton', () => {
    it('should forward ref to button element', () => {
      const ref = createRef<HTMLButtonElement>()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.PasteButton ref={ref}>Paste</ColorWheel.PasteButton>
        </ColorWheel.Root>
      )

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current).toHaveAttribute('data-color-wheel-paste-button')
    })
  })
})

describe('HTML attribute spreading', () => {
  it('should pass data attributes to Wheel', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel data-testid="my-wheel">
          <ColorWheel.HueRing />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const wheel = document.querySelector('[data-testid="my-wheel"]')
    expect(wheel).toBeInTheDocument()
  })

  it('should pass data attributes to HueRing', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing data-testid="my-hue-ring" />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const ring = document.querySelector('[data-testid="my-hue-ring"]')
    expect(ring).toBeInTheDocument()
  })

  it('should pass data attributes to Area', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel>
          <ColorWheel.Area data-testid="my-area" />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const area = document.querySelector('[data-testid="my-area"]')
    expect(area).toBeInTheDocument()
  })

  it('should pass data attributes to Swatch', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Swatch data-testid="my-swatch" />
      </ColorWheel.Root>
    )

    const swatch = document.querySelector('[data-testid="my-swatch"]')
    expect(swatch).toBeInTheDocument()
  })

  it('should pass data attributes to AlphaSlider', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.AlphaSlider data-testid="my-alpha-slider" />
      </ColorWheel.Root>
    )

    const slider = document.querySelector('[data-testid="my-alpha-slider"]')
    expect(slider).toBeInTheDocument()
  })
})
