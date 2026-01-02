import { describe, it, expect } from 'vitest'
import { hslaToHex } from '../../utils'

describe('hslaToHex', () => {
  it('should convert with full opacity', () => {
    expect(hslaToHex({ h: 0, s: 100, l: 50, a: 1 })).toBe('#ff0000ff')
  })

  it('should convert with half opacity', () => {
    expect(hslaToHex({ h: 0, s: 100, l: 50, a: 0.5 })).toBe('#ff000080')
  })

  it('should convert with zero opacity', () => {
    expect(hslaToHex({ h: 0, s: 100, l: 50, a: 0 })).toBe('#ff000000')
  })

  it('should handle green with partial alpha', () => {
    expect(hslaToHex({ h: 120, s: 100, l: 50, a: 0.75 })).toBe('#00ff00bf')
  })

  it('should handle blue with partial alpha', () => {
    expect(hslaToHex({ h: 240, s: 100, l: 50, a: 0.25 })).toBe('#0000ff40')
  })
})
