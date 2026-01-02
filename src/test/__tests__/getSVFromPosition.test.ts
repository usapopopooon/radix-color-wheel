import { describe, it, expect } from 'vitest'
import { getSVFromPosition } from '../../utils/getSVFromPosition'

describe('getSVFromPosition', () => {
  const areaSize = 100

  it('should return (0, 100) at top-left corner (white)', () => {
    const result = getSVFromPosition(0, 0, areaSize)
    expect(result).toEqual({ s: 0, v: 100 })
  })

  it('should return (100, 100) at top-right corner (full color)', () => {
    const result = getSVFromPosition(areaSize, 0, areaSize)
    expect(result).toEqual({ s: 100, v: 100 })
  })

  it('should return (0, 0) at bottom-left corner (black)', () => {
    const result = getSVFromPosition(0, areaSize, areaSize)
    expect(result).toEqual({ s: 0, v: 0 })
  })

  it('should return (100, 0) at bottom-right corner', () => {
    const result = getSVFromPosition(areaSize, areaSize, areaSize)
    expect(result).toEqual({ s: 100, v: 0 })
  })

  it('should return (50, 50) at center', () => {
    const result = getSVFromPosition(50, 50, areaSize)
    expect(result).toEqual({ s: 50, v: 50 })
  })

  it('should clamp negative x values to 0% saturation', () => {
    const result = getSVFromPosition(-10, 50, areaSize)
    expect(result.s).toBe(0)
  })

  it('should clamp x values above areaSize to 100% saturation', () => {
    const result = getSVFromPosition(150, 50, areaSize)
    expect(result.s).toBe(100)
  })

  it('should clamp negative y values to 100% brightness', () => {
    const result = getSVFromPosition(50, -10, areaSize)
    expect(result.v).toBe(100)
  })

  it('should clamp y values above areaSize to 0% brightness', () => {
    const result = getSVFromPosition(50, 150, areaSize)
    expect(result.v).toBe(0)
  })

  it('should handle different area sizes', () => {
    // With area size of 200, position (100, 100) should be center
    const result = getSVFromPosition(100, 100, 200)
    expect(result).toEqual({ s: 50, v: 50 })
  })
})
