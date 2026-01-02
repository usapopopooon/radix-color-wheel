import { describe, it, expect } from 'vitest'
import { hexToHsla } from '../../utils'

describe('hexToHsla', () => {
  it('should convert 6-digit hex with default alpha 1', () => {
    expect(hexToHsla('#ff0000')).toEqual({ h: 0, s: 100, l: 50, a: 1 })
  })

  it('should convert 8-digit hex with full opacity', () => {
    expect(hexToHsla('#ff0000ff')).toEqual({ h: 0, s: 100, l: 50, a: 1 })
  })

  it('should convert 8-digit hex with half opacity', () => {
    const result = hexToHsla('#ff000080')
    expect(result.h).toBe(0)
    expect(result.s).toBe(100)
    expect(result.l).toBe(50)
    expect(result.a).toBeCloseTo(0.5, 1)
  })

  it('should convert 8-digit hex with zero opacity', () => {
    expect(hexToHsla('#ff000000')).toEqual({ h: 0, s: 100, l: 50, a: 0 })
  })

  it('should handle green with alpha', () => {
    const result = hexToHsla('#00ff00c0')
    expect(result.h).toBe(120)
    expect(result.s).toBe(100)
    expect(result.l).toBe(50)
    expect(result.a).toBeCloseTo(0.75, 1)
  })
})
