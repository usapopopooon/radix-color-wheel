import { describe, it, expect } from 'vitest'
import { getHueFromPosition } from '../../utils/getHueFromPosition'

describe('getHueFromPosition', () => {
  const center = 100

  it('should return 0 degrees at 12 o\'clock position (top center)', () => {
    // Top center: x = center, y = 0 (above center)
    const hue = getHueFromPosition(center, 0, center, center)
    expect(Math.round(hue)).toBe(0)
  })

  it('should return 90 degrees at 3 o\'clock position (right center)', () => {
    // Right center: x = 200 (right of center), y = center
    const hue = getHueFromPosition(200, center, center, center)
    expect(Math.round(hue)).toBe(90)
  })

  it('should return 180 degrees at 6 o\'clock position (bottom center)', () => {
    // Bottom center: x = center, y = 200 (below center)
    const hue = getHueFromPosition(center, 200, center, center)
    expect(Math.round(hue)).toBe(180)
  })

  it('should return 270 degrees at 9 o\'clock position (left center)', () => {
    // Left center: x = 0 (left of center), y = center
    const hue = getHueFromPosition(0, center, center, center)
    expect(Math.round(hue)).toBe(270)
  })

  it('should return approximately 45 degrees at 1:30 position', () => {
    // 1:30 position is between 12 and 3 o'clock
    // At 45 degrees: x = center + r*cos(-45), y = center + r*sin(-45)
    // Using radius of 100 for calculation
    const r = 100
    const x = center + r * Math.cos((-45 * Math.PI) / 180)
    const y = center + r * Math.sin((-45 * Math.PI) / 180)
    const hue = getHueFromPosition(x, y, center, center)
    expect(Math.round(hue)).toBe(45)
  })

  it('should handle positions near 360/0 boundary', () => {
    // Just before 12 o'clock (slightly to the left)
    const hue = getHueFromPosition(center - 1, 0, center, center)
    // Should be close to 360 (or wrapped to near 0)
    expect(hue).toBeGreaterThan(350)
  })

  it('should return value between 0 and 360', () => {
    // Test various positions
    const positions = [
      [50, 50],
      [150, 50],
      [150, 150],
      [50, 150],
      [0, 0],
      [200, 200],
    ]

    for (const [x, y] of positions) {
      const hue = getHueFromPosition(x, y, center, center)
      expect(hue).toBeGreaterThanOrEqual(0)
      expect(hue).toBeLessThan(360)
    }
  })
})
