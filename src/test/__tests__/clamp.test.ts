import { describe, it, expect } from 'vitest'
import { clamp } from '../../utils/clamp'

describe('clamp', () => {
  it('should return the value when it is within range', () => {
    expect(clamp(50, 0, 100)).toBe(50)
  })

  it('should return min when value is below range', () => {
    expect(clamp(-10, 0, 100)).toBe(0)
  })

  it('should return max when value is above range', () => {
    expect(clamp(150, 0, 100)).toBe(100)
  })

  it('should return min when value equals min', () => {
    expect(clamp(0, 0, 100)).toBe(0)
  })

  it('should return max when value equals max', () => {
    expect(clamp(100, 0, 100)).toBe(100)
  })

  it('should handle negative ranges', () => {
    expect(clamp(-50, -100, -10)).toBe(-50)
    expect(clamp(-200, -100, -10)).toBe(-100)
    expect(clamp(0, -100, -10)).toBe(-10)
  })

  it('should handle decimal values', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5)
    expect(clamp(-0.5, 0, 1)).toBe(0)
    expect(clamp(1.5, 0, 1)).toBe(1)
  })
})
