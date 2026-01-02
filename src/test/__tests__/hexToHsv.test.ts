import { describe, it, expect } from 'vitest'
import { hexToHsv } from '../../utils/hexToHsv'

describe('hexToHsv', () => {
  it('should convert #ff0000 to red (0, 100, 100)', () => {
    expect(hexToHsv('#ff0000')).toEqual({ h: 0, s: 100, v: 100 })
  })

  it('should convert #ffffff to white (0, 0, 100)', () => {
    expect(hexToHsv('#ffffff')).toEqual({ h: 0, s: 0, v: 100 })
  })

  it('should convert #000000 to black (0, 0, 0)', () => {
    expect(hexToHsv('#000000')).toEqual({ h: 0, s: 0, v: 0 })
  })

  it('should convert #00ff00 to green (120, 100, 100)', () => {
    expect(hexToHsv('#00ff00')).toEqual({ h: 120, s: 100, v: 100 })
  })

  it('should convert #0000ff to blue (240, 100, 100)', () => {
    expect(hexToHsv('#0000ff')).toEqual({ h: 240, s: 100, v: 100 })
  })

  it('should convert #ffff00 to yellow (60, 100, 100)', () => {
    expect(hexToHsv('#ffff00')).toEqual({ h: 60, s: 100, v: 100 })
  })

  it('should convert #00ffff to cyan (180, 100, 100)', () => {
    expect(hexToHsv('#00ffff')).toEqual({ h: 180, s: 100, v: 100 })
  })

  it('should convert #ff00ff to magenta (300, 100, 100)', () => {
    expect(hexToHsv('#ff00ff')).toEqual({ h: 300, s: 100, v: 100 })
  })

  it('should handle lowercase hex values', () => {
    expect(hexToHsv('#ff0000')).toEqual({ h: 0, s: 100, v: 100 })
  })

  it('should handle uppercase hex values', () => {
    expect(hexToHsv('#FF0000')).toEqual({ h: 0, s: 100, v: 100 })
  })

  it('should handle mixed case hex values', () => {
    expect(hexToHsv('#Ff0000')).toEqual({ h: 0, s: 100, v: 100 })
  })

  it('should convert gray #808080 correctly', () => {
    const result = hexToHsv('#808080')
    expect(result.h).toBe(0) // Gray has undefined hue, defaults to 0
    expect(result.s).toBe(0) // No saturation
    expect(result.v).toBe(50) // 50% brightness
  })
})
