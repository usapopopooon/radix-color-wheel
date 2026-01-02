import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ColorWheelSimple } from '../../presets/Simple'

describe('ColorWheelSimple', () => {
  it('should render with default props', () => {
    render(<ColorWheelSimple value="#ff0000" onValueChange={() => {}} />)

    // Should have hue slider
    expect(screen.getByRole('slider', { name: /hue/i })).toBeInTheDocument()
    // Should have area slider
    expect(screen.getByRole('slider', { name: /saturation and brightness/i })).toBeInTheDocument()
    // Should have swatch by default
    expect(screen.getByRole('img', { name: /current color/i })).toBeInTheDocument()
    // Should have hex input by default
    expect(screen.getByRole('textbox', { name: /hexadecimal color code/i })).toBeInTheDocument()
  })

  it('should hide swatch when showSwatch is false', () => {
    render(<ColorWheelSimple value="#ff0000" onValueChange={() => {}} showSwatch={false} />)

    expect(screen.queryByRole('img', { name: /current color/i })).not.toBeInTheDocument()
  })

  it('should hide hex input when showHexInput is false', () => {
    render(<ColorWheelSimple value="#ff0000" onValueChange={() => {}} showHexInput={false} />)

    expect(screen.queryByRole('textbox', { name: /hexadecimal color code/i })).not.toBeInTheDocument()
  })

  it('should hide both swatch and hex input', () => {
    render(
      <ColorWheelSimple
        value="#ff0000"
        onValueChange={() => {}}
        showSwatch={false}
        showHexInput={false}
      />
    )

    expect(screen.queryByRole('img', { name: /current color/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: /hexadecimal color code/i })).not.toBeInTheDocument()
  })

  it('should call onValueChange when color changes', () => {
    const onValueChange = vi.fn()

    render(<ColorWheelSimple value="#ff0000" onValueChange={onValueChange} />)

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    fireEvent.keyDown(hueThumb, { key: 'ArrowRight' })

    expect(onValueChange).toHaveBeenCalled()
  })

  it('should work in uncontrolled mode with defaultValue', () => {
    render(<ColorWheelSimple defaultValue="#00ff00" />)

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    // Green has hue of 120
    expect(hueThumb).toHaveAttribute('aria-valuenow', '120')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<ColorWheelSimple value="#ff0000" onValueChange={() => {}} disabled />)

    const hueThumb = screen.getByRole('slider', { name: /hue/i })
    expect(hueThumb).toHaveAttribute('aria-disabled', 'true')

    const hexInput = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    expect(hexInput).toBeDisabled()
  })

  it('should render with custom size', () => {
    const { container } = render(
      <ColorWheelSimple value="#ff0000" onValueChange={() => {}} size={300} />
    )

    const wheel = container.querySelector('[data-color-wheel-wheel]')
    expect(wheel).toHaveStyle({ width: '300px', height: '300px' })
  })

  it('should sync hex input with color value', () => {
    render(<ColorWheelSimple value="#ff0000" onValueChange={() => {}} />)

    const hexInput = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    expect(hexInput).toHaveValue('#ff0000')
  })
})
