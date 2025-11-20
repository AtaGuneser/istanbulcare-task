import { useState, useEffect } from 'react'
import type { CanvasElement, CanvasConfig } from '@/types/element.types'
import {
  calculateAbsolutePosition,
  applyGridSnap
} from '@/lib/utils/position-calculator'

function getActualElementWidth (
  width: number | string,
  canvasWidth: number,
  elementType: string
): number {
  if (typeof width === 'number') {
    return width
  }
  if (typeof width === 'string' && width.endsWith('%')) {
    const percentage = parseFloat(width) / 100
    return canvasWidth * percentage
  }
  if (typeof width === 'string' && width === 'auto') {
    if (elementType === 'text-content') {
      return 400
    }
    return 300
  }
  return 300
}

type ResizeHandlesProps = {
  readonly element: CanvasElement
  readonly canvasOffset: { x: number; y: number }
  readonly canvasConfig: CanvasConfig
  readonly onResize: (width: number | string, height: number) => void
  readonly onMove?: (newPosition: Partial<{ x: number; y: number }>) => void
  readonly onResizeStart?: () => void
  readonly onResizeEnd?: () => void
}

type ResizeHandlePosition = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w'

export function ResizeHandles ({
  element,
  canvasOffset,
  canvasConfig,
  onResize,
  onMove,
  onResizeStart,
  onResizeEnd
}: ResizeHandlesProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<ResizeHandlePosition | null>(
    null
  )
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = useState({ width: 0, height: 0 })
  const [startElementPos, setStartElementPos] = useState({ x: 0, y: 0 })

  const handleMouseDown = (
    e: React.MouseEvent,
    handle: ResizeHandlePosition
  ) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
    onResizeStart?.()

    const elementWidth = getActualElementWidth(
      element.position.width,
      canvasConfig.width,
      element.type
    )

    const elementHeight =
      typeof element.position.height === 'number'
        ? element.position.height
        : 200

    const mousePos = { x: e.clientX, y: e.clientY }
    const absolutePos = calculateAbsolutePosition(mousePos, canvasOffset)

    let elementX: number
    if (typeof element.position.x === 'number') {
      elementX = element.position.x
    } else if (typeof element.position.x === 'string') {
      if (element.position.x.endsWith('%')) {
        const percentage = parseFloat(element.position.x) / 100
        elementX = canvasConfig.width * percentage
      } else {
        elementX = parseFloat(element.position.x) || 0
      }
    } else {
      elementX = 0
    }

    const elementY =
      typeof element.position.y === 'number' ? element.position.y : 0

    setStartPos(absolutePos)
    setStartSize({ width: elementWidth, height: elementHeight })
    setStartElementPos({ x: elementX, y: elementY })
  }

  useEffect(() => {
    if (!isResizing || !resizeHandle) return

    const handleMouseMove = (e: MouseEvent) => {
      const mousePos = { x: e.clientX, y: e.clientY }
      const absolutePos = calculateAbsolutePosition(mousePos, canvasOffset)
      const snappedPos = applyGridSnap(absolutePos, canvasConfig.grid)

      let newWidth = startSize.width
      let newHeight = startSize.height
      let newX = startElementPos.x
      let newY = startElementPos.y

      const deltaX = snappedPos.x - startPos.x
      const deltaY = snappedPos.y - startPos.y

      if (resizeHandle.includes('e')) {
        newWidth = Math.max(50, startSize.width + deltaX)
      }
      if (resizeHandle.includes('w')) {
        const widthChange = deltaX
        newWidth = Math.max(50, startSize.width - widthChange)
        newX = startElementPos.x + widthChange
      }
      if (resizeHandle.includes('s')) {
        newHeight = Math.max(50, startSize.height + deltaY)
      }
      if (resizeHandle.includes('n')) {
        const heightChange = deltaY
        newHeight = Math.max(50, startSize.height - heightChange)
        newY = startElementPos.y + heightChange
      }

      if (canvasConfig.grid.enabled && canvasConfig.grid.snap) {
        newWidth =
          Math.round(newWidth / canvasConfig.grid.size) * canvasConfig.grid.size
        newHeight =
          Math.round(newHeight / canvasConfig.grid.size) *
          canvasConfig.grid.size
        if (resizeHandle.includes('w')) {
          newX =
            Math.round(newX / canvasConfig.grid.size) * canvasConfig.grid.size
        }
        if (resizeHandle.includes('n')) {
          newY =
            Math.round(newY / canvasConfig.grid.size) * canvasConfig.grid.size
        }
      }

      onResize(newWidth, newHeight)

      if (
        onMove &&
        (resizeHandle.includes('w') || resizeHandle.includes('n'))
      ) {
        const positionUpdate: Partial<{ x: number; y: number }> = {}
        if (resizeHandle.includes('w')) {
          positionUpdate.x = newX
        }
        if (resizeHandle.includes('n')) {
          positionUpdate.y = newY
        }
        onMove(positionUpdate)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeHandle(null)
      onResizeEnd?.()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [
    isResizing,
    resizeHandle,
    startPos,
    startSize,
    startElementPos,
    canvasOffset,
    canvasConfig,
    onResize,
    onMove,
    onResizeEnd
  ])

  let elementX: number
  if (typeof element.position.x === 'number') {
    elementX = element.position.x
  } else if (typeof element.position.x === 'string') {
    if (element.position.x.endsWith('%')) {
      const percentage = parseFloat(element.position.x) / 100
      elementX = canvasConfig.width * percentage
    } else {
      elementX = parseFloat(element.position.x) || 0
    }
  } else {
    elementX = 0
  }

  const elementY =
    typeof element.position.y === 'number' ? element.position.y : 0

  const elementWidth = getActualElementWidth(
    element.position.width,
    canvasConfig.width,
    element.type
  )

  const elementHeight =
    typeof element.position.height === 'number' ? element.position.height : 200

  const handleSize = 12
  const handleOffset = handleSize / 2

  const actualWidth = elementWidth

  const handles: Array<{
    position: ResizeHandlePosition
    style: React.CSSProperties
  }> = [
    {
      position: 'nw',
      style: {
        top: `${Math.max(0, elementY - handleOffset)}px`,
        left: `${elementX - handleOffset}px`,
        cursor: 'nw-resize'
      }
    },
    {
      position: 'ne',
      style: {
        top: `${Math.max(0, elementY - handleOffset)}px`,
        left: `${elementX + actualWidth - handleOffset}px`,
        cursor: 'ne-resize'
      }
    },
    {
      position: 'sw',
      style: {
        top: `${elementY + elementHeight - handleOffset}px`,
        left: `${elementX - handleOffset}px`,
        cursor: 'sw-resize'
      }
    },
    {
      position: 'se',
      style: {
        top: `${elementY + elementHeight - handleOffset}px`,
        left: `${elementX + actualWidth - handleOffset}px`,
        cursor: 'se-resize'
      }
    },
    {
      position: 'n',
      style: {
        top: `${Math.max(0, elementY - handleOffset)}px`,
        left: `${elementX + actualWidth / 2 - handleOffset}px`,
        cursor: 'n-resize'
      }
    },
    {
      position: 's',
      style: {
        top: `${elementY + elementHeight - handleOffset}px`,
        left: `${elementX + actualWidth / 2 - handleOffset}px`,
        cursor: 's-resize'
      }
    },
    {
      position: 'e',
      style: {
        top: `${elementY + elementHeight / 2 - handleOffset}px`,
        left: `${elementX + actualWidth - handleOffset}px`,
        cursor: 'e-resize'
      }
    },
    {
      position: 'w',
      style: {
        top: `${elementY + elementHeight / 2 - handleOffset}px`,
        left: `${elementX - handleOffset}px`,
        cursor: 'w-resize'
      }
    }
  ]

  return (
    <>
      {handles.map(handle => (
        <div
          key={handle.position}
          data-resize-handle
          onMouseDown={e => handleMouseDown(e, handle.position)}
          className='absolute bg-blue-500 border-2 border-white rounded-sm z-50 shadow-lg'
          style={{
            ...handle.style,
            width: `${handleSize}px`,
            height: `${handleSize}px`,
            zIndex: (element.position.zIndex ?? 1) + 1001
          }}
        />
      ))}
    </>
  )
}
