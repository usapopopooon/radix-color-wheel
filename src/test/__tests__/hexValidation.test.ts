import { describe, it, expect } from 'vitest'
import {
  isValidHex,
  isValidHex6,
  normalizeHex,
  isHex8,
  stripAlphaFromHex,
} from '../../utils/hexValidation'

describe('isValidHex6', () => {
  it('should return true for valid 6-digit hex', () => {
    expect(isValidHex6('#ff0000')).toBe(true)
    expect(isValidHex6('#00ff00')).toBe(true)
    expect(isValidHex6('#0000ff')).toBe(true)
    expect(isValidHex6('#000000')).toBe(true)
    expect(isValidHex6('#ffffff')).toBe(true)
    expect(isValidHex6('#FFFFFF')).toBe(true)
    expect(isValidHex6('#AbCdEf')).toBe(true)
  })

  it('should return false for 8-digit hex', () => {
    expect(isValidHex6('#ff0000ff')).toBe(false)
    expect(isValidHex6('#00ff0080')).toBe(false)
  })

  it('should return false for invalid hex', () => {
    expect(isValidHex6('')).toBe(false)
    expect(isValidHex6('#fff')).toBe(false)
    expect(isValidHex6('#gggggg')).toBe(false)
    expect(isValidHex6('ff0000')).toBe(false)
    expect(isValidHex6('#ff00')).toBe(false)
    expect(isValidHex6('#ff000000ff')).toBe(false)
  })
})

describe('isValidHex', () => {
  it('should return true for valid 6-digit hex', () => {
    expect(isValidHex('#ff0000')).toBe(true)
    expect(isValidHex('#00ff00')).toBe(true)
    expect(isValidHex('#FFFFFF')).toBe(true)
  })

  it('should return true for valid 8-digit hex', () => {
    expect(isValidHex('#ff0000ff')).toBe(true)
    expect(isValidHex('#00ff0080')).toBe(true)
    expect(isValidHex('#ffffff00')).toBe(true)
    expect(isValidHex('#FFFFFFCC')).toBe(true)
  })

  it('should return false for invalid hex', () => {
    expect(isValidHex('')).toBe(false)
    expect(isValidHex('#fff')).toBe(false)
    expect(isValidHex('#gggggg')).toBe(false)
    expect(isValidHex('ff0000')).toBe(false)
    expect(isValidHex('#ff00')).toBe(false)
    expect(isValidHex('#ff000000ff')).toBe(false)
  })
})

describe('isHex8', () => {
  it('should return true for 8-digit hex', () => {
    expect(isHex8('#ff0000ff')).toBe(true)
    expect(isHex8('#00ff0080')).toBe(true)
    expect(isHex8('#ffffff00')).toBe(true)
  })

  it('should return false for 6-digit hex', () => {
    expect(isHex8('#ff0000')).toBe(false)
    expect(isHex8('#00ff00')).toBe(false)
  })

  it('should return false for other lengths', () => {
    expect(isHex8('#fff')).toBe(false)
    expect(isHex8('#ffffff0')).toBe(false)
    expect(isHex8('#ffffff000')).toBe(false)
  })
})

describe('stripAlphaFromHex', () => {
  it('should strip alpha from 8-digit hex', () => {
    expect(stripAlphaFromHex('#ff0000ff')).toBe('#ff0000')
    expect(stripAlphaFromHex('#00ff0080')).toBe('#00ff00')
    expect(stripAlphaFromHex('#ffffff00')).toBe('#ffffff')
  })

  it('should return 6-digit hex unchanged', () => {
    expect(stripAlphaFromHex('#ff0000')).toBe('#ff0000')
    expect(stripAlphaFromHex('#00ff00')).toBe('#00ff00')
    expect(stripAlphaFromHex('#ffffff')).toBe('#ffffff')
  })
})

describe('normalizeHex', () => {
  it('should add # prefix if missing', () => {
    expect(normalizeHex('ff0000')).toBe('#ff0000')
    expect(normalizeHex('00ff00')).toBe('#00ff00')
  })

  it('should not add duplicate # prefix', () => {
    expect(normalizeHex('#ff0000')).toBe('#ff0000')
    expect(normalizeHex('#00ff00')).toBe('#00ff00')
  })

  it('should convert to lowercase', () => {
    expect(normalizeHex('#FF0000')).toBe('#ff0000')
    expect(normalizeHex('FFFFFF')).toBe('#ffffff')
    expect(normalizeHex('#AbCdEf')).toBe('#abcdef')
  })

  it('should trim whitespace', () => {
    expect(normalizeHex('  #ff0000  ')).toBe('#ff0000')
    expect(normalizeHex('  ff0000  ')).toBe('#ff0000')
  })
})
