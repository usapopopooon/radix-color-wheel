import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('forwardRef support', () => {
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
