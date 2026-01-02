import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('GammaSlider', () => {
  it('should render with default gamma value of 1.0', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.GammaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /gamma/i })
    expect(slider).toHaveAttribute('aria-valuenow', '1')
  })

  it('should render with custom default value', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.GammaSlider defaultValue={2.2} />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /gamma/i })
    expect(slider).toHaveAttribute('aria-valuenow', '2.2')
  })

  it('should have correct aria attributes', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.GammaSlider min={0.1} max={3.0} />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /gamma/i })
    expect(slider).toHaveAttribute('aria-valuemin', '0.1')
    expect(slider).toHaveAttribute('aria-valuemax', '3')
  })

  it('should call onValueChange when pressing ArrowRight', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.GammaSlider onValueChange={onValueChange} />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /gamma/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })

    expect(onValueChange).toHaveBeenCalledWith(1.1)
  })

  it('should decrease gamma when pressing ArrowLeft', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.GammaSlider onValueChange={onValueChange} />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /gamma/i })
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })

    expect(onValueChange).toHaveBeenCalledWith(0.9)
  })

  it('should set gamma to min when pressing Alt+ArrowLeft', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.GammaSlider min={0.1} onValueChange={onValueChange} />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /gamma/i })
    fireEvent.keyDown(slider, { key: 'ArrowLeft', altKey: true })

    expect(onValueChange).toHaveBeenCalledWith(0.1)
  })

  it('should set gamma to max when pressing Alt+ArrowRight', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.GammaSlider max={3.0} onValueChange={onValueChange} />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /gamma/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight', altKey: true })

    expect(onValueChange).toHaveBeenCalledWith(3.0)
  })

  it('should reset gamma to 1.0 when pressing Home', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.GammaSlider defaultValue={2.0} onValueChange={onValueChange} />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /gamma/i })
    fireEvent.keyDown(slider, { key: 'Home' })

    expect(onValueChange).toHaveBeenCalledWith(1.0)
  })

  it('should work in controlled mode', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.GammaSlider value={1.5} onValueChange={onValueChange} />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /gamma/i })
    expect(slider).toHaveAttribute('aria-valuenow', '1.5')
  })

  it('should be disabled when parent Root is disabled', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.GammaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /gamma/i })
    expect(slider).toHaveAttribute('aria-disabled', 'true')
    expect(slider).toHaveAttribute('tabindex', '-1')
  })

  it('should have horizontal orientation by default', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.GammaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /gamma/i })
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('should support vertical orientation', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.GammaSlider orientation="vertical" />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /gamma/i })
    expect(slider).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('should have data-color-wheel-gamma-slider attribute', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.GammaSlider />
      </ColorWheel.Root>
    )

    const sliderContainer = document.querySelector('[data-color-wheel-gamma-slider]')
    expect(sliderContainer).toBeInTheDocument()
  })

  describe('custom step', () => {
    it('should use custom step value', () => {
      const onValueChange = vi.fn()

      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.GammaSlider step={0.05} onValueChange={onValueChange} />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /gamma/i })
      fireEvent.keyDown(slider, { key: 'ArrowRight' })

      expect(onValueChange).toHaveBeenCalledWith(1.05)
    })
  })

  describe('trackSize and thumbSize props', () => {
    it('should apply custom trackSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.GammaSlider trackSize={20} />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector(
        '[data-color-wheel-gamma-slider]'
      ) as HTMLElement
      expect(sliderContainer.style.height).toBe('20px')
    })

    it('should apply custom thumbSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.GammaSlider thumbSize={24} />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /gamma/i })
      expect(slider.style.width).toBe('24px')
      expect(slider.style.height).toBe('24px')
    })
  })
})
