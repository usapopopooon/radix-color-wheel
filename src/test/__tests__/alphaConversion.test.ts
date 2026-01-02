import { describe, it, expect } from 'vitest'
import { alphaToHex, parseAlphaFromHex, combineHexWithAlpha } from '../../utils/alphaConversion'

describe('alphaToHex', () => {
  it('should convert 100% alpha to ff', () => {
    expect(alphaToHex(100)).toBe('ff')
  })

  it('should convert 0% alpha to 00', () => {
    expect(alphaToHex(0)).toBe('00')
  })

  it('should convert 50% alpha to 80', () => {
    expect(alphaToHex(50)).toBe('80')
  })

  it('should convert 25% alpha to 40', () => {
    expect(alphaToHex(25)).toBe('40')
  })

  it('should convert 75% alpha to bf', () => {
    expect(alphaToHex(75)).toBe('bf')
  })

  it('should pad single digit hex values', () => {
    expect(alphaToHex(1)).toBe('03')
    expect(alphaToHex(5)).toBe('0d')
  })
})

describe('parseAlphaFromHex', () => {
  it('should parse 100% alpha (ff) from 8-digit hex', () => {
    expect(parseAlphaFromHex('#ff0000ff')).toBe(100)
  })

  it('should parse 0% alpha (00) from 8-digit hex', () => {
    expect(parseAlphaFromHex('#ff000000')).toBe(0)
  })

  it('should parse 50% alpha (80) from 8-digit hex', () => {
    expect(parseAlphaFromHex('#ff000080')).toBe(50)
  })

  it('should return 100 for 6-digit hex (no alpha)', () => {
    expect(parseAlphaFromHex('#ff0000')).toBe(100)
    expect(parseAlphaFromHex('#00ff00')).toBe(100)
  })

  it('should handle uppercase hex', () => {
    expect(parseAlphaFromHex('#FF0000FF')).toBe(100)
    expect(parseAlphaFromHex('#FF000080')).toBe(50)
  })
})

describe('combineHexWithAlpha', () => {
  it('should append alpha hex when alpha < 100', () => {
    expect(combineHexWithAlpha('#ff0000', 50)).toBe('#ff000080')
    expect(combineHexWithAlpha('#00ff00', 25)).toBe('#00ff0040')
    expect(combineHexWithAlpha('#0000ff', 0)).toBe('#0000ff00')
  })

  it('should not append alpha hex when alpha is 100', () => {
    expect(combineHexWithAlpha('#ff0000', 100)).toBe('#ff0000')
    expect(combineHexWithAlpha('#00ff00', 100)).toBe('#00ff00')
  })

  it('should handle edge case of 99% alpha', () => {
    expect(combineHexWithAlpha('#ff0000', 99)).toBe('#ff0000fc')
  })

  it('should handle 1% alpha', () => {
    expect(combineHexWithAlpha('#ff0000', 1)).toBe('#ff000003')
  })
})
