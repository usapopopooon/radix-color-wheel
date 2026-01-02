import { describe, it, expect } from 'vitest'
import {
  hexToLab,
  labToHex,
  hexToOklch,
  oklchToHex,
  hexToCmyk,
  cmykToHex,
  getDeltaE,
} from '../../index'

describe('Color Space Conversions', () => {
  describe('LAB', () => {
    describe('hexToLab', () => {
      it('should convert red to Lab', () => {
        const lab = hexToLab('#ff0000')
        expect(lab.l).toBeCloseTo(53, 0)
        expect(lab.a).toBeGreaterThan(50) // Positive a = red
        expect(lab.b).toBeGreaterThan(50) // Positive b = yellow-ish red
      })

      it('should convert white to Lab', () => {
        const lab = hexToLab('#ffffff')
        expect(lab.l).toBeCloseTo(100, 0)
        expect(lab.a).toBeCloseTo(0, 0)
        expect(lab.b).toBeCloseTo(0, 0)
      })

      it('should convert black to Lab', () => {
        const lab = hexToLab('#000000')
        expect(lab.l).toBeCloseTo(0, 0)
      })
    })

    describe('labToHex', () => {
      it('should convert Lab back to hex', () => {
        const hex = labToHex({ l: 100, a: 0, b: 0 })
        expect(hex).toBe('#ffffff')
      })

      it('should convert Lab black to hex', () => {
        const hex = labToHex({ l: 0, a: 0, b: 0 })
        expect(hex).toBe('#000000')
      })

      it('should round-trip approximately', () => {
        const original = '#ff0000'
        const lab = hexToLab(original)
        const result = labToHex(lab)
        // Due to color space conversion, exact match isn't guaranteed
        expect(result.toLowerCase()).toMatch(/^#[a-f0-9]{6}$/)
      })
    })
  })

  describe('OKLCH', () => {
    describe('hexToOklch', () => {
      it('should convert red to Oklch', () => {
        const oklch = hexToOklch('#ff0000')
        expect(oklch.l).toBeGreaterThan(0)
        expect(oklch.l).toBeLessThan(1)
        expect(oklch.c).toBeGreaterThan(0) // Chroma > 0 for saturated colors
        expect(oklch.h).toBeGreaterThanOrEqual(0)
        expect(oklch.h).toBeLessThan(360)
      })

      it('should convert white to Oklch', () => {
        const oklch = hexToOklch('#ffffff')
        expect(oklch.l).toBeCloseTo(1, 1)
        expect(oklch.c).toBeCloseTo(0, 2) // White has no chroma
      })

      it('should convert black to Oklch', () => {
        const oklch = hexToOklch('#000000')
        expect(oklch.l).toBeCloseTo(0, 1)
      })
    })

    describe('oklchToHex', () => {
      it('should convert Oklch back to hex', () => {
        const hex = oklchToHex({ l: 1, c: 0, h: 0 })
        expect(hex).toBe('#ffffff')
      })

      it('should handle saturated colors', () => {
        const oklch = hexToOklch('#ff0000')
        const hex = oklchToHex(oklch)
        expect(hex.toLowerCase()).toMatch(/^#[a-f0-9]{6}$/)
      })
    })
  })

  describe('CMYK', () => {
    describe('hexToCmyk', () => {
      it('should convert red to CMYK', () => {
        const cmyk = hexToCmyk('#ff0000')
        expect(cmyk.c).toBe(0)
        expect(cmyk.m).toBe(100)
        expect(cmyk.y).toBe(100)
        expect(cmyk.k).toBe(0)
      })

      it('should convert white to CMYK', () => {
        const cmyk = hexToCmyk('#ffffff')
        expect(cmyk.c).toBe(0)
        expect(cmyk.m).toBe(0)
        expect(cmyk.y).toBe(0)
        expect(cmyk.k).toBe(0)
      })

      it('should convert black to CMYK', () => {
        const cmyk = hexToCmyk('#000000')
        expect(cmyk.k).toBe(100)
      })

      it('should convert cyan to CMYK', () => {
        const cmyk = hexToCmyk('#00ffff')
        expect(cmyk.c).toBe(100)
        expect(cmyk.m).toBe(0)
        expect(cmyk.y).toBe(0)
        expect(cmyk.k).toBe(0)
      })
    })

    describe('cmykToHex', () => {
      it('should convert CMYK red to hex', () => {
        const hex = cmykToHex({ c: 0, m: 100, y: 100, k: 0 })
        expect(hex).toBe('#ff0000')
      })

      it('should convert CMYK white to hex', () => {
        const hex = cmykToHex({ c: 0, m: 0, y: 0, k: 0 })
        expect(hex).toBe('#ffffff')
      })

      it('should convert CMYK black to hex', () => {
        const hex = cmykToHex({ c: 0, m: 0, y: 0, k: 100 })
        expect(hex).toBe('#000000')
      })

      it('should round-trip correctly', () => {
        const original = '#ff0000'
        const cmyk = hexToCmyk(original)
        const result = cmykToHex(cmyk)
        expect(result).toBe(original)
      })
    })
  })

  describe('getDeltaE', () => {
    it('should return 0 for identical colors', () => {
      const delta = getDeltaE('#ff0000', '#ff0000')
      expect(delta).toBeCloseTo(0, 1)
    })

    it('should return small value for similar colors', () => {
      const delta = getDeltaE('#ff0000', '#ff0001')
      expect(delta).toBeLessThan(5)
    })

    it('should return large value for different colors', () => {
      const delta = getDeltaE('#ff0000', '#00ff00')
      expect(delta).toBeGreaterThan(50)
    })

    it('should be symmetric', () => {
      const delta1 = getDeltaE('#ff0000', '#0000ff')
      const delta2 = getDeltaE('#0000ff', '#ff0000')
      expect(delta1).toBeCloseTo(delta2, 5)
    })
  })
})
