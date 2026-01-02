import { describe, it, expect } from 'vitest'
import { cssRgbToHex } from '../../utils'

describe('cssRgbToHex', () => {
  it('should convert rgb() to 6-digit hex', () => {
    expect(cssRgbToHex('rgb(255, 0, 0)')).toBe('#ff0000')
  })

  it('should convert rgba() with full opacity to 6-digit hex', () => {
    expect(cssRgbToHex('rgba(255, 0, 0, 1)')).toBe('#ff0000')
  })

  it('should convert rgba() with partial opacity to 8-digit hex', () => {
    expect(cssRgbToHex('rgba(255, 0, 0, 0.5)')).toBe('#ff000080')
  })

  it('should convert rgba() with zero opacity to 8-digit hex', () => {
    expect(cssRgbToHex('rgba(255, 0, 0, 0)')).toBe('#ff000000')
  })

  it('should handle green', () => {
    expect(cssRgbToHex('rgb(0, 255, 0)')).toBe('#00ff00')
  })

  it('should handle spaces variations', () => {
    expect(cssRgbToHex('rgb( 255 , 0 , 0 )')).toBe('#ff0000')
  })

  it('should throw on invalid format', () => {
    expect(() => cssRgbToHex('invalid')).toThrow()
  })

  it('should handle modern syntax with spaces', () => {
    expect(cssRgbToHex('rgb(255 0 0)')).toBe('#ff0000')
  })

  it('should handle modern syntax with alpha', () => {
    expect(cssRgbToHex('rgb(255 0 0 / 0.5)')).toBe('#ff000080')
  })
})
