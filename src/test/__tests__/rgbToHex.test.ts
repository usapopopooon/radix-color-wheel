import { describe, it, expect } from 'vitest'
import { rgbToHex } from '../../utils'

describe('rgbToHex', () => {
  it('should convert red', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000')
  })

  it('should convert green', () => {
    expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00ff00')
  })

  it('should convert blue', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe('#0000ff')
  })

  it('should convert white', () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff')
  })

  it('should convert black', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
  })

  it('should throw error for values over 255', () => {
    expect(() => rgbToHex({ r: 300, g: 0, b: 0 })).toThrow()
  })

  it('should throw error for values under 0', () => {
    expect(() => rgbToHex({ r: -10, g: 0, b: 0 })).toThrow()
  })
})
