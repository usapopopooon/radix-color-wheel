import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('HexInput', () => {
  it('should render with current hex value', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.HexInput />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    expect(input).toHaveValue('#ff0000')
  })

  it('should update value on valid hex input and Enter', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.HexInput />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '#00ff00' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onValueChange).toHaveBeenCalledWith('#00ff00')
  })

  it('should revert to previous value on Escape', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.HexInput />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '#00ff00' } })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(input).toHaveValue('#ff0000')
  })

  it('should revert to previous value on blur with invalid input', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.HexInput />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'invalid' } })
    fireEvent.blur(input)

    expect(input).toHaveValue('#ff0000')
  })

  it('should set aria-invalid to true for invalid hex', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.HexInput />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'invalid' } })

    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('should be disabled when parent Root is disabled', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.HexInput />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    expect(input).toBeDisabled()
  })

  it('should accept hex without # prefix', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.HexInput />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '00ff00' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onValueChange).toHaveBeenCalledWith('#00ff00')
  })

  it('should normalize uppercase hex to lowercase', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.HexInput />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '#AABBCC' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onValueChange).toHaveBeenCalledWith('#aabbcc')
  })

  it('should update value on blur with valid input', () => {
    const onValueChange = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.HexInput />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '#0000ff' } })
    fireEvent.blur(input)

    expect(onValueChange).toHaveBeenCalledWith('#0000ff')
  })

  it('should sync with external value changes', () => {
    const { rerender } = render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.HexInput />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    expect(input).toHaveValue('#ff0000')

    rerender(
      <ColorWheel.Root value="#00ff00" onValueChange={() => {}}>
        <ColorWheel.HexInput />
      </ColorWheel.Root>
    )

    expect(input).toHaveValue('#00ff00')
  })

  it('should call onCommit callback when valid hex is committed via Enter', () => {
    const onCommit = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.HexInput onCommit={onCommit} />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '#00ff00' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onCommit).toHaveBeenCalledWith('#00ff00')
  })

  it('should call onCommit callback when valid hex is committed via blur', () => {
    const onCommit = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.HexInput onCommit={onCommit} />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '#0000ff' } })
    fireEvent.blur(input)

    expect(onCommit).toHaveBeenCalledWith('#0000ff')
  })

  it('should not call onCommit callback when hex is invalid', () => {
    const onCommit = vi.fn()

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.HexInput onCommit={onCommit} />
      </ColorWheel.Root>
    )

    const input = screen.getByRole('textbox', { name: /hexadecimal color code/i })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'invalid' } })
    fireEvent.blur(input)

    expect(onCommit).not.toHaveBeenCalled()
  })
})
