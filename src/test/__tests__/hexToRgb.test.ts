import { describe, it, expect } from 'vitest'
import { hexToRgb } from '../../utils'

describe('hexToRgb', () => {
  it('should convert red', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('should convert green', () => {
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 })
  })

  it('should convert blue', () => {
    expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 })
  })

  it('should convert white', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('should convert black', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('should convert gray', () => {
    expect(hexToRgb('#808080')).toEqual({ r: 128, g: 128, b: 128 })
  })

  it('should handle mixed colors', () => {
    expect(hexToRgb('#3b82f6')).toEqual({ r: 59, g: 130, b: 246 })
  })
})
