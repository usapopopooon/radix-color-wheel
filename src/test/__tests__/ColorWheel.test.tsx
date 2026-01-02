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

  it('should set hue to 0 when Home is pressed', () => {
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
    fireEvent.keyDown(hueThumb, { key: 'Home' })

    expect(onHueChange).toHaveBeenCalledWith(0)
  })

  it('should set hue to 359 when End is pressed', () => {
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
    fireEvent.keyDown(hueThumb, { key: 'End' })

    expect(onHueChange).toHaveBeenCalledWith(359)
  })
})
