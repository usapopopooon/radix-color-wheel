import { describe, it, expect } from 'vitest'
import {
  lighten,
  darken,
  saturate,
  desaturate,
  mix,
  complement,
  invert,
  grayscale,
  rotateHue,
  setAlpha,
} from '../../index'

describe('Color Manipulation Functions', () => {
  describe('lighten', () => {
    it('should lighten a color', () => {
      const result = lighten('#000000', 50)
      expect(result).toBe('#808080')
    })

    it('should not exceed 100% lightness', () => {
      const result = lighten('#ffffff', 50)
      expect(result).toBe('#ffffff')
    })

    it('should throw for invalid hex', () => {
      expect(() => lighten('invalid', 20)).toThrow()
    })

    it('should throw for amount out of range', () => {
      expect(() => lighten('#ff0000', 150)).toThrow()
    })
  })

  describe('darken', () => {
    it('should darken a color', () => {
      const result = darken('#ffffff', 50)
      expect(result).toBe('#808080')
    })

    it('should not go below 0% lightness', () => {
      const result = darken('#000000', 50)
      expect(result).toBe('#000000')
    })
  })

  describe('saturate', () => {
    it('should increase saturation', () => {
      // Gray has 0% saturation, adding saturation won't change it
      // Use a color with some saturation
      const result = saturate('#bf4040', 20)
      expect(result).not.toBe('#bf4040')
    })
  })

  describe('desaturate', () => {
    it('should decrease saturation', () => {
      const result = desaturate('#ff0000', 50)
      expect(result).toBe('#bf4040')
    })

    it('should create gray when fully desaturated', () => {
      const result = desaturate('#ff0000', 100)
      expect(result).toBe('#808080')
    })
  })

  describe('mix', () => {
    it('should mix two colors equally', () => {
      const result = mix('#ff0000', '#0000ff', 0.5)
      expect(result).toBe('#800080')
    })

    it('should return first color when ratio is 0', () => {
      const result = mix('#ff0000', '#0000ff', 0)
      expect(result).toBe('#ff0000')
    })

    it('should return second color when ratio is 1', () => {
      const result = mix('#ff0000', '#0000ff', 1)
      expect(result).toBe('#0000ff')
    })

    it('should throw for ratio out of range', () => {
      expect(() => mix('#ff0000', '#0000ff', 1.5)).toThrow()
    })
  })

  describe('complement', () => {
    it('should return complementary color', () => {
      expect(complement('#ff0000')).toBe('#00ffff')
      expect(complement('#00ff00')).toBe('#ff00ff')
      expect(complement('#0000ff')).toBe('#ffff00')
    })
  })

  describe('invert', () => {
    it('should invert colors', () => {
      expect(invert('#000000')).toBe('#ffffff')
      expect(invert('#ffffff')).toBe('#000000')
      expect(invert('#ff0000')).toBe('#00ffff')
    })
  })

  describe('grayscale', () => {
    it('should convert to grayscale', () => {
      const result = grayscale('#ff0000')
      expect(result).toBe('#808080')
    })

    it('should not change already gray colors', () => {
      expect(grayscale('#808080')).toBe('#808080')
    })
  })

  describe('rotateHue', () => {
    it('should rotate hue by positive degrees', () => {
      const result = rotateHue('#ff0000', 120)
      expect(result).toBe('#00ff00')
    })

    it('should rotate hue by negative degrees', () => {
      const result = rotateHue('#ff0000', -120)
      expect(result).toBe('#0000ff')
    })

    it('should wrap around 360 degrees', () => {
      const result = rotateHue('#ff0000', 360)
      expect(result).toBe('#ff0000')
    })
  })

  describe('setAlpha', () => {
    it('should set alpha to 50%', () => {
      const result = setAlpha('#ff0000', 0.5)
      expect(result).toBe('#ff000080')
    })

    it('should set alpha to 0%', () => {
      const result = setAlpha('#ff0000', 0)
      expect(result).toBe('#ff000000')
    })

    it('should set alpha to 100%', () => {
      const result = setAlpha('#ff0000', 1)
      expect(result).toBe('#ff0000ff')
    })

    it('should throw for alpha out of range', () => {
      expect(() => setAlpha('#ff0000', 1.5)).toThrow()
      expect(() => setAlpha('#ff0000', -0.5)).toThrow()
    })
  })
})
