import { useState, useRef, useCallback } from 'react'

/**
 * Return type for drag operations
 */
export interface UseDragReturn {
  /** Ref to container element */
  readonly containerRef: React.RefObject<HTMLDivElement | null>
  /** Whether currently dragging */
  readonly isDragging: boolean
  /** Event handlers */
  readonly handlers: Readonly<{
    onPointerDown: (e: React.PointerEvent) => void
    onPointerMove: (e: React.PointerEvent) => void
    onPointerUp: (e: React.PointerEvent) => void
  }>
}

/**
 * Options for useDrag hook
 */
export interface UseDragOptions {
  /** If true, disables drag */
  readonly disabled?: boolean
  /** Callback when drag starts */
  readonly onDragStart?: () => void
  /** Callback when drag ends */
  readonly onDragEnd?: () => void
}

/**
 * Custom hook for managing drag operations
 *
 * Provides mouse and touch compatible drag handling using Pointer Events.
 * Manages pointerdown -> pointermove -> pointerup event flow.
 *
 * @param onMove - Callback called during drag with coordinates
 * @param options - Optional settings
 * @returns Drag state and event handlers
 *
 * @example
 * ```tsx
 * const { containerRef, isDragging, handlers } = useDrag(
 *   (x, y) => console.log(x, y),
 *   { disabled: false }
 * )
 *
 * return <div ref={containerRef} {...handlers} />
 * ```
 */
export function useDrag(
  onMove: (x: number, y: number) => void,
  options?: UseDragOptions
): UseDragReturn {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const disabled = options?.disabled ?? false

  const updatePosition = useCallback(
    (e: React.PointerEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      onMove(x, y)
    },
    [onMove]
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      e.preventDefault()
      setIsDragging(true)
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      options?.onDragStart?.()
      updatePosition(e)
    },
    [disabled, updatePosition, options]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      updatePosition(e)
    },
    [isDragging, updatePosition]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      setIsDragging(false)
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      options?.onDragEnd?.()
    },
    [isDragging, options]
  )

  return {
    containerRef,
    isDragging,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  }
}
