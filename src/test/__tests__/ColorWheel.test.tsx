import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('ColorWheel', () => {
  it('should render without crashing', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )
    expect(screen.getByRole('slider', { name: /hue/i })).toBeInTheDocument()
  })

  it('should render HueThumb with correct initial position', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    expect(hueThumb).toHaveAttribute('aria-valuenow', '0')
  })

  it('should render AreaThumb with saturation and brightness slider', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })
    expect(areaThumb).toBeInTheDocument()
  })

  it('should call onValueChange when hue is changed via keyboard', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(hueThumb, { key: 'ArrowRight' })

    expect(onValueChange).toHaveBeenCalled()
  })

  it('should change hue value when pressing ArrowRight', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(hueThumb, { key: 'ArrowRight' })

    // Should be called with a hex color
    expect(onValueChange).toHaveBeenCalledWith(expect.stringMatching(/^#/))
  })

  it('should disable all interactions when disabled prop is true', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    expect(hueThumb).toHaveAttribute('aria-disabled', 'true')
    expect(hueThumb).toHaveAttribute('tabindex', '-1')

    const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })
    expect(areaThumb).toHaveAttribute('aria-disabled', 'true')
    expect(areaThumb).toHaveAttribute('tabindex', '-1')
  })

  it('should not call onValueChange when disabled and keyboard pressed', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange} disabled>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(hueThumb, { key: 'ArrowRight' })

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('should use defaultValue for uncontrolled mode', () => {
    render(
      <ColorWheel.Root defaultValue="#00ff00">
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    // Green has hue of 120
    expect(hueThumb).toHaveAttribute('aria-valuenow', '120')
  })

  it('should update saturation when pressing ArrowLeft on AreaThumb', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })
    fireEvent.keyDown(areaThumb, { key: 'ArrowLeft' })

    expect(onValueChange).toHaveBeenCalled()
  })

  it('should update brightness when pressing ArrowUp on AreaThumb', () => {
    const onValueChange = vi.fn()

    // Start with a color that has room to increase brightness
    render(
      <ColorWheel.Root value="#800000" onValueChange={onValueChange}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })
    fireEvent.keyDown(areaThumb, { key: 'ArrowUp' })

    expect(onValueChange).toHaveBeenCalled()
  })

  it('should move hue by 10 when Shift+ArrowRight is pressed', () => {
    const onHueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onHueChange={onHueChange}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(hueThumb, { key: 'ArrowRight', shiftKey: true })

    // Should be called with hue = 10 (0 + 10)
    expect(onHueChange).toHaveBeenCalledWith(10)
  })

  it('should set hue to 0 when Alt+ArrowLeft is pressed', () => {
    const onHueChange = vi.fn()

    render(
      <ColorWheel.Root value="#00ff00" onValueChange={() => {}} onHueChange={onHueChange}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(hueThumb, { key: 'ArrowLeft', altKey: true })

    expect(onHueChange).toHaveBeenCalledWith(0)
  })

  it('should set hue to 359 when Alt+ArrowRight is pressed', () => {
    const onHueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onHueChange={onHueChange}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(hueThumb, { key: 'ArrowRight', altKey: true })

    expect(onHueChange).toHaveBeenCalledWith(359)
  })

  it('should decrease hue when A key is pressed (WASD)', () => {
    const onHueChange = vi.fn()

    render(
      <ColorWheel.Root value="#00ff00" onValueChange={() => {}} onHueChange={onHueChange}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(hueThumb, { key: 'a' })

    // Green is 120°, so 120 - 1 = 119
    expect(onHueChange).toHaveBeenCalledWith(119)
  })

  it('should increase hue when D key is pressed (WASD)', () => {
    const onHueChange = vi.fn()

    render(
      <ColorWheel.Root value="#00ff00" onValueChange={() => {}} onHueChange={onHueChange}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(hueThumb, { key: 'd' })

    // Green is 120°, so 120 + 1 = 121
    expect(onHueChange).toHaveBeenCalledWith(121)
  })

  it('should call onDragStart when pointer down on HueThumb', () => {
    const onDragStart = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onDragStart={onDragStart}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.pointerDown(hueThumb)

    expect(onDragStart).toHaveBeenCalled()
  })

  it('should call onDragEnd when pointer up on HueThumb', () => {
    const onDragEnd = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onDragEnd={onDragEnd}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.pointerDown(hueThumb)
    fireEvent.pointerUp(hueThumb)

    expect(onDragEnd).toHaveBeenCalled()
  })

  it('should call onDrag during pointer move on HueThumb', () => {
    const onDrag = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onDrag={onDrag}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })

    // Mock setPointerCapture and hasPointerCapture
    hueThumb.setPointerCapture = vi.fn()
    hueThumb.hasPointerCapture = vi.fn().mockReturnValue(true)
    hueThumb.releasePointerCapture = vi.fn()

    fireEvent.pointerDown(hueThumb, { pointerId: 1 })
    fireEvent.pointerMove(hueThumb, { pointerId: 1, clientX: 150, clientY: 100 })

    expect(onDrag).toHaveBeenCalledWith(expect.stringMatching(/^#[0-9a-f]{6}$/i))
  })

  it('should call onDrag during pointer move on AreaThumb', () => {
    const onDrag = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onDrag={onDrag}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })

    // Mock setPointerCapture and hasPointerCapture
    areaThumb.setPointerCapture = vi.fn()
    areaThumb.hasPointerCapture = vi.fn().mockReturnValue(true)
    areaThumb.releasePointerCapture = vi.fn()

    fireEvent.pointerDown(areaThumb, { pointerId: 1 })
    fireEvent.pointerMove(areaThumb, { pointerId: 1, clientX: 150, clientY: 100 })

    expect(onDrag).toHaveBeenCalledWith(expect.stringMatching(/^#[0-9a-f]{6}$/i))
  })

  it('should decrease saturation when A key is pressed (WASD)', () => {
    const onSaturationChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#ff8080"
        onValueChange={() => {}}
        onSaturationChange={onSaturationChange}
      >
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })
    fireEvent.keyDown(areaThumb, { key: 'a' })

    expect(onSaturationChange).toHaveBeenCalled()
  })

  it('should increase saturation when D key is pressed (WASD)', () => {
    const onSaturationChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#ff8080"
        onValueChange={() => {}}
        onSaturationChange={onSaturationChange}
      >
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })
    fireEvent.keyDown(areaThumb, { key: 'd' })

    expect(onSaturationChange).toHaveBeenCalled()
  })

  it('should increase brightness when W key is pressed (WASD)', () => {
    const onBrightnessChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#800000"
        onValueChange={() => {}}
        onBrightnessChange={onBrightnessChange}
      >
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })
    fireEvent.keyDown(areaThumb, { key: 'w' })

    expect(onBrightnessChange).toHaveBeenCalled()
  })

  it('should decrease brightness when S key is pressed (WASD)', () => {
    const onBrightnessChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#ff0000"
        onValueChange={() => {}}
        onBrightnessChange={onBrightnessChange}
      >
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })
    fireEvent.keyDown(areaThumb, { key: 's' })

    expect(onBrightnessChange).toHaveBeenCalled()
  })

  it('should call onFocus when HueThumb receives focus', () => {
    const onFocus = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onFocus={onFocus}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.focus(hueThumb)

    expect(onFocus).toHaveBeenCalled()
  })

  it('should call onBlur when HueThumb loses focus', () => {
    const onBlur = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onBlur={onBlur}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.focus(hueThumb)
    fireEvent.blur(hueThumb)

    expect(onBlur).toHaveBeenCalled()
  })

  it('should call onFocus when AreaThumb receives focus', () => {
    const onFocus = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onFocus={onFocus}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })
    fireEvent.focus(areaThumb)

    expect(onFocus).toHaveBeenCalled()
  })

  it('should call onBlur when AreaThumb loses focus', () => {
    const onBlur = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onBlur={onBlur}>
        <ColorWheel.Wheel>
          <ColorWheel.HueRing />
          <ColorWheel.HueThumb />
          <ColorWheel.Area />
          <ColorWheel.AreaThumb />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })
    fireEvent.focus(areaThumb)
    fireEvent.blur(areaThumb)

    expect(onBlur).toHaveBeenCalled()
  })

  describe('thumbSize prop', () => {
    it('should apply custom thumbSize to HueThumb', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel thumbSize={24}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueThumb = screen.getByRole('slider', { name: /hue/i })
      expect(hueThumb.style.width).toBe('24px')
      expect(hueThumb.style.height).toBe('24px')
    })

    it('should apply custom thumbSize to AreaThumb', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel thumbSize={24}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })
      expect(areaThumb.style.width).toBe('24px')
      expect(areaThumb.style.height).toBe('24px')
    })

    it('should use calculated thumbSize when not explicitly set', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel size={200} ringWidth={20}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueThumb = screen.getByRole('slider', { name: /hue/i })
      // Default calculation: Math.round(size * 0.07) = Math.round(200 * 0.07) = 14
      expect(hueThumb.style.width).toBe('14px')
      expect(hueThumb.style.height).toBe('14px')
    })

    it('should allow very large thumbSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel thumbSize={40}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueThumb = screen.getByRole('slider', { name: /hue/i })
      expect(hueThumb.style.width).toBe('40px')
    })

    it('should allow very small thumbSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel thumbSize={8}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueThumb = screen.getByRole('slider', { name: /hue/i })
      expect(hueThumb.style.width).toBe('8px')
    })
  })

  describe('hueOffset prop', () => {
    it('should apply hueOffset to HueRing conic-gradient', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel hueOffset={0}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueRing = document.querySelector('[data-color-wheel-hue-ring]') as HTMLElement
      // With hueOffset=0, the gradient should start from 0deg
      expect(hueRing.style.background).toContain('from 0deg')
    })

    it('should default hueOffset to -90 (red at top)', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueRing = document.querySelector('[data-color-wheel-hue-ring]') as HTMLElement
      // Default hueOffset=-90 means the gradient starts from -90deg
      expect(hueRing.style.background).toContain('from -90deg')
    })

    it('should position HueThumb correctly with hueOffset=0', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel size={200} ringWidth={20} hueOffset={0}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueThumb = screen.getByRole('slider', { name: /hue/i })
      // Red (hue=0) with hueOffset=0: angle = 0deg
      // center = 100, radius = 100 - 20/2 = 90
      // x = 100 + 90 * cos(0) = 190, y = 100 + 90 * sin(0) = 100
      expect(hueThumb.style.left).toBe('190px')
      expect(hueThumb.style.top).toBe('100px')
    })

    it('should position HueThumb correctly with default hueOffset (-90)', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel size={200} ringWidth={20}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueThumb = screen.getByRole('slider', { name: /hue/i })
      // Red (hue=0) with hueOffset=-90: angle = 0 + (-90) = -90deg
      // center = 100, radius = 90
      // x = 100 + 90 * cos(-90deg) = 100, y = 100 + 90 * sin(-90deg) = 10
      expect(hueThumb.style.left).toBe('100px')
      expect(hueThumb.style.top).toBe('10px')
    })

    it('should position HueThumb for green (hue=120) correctly with hueOffset', () => {
      render(
        <ColorWheel.Root value="#00ff00" onValueChange={() => {}}>
          <ColorWheel.Wheel size={200} ringWidth={20} hueOffset={0}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueThumb = screen.getByRole('slider', { name: /hue/i })
      // Green (hue=120) with hueOffset=0: angle = 120deg
      // center = 100, radius = 90
      // x = 100 + 90 * cos(120deg) = 100 + 90 * (-0.5) = 55
      // y = 100 + 90 * sin(120deg) = 100 + 90 * (sqrt(3)/2) ≈ 100 + 77.94 ≈ 177.94
      // Allow for floating point precision
      expect(parseFloat(hueThumb.style.left)).toBeCloseTo(55, 0)
      expect(parseFloat(hueThumb.style.top)).toBeCloseTo(177.94, 0)
    })

    it('should calculate hue correctly when clicking on HueRing with hueOffset', () => {
      const onHueChange = vi.fn()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onHueChange={onHueChange}>
          <ColorWheel.Wheel size={200} ringWidth={20} hueOffset={0}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueRing = document.querySelector('[data-color-wheel-hue-ring]') as HTMLElement

      // Mock getBoundingClientRect
      hueRing.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
      })

      // Mock setPointerCapture
      hueRing.setPointerCapture = vi.fn()

      // Click at right edge (100 + 90 = 190, 100) which is angle 0 from center
      // With hueOffset=0, this should give hue=0
      fireEvent.pointerDown(hueRing, { clientX: 190, clientY: 100, pointerId: 1 })

      expect(onHueChange).toHaveBeenCalledWith(0)
    })

    it('should support positive hueOffset values', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel hueOffset={90}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueRing = document.querySelector('[data-color-wheel-hue-ring]') as HTMLElement
      expect(hueRing.style.background).toContain('from 90deg')
    })
  })

  describe('jumpOnClick', () => {
    it('should call onDragStart when clicking on HueRing with jumpOnClick=true (default)', () => {
      const onDragStart = vi.fn()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onDragStart={onDragStart}>
          <ColorWheel.Wheel size={200} ringWidth={20}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueRing = document.querySelector('[data-color-wheel-hue-ring]') as HTMLElement

      // Mock getBoundingClientRect
      hueRing.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
      })

      // Mock setPointerCapture
      hueRing.setPointerCapture = vi.fn()

      // Click on the ring area (at the right edge of the ring)
      // Center is 100, ring outer is 100, inner is 80
      // Click at x=95 (within ring), y=100 (middle)
      fireEvent.pointerDown(hueRing, { clientX: 195, clientY: 100, pointerId: 1 })

      expect(onDragStart).toHaveBeenCalled()
    })

    it('should not call onDragStart when clicking on HueRing with jumpOnClick=false', () => {
      const onDragStart = vi.fn()

      render(
        <ColorWheel.Root
          value="#ff0000"
          onValueChange={() => {}}
          onDragStart={onDragStart}
          jumpOnClick={false}
        >
          <ColorWheel.Wheel size={200} ringWidth={20}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueRing = document.querySelector('[data-color-wheel-hue-ring]') as HTMLElement

      // Mock getBoundingClientRect
      hueRing.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
      })

      fireEvent.pointerDown(hueRing, { clientX: 195, clientY: 100, pointerId: 1 })

      expect(onDragStart).not.toHaveBeenCalled()
    })

    it('should call onDragStart when clicking on Area with jumpOnClick=true (default)', () => {
      const onDragStart = vi.fn()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onDragStart={onDragStart}>
          <ColorWheel.Wheel size={200} ringWidth={20}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const area = document.querySelector('[data-color-wheel-area]') as HTMLElement

      // Mock getBoundingClientRect
      area.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 50,
        top: 50,
        width: 100,
        height: 100,
      })

      // Mock setPointerCapture
      area.setPointerCapture = vi.fn()

      // Click in the center of the area
      fireEvent.pointerDown(area, { clientX: 100, clientY: 100, pointerId: 1 })

      expect(onDragStart).toHaveBeenCalled()
    })

    it('should not call onDragStart when clicking on Area with jumpOnClick=false', () => {
      const onDragStart = vi.fn()

      render(
        <ColorWheel.Root
          value="#ff0000"
          onValueChange={() => {}}
          onDragStart={onDragStart}
          jumpOnClick={false}
        >
          <ColorWheel.Wheel size={200} ringWidth={20}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const area = document.querySelector('[data-color-wheel-area]') as HTMLElement

      // Mock getBoundingClientRect
      area.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 50,
        top: 50,
        width: 100,
        height: 100,
      })

      fireEvent.pointerDown(area, { clientX: 100, clientY: 100, pointerId: 1 })

      expect(onDragStart).not.toHaveBeenCalled()
    })

    it('should update hue when clicking on HueRing', () => {
      const onHueChange = vi.fn()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onHueChange={onHueChange}>
          <ColorWheel.Wheel size={200} ringWidth={20}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueRing = document.querySelector('[data-color-wheel-hue-ring]') as HTMLElement

      // Mock getBoundingClientRect
      hueRing.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
      })

      // Mock setPointerCapture
      hueRing.setPointerCapture = vi.fn()

      // Click on the right side of the ring (should be around 90 degrees = green-ish)
      fireEvent.pointerDown(hueRing, { clientX: 195, clientY: 100, pointerId: 1 })

      expect(onHueChange).toHaveBeenCalledWith(expect.any(Number))
    })

    it('should update saturation and brightness when clicking on Area', () => {
      const onSaturationChange = vi.fn()
      const onBrightnessChange = vi.fn()

      render(
        <ColorWheel.Root
          value="#ff0000"
          onValueChange={() => {}}
          onSaturationChange={onSaturationChange}
          onBrightnessChange={onBrightnessChange}
        >
          <ColorWheel.Wheel size={200} ringWidth={20}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const area = document.querySelector('[data-color-wheel-area]') as HTMLElement

      // Mock getBoundingClientRect
      area.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 50,
        top: 50,
        width: 100,
        height: 100,
      })

      // Mock setPointerCapture
      area.setPointerCapture = vi.fn()

      // Click in the center of the area
      fireEvent.pointerDown(area, { clientX: 100, clientY: 100, pointerId: 1 })

      expect(onSaturationChange).toHaveBeenCalled()
      expect(onBrightnessChange).toHaveBeenCalled()
    })

    it('should have cursor pointer on HueRing when enabled', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueRing = document.querySelector('[data-color-wheel-hue-ring]') as HTMLElement
      expect(hueRing.style.cursor).toBe('pointer')
    })

    it('should have cursor default on HueRing when disabled', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueRing = document.querySelector('[data-color-wheel-hue-ring]') as HTMLElement
      expect(hueRing.style.cursor).toBe('default')
    })

    it('should have cursor crosshair on Area when enabled', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const area = document.querySelector('[data-color-wheel-area]') as HTMLElement
      expect(area.style.cursor).toBe('crosshair')
    })

    it('should have cursor default on Area when disabled', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const area = document.querySelector('[data-color-wheel-area]') as HTMLElement
      expect(area.style.cursor).toBe('default')
    })

    it('should update saturation and brightness atomically when clicking on AreaThumb', () => {
      const onSaturationChange = vi.fn()
      const onBrightnessChange = vi.fn()

      render(
        <ColorWheel.Root
          value="#ff0000"
          onValueChange={() => {}}
          onSaturationChange={onSaturationChange}
          onBrightnessChange={onBrightnessChange}
        >
          <ColorWheel.Wheel size={200} ringWidth={20}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const areaThumb = screen.getByRole('slider', { name: /saturation and brightness/i })
      const wheel = document.querySelector('[data-color-wheel-wheel]') as HTMLElement

      // Mock getBoundingClientRect for the wheel (parent element)
      wheel.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
      })

      // Mock setPointerCapture
      areaThumb.setPointerCapture = vi.fn()

      // Click on the AreaThumb - should update both saturation and brightness
      fireEvent.pointerDown(areaThumb, { clientX: 150, clientY: 80, pointerId: 1 })

      // Both callbacks should be called (atomic update)
      expect(onSaturationChange).toHaveBeenCalled()
      expect(onBrightnessChange).toHaveBeenCalled()
    })

    it('should update hue when clicking on HueThumb with jumpOnClick enabled', () => {
      const onHueChange = vi.fn()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onHueChange={onHueChange}>
          <ColorWheel.Wheel size={200} ringWidth={20}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const hueThumb = screen.getByRole('slider', { name: /hue/i })
      const wheel = document.querySelector('[data-color-wheel-wheel]') as HTMLElement

      // Mock getBoundingClientRect for the wheel
      wheel.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
      })

      // Mock setPointerCapture
      hueThumb.setPointerCapture = vi.fn()

      // Click on the HueThumb
      fireEvent.pointerDown(hueThumb, { clientX: 100, clientY: 10, pointerId: 1 })

      // onDragStart should be called (thumb always responds to clicks for dragging)
      expect(hueThumb.setPointerCapture).toHaveBeenCalled()
    })
  })
})
