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

  it('should set alpha to 0 when pressing Alt+ArrowLeft', () => {
    const onAlphaChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onAlphaChange={onAlphaChange}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    fireEvent.keyDown(slider, { key: 'ArrowLeft', altKey: true })

    expect(onAlphaChange).toHaveBeenCalledWith(0)
  })

  it('should set alpha to 100 when pressing Alt+ArrowRight', () => {
    const onAlphaChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff000080" onValueChange={() => {}} onAlphaChange={onAlphaChange}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight', altKey: true })

    expect(onAlphaChange).toHaveBeenCalledWith(100)
  })

  it('should decrease alpha when A key is pressed (WASD)', () => {
    const onAlphaChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} onAlphaChange={onAlphaChange}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    fireEvent.keyDown(slider, { key: 'a' })

    expect(onAlphaChange).toHaveBeenCalledWith(99)
  })

  it('should increase alpha when D key is pressed (WASD)', () => {
    const onAlphaChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff000080" onValueChange={() => {}} onAlphaChange={onAlphaChange}>
        <ColorWheel.AlphaSlider />
      </ColorWheel.Root>
    )

    const slider = screen.getByRole('slider', { name: /opacity/i })
    fireEvent.keyDown(slider, { key: 'd' })

    expect(onAlphaChange).toHaveBeenCalledWith(51)
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

  describe('trackSize and thumbSize props', () => {
    it('should apply custom trackSize to horizontal slider', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.AlphaSlider trackSize={20} />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector(
        '[data-color-wheel-alpha-slider]'
      ) as HTMLElement
      expect(sliderContainer.style.height).toBe('20px')
    })

    it('should apply custom trackSize to vertical slider', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.AlphaSlider orientation="vertical" trackSize={20} />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector(
        '[data-color-wheel-alpha-slider]'
      ) as HTMLElement
      expect(sliderContainer.style.width).toBe('20px')
    })

    it('should apply custom thumbSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.AlphaSlider thumbSize={24} />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /opacity/i })
      expect(slider.style.width).toBe('24px')
      expect(slider.style.height).toBe('24px')
    })

    it('should use default trackSize of 12', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.AlphaSlider />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector(
        '[data-color-wheel-alpha-slider]'
      ) as HTMLElement
      expect(sliderContainer.style.height).toBe('12px')
    })

    it('should use default thumbSize of 16', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.AlphaSlider />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /opacity/i })
      expect(slider.style.width).toBe('16px')
      expect(slider.style.height).toBe('16px')
    })

    it('should apply borderRadius based on trackSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.AlphaSlider trackSize={20} />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector(
        '[data-color-wheel-alpha-slider]'
      ) as HTMLElement
      // borderRadius = trackSize / 2 = 10
      expect(sliderContainer.style.borderRadius).toBe('10px')
    })

    it('should allow very small trackSize and thumbSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.AlphaSlider trackSize={8} thumbSize={10} />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector(
        '[data-color-wheel-alpha-slider]'
      ) as HTMLElement
      const slider = screen.getByRole('slider', { name: /opacity/i })

      expect(sliderContainer.style.height).toBe('8px')
      expect(slider.style.width).toBe('10px')
    })

    it('should allow very large trackSize and thumbSize', () => {
      render(
        <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
          <ColorWheel.AlphaSlider trackSize={32} thumbSize={40} />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector(
        '[data-color-wheel-alpha-slider]'
      ) as HTMLElement
      const slider = screen.getByRole('slider', { name: /opacity/i })

      expect(sliderContainer.style.height).toBe('32px')
      expect(slider.style.width).toBe('40px')
    })
  })

  describe('inverted prop', () => {
    it('should position thumb at 0% when alpha is 100 with inverted=true', () => {
      render(
        <ColorWheel.Root value="#ff0000" alpha={100} onValueChange={() => {}}>
          <ColorWheel.AlphaSlider inverted />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /opacity/i })
      // With inverted=true and alpha=100, thumb should be at 0% (left side)
      expect(slider.style.left).toBe('0%')
    })

    it('should position thumb at 100% when alpha is 0 with inverted=true', () => {
      render(
        <ColorWheel.Root value="#ff0000" alpha={0} onValueChange={() => {}}>
          <ColorWheel.AlphaSlider inverted />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /opacity/i })
      // With inverted=true and alpha=0, thumb should be at 100% (right side)
      expect(slider.style.left).toBe('100%')
    })

    it('should position thumb at 50% when alpha is 50 with inverted=true', () => {
      render(
        <ColorWheel.Root value="#ff0000" alpha={50} onValueChange={() => {}}>
          <ColorWheel.AlphaSlider inverted />
        </ColorWheel.Root>
      )

      const slider = screen.getByRole('slider', { name: /opacity/i })
      expect(slider.style.left).toBe('50%')
    })

    it('should update alpha correctly when clicking on inverted horizontal slider', () => {
      const onAlphaChange = vi.fn()

      render(
        <ColorWheel.Root
          value="#ff0000"
          alpha={100}
          onValueChange={() => {}}
          onAlphaChange={onAlphaChange}
        >
          <ColorWheel.AlphaSlider inverted />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector(
        '[data-color-wheel-alpha-slider]'
      ) as HTMLElement

      // Mock getBoundingClientRect
      sliderContainer.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 100,
        height: 12,
      })

      // Mock setPointerCapture
      sliderContainer.setPointerCapture = vi.fn()

      // Click at position 75 (75% from left)
      // With inverted=true, this should result in alpha = 100 - 75 = 25
      fireEvent.pointerDown(sliderContainer, { clientX: 75, clientY: 6, pointerId: 1 })

      expect(onAlphaChange).toHaveBeenCalledWith(25)
    })

    it('should update alpha correctly when clicking on inverted vertical slider', () => {
      const onAlphaChange = vi.fn()

      render(
        <ColorWheel.Root
          value="#ff0000"
          alpha={100}
          onValueChange={() => {}}
          onAlphaChange={onAlphaChange}
        >
          <ColorWheel.AlphaSlider orientation="vertical" inverted />
        </ColorWheel.Root>
      )

      const sliderContainer = document.querySelector(
        '[data-color-wheel-alpha-slider]'
      ) as HTMLElement

      // Mock getBoundingClientRect
      sliderContainer.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 12,
        height: 100,
      })

      // Mock setPointerCapture
      sliderContainer.setPointerCapture = vi.fn()

      // Click at position 25 from top (25% from top)
      // With inverted=true, this should result in alpha = 100 - 25 = 75
      fireEvent.pointerDown(sliderContainer, { clientX: 6, clientY: 25, pointerId: 1 })

      expect(onAlphaChange).toHaveBeenCalledWith(75)
    })
  })
})
