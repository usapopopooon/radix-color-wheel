import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('PasteButton', () => {
  const mockReadText = vi.fn()

  beforeEach(() => {
    mockReadText.mockReset()
    vi.stubGlobal('navigator', {
      clipboard: {
        readText: mockReadText,
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should render with children', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.PasteButton>Paste</ColorWheel.PasteButton>
      </ColorWheel.Root>
    )

    expect(screen.getByRole('button', { name: /paste color/i })).toBeInTheDocument()
    expect(screen.getByText('Paste')).toBeInTheDocument()
  })

  it('should have aria-label', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.PasteButton>Paste</ColorWheel.PasteButton>
      </ColorWheel.Root>
    )

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Paste color')
  })

  it('should paste valid hex color from clipboard', async () => {
    const onValueChange = vi.fn()
    const onPaste = vi.fn()
    mockReadText.mockResolvedValue('#00ff00')

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.PasteButton onPaste={onPaste}>Paste</ColorWheel.PasteButton>
      </ColorWheel.Root>
    )

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(onPaste).toHaveBeenCalledWith('#00ff00')
    })
    expect(onValueChange).toHaveBeenCalledWith('#00ff00')
  })

  it('should normalize hex color without hash', async () => {
    const onValueChange = vi.fn()
    const onPaste = vi.fn()
    mockReadText.mockResolvedValue('00ff00')

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.PasteButton onPaste={onPaste}>Paste</ColorWheel.PasteButton>
      </ColorWheel.Root>
    )

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(onPaste).toHaveBeenCalledWith('#00ff00')
    })
  })

  it('should call onError for invalid hex color', async () => {
    const onValueChange = vi.fn()
    const onError = vi.fn()
    mockReadText.mockResolvedValue('invalid')

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.PasteButton onError={onError}>Paste</ColorWheel.PasteButton>
      </ColorWheel.Root>
    )

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(onError).toHaveBeenCalled()
    })
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('should call onError when clipboard read fails', async () => {
    const onError = vi.fn()
    mockReadText.mockRejectedValue(new Error('Permission denied'))

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.PasteButton onError={onError}>Paste</ColorWheel.PasteButton>
      </ColorWheel.Root>
    )

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(onError).toHaveBeenCalled()
    })
  })

  it('should be disabled when parent is disabled', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.PasteButton>Paste</ColorWheel.PasteButton>
      </ColorWheel.Root>
    )

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should not paste when disabled', async () => {
    const onPaste = vi.fn()
    mockReadText.mockResolvedValue('#00ff00')

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.PasteButton onPaste={onPaste}>Paste</ColorWheel.PasteButton>
      </ColorWheel.Root>
    )

    fireEvent.click(screen.getByRole('button'))

    // Wait a bit to ensure no async calls were made
    await new Promise((r) => setTimeout(r, 50))
    expect(mockReadText).not.toHaveBeenCalled()
    expect(onPaste).not.toHaveBeenCalled()
  })

  it('should have data-color-wheel-paste-button attribute', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.PasteButton>Paste</ColorWheel.PasteButton>
      </ColorWheel.Root>
    )

    expect(screen.getByRole('button')).toHaveAttribute('data-color-wheel-paste-button')
  })

  it('should apply custom className', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.PasteButton className="custom-class">Paste</ColorWheel.PasteButton>
      </ColorWheel.Root>
    )

    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('should handle 8-digit hex with alpha', async () => {
    const onValueChange = vi.fn()
    const onPaste = vi.fn()
    mockReadText.mockResolvedValue('#ff000080')

    render(
      <ColorWheel.Root value="#ff0000" onValueChange={onValueChange}>
        <ColorWheel.PasteButton onPaste={onPaste}>Paste</ColorWheel.PasteButton>
      </ColorWheel.Root>
    )

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(onPaste).toHaveBeenCalledWith('#ff000080')
    })
  })
})
