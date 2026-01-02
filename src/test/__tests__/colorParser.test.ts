import { describe, it, expect } from 'vitest'
import {
  parseColor,
  parseColorFull,
  formatColor,
  detectColorFormat,
  isValidColor,
  getNamedColor,
  getNamedColors,
} from '../../index'

describe('Color Parser Functions', () => {
  describe('parseColor', () => {
    it('should parse 6-digit hex', () => {
      expect(parseColor('#ff0000')).toBe('#ff0000')
    })

    it('should parse 8-digit hex', () => {
      expect(parseColor('#ff000080')).toBe('#ff000080')
    })

    it('should parse 3-digit hex and expand', () => {
      expect(parseColor('#f00')).toBe('#ff0000')
    })

    it('should parse 4-digit hex and expand', () => {
      expect(parseColor('#f008')).toBe('#ff000088')
    })

    it('should parse CSS rgb()', () => {
      expect(parseColor('rgb(255, 0, 0)')).toBe('#ff0000')
    })

    it('should parse CSS rgba()', () => {
      const result = parseColor('rgba(255, 0, 0, 0.5)')
      expect(result).toBe('#ff000080')
    })

    it('should parse CSS hsl()', () => {
      expect(parseColor('hsl(0, 100%, 50%)')).toBe('#ff0000')
    })

    it('should parse CSS hsla()', () => {
      const result = parseColor('hsla(0, 100%, 50%, 0.5)')
      expect(result).toBe('#ff000080')
    })

    it('should parse named colors', () => {
      expect(parseColor('red')).toBe('#ff0000')
      expect(parseColor('blue')).toBe('#0000ff')
      expect(parseColor('green')).toBe('#008000')
    })

    it('should be case-insensitive for named colors', () => {
      expect(parseColor('RED')).toBe('#ff0000')
      expect(parseColor('Red')).toBe('#ff0000')
    })

    it('should throw for invalid color', () => {
      expect(() => parseColor('not-a-color')).toThrow()
    })
  })

  describe('parseColorFull', () => {
    it('should return all formats', () => {
      const result = parseColorFull('#ff0000')

      expect(result.hex).toBe('#ff0000')
      expect(result.hex8).toBe('#ff0000ff')
      expect(result.rgb).toEqual({ r: 255, g: 0, b: 0 })
      expect(result.rgba).toEqual({ r: 255, g: 0, b: 0, a: 1 })
      expect(result.hsl).toEqual({ h: 0, s: 100, l: 50 })
      expect(result.hsla).toEqual({ h: 0, s: 100, l: 50, a: 1 })
      expect(result.cssRgb).toBe('rgb(255, 0, 0)')
      expect(result.cssHsl).toBe('hsl(0, 100%, 50%)')
      expect(result.cmyk).toEqual({ c: 0, m: 100, y: 100, k: 0 })
      expect(result.format).toBe('hex')
      expect(result.original).toBe('#ff0000')
    })

    it('should detect original format', () => {
      expect(parseColorFull('rgb(255, 0, 0)').format).toBe('cssRgb')
      expect(parseColorFull('hsl(0, 100%, 50%)').format).toBe('cssHsl')
      expect(parseColorFull('red').format).toBe('hex')
    })
  })

  describe('formatColor', () => {
    it('should format to hex', () => {
      expect(formatColor('red', 'hex')).toBe('#ff0000')
    })

    it('should format to hex8', () => {
      expect(formatColor('red', 'hex8')).toBe('#ff0000ff')
    })

    it('should format to rgb object', () => {
      expect(formatColor('red', 'rgb')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should format to cssRgb string', () => {
      expect(formatColor('red', 'cssRgb')).toBe('rgb(255, 0, 0)')
    })

    it('should format to cssHsl string', () => {
      expect(formatColor('red', 'cssHsl')).toBe('hsl(0, 100%, 50%)')
    })

    it('should format to cmyk object', () => {
      expect(formatColor('red', 'cmyk')).toEqual({ c: 0, m: 100, y: 100, k: 0 })
    })
  })

  describe('detectColorFormat', () => {
    it('should detect hex format', () => {
      expect(detectColorFormat('#ff0000')).toBe('hex')
    })

    it('should detect hex8 format', () => {
      expect(detectColorFormat('#ff000080')).toBe('hex8')
    })

    it('should detect cssRgb format', () => {
      expect(detectColorFormat('rgb(255, 0, 0)')).toBe('cssRgb')
    })

    it('should detect cssRgba format', () => {
      expect(detectColorFormat('rgba(255, 0, 0, 0.5)')).toBe('cssRgba')
    })

    it('should detect cssHsl format', () => {
      expect(detectColorFormat('hsl(0, 100%, 50%)')).toBe('cssHsl')
    })

    it('should detect cssHsla format', () => {
      expect(detectColorFormat('hsla(0, 100%, 50%, 0.5)')).toBe('cssHsla')
    })

    it('should return null for unknown format', () => {
      expect(detectColorFormat('not-a-color')).toBeNull()
    })
  })

  describe('isValidColor', () => {
    it('should return true for valid colors', () => {
      expect(isValidColor('#ff0000')).toBe(true)
      expect(isValidColor('rgb(255, 0, 0)')).toBe(true)
      expect(isValidColor('hsl(0, 100%, 50%)')).toBe(true)
      expect(isValidColor('red')).toBe(true)
    })

    it('should return false for invalid colors', () => {
      expect(isValidColor('not-a-color')).toBe(false)
      expect(isValidColor('#gggggg')).toBe(false)
      expect(isValidColor('')).toBe(false)
    })
  })

  describe('getNamedColor', () => {
    it('should return name for known colors', () => {
      expect(getNamedColor('#ff0000')).toBe('red')
      expect(getNamedColor('#0000ff')).toBe('blue')
      expect(getNamedColor('#008000')).toBe('green')
    })

    it('should return null for unknown colors', () => {
      expect(getNamedColor('#123456')).toBeNull()
    })

    it('should be case-insensitive', () => {
      expect(getNamedColor('#FF0000')).toBe('red')
    })
  })

  describe('getNamedColors', () => {
    it('should return all named colors', () => {
      const colors = getNamedColors()
      expect(colors.red).toBe('#ff0000')
      expect(colors.blue).toBe('#0000ff')
      expect(Object.keys(colors).length).toBeGreaterThan(100)
    })

    it('should return a copy', () => {
      const colors1 = getNamedColors()
      const colors2 = getNamedColors()
      expect(colors1).not.toBe(colors2)
    })
  })
})
