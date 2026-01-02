import { describe, it, expect } from 'vitest'
import { hsvToHex } from '../../utils/hsvToHex'

describe('hsvToHex', () => {
  it('should convert red (0, 100, 100) to #ff0000', () => {
    expect(hsvToHex(0, 100, 100)).toBe('#ff0000')
  })

  it('should convert white (0, 0, 100) to #ffffff', () => {
    expect(hsvToHex(0, 0, 100)).toBe('#ffffff')
  })

  it('should convert black (0, 0, 0) to #000000', () => {
    expect(hsvToHex(0, 0, 0)).toBe('#000000')
  })

  it('should convert green (120, 100, 100) to #00ff00', () => {
    expect(hsvToHex(120, 100, 100)).toBe('#00ff00')
  })

  it('should convert blue (240, 100, 100) to #0000ff', () => {
    expect(hsvToHex(240, 100, 100)).toBe('#0000ff')
  })

  it('should convert yellow (60, 100, 100) to #ffff00', () => {
    expect(hsvToHex(60, 100, 100)).toBe('#ffff00')
  })

  it('should convert cyan (180, 100, 100) to #00ffff', () => {
    expect(hsvToHex(180, 100, 100)).toBe('#00ffff')
  })

  it('should convert magenta (300, 100, 100) to #ff00ff', () => {
    expect(hsvToHex(300, 100, 100)).toBe('#ff00ff')
  })

  it('should convert gray (0, 0, 50) to #808080', () => {
    expect(hsvToHex(0, 0, 50)).toBe('#808080')
  })

  it('should handle half saturation correctly', () => {
    // Red with 50% saturation should be pinkish
    const result = hsvToHex(0, 50, 100)
    expect(result).toBe('#ff8080')
  })

  it('should handle half brightness correctly', () => {
    // Red with 50% brightness should be dark red
    const result = hsvToHex(0, 100, 50)
    expect(result).toBe('#800000')
  })
})
