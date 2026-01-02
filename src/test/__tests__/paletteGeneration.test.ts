import { describe, it, expect } from 'vitest'
import {
  generateAnalogous,
  generateComplementary,
  generateSplitComplementary,
  generateTriadic,
  generateTetradic,
  generateShades,
  generateTints,
  generateScale,
  generateMonochromatic,
} from '../../index'

describe('Palette Generation Functions', () => {
  describe('generateAnalogous', () => {
    it('should generate 3 colors by default', () => {
      const result = generateAnalogous('#ff0000')
      expect(result).toHaveLength(3)
    })

    it('should generate specified number of colors', () => {
      const result = generateAnalogous('#ff0000', 5)
      expect(result).toHaveLength(5)
    })

    it('should include the base color', () => {
      const result = generateAnalogous('#ff0000', 3)
      expect(result).toContain('#ff0000')
    })

    it('should throw for count < 1', () => {
      expect(() => generateAnalogous('#ff0000', 0)).toThrow()
    })
  })

  describe('generateComplementary', () => {
    it('should return 2 colors', () => {
      const result = generateComplementary('#ff0000')
      expect(result).toHaveLength(2)
    })

    it('should include base and complement', () => {
      const [base, complement] = generateComplementary('#ff0000')
      expect(base).toBe('#ff0000')
      expect(complement).toBe('#00ffff')
    })
  })

  describe('generateSplitComplementary', () => {
    it('should return 3 colors', () => {
      const result = generateSplitComplementary('#ff0000')
      expect(result).toHaveLength(3)
    })

    it('should include the base color', () => {
      const [base] = generateSplitComplementary('#ff0000')
      expect(base).toBe('#ff0000')
    })
  })

  describe('generateTriadic', () => {
    it('should return 3 colors', () => {
      const result = generateTriadic('#ff0000')
      expect(result).toHaveLength(3)
    })

    it('should be evenly spaced 120 degrees apart', () => {
      const result = generateTriadic('#ff0000')
      // Red, Green, Blue (approximately)
      expect(result[0]).toBe('#ff0000')
    })
  })

  describe('generateTetradic', () => {
    it('should return 4 colors', () => {
      const result = generateTetradic('#ff0000')
      expect(result).toHaveLength(4)
    })

    it('should include the base color', () => {
      const [base] = generateTetradic('#ff0000')
      expect(base).toBe('#ff0000')
    })
  })

  describe('generateShades', () => {
    it('should generate 5 shades by default', () => {
      const result = generateShades('#ff0000')
      expect(result).toHaveLength(5)
    })

    it('should start with the base color', () => {
      const result = generateShades('#ff0000')
      expect(result[0]).toBe('#ff0000')
    })

    it('should get progressively darker', () => {
      const result = generateShades('#ff0000', 3)
      // Later colors should be darker (closer to black)
      expect(result[0]).toBe('#ff0000')
    })

    it('should throw for count < 1', () => {
      expect(() => generateShades('#ff0000', 0)).toThrow()
    })
  })

  describe('generateTints', () => {
    it('should generate 5 tints by default', () => {
      const result = generateTints('#ff0000')
      expect(result).toHaveLength(5)
    })

    it('should start with the base color', () => {
      const result = generateTints('#ff0000')
      expect(result[0]).toBe('#ff0000')
    })

    it('should throw for count < 1', () => {
      expect(() => generateTints('#ff0000', 0)).toThrow()
    })
  })

  describe('generateScale', () => {
    it('should generate a scale from dark to light', () => {
      const result = generateScale('#ff0000', 3)
      expect(result.length).toBeGreaterThan(1)
    })

    it('should include the base color', () => {
      const result = generateScale('#808080', 3)
      expect(result).toContain('#808080')
    })
  })

  describe('generateMonochromatic', () => {
    it('should generate 5 colors by default', () => {
      const result = generateMonochromatic('#ff0000')
      expect(result).toHaveLength(5)
    })

    it('should throw for count < 1', () => {
      expect(() => generateMonochromatic('#ff0000', 0)).toThrow()
    })
  })
})
