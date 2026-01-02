import { describe, it, expect } from 'vitest'
import { rgbaToHex } from '../../utils'

describe('rgbaToHex', () => {
  it('should convert with full opacity', () => {
    expect(rgbaToHex({ r: 255, g: 0, b: 0, a: 1 })).toBe('#ff0000ff')
  })

  it('should convert with half opacity', () => {
    expect(rgbaToHex({ r: 255, g: 0, b: 0, a: 0.5 })).toBe('#ff000080')
  })

  it('should convert with zero opacity', () => {
    expect(rgbaToHex({ r: 255, g: 0, b: 0, a: 0 })).toBe('#ff000000')
  })

  it('should clamp alpha over 1', () => {
    expect(rgbaToHex({ r: 255, g: 0, b: 0, a: 1.5 })).toBe('#ff0000ff')
  })

  it('should clamp alpha under 0', () => {
    expect(rgbaToHex({ r: 255, g: 0, b: 0, a: -0.5 })).toBe('#ff000000')
  })

  it('should handle green with partial alpha', () => {
    expect(rgbaToHex({ r: 0, g: 255, b: 0, a: 0.75 })).toBe('#00ff00bf')
  })
})
