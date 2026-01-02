import { describe, it, expect } from 'vitest'
import { hexToCssHsl } from '../../utils'

describe('hexToCssHsl', () => {
  it('should convert 6-digit hex to hsl()', () => {
    expect(hexToCssHsl('#ff0000')).toBe('hsl(0, 100%, 50%)')
  })

  it('should convert 8-digit hex with full opacity to hsl()', () => {
    expect(hexToCssHsl('#ff0000ff')).toBe('hsl(0, 100%, 50%)')
  })

  it('should convert 8-digit hex with partial opacity to hsla()', () => {
    expect(hexToCssHsl('#ff000080')).toBe('hsla(0, 100%, 50%, 0.5)')
  })

  it('should convert 8-digit hex with zero opacity to hsla()', () => {
    expect(hexToCssHsl('#ff000000')).toBe('hsla(0, 100%, 50%, 0)')
  })

  it('should handle green', () => {
    expect(hexToCssHsl('#00ff00')).toBe('hsl(120, 100%, 50%)')
  })

  it('should handle blue with alpha', () => {
    expect(hexToCssHsl('#0000ff40')).toBe('hsla(240, 100%, 50%, 0.25)')
  })

  it('should handle white', () => {
    expect(hexToCssHsl('#ffffff')).toBe('hsl(0, 0%, 100%)')
  })
})
