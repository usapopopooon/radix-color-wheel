import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('LightnessSlider', () => {
  it('should render with current lightness value', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.LightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /lightness/i })
    // Pure red has lightness of 50%
    expect(slider).toHaveAttribute('aria-valuenow', '50')
  })

  it('should have correct aria attributes', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.LightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /lightness/i })
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
  })

  it('should update color when pressing ArrowRight', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.LightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /lightness/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })

    expect(onValueChange).toHaveBeenCalled()
  })

  it('should set lightness to 0 (black) when pressing Alt+ArrowLeft', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.LightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /lightness/i })
    fireEvent.keyDown(slider, { key: 'ArrowLeft', altKey: true })

    // Should result in black
    expect(onValueChange).toHaveBeenCalledWith('#000000')
  })

  it('should set lightness to 100 (white) when pressing Alt+ArrowRight', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.LightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /lightness/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight', altKey: true })

    // Should result in white
    expect(onValueChange).toHaveBeenCalledWith('#ffffff')
  })

  it('should be disabled when parent Root is disabled', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.LightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /lightness/i })
    expect(slider).toHaveAttribute('aria-disabled', 'true')
    expect(slider).toHaveAttribute('tabindex', '-1')
  })

  it('should have horizontal orientation by default', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.LightnessSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /lightness/i })
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('should support vertical orientation', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.LightnessSlider orientation="vertical" />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /lightness/i })
    expect(slider).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('should have data-color-wheel-lightness-slider attribute', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.LightnessSlider />
      </ColorWheel.Root>
    )

    const sliderContainer = document.querySelector('[data-color-wheel-lightness-slider]')
    expect(sliderContainer).toBeInTheDocument()
  })

  describe('inverted prop', () => {
    it('should position thumb at 50% for pure color with inverted=true', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.LightnessSlider inverted />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /lightness/i })
      // Pure red has lightness 50%, inverted: (1 - 0.5) * 100 = 50%
      expect(slider.style.left).toBe('50%')
    })

    it('should position thumb at 0% when lightness is 100 with inverted=true', () => {
      render(
        <ColorWheel.Root value="#ffffff" onValueChange={() => {}}>
          <ColorWheel.LightnessSlider inverted />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /lightness/i })
      expect(slider.style.left).toBe('0%')
    })

    it('should position thumb at 100% when lightness is 0 with inverted=true', () => {
      render(
        <ColorWheel.Root value="#000000" onValueChange={() => {}}>
          <ColorWheel.LightnessSlider inverted />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /lightness/i })
      expect(slider.style.left).toBe('100%')
    })
  })

  describe('trackSize and thumbSize props', () => {
    it('should apply custom trackSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.LightnessSlider trackSize={20} />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector(
        '[data-color-wheel-lightness-slider]'
      ) as HTMLElement
      expect(sliderContainer.style.height).toBe('20px')
    })

    it('should apply custom thumbSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.LightnessSlider thumbSize={24} />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /lightness/i })
      expect(slider.style.width).toBe('24px')
      expect(slider.style.height).toBe('24px')
    })
  })
})
