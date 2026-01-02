import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('AlphaSlider', () => {
  it('should render with default alpha value of 100', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    expect(slider).toHaveAttribute('aria-valuenow', '100')
  })

  it('should have correct aria attributes', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
    expect(slider).toHaveAttribute('aria-valuetext', '100%')
  })

  it('should update alpha when pressing ArrowLeft', () => {
    const onAlphaChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onAlphaChange={onAlphaChange}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })

    expect(onAlphaChange).toHaveBeenCalledWith(99)
  })

  it('should update alpha by 10 when pressing Shift+ArrowLeft', () => {
    const onAlphaChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onAlphaChange={onAlphaChange}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    fireEvent.keyDown(slider, { key: 'ArrowLeft', shiftKey: true })

    expect(onAlphaChange).toHaveBeenCalledWith(90)
  })

  it('should set alpha to 0 when pressing Home', () => {
    const onAlphaChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onAlphaChange={onAlphaChange}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    fireEvent.keyDown(slider, { key: 'Home' })

    expect(onAlphaChange).toHaveBeenCalledWith(0)
  })

  it('should set alpha to 100 when pressing End', () => {
    const onAlphaChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff000080" onValueChange={() => {}} onAlphaChange={onAlphaChange}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    fireEvent.keyDown(slider, { key: 'End' })

    expect(onAlphaChange).toHaveBeenCalledWith(100)
  })

  it('should be disabled when parent Root is disabled', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    expect(slider).toHaveAttribute('aria-disabled', 'true')
    expect(slider).toHaveAttribute('tabindex', '-1')
  })

  it('should have horizontal orientation by default', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('should support vertical orientation', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.AlphaSlider orientation="vertical" />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    expect(slider).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('should have data-color-wheel-alpha-slider attribute', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const sliderContainer = document.querySelector('[data-color-wheel-alpha-slider]')
    expect(sliderContainer).toBeInTheDocument()
  })

  it('should use alpha prop for controlled alpha value', () => {
    render(
      <ColorWheel.Root value="#ff0000" alpha={50} onValueChange={() => {}}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    expect(slider).toHaveAttribute('aria-valuenow', '50')
    expect(slider).toHaveAttribute('aria-valuetext', '50%')
  })

  it('should use defaultAlpha prop for initial uncontrolled value', () => {
    render(
      <ColorWheel.Root value="#ff0000" defaultAlpha={75} onValueChange={() => {}}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    expect(slider).toHaveAttribute('aria-valuenow', '75')
  })

  it('should call onAlphaChange when alpha changes with controlled alpha', () => {
    const onAlphaChange = vi.fn()

    render(
      <ColorWheel.Root
        value="#ff0000"
        alpha={50}
        onValueChange={() => {}}
        onAlphaChange={onAlphaChange}
      >
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })

    expect(onAlphaChange).toHaveBeenCalledWith(51)
  })
})
