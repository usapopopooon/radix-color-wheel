import { describe, it, expect } from 'vitest'
import { cssHslToHex } from '../../utils'

describe('cssHslToHex', () => {
  it('should convert hsl() to 6-digit hex', () => {
    expect(cssHslToHex('hsl(0, 100%, 50%)')).toBe('#ff0000')
  })

  it('should convert hsla() with full opacity to 6-digit hex', () => {
    expect(cssHslToHex('hsla(0, 100%, 50%, 1)')).toBe('#ff0000')
  })

  it('should convert hsla() with partial opacity to 8-digit hex', () => {
    expect(cssHslToHex('hsla(0, 100%, 50%, 0.5)')).toBe('#ff000080')
  })

  it('should convert hsla() with zero opacity to 8-digit hex', () => {
    expect(cssHslToHex('hsla(0, 100%, 50%, 0)')).toBe('#ff000000')
  })

  it('should handle green', () => {
    expect(cssHslToHex('hsl(120, 100%, 50%)')).toBe('#00ff00')
  })

  it('should handle spaces variations', () => {
    expect(cssHslToHex('hsl( 0 , 100% , 50% )')).toBe('#ff0000')
  })

  it('should throw on invalid format', () => {
    expect(() => cssHslToHex('invalid')).toThrow()
  })

  it('should handle modern syntax with spaces', () => {
    expect(cssHslToHex('hsl(0 100% 50%)')).toBe('#ff0000')
  })

  it('should handle modern syntax with alpha', () => {
    expect(cssHslToHex('hsl(0 100% 50% / 0.5)')).toBe('#ff000080')
  })

  it('should handle white', () => {
    expect(cssHslToHex('hsl(0, 0%, 100%)')).toBe('#ffffff')
  })
})
