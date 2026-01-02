import { describe, it, expect } from 'vitest'
import {
  getLuminance,
  getContrastRatio,
  isReadable,
  suggestTextColor,
  getBestContrast,
  isLight,
  isDark,
} from '../../index'

describe('Accessibility Functions', () => {
  describe('getLuminance', () => {
    it('should return 1 for white', () => {
      expect(getLuminance('#ffffff')).toBeCloseTo(1, 2)
    })

    it('should return 0 for black', () => {
      expect(getLuminance('#000000')).toBeCloseTo(0, 5)
    })

    it('should return intermediate value for gray', () => {
      const lum = getLuminance('#808080')
      expect(lum).toBeGreaterThan(0)
      expect(lum).toBeLessThan(1)
    })
  })

  describe('getContrastRatio', () => {
    it('should return 21 for black and white', () => {
      expect(getContrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 0)
    })

    it('should return 1 for identical colors', () => {
      expect(getContrastRatio('#ff0000', '#ff0000')).toBeCloseTo(1, 2)
    })

    it('should be symmetric', () => {
      const ratio1 = getContrastRatio('#ff0000', '#0000ff')
      const ratio2 = getContrastRatio('#0000ff', '#ff0000')
      expect(ratio1).toBeCloseTo(ratio2, 5)
    })
  })

  describe('isReadable', () => {
    it('should pass AA for black on white', () => {
      expect(isReadable('#000000', '#ffffff')).toBe(true)
    })

    it('should pass AAA for black on white', () => {
      expect(isReadable('#000000', '#ffffff', { level: 'AAA' })).toBe(true)
    })

    it('should fail for similar colors', () => {
      expect(isReadable('#cccccc', '#dddddd')).toBe(false)
    })

    it('should have different thresholds for large text', () => {
      // A ratio that passes large text AA but not normal text AA
      const gray = '#767676' // ~4.54:1 contrast with white
      expect(isReadable(gray, '#ffffff', { size: 'large' })).toBe(true)
    })
  })

  describe('suggestTextColor', () => {
    it('should suggest black for white background', () => {
      expect(suggestTextColor('#ffffff')).toBe('#000000')
    })

    it('should suggest white for black background', () => {
      expect(suggestTextColor('#000000')).toBe('#ffffff')
    })

    it('should suggest white for dark colors', () => {
      expect(suggestTextColor('#000080')).toBe('#ffffff')
      expect(suggestTextColor('#800000')).toBe('#ffffff')
    })

    it('should suggest black for light colors', () => {
      expect(suggestTextColor('#ffff00')).toBe('#000000')
      expect(suggestTextColor('#00ffff')).toBe('#000000')
    })
  })

  describe('getBestContrast', () => {
    it('should return white for dark background', () => {
      expect(getBestContrast('#000000', ['#ffffff', '#000000'])).toBe('#ffffff')
    })

    it('should return black for light background', () => {
      expect(getBestContrast('#ffffff', ['#ffffff', '#000000'])).toBe('#000000')
    })

    it('should throw for empty options', () => {
      expect(() => getBestContrast('#ffffff', [])).toThrow()
    })
  })

  describe('isLight / isDark', () => {
    it('should correctly identify light colors', () => {
      expect(isLight('#ffffff')).toBe(true)
      expect(isLight('#ffff00')).toBe(true)
      expect(isDark('#ffffff')).toBe(false)
    })

    it('should correctly identify dark colors', () => {
      expect(isDark('#000000')).toBe(true)
      expect(isDark('#000080')).toBe(true)
      expect(isLight('#000000')).toBe(false)
    })
  })
})
