import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('Wheel', () => {
  it('should render with default size', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel>
          <div data-testid="child" />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const wheel = document.querySelector('[data-color-wheel-wheel]') as HTMLElement
    expect(wheel).toBeInTheDocument()
    expect(wheel.style.width).toBe('200px')
    expect(wheel.style.height).toBe('200px')
  })

  it('should apply custom size', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel size={300}>
          <div data-testid="child" />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const wheel = document.querySelector('[data-color-wheel-wheel]') as HTMLElement
    expect(wheel.style.width).toBe('300px')
    expect(wheel.style.height).toBe('300px')
  })

  it('should have role="group" for accessibility', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel>
          <div data-testid="child" />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const wheel = screen.getByRole('group', { name: /color wheel/i })
    expect(wheel).toBeInTheDocument()
  })

  it('should have default aria-label', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel>
          <div data-testid="child" />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const wheel = document.querySelector('[data-color-wheel-wheel]')
    expect(wheel).toHaveAttribute('aria-label', 'Color wheel')
  })

  it('should allow custom aria-label', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel aria-label="Custom color picker">
          <div data-testid="child" />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const wheel = document.querySelector('[data-color-wheel-wheel]')
    expect(wheel).toHaveAttribute('aria-label', 'Custom color picker')
  })

  it('should render children', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel>
          <div data-testid="child-element">Content</div>
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    expect(screen.getByTestId('child-element')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel className="custom-wheel">
          <div data-testid="child" />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const wheel = document.querySelector('[data-color-wheel-wheel]')
    expect(wheel).toHaveClass('custom-wheel')
  })

  it('should apply custom style', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel style={{ margin: '10px' }}>
          <div data-testid="child" />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const wheel = document.querySelector('[data-color-wheel-wheel]') as HTMLElement
    expect(wheel.style.margin).toBe('10px')
  })

  it('should have data-color-wheel-wheel attribute', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel>
          <div data-testid="child" />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const wheel = document.querySelector('[data-color-wheel-wheel]')
    expect(wheel).toBeInTheDocument()
  })

  it('should have position relative for child positioning', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Wheel>
          <div data-testid="child" />
        </ColorWheel.Wheel>
      </ColorWheel.Root>
    )

    const wheel = document.querySelector('[data-color-wheel-wheel]') as HTMLElement
    expect(wheel.style.position).toBe('relative')
  })

  describe('with full component set', () => {
    it('should render HueRing and HueThumb', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      expect(document.querySelector('[data-color-wheel-hue-ring]')).toBeInTheDocument()
      expect(screen.getByRole('slider', { name: /hue/i })).toBeInTheDocument()
    })

    it('should render Area and AreaThumb', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel>
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      expect(document.querySelector('[data-color-wheel-area]')).toBeInTheDocument()
      expect(screen.getByRole('slider', { name: /saturation/i })).toBeInTheDocument()
    })

    it('should render complete wheel with all components', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.Wheel size={250} ringWidth={24}>
            <ColorWheel.HueRing />
            <ColorWheel.HueThumb />
            <ColorWheel.Area />
            <ColorWheel.AreaThumb />
          </ColorWheel.Wheel>
        </ColorWheel.Root>
      )

      const wheel = document.querySelector('[data-color-wheel-wheel]') as HTMLElement
      expect(wheel.style.width).toBe('250px')
      expect(document.querySelector('[data-color-wheel-hue-ring]')).toBeInTheDocument()
      expect(document.querySelector('[data-color-wheel-area]')).toBeInTheDocument()
    })
  })
})
