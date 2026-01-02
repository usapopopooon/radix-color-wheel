import { describe, it, expect } from 'vitest'
import { hexToRgb, rgbToHex, hexToHsl, hslToHex, ColorValidationError } from '../../index'

describe('ColorValidationError', () => {
  it('should be thrown for invalid hex input', () => {
    try {
      hexToRgb('invalid')
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ColorValidationError)
      if (error instanceof ColorValidationError) {
        expect(error.functionName).toBe('hexToRgb')
        expect(error.receivedValue).toBe('invalid')
        expect(error.issues).toBeDefined()
        expect(error.issues.length).toBeGreaterThan(0)
      }
    }
  })

  it('should be thrown for invalid RGB input', () => {
    try {
      rgbToHex({ r: 300, g: 0, b: 0 })
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ColorValidationError)
      if (error instanceof ColorValidationError) {
        expect(error.functionName).toBe('rgbToHex')
        expect(error.receivedValue).toEqual({ r: 300, g: 0, b: 0 })
      }
    }
  })

  it('should be thrown for invalid HSL input', () => {
    try {
      hslToHex({ h: 400, s: 100, l: 50 })
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ColorValidationError)
      if (error instanceof ColorValidationError) {
        expect(error.functionName).toBe('hslToHex')
      }
    }
  })

  it('should have proper error name', () => {
    try {
      hexToHsl('bad')
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ColorValidationError)
      if (error instanceof ColorValidationError) {
        expect(error.name).toBe('ColorValidationError')
      }
    }
  })

  it('should format string values with quotes in message', () => {
    try {
      hexToRgb('xyz')
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ColorValidationError)
      if (error instanceof ColorValidationError) {
        expect(error.message).toContain('"xyz"')
      }
    }
  })

  it('should format object values as JSON in message', () => {
    try {
      rgbToHex({ r: -1, g: 0, b: 0 })
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ColorValidationError)
      if (error instanceof ColorValidationError) {
        expect(error.message).toContain('{"r":-1,"g":0,"b":0}')
      }
    }
  })
})
