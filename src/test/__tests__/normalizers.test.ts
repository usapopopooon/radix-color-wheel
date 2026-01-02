import { describe, it, expect } from 'vitest'
import { ratioToPercent, ratioToHue, normalizeGamma, ratioToGamma } from '../../utils/normalizers'

describe('ratioToPercent', () => {
  it('should convert 0 to 0%', () => {
    expect(ratioToPercent(0)).toBe(0)
  })

  it('should convert 1 to 100%', () => {
    expect(ratioToPercent(1)).toBe(100)
  })

  it('should convert 0.5 to 50%', () => {
    expect(ratioToPercent(0.5)).toBe(50)
  })

  it('should round to nearest integer', () => {
    expect(ratioToPercent(0.333)).toBe(33)
    expect(ratioToPercent(0.666)).toBe(67)
    expect(ratioToPercent(0.999)).toBe(100)
  })

  it('should clamp values below 0', () => {
    expect(ratioToPercent(-0.5)).toBe(0)
    expect(ratioToPercent(-1)).toBe(0)
  })

  it('should clamp values above 1', () => {
    expect(ratioToPercent(1.5)).toBe(100)
    expect(ratioToPercent(2)).toBe(100)
  })
})

describe('ratioToHue', () => {
  it('should convert 0 to 0 degrees', () => {
    expect(ratioToHue(0)).toBe(0)
  })

  it('should convert 1 to 0 degrees (wraps around)', () => {
    expect(ratioToHue(1)).toBe(0)
  })

  it('should convert 0.5 to 180 degrees', () => {
    expect(ratioToHue(0.5)).toBe(180)
  })

  it('should convert 0.25 to 90 degrees', () => {
    expect(ratioToHue(0.25)).toBe(90)
  })

  it('should convert 0.75 to 270 degrees', () => {
    expect(ratioToHue(0.75)).toBe(270)
  })

  it('should wrap values at 360', () => {
    expect(ratioToHue(0.999)).toBe(0) // rounds to 360, then wraps to 0
  })

  it('should clamp values below 0', () => {
    expect(ratioToHue(-0.5)).toBe(0)
  })

  it('should clamp values above 1', () => {
    expect(ratioToHue(1.5)).toBe(0) // clamped to 1, then wrapped
  })
})

describe('normalizeGamma', () => {
  it('should return value within range', () => {
    expect(normalizeGamma(1.5, 0.5, 2.5, 0.1)).toBe(1.5)
  })

  it('should clamp values below min', () => {
    expect(normalizeGamma(0.3, 0.5, 2.5, 0.1)).toBe(0.5)
  })

  it('should clamp values above max', () => {
    expect(normalizeGamma(3.0, 0.5, 2.5, 0.1)).toBe(2.5)
  })

  it('should round to step precision', () => {
    expect(normalizeGamma(1.54, 0.5, 2.5, 0.1)).toBe(1.5)
    expect(normalizeGamma(1.56, 0.5, 2.5, 0.1)).toBe(1.6)
  })

  it('should handle step of 0.01', () => {
    expect(normalizeGamma(1.555, 0.5, 2.5, 0.01)).toBe(1.56)
    expect(normalizeGamma(1.554, 0.5, 2.5, 0.01)).toBe(1.55)
  })

  it('should round to 2 decimal places', () => {
    // Avoid floating-point issues
    const result = normalizeGamma(1.333, 0.5, 2.5, 0.1)
    expect(result).toBe(1.3)
  })
})

describe('ratioToGamma', () => {
  it('should convert 0 to min value', () => {
    expect(ratioToGamma(0, 0.5, 2.5)).toBe(0.5)
  })

  it('should convert 1 to max value', () => {
    expect(ratioToGamma(1, 0.5, 2.5)).toBe(2.5)
  })

  it('should convert 0.5 to middle value', () => {
    expect(ratioToGamma(0.5, 0.5, 2.5)).toBe(1.5)
  })

  it('should handle different ranges', () => {
    expect(ratioToGamma(0.5, 1.0, 3.0)).toBe(2.0)
    expect(ratioToGamma(0.25, 0, 4)).toBe(1)
  })

  it('should clamp values below 0', () => {
    expect(ratioToGamma(-0.5, 0.5, 2.5)).toBe(0.5)
  })

  it('should clamp values above 1', () => {
    expect(ratioToGamma(1.5, 0.5, 2.5)).toBe(2.5)
  })
})
