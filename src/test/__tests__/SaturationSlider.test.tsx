import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('SaturationSlider', () => {
  it('should render with current saturation value', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.SaturationSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /saturation/i })
    expect(slider).toHaveAttribute('aria-valuenow', '100')
  })

  it('should have correct aria attributes', () => {
    render(
      <ColorWheel.Root value="#ff8080" onValueChange={() => {}}>
        <ColorWheel.SaturationSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /saturation/i })
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
  })

  it('should update saturation when pressing ArrowRight', () => {
    const onSaturationChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#ff8080"
        onValueChange={() => {}}
        onSaturationChange={onSaturationChange}
      >
        <ColorWheel.SaturationSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /saturation/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })

    expect(onSaturationChange).toHaveBeenCalled()
  })

  it('should update saturation by 10 when pressing Shift+ArrowRight', () => {
    const onSaturationChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#ff8080"
        onValueChange={() => {}}
        onSaturationChange={onSaturationChange}
      >
        <ColorWheel.SaturationSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /saturation/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight', shiftKey: true })

    expect(onSaturationChange).toHaveBeenCalled()
  })

  it('should set saturation to 0 when pressing Alt+ArrowLeft', () => {
    const onSaturationChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#ff0000"
        onValueChange={() => {}}
        onSaturationChange={onSaturationChange}
      >
        <ColorWheel.SaturationSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /saturation/i })
    fireEvent.keyDown(slider, { key: 'ArrowLeft', altKey: true })

    expect(onSaturationChange).toHaveBeenCalledWith(0)
  })

  it('should set saturation to 100 when pressing Alt+ArrowRight', () => {
    const onSaturationChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#ff8080"
        onValueChange={() => {}}
        onSaturationChange={onSaturationChange}
      >
        <ColorWheel.SaturationSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /saturation/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight', altKey: true })

    expect(onSaturationChange).toHaveBeenCalledWith(100)
  })

  it('should be disabled when parent Root is disabled', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.SaturationSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /saturation/i })
    expect(slider).toHaveAttribute('aria-disabled', 'true')
    expect(slider).toHaveAttribute('tabindex', '-1')
  })

  it('should have horizontal orientation by default', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.SaturationSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /saturation/i })
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('should support vertical orientation', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.SaturationSlider orientation="vertical" />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /saturation/i })
    expect(slider).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('should have data-color-wheel-saturation-slider attribute', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.SaturationSlider />
      </ColorWheel.Root>
    )

    const sliderContainer = document.querySelector('[data-color-wheel-saturation-slider]')
    expect(sliderContainer).toBeInTheDocument()
  })

  describe('inverted prop', () => {
    it('should position thumb at 0% when saturation is 100 with inverted=true', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.SaturationSlider inverted />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /saturation/i })
      expect(slider.style.left).toBe('0%')
    })

    it('should position thumb at 100% when saturation is 0 with inverted=true', () => {
      render(
        <ColorWheel.Root value="#808080" onValueChange={() => {}}>
          <ColorWheel.SaturationSlider inverted />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /saturation/i })
      expect(slider.style.left).toBe('100%')
    })
  })

  describe('trackSize and thumbSize props', () => {
    it('should apply custom trackSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.SaturationSlider trackSize={20} />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector(
        '[data-color-wheel-saturation-slider]'
      ) as HTMLElement
      expect(sliderContainer.style.height).toBe('20px')
    })

    it('should apply custom thumbSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.SaturationSlider thumbSize={24} />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /saturation/i })
      expect(slider.style.width).toBe('24px')
      expect(slider.style.height).toBe('24px')
    })
  })
})
