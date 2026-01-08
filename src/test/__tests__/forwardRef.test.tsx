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

    it('should preserve hue when saturation/brightness changes (no HSV rounding drift)', () => {
      const ref = createRef<ColorWheelRef>()

      render(
        <ColorWheel.Root ref={ref} defaultValue="#ff0000">
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.Area />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      // Set initial hue to 200 (cyan-blue)
      act(() => {
        ref.current?.setHue(200)
      })
      const initialHue = ref.current?.getHsv()?.h
      expect(initialHue).toBe(200)

      // Simulate multiple saturation/brightness changes (like dragging in Area)
      // This previously caused hue drift due to HSV->HEX->HSV rounding errors
      for (let i = 0; i < 10; i++) {
        act(() => {
          ref.current?.setSaturation(50 + i * 5)
          ref.current?.setBrightness(80 - i * 3)
        })
      }

      // Hue should remain exactly 200 after all changes
      const finalHue = ref.current?.getHsv()?.h
      expect(finalHue).toBe(200)
    })

    it('should preserve hue even at low saturation values', () => {
      const ref = createRef<ColorWheelRef>()

      render(
        <ColorWheel.Root ref={ref} defaultValue="#ff0000">
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.Area />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      // Set hue to 120 (green)
      act(() => {
        ref.current?.setHue(120)
      })

      // Set saturation very low (near grayscale where hue is mathematically undefined)
      act(() => {
        ref.current?.setSaturation(5)
        ref.current?.setBrightness(50)
      })

      // Hue should still be preserved at 120
      expect(ref.current?.getHsv()?.h).toBe(120)

      // Increase saturation back - hue should still be 120
      act(() => {
        ref.current?.setSaturation(80)
      })
      expect(ref.current?.getHsv()?.h).toBe(120)
    })

    it('should preserve saturation when brightness is 0 (black)', () => {
      const ref = createRef<ColorWheelRef>()

      render(
        <ColorWheel.Root ref={ref} defaultValue="#ff0000">
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.Area />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      // Set saturation to 75
      act(() => {
        ref.current?.setSaturation(75)
      })
      expect(ref.current?.getHsv()?.s).toBe(75)

      // Set brightness to 0 (black) - saturation becomes undefined in hex
      act(() => {
        ref.current?.setBrightness(0)
      })

      // Saturation should still be preserved at 75 even though hex is #000000
      expect(ref.current?.getHsv()?.s).toBe(75)
      expect(ref.current?.getHsv()?.v).toBe(0)
    })

    it('should allow saturation changes while at brightness 0', () => {
      const ref = createRef<ColorWheelRef>()

      render(
        <ColorWheel.Root ref={ref} defaultValue="#ff0000">
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.Area />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      // Set brightness to 0 first
      act(() => {
        ref.current?.setBrightness(0)
      })

      // Change saturation multiple times while at v=0
      act(() => {
        ref.current?.setSaturation(25)
      })
      expect(ref.current?.getHsv()?.s).toBe(25)

      act(() => {
        ref.current?.setSaturation(100)
      })
      expect(ref.current?.getHsv()?.s).toBe(100)

      act(() => {
        ref.current?.setSaturation(50)
      })
      expect(ref.current?.getHsv()?.s).toBe(50)

      // Increase brightness - saturation should still be 50
      act(() => {
        ref.current?.setBrightness(80)
      })
      expect(ref.current?.getHsv()?.s).toBe(50)
      expect(ref.current?.getHsv()?.v).toBe(80)
    })

    it('should allow hue changes when saturation is 0 (grayscale)', () => {
      const ref = createRef<ColorWheelRef>()

      render(
        <ColorWheel.Root ref={ref} defaultValue="#ff0000">
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.Area />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      // Set hue to 120 (green) first
      act(() => {
        ref.current?.setHue(120)
      })
      expect(ref.current?.getHsv()?.h).toBe(120)

      // Set saturation to 0 (grayscale - hue becomes mathematically undefined)
      act(() => {
        ref.current?.setSaturation(0)
      })
      // Hue should still be preserved at 120
      expect(ref.current?.getHsv()?.h).toBe(120)
      expect(ref.current?.getHsv()?.s).toBe(0)

      // Now change hue while at s=0 - this should still work and update the UI
      act(() => {
        ref.current?.setHue(240)
      })
      // Hue should update to 240 even though hex is still grayscale
      expect(ref.current?.getHsv()?.h).toBe(240)

      // Change hue again
      act(() => {
        ref.current?.setHue(60)
      })
      expect(ref.current?.getHsv()?.h).toBe(60)

      // Restore saturation - should see the new hue
      act(() => {
        ref.current?.setSaturation(100)
      })
      expect(ref.current?.getHsv()?.h).toBe(60)
      expect(ref.current?.getHsv()?.s).toBe(100)
    })

    it('should allow hue changes when brightness is 0 (black)', () => {
      const ref = createRef<ColorWheelRef>()

      render(
        <ColorWheel.Root ref={ref} defaultValue="#ff0000">
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.Area />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      // Set hue to 180 (cyan) first
      act(() => {
        ref.current?.setHue(180)
      })
      expect(ref.current?.getHsv()?.h).toBe(180)

      // Set brightness to 0 (black - hue becomes mathematically undefined)
      act(() => {
        ref.current?.setBrightness(0)
      })
      // Hue should still be preserved at 180
      expect(ref.current?.getHsv()?.h).toBe(180)
      expect(ref.current?.getHsv()?.v).toBe(0)

      // Now change hue while at v=0 - this should still work and update the UI
      act(() => {
        ref.current?.setHue(300)
      })
      // Hue should update to 300 even though hex is still black
      expect(ref.current?.getHsv()?.h).toBe(300)

      // Change hue again
      act(() => {
        ref.current?.setHue(45)
      })
      expect(ref.current?.getHsv()?.h).toBe(45)

      // Restore brightness - should see the new hue
      act(() => {
        ref.current?.setBrightness(100)
      })
      expect(ref.current?.getHsv()?.h).toBe(45)
      expect(ref.current?.getHsv()?.v).toBe(100)
    })

    it('should allow hue changes when both saturation is 0 and brightness is low', () => {
      const ref = createRef<ColorWheelRef>()

      render(
        <ColorWheel.Root ref={ref} defaultValue="#ff0000">
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.Area />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      // Set to a grayscale color with low brightness (separate acts to ensure state updates)
      act(() => {
        ref.current?.setHue(200)
      })
      act(() => {
        ref.current?.setSaturation(0)
      })
      act(() => {
        ref.current?.setBrightness(30)
      })
      expect(ref.current?.getHsv()?.h).toBe(200)
      expect(ref.current?.getHsv()?.s).toBe(0)
      expect(ref.current?.getHsv()?.v).toBe(30)
      // Hex should be a gray color
      expect(ref.current?.getColor()).toBe('#4d4d4d')

      // Change hue multiple times - should all work
      const hueValues = [0, 90, 180, 270, 360]
      for (const hue of hueValues) {
        act(() => {
          ref.current?.setHue(hue)
        })
        expect(ref.current?.getHsv()?.h).toBe(hue === 360 ? 360 : hue)
        // Hex should remain gray since s=0
        expect(ref.current?.getColor()).toBe('#4d4d4d')
      }
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
