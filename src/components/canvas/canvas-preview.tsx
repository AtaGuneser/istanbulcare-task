import { useRef, useState, useEffect } from 'react'
import {
  useCanvasElements,
  useCanvasActions,
  useCanvasConfig,
  useCanvasIsDragging,
  useCanvasDragElementType,
  useCanvasStore
} from '@/stores/canvas.store'
import { DraggableElement } from './draggable-element'
import type { ElementType, Position } from '@/types/element.types'
import {
  calculateAbsolutePosition,
  applyGridSnap,
  isPositionValid
} from '@/lib/utils/position-calculator'
import { getDefaultElementSize } from '@/lib/utils/element-defaults'

type CanvasPreviewProps = {
  readonly className?: string
}

export function CanvasPreview ({ className }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [dragPosition, setDragPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  const elements = useCanvasElements()
  const selectedElementId = useCanvasStore(state => state.selectedElementId)
  const actions = useCanvasActions()
  const canvasConfig = useCanvasConfig()
  const isDragging = useCanvasIsDragging()
  const dragElementType = useCanvasDragElementType()

  useEffect(() => {
    const updateOffset = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setCanvasOffset({ x: rect.left, y: rect.top })
      }
    }

    updateOffset()
    window.addEventListener('resize', updateOffset)
    return () => window.removeEventListener('resize', updateOffset)
  }, [])

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!dragElementType) return

    setIsDraggingOver(true)
    event.dataTransfer.dropEffect = 'copy'

    const mousePos = { x: event.clientX, y: event.clientY }
    const absolutePos = calculateAbsolutePosition(mousePos, canvasOffset)
    const snappedPos = applyGridSnap(absolutePos, canvasConfig.grid)

    if (
      isPositionValid(snappedPos, {
        width: canvasConfig.width,
        height: canvasConfig.height
      })
    ) {
      setDragPosition(snappedPos)
    }
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (!canvasRef.current?.contains(event.relatedTarget as Node)) {
      setIsDraggingOver(false)
      setDragPosition(null)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    setIsDraggingOver(false)
    setDragPosition(null)

    const draggedElementId = event.dataTransfer.getData(
      'application/element-id'
    )
    if (draggedElementId) {
      const mousePos = { x: event.clientX, y: event.clientY }
      const absolutePos = calculateAbsolutePosition(mousePos, canvasOffset)

      // Get offset from drag start
      const offsetX = parseFloat(
        event.dataTransfer.getData('application/drag-offset-x') || '0'
      )
      const offsetY = parseFloat(
        event.dataTransfer.getData('application/drag-offset-y') || '0'
      )

      // Calculate new position accounting for offset
      const newPos = {
        x: absolutePos.x - offsetX,
        y: absolutePos.y - offsetY
      }
      const snappedPos = applyGridSnap(newPos, canvasConfig.grid)

      if (
        isPositionValid(snappedPos, {
          width: canvasConfig.width,
          height: canvasConfig.height
        }) &&
        actions
      ) {
        actions.moveElement(draggedElementId, {
          x: snappedPos.x,
          y: snappedPos.y
        })
      }
      return
    }

    const elementType = event.dataTransfer.getData(
      'application/element-type'
    ) as ElementType
    if (!elementType) return

    const mousePos = { x: event.clientX, y: event.clientY }
    const absolutePos = calculateAbsolutePosition(mousePos, canvasOffset)
    const snappedPos = applyGridSnap(absolutePos, canvasConfig.grid)

    if (
      !isPositionValid(snappedPos, {
        width: canvasConfig.width,
        height: canvasConfig.height
      })
    ) {
      return
    }

    const defaultSize = getDefaultElementSize(elementType)
    const position: Position = {
      x: snappedPos.x,
      y: snappedPos.y,
      width: defaultSize.width,
      height: defaultSize.height,
      zIndex: elements.length + 1
    }

    if (actions) {
      actions.addElement(elementType, position)
      actions.setDragging(false, null)
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && actions) {
      actions.selectElement(null)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Delete' && selectedElementId && actions) {
      actions.deleteElement(selectedElementId)
    }
  }

  return (
    <div
      ref={canvasRef}
      tabIndex={0}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
      onKeyDown={handleKeyDown}
      className={`
        relative bg-gradient-to-b from-white to-indigo-50
        ${isDraggingOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
        ${className || ''}
      `}
      style={{
        width: `${canvasConfig.width}px`,
        height: `${canvasConfig.height}px`,
        minHeight: `${canvasConfig.height}px`
      }}
    >
      {canvasConfig.grid.enabled && (
        <div
          className='absolute inset-0 opacity-10 pointer-events-none'
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: `${canvasConfig.grid.size}px ${canvasConfig.grid.size}px`
          }}
        />
      )}

      {/* Drop indicator */}
      {isDragging && dragPosition && dragElementType && (
        <div
          className='absolute border-2 border-dashed border-blue-400 bg-blue-100/30 pointer-events-none'
          style={{
            left: `${dragPosition.x}px`,
            top: `${dragPosition.y}px`,
            width:
              typeof getDefaultElementSize(dragElementType).width === 'number'
                ? `${getDefaultElementSize(dragElementType).width}px`
                : getDefaultElementSize(dragElementType).width,
            height: `${getDefaultElementSize(dragElementType).height}px`
          }}
        />
      )}

      {/* Render elements */}
      {elements.map(element => (
        <DraggableElement
          key={element.id}
          element={element}
          isSelected={element.id === selectedElementId}
          canvasOffset={canvasOffset}
          canvasConfig={canvasConfig}
          onSelect={() => actions?.selectElement(element.id)}
          onMove={newPosition => actions?.moveElement(element.id, newPosition)}
          onResize={(width, height) =>
            actions?.resizeElement(element.id, width, height)
          }
        />
      ))}
    </div>
  )
}
