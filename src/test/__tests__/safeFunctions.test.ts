import { describe, it, expect } from 'vitest'
import {
  hexToRgbSafe,
  rgbToHexSafe,
  hexToHslSafe,
  hslToHexSafe,
  hexToRgbaSafe,
  rgbaToHexSafe,
  hexToHslaSafe,
  hslaToHexSafe,
  hexToCssRgbSafe,
  cssRgbToHexSafe,
  hexToCssHslSafe,
  cssHslToHexSafe,
  ColorValidationError,
} from '../../index'

describe('Safe conversion functions', () => {
  describe('hexToRgbSafe', () => {
    it('should return success for valid hex', () => {
      const result = hexToRgbSafe('#ff0000')
      expect(result.success).toBe(true)
      expect(result.data).toEqual({ r: 255, g: 0, b: 0 })
      expect(result.error).toBeNull()
    })

    it('should return error for invalid hex', () => {
      const result = hexToRgbSafe('invalid')
      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeInstanceOf(ColorValidationError)
      expect(result.error?.functionName).toBe('hexToRgb')
    })
  })

  describe('rgbToHexSafe', () => {
    it('should return success for valid RGB', () => {
      const result = rgbToHexSafe({ r: 255, g: 0, b: 0 })
      expect(result.success).toBe(true)
      expect(result.data).toBe('#ff0000')
    })

    it('should return error for invalid RGB', () => {
      const result = rgbToHexSafe({ r: 300, g: 0, b: 0 })
      expect(result.success).toBe(false)
      expect(result.error?.functionName).toBe('rgbToHex')
    })
  })

  describe('hexToHslSafe', () => {
    it('should return success for valid hex', () => {
      const result = hexToHslSafe('#ff0000')
      expect(result.success).toBe(true)
      expect(result.data).toEqual({ h: 0, s: 100, l: 50 })
    })

    it('should return error for invalid hex', () => {
      const result = hexToHslSafe('bad')
      expect(result.success).toBe(false)
    })
  })

  describe('hslToHexSafe', () => {
    it('should return success for valid HSL', () => {
      const result = hslToHexSafe({ h: 0, s: 100, l: 50 })
      expect(result.success).toBe(true)
      expect(result.data).toBe('#ff0000')
    })

    it('should return error for invalid HSL', () => {
      const result = hslToHexSafe({ h: 400, s: 100, l: 50 })
      expect(result.success).toBe(false)
    })
  })

  describe('hexToRgbaSafe', () => {
    it('should return success for valid hex', () => {
      const result = hexToRgbaSafe('#ff000080')
      expect(result.success).toBe(true)
      expect(result.data?.a).toBeCloseTo(0.5, 1)
    })

    it('should return error for invalid hex', () => {
      const result = hexToRgbaSafe('xyz')
      expect(result.success).toBe(false)
    })
  })

  describe('rgbaToHexSafe', () => {
    it('should return success for valid RGBA', () => {
      const result = rgbaToHexSafe({ r: 255, g: 0, b: 0, a: 0.5 })
      expect(result.success).toBe(true)
      expect(result.data).toBe('#ff000080')
    })

    it('should return error for invalid alpha', () => {
      const result = rgbaToHexSafe({ r: 255, g: 0, b: 0, a: 2 })
      expect(result.success).toBe(false)
    })
  })

  describe('hexToHslaSafe', () => {
    it('should return success for valid hex', () => {
      const result = hexToHslaSafe('#ff0000')
      expect(result.success).toBe(true)
      expect(result.data?.a).toBe(1)
    })

    it('should return error for invalid hex', () => {
      const result = hexToHslaSafe('#gggggg')
      expect(result.success).toBe(false)
    })
  })

  describe('hslaToHexSafe', () => {
    it('should return success for valid HSLA', () => {
      const result = hslaToHexSafe({ h: 0, s: 100, l: 50, a: 1 })
      expect(result.success).toBe(true)
    })

    it('should return error for invalid alpha', () => {
      const result = hslaToHexSafe({ h: 0, s: 100, l: 50, a: -1 })
      expect(result.success).toBe(false)
    })
  })

  describe('hexToCssRgbSafe', () => {
    it('should return success for valid hex', () => {
      const result = hexToCssRgbSafe('#ff0000')
      expect(result.success).toBe(true)
      expect(result.data).toBe('rgb(255, 0, 0)')
    })

    it('should return error for invalid hex', () => {
      const result = hexToCssRgbSafe('invalid')
      expect(result.success).toBe(false)
    })
  })

  describe('cssRgbToHexSafe', () => {
    it('should return success for valid CSS RGB', () => {
      const result = cssRgbToHexSafe('rgb(255, 0, 0)')
      expect(result.success).toBe(true)
      expect(result.data).toBe('#ff0000')
    })

    it('should return error for invalid CSS RGB', () => {
      const result = cssRgbToHexSafe('not a color')
      expect(result.success).toBe(false)
    })
  })

  describe('hexToCssHslSafe', () => {
    it('should return success for valid hex', () => {
      const result = hexToCssHslSafe('#ff0000')
      expect(result.success).toBe(true)
      expect(result.data).toBe('hsl(0, 100%, 50%)')
    })

    it('should return error for invalid hex', () => {
      const result = hexToCssHslSafe('bad')
      expect(result.success).toBe(false)
    })
  })

  describe('cssHslToHexSafe', () => {
    it('should return success for valid CSS HSL', () => {
      const result = cssHslToHexSafe('hsl(0, 100%, 50%)')
      expect(result.success).toBe(true)
      expect(result.data).toBe('#ff0000')
    })

    it('should return error for invalid CSS HSL', () => {
      const result = cssHslToHexSafe('invalid')
      expect(result.success).toBe(false)
    })
  })

  describe('Type narrowing', () => {
    it('should allow type narrowing with success check', () => {
      const result = hexToRgbSafe('#ff0000')
      if (result.success) {
        // TypeScript should know result.data is RGB here
        expect(result.data.r).toBe(255)
        expect(result.data.g).toBe(0)
        expect(result.data.b).toBe(0)
      }
    })

    it('should allow error inspection when failed', () => {
      const result = hexToRgbSafe('invalid')
      if (!result.success) {
        // TypeScript should know result.error is ColorValidationError here
        expect(result.error.functionName).toBe('hexToRgb')
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })
})
