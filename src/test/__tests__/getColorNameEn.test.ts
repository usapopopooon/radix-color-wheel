import { describe, it, expect } from 'vitest'
import { getColorNameEn } from '../../utils'

describe('getColorNameEn', () => {
  it('should return red for hue 0', () => {
    expect(getColorNameEn(0)).toBe('red')
  })

  it('should return red for hue 360 (wraps around)', () => {
    expect(getColorNameEn(360)).toBe('red')
  })

  it('should return orange for hue 30', () => {
    expect(getColorNameEn(30)).toBe('orange')
  })

  it('should return yellow for hue 60', () => {
    expect(getColorNameEn(60)).toBe('yellow')
  })

  it('should return yellow-green for hue 90', () => {
    expect(getColorNameEn(90)).toBe('yellow-green')
  })

  it('should return green for hue 120', () => {
    expect(getColorNameEn(120)).toBe('green')
  })

  it('should return teal for hue 150', () => {
    expect(getColorNameEn(150)).toBe('teal')
  })

  it('should return cyan for hue 180', () => {
    expect(getColorNameEn(180)).toBe('cyan')
  })

  it('should return blue for hue 210', () => {
    expect(getColorNameEn(210)).toBe('blue')
  })

  it('should return blue for hue 240', () => {
    expect(getColorNameEn(240)).toBe('indigo')
  })

  it('should return purple for hue 270', () => {
    expect(getColorNameEn(270)).toBe('purple')
  })

  it('should return magenta for hue 300', () => {
    expect(getColorNameEn(300)).toBe('magenta')
  })

  it('should return pink for hue 330', () => {
    expect(getColorNameEn(330)).toBe('pink')
  })

  it('should return red for hue 350 (near 360)', () => {
    expect(getColorNameEn(350)).toBe('red')
  })
})
