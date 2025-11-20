import { useCanvasActions, useCanvasStore } from '@/stores/canvas.store'

type ElementToolbarProps = {
  readonly elementId: string
}

export function ElementToolbar ({ elementId }: ElementToolbarProps) {
  const actions = useCanvasActions()
  const elements = useCanvasStore(state => state.elements)
  const element = elements.find(el => el.id === elementId)

  if (!element || !actions) return null

  const handleToggleZIndex = () => {
    if (!actions) return

    const maxZIndex = Math.max(...elements.map(el => el.position.zIndex))
    const isAtFront = element.position.zIndex === maxZIndex

    if (isAtFront) {
      actions.sendToBack(elementId)
    } else {
      actions.bringToFront(elementId)
    }
  }

  const handleDelete = () => {
    if (actions) {
      actions.deleteElement(elementId)
    }
  }

  const maxZIndex =
    elements.length > 0
      ? Math.max(...elements.map(el => el.position.zIndex))
      : 1
  const isAtFront = element.position.zIndex === maxZIndex

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
        onClick={handleToggleZIndex}
        className='p-1 hover:bg-gray-100 rounded text-purple-600'
        title={isAtFront ? 'Send to Back' : 'Bring to Front'}
      >
        {isAtFront ? '⬇' : '⬆'}
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
