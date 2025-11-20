import { useCanvasActions, useCanvasStore } from '@/stores/canvas.store'

type ElementToolbarProps = {
  readonly elementId: string
}

export function ElementToolbar ({ elementId }: ElementToolbarProps) {
  const actions = useCanvasActions()
  const elements = useCanvasStore(state => state.elements)
  const element = elements.find(el => el.id === elementId)
  const elementIndex = elements.findIndex(el => el.id === elementId)

  if (!element || !actions) return null

  const handleMoveUp = () => {
    if (elementIndex > 0 && actions) {
      const prevElement = elements[elementIndex - 1]
      actions.updateElement(elementId, {
        position: { ...element.position, zIndex: prevElement.position.zIndex }
      })
      actions.updateElement(prevElement.id, {
        position: { ...prevElement.position, zIndex: element.position.zIndex }
      })
    }
  }

  const handleMoveDown = () => {
    if (elementIndex < elements.length - 1 && actions) {
      const nextElement = elements[elementIndex + 1]
      actions.updateElement(elementId, {
        position: { ...element.position, zIndex: nextElement.position.zIndex }
      })
      actions.updateElement(nextElement.id, {
        position: { ...nextElement.position, zIndex: element.position.zIndex }
      })
    }
  }

  const handleDelete = () => {
    if (actions) {
      actions.deleteElement(elementId)
    }
  }

  const handleBringToFront = () => {
    if (actions) {
      actions.bringToFront(elementId)
    }
  }

  const handleSendToBack = () => {
    if (actions) {
      actions.sendToBack(elementId)
    }
  }

  const x = typeof element.position.x === 'number' ? element.position.x : 0
  const y = typeof element.position.y === 'number' ? element.position.y : 0
  const elementHeight =
    typeof element.position.height === 'number' ? element.position.height : 80

  const isHeaderAtTop = element.type === 'header' && y <= 10
  const toolbarTop = isHeaderAtTop ? y + elementHeight + 5 : y - 40

  return (
    <div
      className='absolute flex gap-1 bg-white border border-gray-300 rounded shadow-lg p-1 z-50'
      style={{
        left: `${x}px`,
        top: `${toolbarTop}px`,
        zIndex: (element.position.zIndex ?? 1) + 1000
      }}
    >
      <button
        onClick={handleMoveUp}
        className='p-1 hover:bg-gray-100 rounded text-blue-600'
        title='Move Up'
      >
        ↑
      </button>
      <button
        onClick={handleMoveDown}
        className='p-1 hover:bg-gray-100 rounded text-gray-600'
        title='Move Down'
      >
        ↓
      </button>
      <button
        onClick={handleBringToFront}
        className='p-1 hover:bg-gray-100 rounded text-purple-600'
        title='Bring to Front'
      >
        ⬆
      </button>
      <button
        onClick={handleSendToBack}
        className='p-1 hover:bg-gray-100 rounded text-purple-600'
        title='Send to Back'
      >
        ⬇
      </button>
      <button
        onClick={handleDelete}
        className='p-1 hover:bg-red-100 rounded text-red-600'
        title='Delete'
      >
        🗑️
      </button>
    </div>
  )
}
