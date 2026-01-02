import { describe, it, expect } from 'vitest'
import { hexToHsl } from '../../utils'

describe('hexToHsl', () => {
  it('should convert red', () => {
    expect(hexToHsl('#ff0000')).toEqual({ h: 0, s: 100, l: 50 })
  })

  it('should convert green', () => {
    expect(hexToHsl('#00ff00')).toEqual({ h: 120, s: 100, l: 50 })
  })

  it('should convert blue', () => {
    expect(hexToHsl('#0000ff')).toEqual({ h: 240, s: 100, l: 50 })
  })

  it('should convert white', () => {
    expect(hexToHsl('#ffffff')).toEqual({ h: 0, s: 0, l: 100 })
  })

  it('should convert black', () => {
    expect(hexToHsl('#000000')).toEqual({ h: 0, s: 0, l: 0 })
  })

  it('should convert gray', () => {
    const result = hexToHsl('#808080')
    expect(result.h).toBe(0)
    expect(result.s).toBe(0)
    expect(result.l).toBeCloseTo(50, 0)
  })

  it('should convert yellow', () => {
    expect(hexToHsl('#ffff00')).toEqual({ h: 60, s: 100, l: 50 })
  })

  it('should convert cyan', () => {
    expect(hexToHsl('#00ffff')).toEqual({ h: 180, s: 100, l: 50 })
  })

  it('should convert magenta', () => {
    expect(hexToHsl('#ff00ff')).toEqual({ h: 300, s: 100, l: 50 })
  })
})
