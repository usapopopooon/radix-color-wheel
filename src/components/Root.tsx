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
import {
  hexToHsv,
  hsvToHex,
  parseAlphaFromHex,
  combineHexWithAlpha,
  alphaToHex,
  validateRootProps,
  isHex8,
  stripAlphaFromHex,
} from '../utils'
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
    jumpOnClick = true,
    children,
  },
  ref
) {
  // Validate props in development mode
  validateRootProps({ value, defaultValue, alpha: alphaProp, defaultAlpha })

  // Controllable hex state (may include alpha as 8 digits)
  const [hexWithAlpha, setHexWithAlphaState] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })

  // Extract base hex (6 digits) from potentially 8-digit hex
  const hex = useMemo(() => {
    return stripAlphaFromHex(hexWithAlpha ?? '#ff0000')
  }, [hexWithAlpha])

  // Derived HSV from hex
  const derivedHsv = useMemo(() => hexToHsv(hex), [hex])

  // Preserve hue independently to avoid HSV->HEX->HSV rounding errors
  // Hue is undefined when saturation=0 (grayscale), so we preserve it
  // Use state instead of ref to trigger re-renders when hue changes (even if hex doesn't)
  const [preservedHue, setPreservedHue] = useState(derivedHsv.h)

  // Track hex changes to detect external vs internal updates
  // Use state instead of ref to allow access during render
  const [lastInternalHex, setLastInternalHex] = useState<string | null>(null)

  // Track previous hex to detect external changes
  const [prevHex, setPrevHex] = useState(hex)

  // Preserve saturation as state (not ref) because when v=0, hex doesn't change
  // but we still need to trigger re-renders when saturation changes
  const [preservedSaturation, setPreservedSaturation] = useState(derivedHsv.s)

  // Detect external changes and sync preserved values (during render, before useMemo)
  // This pattern is recommended by React for derived state: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (prevHex !== hex) {
    setPrevHex(hex)
    // Check if this is an external change (not from our internal updates)
    if (lastInternalHex !== hex) {
      // External change detected
      // Only update preserved hue if saturation > 0 (hue is defined)
      if (derivedHsv.s > 0) {
        setPreservedHue(derivedHsv.h)
      }
      // Only update preserved saturation if value > 0 (saturation is defined)
      if (derivedHsv.v > 0) {
        setPreservedSaturation(derivedHsv.s)
      }
    }
  }

  // Combined HSV: use preserved values to avoid rounding errors
  const hsv = useMemo(
    () => ({
      h: preservedHue,
      // Use preserved saturation when value=0 (black), otherwise use derived
      s: derivedHsv.v === 0 ? preservedSaturation : derivedHsv.s,
      v: derivedHsv.v,
    }),
    [derivedHsv, preservedHue, preservedSaturation]
  )

  // Alpha state - controllable
  // Priority: alphaProp > defaultAlpha > parsed from hex
  const computedDefaultAlpha = useMemo(() => {
    // If defaultAlpha is explicitly set (not 100), use it
    // Otherwise parse from hex value
    if (defaultAlpha !== 100) {
      return defaultAlpha
    }
    return parseAlphaFromHex(hexWithAlpha ?? '#ff0000')
  }, [defaultAlpha, hexWithAlpha])

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
      // Always update preserved hue so it persists when saturation is 0
      // This triggers re-render even if hex doesn't change (e.g., when s=0 or v=0)
      setPreservedHue(h)
      const newHex = hsvToHex(h, hsv.s, hsv.v)
      setLastInternalHex(newHex)
      setHexWithAlphaState(combineHexWithAlpha(newHex, alpha))
      onHueChange?.(h)
    },
    [hsv.s, hsv.v, alpha, setHexWithAlphaState, onHueChange]
  )

  // Use preservedHue instead of hsv.h to avoid HSV->HEX->HSV rounding errors
  const setSaturation = useCallback(
    (s: number) => {
      // Preserve saturation for when v=0 (black makes saturation undefined)
      setPreservedSaturation(s)
      const newHex = hsvToHex(preservedHue, s, hsv.v)
      setLastInternalHex(newHex)
      setHexWithAlphaState(combineHexWithAlpha(newHex, alpha))
      onSaturationChange?.(s)
    },
    [preservedHue, hsv.v, alpha, setHexWithAlphaState, onSaturationChange]
  )

  // Use preservedHue and preserved saturation to avoid HSV->HEX->HSV rounding errors
  const setBrightness = useCallback(
    (v: number) => {
      // Use preserved saturation to maintain value when at v=0
      const newHex = hsvToHex(preservedHue, preservedSaturation, v)
      setLastInternalHex(newHex)
      setHexWithAlphaState(combineHexWithAlpha(newHex, alpha))
      onBrightnessChange?.(v)
    },
    [preservedHue, preservedSaturation, alpha, setHexWithAlphaState, onBrightnessChange]
  )

  // Set both saturation and brightness atomically to avoid race conditions
  // Use preservedHue instead of hsv.h to avoid HSV->HEX->HSV rounding errors
  const setSaturationAndBrightness = useCallback(
    (s: number, v: number) => {
      // Preserve saturation for when v=0 (black makes saturation undefined)
      setPreservedSaturation(s)
      const newHex = hsvToHex(preservedHue, s, v)
      setLastInternalHex(newHex)
      setHexWithAlphaState(combineHexWithAlpha(newHex, alpha))
      onSaturationChange?.(s)
      onBrightnessChange?.(v)
    },
    [preservedHue, alpha, setHexWithAlphaState, onSaturationChange, onBrightnessChange]
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
      if (isHex8(newHex)) {
        // 8-digit hex: use as-is and update alpha
        setHexWithAlphaState(newHex)
        setAlphaState(parseAlphaFromHex(newHex))
      } else {
        // 6-digit hex: preserve current alpha
        setHexWithAlphaState(combineHexWithAlpha(newHex, alpha))
      }
    },
    [alpha, setHexWithAlphaState, setAlphaState]
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
      setSaturationAndBrightness,
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
      jumpOnClick,
    }),
    [
      hsv,
      alpha,
      hex,
      hex8,
      setHue,
      setSaturation,
      setBrightness,
      setSaturationAndBrightness,
      setAlpha,
      setHex,
      disabled,
      isDragging,
      handleDragStart,
      handleDrag,
      handleDragEnd,
      handleFocus,
      handleBlur,
      jumpOnClick,
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
