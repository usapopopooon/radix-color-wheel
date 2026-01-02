import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('Swatch', () => {
  it('should render with current color', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Swatch />
      </ColorWheel.Root>
    )

    const swatch = screen.getByRole('img', { name: /current color/i })
    expect(swatch).toBeInTheDocument()
  })

  it('should have aria-label with current hex value', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Swatch />
      </ColorWheel.Root>
    )

    const swatch = screen.getByRole('img')
    expect(swatch).toHaveAttribute('aria-label', 'Current color: #ff0000')
  })

  it('should update aria-label when color changes', () => {
    const { rerender } = render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Swatch />
      </ColorWheel.Root>
    )

    const swatch = screen.getByRole('img')
    expect(swatch).toHaveAttribute('aria-label', 'Current color: #ff0000')

    rerender(
      <ColorWheel.Root value="#00ff00" onValueChange={() => {}}>
        <ColorWheel.Swatch />
      </ColorWheel.Root>
    )

    expect(swatch).toHaveAttribute('aria-label', 'Current color: #00ff00')
  })

  it('should have backgroundColor style matching current color', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Swatch />
      </ColorWheel.Root>
    )

    const swatch = screen.getByRole('img')
    expect(swatch).toHaveStyle({ backgroundColor: '#ff0000' })
  })

  it('should apply custom className', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Swatch className="custom-class" />
      </ColorWheel.Root>
    )

    const swatch = screen.getByRole('img')
    expect(swatch).toHaveClass('custom-class')
  })

  it('should have data-color-wheel-swatch attribute', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.Swatch />
      </ColorWheel.Root>
    )

    const swatch = screen.getByRole('img')
    expect(swatch).toHaveAttribute('data-color-wheel-swatch')
  })
})
