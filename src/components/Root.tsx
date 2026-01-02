import { useState, useCallback, useMemo, useRef, useEffect, useId } from 'react'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { ColorWheelContext, type ColorWheelContextValue } from '../context/ColorWheelContext'
import { hexToHsv, hsvToHex } from '../utils'
import type { RootProps } from '../types'

/**
 * Convert alpha value (0-100) to hex string (00-ff)
 */
function alphaToHex(alpha: number): string {
  return Math.round((alpha / 100) * 255)
    .toString(16)
    .padStart(2, '0')
}

/**
 * Parse alpha from 8-digit hex string
 * Returns 100 if hex is 6 digits (no alpha)
 */
function parseAlphaFromHex(hex: string): number {
  if (hex.length === 9) {
    // #rrggbbaa format
    const alphaHex = hex.slice(7, 9)
    return Math.round((parseInt(alphaHex, 16) / 255) * 100)
  }
  return 100
}

/**
 * Root component for ColorWheel
 *
 * Acts as a Context Provider, sharing color state and
 * update functions with all child components.
 *
 * @param props - Component props
 * @param props.value - Current color (HEX format, e.g., "#ff0000" or "#ff000080")
 * @param props.defaultValue - Initial value for uncontrolled mode
 * @param props.onValueChange - Callback when color changes
 * @param props.onValueChangeEnd - Callback when drag ends
 * @param props.disabled - If true, disables all interactions
 * @param props.children - Child components
 *
 * @example
 * ```tsx
 * <ColorWheel.Root value={color} onValueChange={setColor}>
 *   <ColorWheel.Wheel>
 *     <ColorWheel.HueRing />
 *     <ColorWheel.HueThumb />
 *     <ColorWheel.Area />
 *     <ColorWheel.AreaThumb />
 *   </ColorWheel.Wheel>
 * </ColorWheel.Root>
 * ```
 */
export function Root({
  value,
  defaultValue = '#ff0000',
  onValueChange,
  onValueChangeEnd,
  onHueChange,
  onSaturationChange,
  onBrightnessChange,
  onAlphaChange,
  onDragStart,
  onDragEnd,
  disabled = false,
  children,
}: RootProps): React.ReactElement {
  // Controllable hex state (may include alpha as 8 digits)
  const [hexWithAlpha, setHexWithAlphaState] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })

  // Extract base hex (6 digits) and alpha from the value
  const hex = useMemo(() => {
    const h = hexWithAlpha ?? '#ff0000'
    return h.length === 9 ? h.slice(0, 7) : h
  }, [hexWithAlpha])

  // Derived HSV state from hex
  const hsv = useMemo(() => hexToHsv(hex), [hex])

  // Alpha state
  const [alpha, setAlphaState] = useState(() => parseAlphaFromHex(hexWithAlpha ?? '#ff0000'))

  // Generate hex8 (with alpha)
  const hex8 = useMemo(() => `${hex}${alphaToHex(alpha)}`, [hex, alpha])

  // Drag state
  const [isDragging, setIsDragging] = useState(false)

  // Live region for screen reader announcements
  const announcementId = useId()
  const [announcement, setAnnouncement] = useState('')
  const announcementTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Announce color changes to screen readers
  const prevHexRef = useRef(hex)
  useEffect(() => {
    if (prevHexRef.current !== hex) {
      prevHexRef.current = hex
      // Only announce when not dragging to avoid excessive announcements
      if (!isDragging) {
        setAnnouncement(`Color changed to ${hex}`)
        // Clear announcement after a short delay
        if (announcementTimeoutRef.current) {
          clearTimeout(announcementTimeoutRef.current)
        }
        announcementTimeoutRef.current = setTimeout(() => {
          setAnnouncement('')
        }, 1000)
      }
    }
  }, [hex, isDragging])

  // Update handlers
  const setHue = useCallback(
    (h: number) => {
      const newHex = hsvToHex(h, hsv.s, hsv.v)
      const newHexWithAlpha = alpha < 100 ? `${newHex}${alphaToHex(alpha)}` : newHex
      setHexWithAlphaState(newHexWithAlpha)
      onHueChange?.(h)
    },
    [hsv.s, hsv.v, alpha, setHexWithAlphaState, onHueChange]
  )

  const setSaturation = useCallback(
    (s: number) => {
      const newHex = hsvToHex(hsv.h, s, hsv.v)
      const newHexWithAlpha = alpha < 100 ? `${newHex}${alphaToHex(alpha)}` : newHex
      setHexWithAlphaState(newHexWithAlpha)
      onSaturationChange?.(s)
    },
    [hsv.h, hsv.v, alpha, setHexWithAlphaState, onSaturationChange]
  )

  const setBrightness = useCallback(
    (v: number) => {
      const newHex = hsvToHex(hsv.h, hsv.s, v)
      const newHexWithAlpha = alpha < 100 ? `${newHex}${alphaToHex(alpha)}` : newHex
      setHexWithAlphaState(newHexWithAlpha)
      onBrightnessChange?.(v)
    },
    [hsv.h, hsv.s, alpha, setHexWithAlphaState, onBrightnessChange]
  )

  const setAlpha = useCallback(
    (a: number) => {
      setAlphaState(a)
      const newHexWithAlpha = a < 100 ? `${hex}${alphaToHex(a)}` : hex
      setHexWithAlphaState(newHexWithAlpha)
      onAlphaChange?.(a)
    },
    [hex, setHexWithAlphaState, onAlphaChange]
  )

  const setHex = useCallback(
    (newHex: string) => {
      // If setting a 6-digit hex, preserve current alpha
      if (newHex.length === 7 && alpha < 100) {
        setHexWithAlphaState(`${newHex}${alphaToHex(alpha)}`)
      } else {
        setHexWithAlphaState(newHex)
        // Update alpha if 8-digit hex was provided
        if (newHex.length === 9) {
          setAlphaState(parseAlphaFromHex(newHex))
        }
      }
    },
    [alpha, setHexWithAlphaState]
  )

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
    onDragStart?.()
  }, [onDragStart])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    onDragEnd?.()
    if (hexWithAlpha) {
      onValueChangeEnd?.(hexWithAlpha)
    }
  }, [hexWithAlpha, onDragEnd, onValueChangeEnd])

  // Context value
  const contextValue = useMemo<ColorWheelContextValue>(
    () => ({
      hsv,
      alpha,
      hex,
      hex8,
      setHue,
      setSaturation,
      setBrightness,
      setAlpha,
      setHex,
      disabled,
      isDragging,
      setIsDragging,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
    }),
    [
      hsv,
      alpha,
      hex,
      hex8,
      setHue,
      setSaturation,
      setBrightness,
      setAlpha,
      setHex,
      disabled,
      isDragging,
      handleDragStart,
      handleDragEnd,
    ]
  )

  return (
    <ColorWheelContext.Provider value={contextValue}>
      <div data-color-wheel-root data-disabled={disabled || undefined}>
        {children}
        {/* Screen reader announcement region */}
        <div
          id={announcementId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          {announcement}
        </div>
      </div>
    </ColorWheelContext.Provider>
  )
}
