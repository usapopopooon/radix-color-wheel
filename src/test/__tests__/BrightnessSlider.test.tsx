import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('BrightnessSlider', () => {
  it('should render with current brightness value', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.BrightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /brightness/i })
    expect(slider).toHaveAttribute('aria-valuenow', '100')
  })

  it('should have correct aria attributes', () => {
    render(
      <ColorWheel.Root value="#800000" onValueChange={() => {}}>
        <ColorWheel.BrightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /brightness/i })
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
  })

  it('should update brightness when pressing ArrowRight', () => {
    const onBrightnessChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#800000"
        onValueChange={() => {}}
        onBrightnessChange={onBrightnessChange}
      >
        <ColorWheel.BrightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /brightness/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })

    expect(onBrightnessChange).toHaveBeenCalled()
  })

  it('should update brightness by 10 when pressing Shift+ArrowRight', () => {
    const onBrightnessChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#800000"
        onValueChange={() => {}}
        onBrightnessChange={onBrightnessChange}
      >
        <ColorWheel.BrightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /brightness/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight', shiftKey: true })

    expect(onBrightnessChange).toHaveBeenCalled()
  })

  it('should set brightness to 0 when pressing Alt+ArrowLeft', () => {
    const onBrightnessChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#ff0000"
        onValueChange={() => {}}
        onBrightnessChange={onBrightnessChange}
      >
        <ColorWheel.BrightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /brightness/i })
    fireEvent.keyDown(slider, { key: 'ArrowLeft', altKey: true })

    expect(onBrightnessChange).toHaveBeenCalledWith(0)
  })

  it('should set brightness to 100 when pressing Alt+ArrowRight', () => {
    const onBrightnessChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#800000"
        onValueChange={() => {}}
        onBrightnessChange={onBrightnessChange}
      >
        <ColorWheel.BrightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /brightness/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight', altKey: true })

    expect(onBrightnessChange).toHaveBeenCalledWith(100)
  })

  it('should be disabled when parent Root is disabled', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.BrightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /brightness/i })
    expect(slider).toHaveAttribute('aria-disabled', 'true')
    expect(slider).toHaveAttribute('tabindex', '-1')
  })

  it('should have horizontal orientation by default', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.BrightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /brightness/i })
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('should support vertical orientation', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.BrightnessSlider orientation="vertical" />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /brightness/i })
    expect(slider).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('should have data-color-wheel-brightness-slider attribute', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.BrightnessSlider />
      </ColorWheel.Root>
    )

    const sliderContainer = document.querySelector('[data-color-wheel-brightness-slider]')
    expect(sliderContainer).toBeInTheDocument()
  })

  describe('inverted prop', () => {
    it('should position thumb at 0% when brightness is 100 with inverted=true', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.BrightnessSlider inverted />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /brightness/i })
      expect(slider.style.left).toBe('0%')
    })

    it('should position thumb at 100% when brightness is 0 with inverted=true', () => {
      render(
        <ColorWheel.Root value="#000000" onValueChange={() => {}}>
          <ColorWheel.BrightnessSlider inverted />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /brightness/i })
      expect(slider.style.left).toBe('100%')
    })
  })

  describe('trackSize and thumbSize props', () => {
    it('should apply custom trackSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.BrightnessSlider trackSize={20} />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector(
        '[data-color-wheel-brightness-slider]'
      ) as HTMLElement
      expect(sliderContainer.style.height).toBe('20px')
    })

    it('should apply custom thumbSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.BrightnessSlider thumbSize={24} />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /brightness/i })
      expect(slider.style.width).toBe('24px')
      expect(slider.style.height).toBe('24px')
    })
  })
})
