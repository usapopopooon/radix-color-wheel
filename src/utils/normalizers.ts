/**
 * Value normalization utilities for consistent rounding and clamping.
 * Ensures all slider components handle values uniformly.
 */

import { clamp } from './index'

/**
 * Normalizes a ratio (0-1) to a percentage (0-100).
 * Used by saturation, brightness, alpha, and lightness sliders.
 *
 * @param ratio - Value between 0 and 1
 * @returns Integer between 0 and 100
 */
export function ratioToPercent(ratio: number): number {
  return Math.round(clamp(ratio, 0, 1) * 100)
}

/**
 * Normalizes a ratio (0-1) to hue degrees (0-359).
 * Uses modulo to wrap around the color wheel.
 *
 * @param ratio - Value between 0 and 1
 * @returns Integer between 0 and 359
 */
export function ratioToHue(ratio: number): number {
  return Math.round(clamp(ratio, 0, 1) * 360) % 360
}

/**
 * Normalizes a gamma value with step precision.
 * Handles floating-point precision issues.
 *
 * @param value - Raw gamma value
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param step - Step precision (e.g., 0.1)
 * @returns Normalized gamma value
 */
export function normalizeGamma(value: number, min: number, max: number, step: number): number {
  const clamped = clamp(value, min, max)
  const stepped = Math.round(clamped / step) * step
  // Round to 2 decimal places to avoid floating-point issues
  return Math.round(stepped * 100) / 100
}

/**
 * Converts a ratio (0-1) to a gamma value within a given range.
 *
 * @param ratio - Value between 0 and 1
 * @param min - Minimum gamma value
 * @param max - Maximum gamma value
 * @returns Gamma value within the specified range
 */
export function ratioToGamma(ratio: number, min: number, max: number): number {
  return min + clamp(ratio, 0, 1) * (max - min)
}
