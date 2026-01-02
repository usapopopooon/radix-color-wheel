import { forwardRef, useMemo, useCallback, useRef, useImperativeHandle } from 'react'
import { useColorWheelContext } from '../context/ColorWheelContext'
import { useWheelContext } from '../context/WheelContext'
import { getHueFromPosition } from '../utils'
import type { HueRingProps } from '../types'

/**
 * HueRing component - Displays the circular hue gradient
 *
 * Renders a ring-shaped element with a conic gradient representing all hues.
 * This component is decorative and non-interactive (use HueThumb for interaction).
 *
 * @param props - Component props
 * @param props.className - Additional CSS class
 * @param props.style - Inline styles
 *
 * @example
 * ```tsx
 * <ColorWheel.Wheel>
 *   <ColorWheel.HueRing />
 *   <ColorWheel.HueThumb />
 * </ColorWheel.Wheel>
 * ```
 */
export const HueRing = forwardRef<HTMLDivElement, HueRingProps>(
  ({ className, style, ...props }, ref) => {
    const { setHue, disabled, jumpOnClick, onDragStart, onDragEnd, hex, onDrag } =
      useColorWheelContext()
    const { size, ringWidth } = useWheelContext()
    const ringRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ringRef.current!, [])

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled || !jumpOnClick) return
        e.preventDefault()

        const rect = ringRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const center = size / 2

        // Check if click is within the ring area
        const distanceFromCenter = Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2))
        const outerRadius = size / 2
        const innerRadius = outerRadius - ringWidth

        if (distanceFromCenter >= innerRadius && distanceFromCenter <= outerRadius) {
          // Capture pointer on the ring for continued dragging
          ringRef.current?.setPointerCapture(e.pointerId)
          onDragStart?.()

          // Calculate and set hue
          const newHue = getHueFromPosition(x, y, center, center)
          setHue(Math.round(newHue))
        }
      },
      [disabled, jumpOnClick, size, ringWidth, setHue, onDragStart]
    )

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return
        if (!ringRef.current?.hasPointerCapture(e.pointerId)) return

        const rect = ringRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const center = size / 2

        const newHue = getHueFromPosition(x, y, center, center)
        setHue(Math.round(newHue))
        onDrag?.(hex)
      },
      [disabled, size, setHue, onDrag, hex]
    )

    const handlePointerUp = useCallback(
      (e: React.PointerEvent) => {
        if (ringRef.current?.hasPointerCapture(e.pointerId)) {
          ringRef.current.releasePointerCapture(e.pointerId)
          onDragEnd?.()
        }
      },
      [onDragEnd]
    )

    const ringStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        // Use border with conic-gradient for hue ring
        // This creates a transparent center naturally
        border: `${ringWidth}px solid transparent`,
        backgroundImage: `conic-gradient(
        from -90deg,
        hsl(0, 100%, 50%),
        hsl(60, 100%, 50%),
        hsl(120, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(240, 100%, 50%),
        hsl(300, 100%, 50%),
        hsl(360, 100%, 50%)
      )`,
        backgroundOrigin: 'border-box',
        backgroundClip: 'border-box',
        // Mask to show only the border area (ring)
        // Add 1px gradient transition for anti-aliasing (smoother edge)
        mask: `radial-gradient(farthest-side, transparent calc(100% - ${ringWidth}px - 1px), black calc(100% - ${ringWidth}px))`,
        WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ringWidth}px - 1px), black calc(100% - ${ringWidth}px))`,
        boxSizing: 'border-box',
        cursor: disabled ? 'default' : 'pointer',
        touchAction: 'none',
        ...style,
      }),
      [ringWidth, style, disabled]
    )

    return (
      <div
        ref={ringRef}
        data-color-wheel-hue-ring
        className={className}
        style={ringStyle}
        aria-hidden="true"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        {...props}
      />
    )
  }
)

HueRing.displayName = 'HueRing'
