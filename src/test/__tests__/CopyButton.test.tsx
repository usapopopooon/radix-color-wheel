import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import * as ColorWheel from '../../components'

describe('CopyButton', () => {
  const mockWriteText = vi.fn()

  beforeEach(() => {
    mockWriteText.mockReset()
    mockWriteText.mockResolvedValue(undefined)
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: mockWriteText,
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should render with children', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.CopyButton>Copy</ColorWheel.CopyButton>
      </ColorWheel.Root>
    )

    expect(screen.getByRole('button', { name: /copy color/i })).toBeInTheDocument()
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })

  it('should have aria-label', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.CopyButton>Copy</ColorWheel.CopyButton>
      </ColorWheel.Root>
    )

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy color')
  })

  it('should copy color to clipboard on click', async () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.CopyButton>Copy</ColorWheel.CopyButton>
      </ColorWheel.Root>
    )

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('#FF0000')
    })
  })

  it('should call onCopy callback after copying', async () => {
    const onCopy = vi.fn()
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.CopyButton onCopy={onCopy}>Copy</ColorWheel.CopyButton>
      </ColorWheel.Root>
    )

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(onCopy).toHaveBeenCalledWith('#FF0000')
    })
  })

  it('should be disabled when parent is disabled', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.CopyButton>Copy</ColorWheel.CopyButton>
      </ColorWheel.Root>
    )

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should not copy when disabled', async () => {
    const onCopy = vi.fn()
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}} disabled>
        <ColorWheel.CopyButton onCopy={onCopy}>Copy</ColorWheel.CopyButton>
      </ColorWheel.Root>
    )

    fireEvent.click(screen.getByRole('button'))

    // Wait a bit to ensure no async calls were made
    await new Promise((r) => setTimeout(r, 50))
    expect(mockWriteText).not.toHaveBeenCalled()
    expect(onCopy).not.toHaveBeenCalled()
  })

  it('should have data-color-wheel-copy-button attribute', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.CopyButton>Copy</ColorWheel.CopyButton>
      </ColorWheel.Root>
    )

    expect(screen.getByRole('button')).toHaveAttribute('data-color-wheel-copy-button')
  })

  it('should apply custom className', () => {
    render(
      <ColorWheel.Root value="#ff0000" onValueChange={() => {}}>
        <ColorWheel.CopyButton className="custom-class">Copy</ColorWheel.CopyButton>
      </ColorWheel.Root>
    )

    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })
})
