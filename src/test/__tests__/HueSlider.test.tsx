import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('HueSlider', () => {
  it('should render with current hue value', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.HueSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /hue/i })
    expect(slider).toHaveAttribute('aria-valuenow', '0')
  })

  it('should have correct aria attributes', () => {
    render(
      <ColorWheel.Root value="#00ff00" onValueChange={() => {}}>
        <ColorWheel.HueSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /hue/i })
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '360')
  })

  it('should update hue when pressing ArrowRight', () => {
    const onHueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onHueChange={onHueChange}>
        <ColorWheel.HueSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })

    expect(onHueChange).toHaveBeenCalledWith(1)
  })

  it('should update hue by 10 when pressing Shift+ArrowRight', () => {
    const onHueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onHueChange={onHueChange}>
        <ColorWheel.HueSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight', shiftKey: true })

    expect(onHueChange).toHaveBeenCalledWith(10)
  })

  it('should set hue to 0 when pressing Alt+ArrowLeft', () => {
    const onHueChange = vi.fn()

    render(
      <ColorWheel.Root value="#00ff00" onValueChange={() => {}} onHueChange={onHueChange}>
        <ColorWheel.HueSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(slider, { key: 'ArrowLeft', altKey: true })

    expect(onHueChange).toHaveBeenCalledWith(0)
  })

  it('should set hue to 359 when pressing Alt+ArrowRight', () => {
    const onHueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onHueChange={onHueChange}>
        <ColorWheel.HueSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight', altKey: true })

    expect(onHueChange).toHaveBeenCalledWith(359)
  })

  it('should wrap hue when going below 0', () => {
    const onHueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onHueChange={onHueChange}>
        <ColorWheel.HueSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })

    // 0 - 1 + 360 = 359
    expect(onHueChange).toHaveBeenCalledWith(359)
  })

  it('should decrease hue when A key is pressed (WASD)', () => {
    const onHueChange = vi.fn()

    render(
      <ColorWheel.Root value="#00ff00" onValueChange={() => {}} onHueChange={onHueChange}>
        <ColorWheel.HueSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(slider, { key: 'a' })

    // Green is hue 120, 120 - 1 = 119
    expect(onHueChange).toHaveBeenCalledWith(119)
  })

  it('should increase hue when D key is pressed (WASD)', () => {
    const onHueChange = vi.fn()

    render(
      <ColorWheel.Root value="#00ff00" onValueChange={() => {}} onHueChange={onHueChange}>
        <ColorWheel.HueSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(slider, { key: 'd' })

    // Green is hue 120, 120 + 1 = 121
    expect(onHueChange).toHaveBeenCalledWith(121)
  })

  it('should be disabled when parent Root is disabled', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.HueSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /hue/i })
    expect(slider).toHaveAttribute('aria-disabled', 'true')
    expect(slider).toHaveAttribute('tabindex', '-1')
  })

  it('should have horizontal orientation by default', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.HueSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /hue/i })
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('should support vertical orientation', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.HueSlider orientation="vertical" />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /hue/i })
    expect(slider).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('should have data-color-wheel-hue-slider attribute', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.HueSlider />
      </ColorWheel.Root>
    )

    const sliderContainer = document.querySelector('[data-color-wheel-hue-slider]')
    expect(sliderContainer).toBeInTheDocument()
  })

  describe('inverted prop', () => {
    it('should position thumb near 100% when hue is 0 with inverted=true', () => {
      // Hue 0 is red
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.HueSlider inverted />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /hue/i })
      // With inverted=true and hue=0, thumb should be at 100%
      expect(slider.style.left).toBe('100%')
    })

    it('should position thumb at 50% when hue is 180 with inverted=true', () => {
      render(
        <ColorWheel.Root value="#00ffff" onValueChange={() => {}}>
          <ColorWheel.HueSlider inverted />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /hue/i })
      // With inverted=true and hue=180, thumb should be at 50%
      expect(slider.style.left).toBe('50%')
    })

    it('should update hue correctly when clicking on inverted horizontal slider', () => {
      const onHueChange = vi.fn()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onHueChange={onHueChange}>
          <ColorWheel.HueSlider inverted />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector('[data-color-wheel-hue-slider]') as HTMLElement

      // Mock getBoundingClientRect
      sliderContainer.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 360,
        height: 12,
      })

      // Mock setPointerCapture
      sliderContainer.setPointerCapture = vi.fn()

      // Click at position 90 (25% from left)
      // With inverted=true, this should result in hue = (1 - 0.25) * 360 = 270
      fireEvent.pointerDown(sliderContainer, { clientX: 90, clientY: 6, pointerId: 1 })

      expect(onHueChange).toHaveBeenCalledWith(270)
    })
  })

  describe('trackSize and thumbSize props', () => {
    it('should apply custom trackSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.HueSlider trackSize={20} />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector('[data-color-wheel-hue-slider]') as HTMLElement
      expect(sliderContainer.style.height).toBe('20px')
    })

    it('should apply custom trackSize to vertical slider', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.HueSlider orientation="vertical" trackSize={20} />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector('[data-color-wheel-hue-slider]') as HTMLElement
      expect(sliderContainer.style.width).toBe('20px')
    })
  })
})
