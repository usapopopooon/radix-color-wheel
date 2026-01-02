import { describe, it, expect } from 'vitest'
import { hslToHex } from '../../utils'

describe('hslToHex', () => {
  it('should convert red', () => {
    expect(hslToHex({ h: 0, s: 100, l: 50 })).toBe('#ff0000')
  })

  it('should convert green', () => {
    expect(hslToHex({ h: 120, s: 100, l: 50 })).toBe('#00ff00')
  })

  it('should convert blue', () => {
    expect(hslToHex({ h: 240, s: 100, l: 50 })).toBe('#0000ff')
  })

  it('should convert white', () => {
    expect(hslToHex({ h: 0, s: 0, l: 100 })).toBe('#ffffff')
  })

  it('should convert black', () => {
    expect(hslToHex({ h: 0, s: 0, l: 0 })).toBe('#000000')
  })

  it('should convert gray', () => {
    expect(hslToHex({ h: 0, s: 0, l: 50 })).toBe('#808080')
  })

  it('should convert yellow', () => {
    expect(hslToHex({ h: 60, s: 100, l: 50 })).toBe('#ffff00')
  })

  it('should convert cyan', () => {
    expect(hslToHex({ h: 180, s: 100, l: 50 })).toBe('#00ffff')
  })

  it('should convert magenta', () => {
    expect(hslToHex({ h: 300, s: 100, l: 50 })).toBe('#ff00ff')
  })
})
