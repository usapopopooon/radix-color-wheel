import {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useId,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { ColorWheelContext, type ColorWheelContextValue } from '../context/ColorWheelContext'
import { hexToHsv, hsvToHex, parseAlphaFromHex, combineHexWithAlpha, alphaToHex } from '../utils'
import type { RootProps, ColorWheelRef, HSV } from '../types'

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
 * @param ref - Imperative handle for programmatic control
 *
 * @example
 * ```tsx
 * const colorWheelRef = useRef<ColorWheelRef>(null)
 *
 * <ColorWheel.Root ref={colorWheelRef} value={color} onValueChange={setColor}>
 *   <ColorWheel.Wheel>
 *     <ColorWheel.HueRing />
 *     <ColorWheel.HueThumb />
 *     <ColorWheel.Area />
 *     <ColorWheel.AreaThumb />
 *   </ColorWheel.Wheel>
 * </ColorWheel.Root>
 *
 * // Programmatic access
 * colorWheelRef.current?.setColor('#00ff00')
 * colorWheelRef.current?.setAlpha(50)
 * ```
 */
export const Root = forwardRef<ColorWheelRef, RootProps>(function Root(
  {
    value,
    defaultValue = '#ff0000',
    alpha: alphaProp,
    defaultAlpha = 100,
    onValueChange,
    onValueChangeEnd,
    onHueChange,
    onSaturationChange,
    onBrightnessChange,
    onAlphaChange,
    onDragStart,
    onDrag,
    onDragEnd,
    onFocus,
    onBlur,
    disabled = false,
    children,
  },
  ref
) {
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

  // Alpha state - controllable
  // Priority: alphaProp > defaultAlpha > parsed from hex
  const computedDefaultAlpha = useMemo(() => {
    // If defaultAlpha is explicitly set (not 100), use it
    // Otherwise parse from hex value
    if (defaultAlpha !== 100) {
      return defaultAlpha
    }
    return parseAlphaFromHex(hexWithAlpha ?? '#ff0000')
  }, []) // Only compute once on mount

  const [alphaState, setAlphaState] = useControllableState({
    prop: alphaProp,
    defaultProp: computedDefaultAlpha,
    onChange: onAlphaChange,
  })
  const alpha = alphaState ?? 100

  // Generate hex8 (with alpha)
  const hex8 = useMemo(() => `${hex}${alphaToHex(alpha)}`, [hex, alpha])

  // Drag state
  const [isDragging, setIsDragging] = useState(false)

  // Live region for screen reader announcements
  const announcementId = useId()
  const announcementRef = useRef<HTMLDivElement>(null)
  const announcementTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevHexRef = useRef(hex)

  // Announce color changes to screen readers via direct DOM manipulation
  useEffect(() => {
    if (prevHexRef.current !== hex) {
      prevHexRef.current = hex
      if (!isDragging && announcementRef.current) {
        announcementRef.current.textContent = `Color changed to ${hex}`
        if (announcementTimeoutRef.current) {
          clearTimeout(announcementTimeoutRef.current)
        }
        announcementTimeoutRef.current = setTimeout(() => {
          if (announcementRef.current) {
            announcementRef.current.textContent = ''
          }
        }, 1000)
      }
    }
  }, [hex, isDragging])

  // Update handlers
  const setHue = useCallback(
    (h: number) => {
      const newHex = hsvToHex(h, hsv.s, hsv.v)
      setHexWithAlphaState(combineHexWithAlpha(newHex, alpha))
      onHueChange?.(h)
    },
    [hsv.s, hsv.v, alpha, setHexWithAlphaState, onHueChange]
  )

  const setSaturation = useCallback(
    (s: number) => {
      const newHex = hsvToHex(hsv.h, s, hsv.v)
      setHexWithAlphaState(combineHexWithAlpha(newHex, alpha))
      onSaturationChange?.(s)
    },
    [hsv.h, hsv.v, alpha, setHexWithAlphaState, onSaturationChange]
  )

  const setBrightness = useCallback(
    (v: number) => {
      const newHex = hsvToHex(hsv.h, hsv.s, v)
      setHexWithAlphaState(combineHexWithAlpha(newHex, alpha))
      onBrightnessChange?.(v)
    },
    [hsv.h, hsv.s, alpha, setHexWithAlphaState, onBrightnessChange]
  )

  const setAlpha = useCallback(
    (a: number) => {
      setAlphaState(a)
      setHexWithAlphaState(combineHexWithAlpha(hex, a))
    },
    [hex, setHexWithAlphaState, setAlphaState]
  )

  const setHex = useCallback(
    (newHex: string) => {
      // If setting a 6-digit hex, preserve current alpha
      if (newHex.length === 7) {
        setHexWithAlphaState(combineHexWithAlpha(newHex, alpha))
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

  // setHsv - set color by HSV values
  const setHsv = useCallback(
    (newHsv: HSV) => {
      const newHex = hsvToHex(newHsv.h, newHsv.s, newHsv.v)
      setHexWithAlphaState(combineHexWithAlpha(newHex, alpha))
    },
    [alpha, setHexWithAlphaState]
  )

  // Expose imperative API via ref
  useImperativeHandle(
    ref,
    () => ({
      getColor: () => hex,
      getColor8: () => hex8,
      getAlpha: () => alpha,
      getHsv: () => ({ ...hsv }),
      setColor: setHex,
      setAlpha,
      setHsv,
      setHue,
      setSaturation,
      setBrightness,
    }),
    [hex, hex8, alpha, hsv, setHex, setAlpha, setHsv, setHue, setSaturation, setBrightness]
  )

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
    onDragStart?.()
  }, [onDragStart])

  const handleDrag = useCallback(
    (currentHex: string) => {
      onDrag?.(currentHex)
    },
    [onDrag]
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    onDragEnd?.()
    if (hexWithAlpha) {
      onValueChangeEnd?.(hexWithAlpha)
    }
  }, [hexWithAlpha, onDragEnd, onValueChangeEnd])

  const handleFocus = useCallback(() => {
    onFocus?.()
  }, [onFocus])

  const handleBlur = useCallback(() => {
    onBlur?.()
  }, [onBlur])

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
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
      onFocus: handleFocus,
      onBlur: handleBlur,
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
      handleDrag,
      handleDragEnd,
      handleFocus,
      handleBlur,
    ]
  )

  return (
    <ColorWheelContext.Provider value={contextValue}>
      <div data-color-wheel-root data-disabled={disabled || undefined}>
        {children}
        {/* Screen reader announcement region */}
        <div
          ref={announcementRef}
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
        />
      </div>
    </ColorWheelContext.Provider>
  )
})

Root.displayName = 'Root'
