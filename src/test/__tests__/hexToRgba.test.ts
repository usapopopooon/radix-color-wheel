import { describe, it, expect } from 'vitest'
import { hexToRgba } from '../../utils'

describe('hexToRgba', () => {
  it('should convert 6-digit hex with default alpha 1', () => {
    expect(hexToRgba('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })

  it('should convert 8-digit hex with full opacity', () => {
    expect(hexToRgba('#ff0000ff')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })

  it('should convert 8-digit hex with half opacity', () => {
    const result = hexToRgba('#ff000080')
    expect(result.r).toBe(255)
    expect(result.g).toBe(0)
    expect(result.b).toBe(0)
    expect(result.a).toBeCloseTo(0.5, 1)
  })

  it('should convert 8-digit hex with zero opacity', () => {
    expect(hexToRgba('#ff000000')).toEqual({ r: 255, g: 0, b: 0, a: 0 })
  })

  it('should handle green with alpha', () => {
    const result = hexToRgba('#00ff00c0')
    expect(result.r).toBe(0)
    expect(result.g).toBe(255)
    expect(result.b).toBe(0)
    expect(result.a).toBeCloseTo(0.75, 1)
  })
})
