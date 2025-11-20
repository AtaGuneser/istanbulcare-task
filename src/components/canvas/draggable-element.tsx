import { useState } from 'react'
import type {
  CanvasElement,
  CanvasConfig,
  Position
} from '@/types/element.types'
import { ElementRenderer } from '@/components/elements/element-renderer'
import { ElementToolbar } from './element-toolbar'
import { ResizeHandles } from './resize-handles'
import {
  calculateAbsolutePosition,
  applyGridSnap,
  isPositionValid
} from '@/lib/utils/position-calculator'

type DraggableElementProps = {
  readonly element: CanvasElement
  readonly isSelected: boolean
  readonly canvasOffset: { x: number; y: number }
  readonly canvasConfig: CanvasConfig
  readonly onSelect: () => void
  readonly onMove: (newPosition: Partial<Position>) => void
  readonly onResize: (width: number | string, height: number) => void
}

export function DraggableElement ({
  element,
  isSelected,
  canvasOffset,
  canvasConfig,
  onSelect,
  onMove,
  onResize
}: DraggableElementProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (isResizing) {
      event.preventDefault()
      return
    }

    setIsDragging(true)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/element-id', element.id)

    const elementX =
      typeof element.position.x === 'number' ? element.position.x : 0
    const elementY =
      typeof element.position.y === 'number' ? element.position.y : 0
    const mousePos = { x: event.clientX, y: event.clientY }
    const absolutePos = calculateAbsolutePosition(mousePos, canvasOffset)

    const offsetX = absolutePos.x - elementX
    const offsetY = absolutePos.y - elementY

    setDragOffset({ x: offsetX, y: offsetY })

    event.dataTransfer.setData('application/drag-offset-x', offsetX.toString())
    event.dataTransfer.setData('application/drag-offset-y', offsetY.toString())
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
  }

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isDragging || isResizing) return

    const mousePos = { x: event.clientX, y: event.clientY }
    const absolutePos = calculateAbsolutePosition(mousePos, canvasOffset)
    const newPos = {
      x: absolutePos.x - dragOffset.x,
      y: absolutePos.y - dragOffset.y
    }
    const snappedPos = applyGridSnap(newPos, canvasConfig.grid)

    if (
      isPositionValid(snappedPos, {
        width: canvasConfig.width,
        height: canvasConfig.height
      })
    ) {
      onMove({ x: snappedPos.x, y: snappedPos.y })
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      isResizing ||
      (event.target as HTMLElement).closest('[data-resize-handle]')
    ) {
      return
    }
    onSelect()
  }

  return (
    <div
      draggable={!isResizing}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={isDragging ? 'opacity-50' : ''}
      style={{
        cursor: isDragging ? 'grabbing' : isResizing ? 'default' : 'grab'
      }}
    >
      {isSelected && <ElementToolbar elementId={element.id} />}
      {isSelected && (
        <ResizeHandles
          element={element}
          canvasOffset={canvasOffset}
          canvasConfig={canvasConfig}
          onResize={onResize}
          onMove={onMove}
          onResizeStart={() => setIsResizing(true)}
          onResizeEnd={() => setIsResizing(false)}
        />
      )}
      <ElementRenderer
        element={element}
        isSelected={isSelected}
        onSelect={onSelect}
      />
    </div>
  )
}
