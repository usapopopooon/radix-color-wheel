import { describe, it, expect } from 'vitest'
import { hexToCssRgb } from '../../utils'

describe('hexToCssRgb', () => {
  it('should convert 6-digit hex to rgb()', () => {
    expect(hexToCssRgb('#ff0000')).toBe('rgb(255, 0, 0)')
  })

  it('should convert 8-digit hex with full opacity to rgb()', () => {
    expect(hexToCssRgb('#ff0000ff')).toBe('rgb(255, 0, 0)')
  })

  it('should convert 8-digit hex with partial opacity to rgba()', () => {
    expect(hexToCssRgb('#ff000080')).toBe('rgba(255, 0, 0, 0.5)')
  })

  it('should convert 8-digit hex with zero opacity to rgba()', () => {
    expect(hexToCssRgb('#ff000000')).toBe('rgba(255, 0, 0, 0)')
  })

  it('should handle green', () => {
    expect(hexToCssRgb('#00ff00')).toBe('rgb(0, 255, 0)')
  })

  it('should handle blue with alpha', () => {
    expect(hexToCssRgb('#0000ff40')).toBe('rgba(0, 0, 255, 0.25)')
  })
})
