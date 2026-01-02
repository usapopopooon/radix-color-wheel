import { useState, useCallback, useMemo } from 'react'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { ColorWheelContext, type ColorWheelContextValue } from '../context/ColorWheelContext'
import { hexToHsv, hsvToHex } from '../utils'
import type { RootProps } from '../types'

/**
 * Root component for ColorWheel
 *
 * Acts as a Context Provider, sharing color state and
 * update functions with all child components.
 *
 * @param props - Component props
 * @param props.value - Current color (HEX format, e.g., "#ff0000")
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
  onDragStart,
  onDragEnd,
  disabled = false,
  children,
}: RootProps): JSX.Element {
  // Controllable hex state
  const [hex, setHexState] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })

  // Derived HSV state from hex
  const hsv = useMemo(() => hexToHsv(hex ?? '#ff0000'), [hex])

  // Drag state
  const [isDragging, setIsDragging] = useState(false)

  // Update handlers
  const setHue = useCallback(
    (h: number) => {
      const newHex = hsvToHex(h, hsv.s, hsv.v)
      setHexState(newHex)
      onHueChange?.(h)
    },
    [hsv.s, hsv.v, setHexState, onHueChange]
  )

  const setSaturation = useCallback(
    (s: number) => {
      const newHex = hsvToHex(hsv.h, s, hsv.v)
      setHexState(newHex)
      onSaturationChange?.(s)
    },
    [hsv.h, hsv.v, setHexState, onSaturationChange]
  )

  const setBrightness = useCallback(
    (v: number) => {
      const newHex = hsvToHex(hsv.h, hsv.s, v)
      setHexState(newHex)
      onBrightnessChange?.(v)
    },
    [hsv.h, hsv.s, setHexState, onBrightnessChange]
  )

  const setHex = useCallback(
    (newHex: string) => {
      setHexState(newHex)
    },
    [setHexState]
  )

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
    onDragStart?.()
  }, [onDragStart])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    onDragEnd?.()
    if (hex) {
      onValueChangeEnd?.(hex)
    }
  }, [hex, onDragEnd, onValueChangeEnd])

  // Context value
  const contextValue = useMemo<ColorWheelContextValue>(
    () => ({
      hsv,
      hex: hex ?? '#ff0000',
      setHue,
      setSaturation,
      setBrightness,
      setHex,
      disabled,
      isDragging,
      setIsDragging,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
    }),
    [
      hsv,
      hex,
      setHue,
      setSaturation,
      setBrightness,
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
      </div>
    </ColorWheelContext.Provider>
  )
}
