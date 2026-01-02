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
})
