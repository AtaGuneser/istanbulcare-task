import { create } from 'zustand'
import type {
  CanvasElement,
  CanvasConfig,
  ElementType,
  Position
} from '@/types/element.types'
import { generateElementId } from '@/lib/utils/element-id'

type CanvasState = {
  readonly elements: readonly CanvasElement[]
  readonly selectedElementId: string | null
  readonly canvasConfig: CanvasConfig
  readonly isDragging: boolean
  readonly dragElementType: ElementType | null
  readonly projectCreated: string | null
  readonly projectLastModified: string | null
}

type CanvasActions = {
  readonly actions: {
    addElement: (type: ElementType, position: Position) => void
    updateElement: (id: string, updates: Partial<CanvasElement>) => void
    deleteElement: (id: string) => void
    selectElement: (id: string | null) => void
    moveElement: (id: string, newPosition: Partial<Position>) => void
    resizeElement: (
      id: string,
      width: number | string,
      height: number | string
    ) => void
    bringToFront: (id: string) => void
    sendToBack: (id: string) => void
    setDragging: (isDragging: boolean, elementType?: ElementType | null) => void
    setElements: (elements: readonly CanvasElement[]) => void
    setCanvasConfig: (config: Partial<CanvasConfig>) => void
    setProjectMetadata: (
      created: string | null,
      lastModified: string | null
    ) => void
  }
}

const DEFAULT_CANVAS_CONFIG: CanvasConfig = {
  width: 1200,
  height: 800,
  grid: {
    enabled: true,
    size: 10,
    snap: true
  }
}

const getDefaultElementContent = (type: ElementType) => {
  switch (type) {
    case 'header':
      return { text: 'Site Başlığı', style: 'default' }
    case 'footer':
      return { copyright: '© 2024 Test Builder', links: [] }
    case 'card':
      return {
        title: 'Card Title',
        description: 'Card description',
        image: null
      }
    case 'text-content':
      return {
        html: 'Metin içeriği buraya gelecek',
        plainText: 'Metin içeriği buraya gelecek'
      }
    case 'slider':
      return { image: null }
    default:
      return {}
  }
}

const getDefaultElementSize = (
  type: ElementType
): { width: number | string; height: number } => {
  switch (type) {
    case 'header':
      return { width: '100%', height: 80 }
    case 'footer':
      return { width: '100%', height: 60 }
    case 'card':
      return { width: 300, height: 200 }
    case 'text-content':
      return { width: 'auto', height: 100 }
    case 'slider':
      return { width: '100%', height: 400 }
    default:
      return { width: 300, height: 200 }
  }
}

export const useCanvasStore = create<CanvasState & CanvasActions>(
  (set, get) => ({
    elements: [],
    selectedElementId: null,
    canvasConfig: DEFAULT_CANVAS_CONFIG,
    isDragging: false,
    dragElementType: null,
    projectCreated: null,
    projectLastModified: null,

    actions: {
      addElement: (type, position) => {
        const { elements } = get()
        const maxZIndex =
          elements.length > 0
            ? Math.max(...elements.map(el => el.position.zIndex))
            : 0

        const newElement: CanvasElement = {
          id: generateElementId(type),
          type,
          content: getDefaultElementContent(type),
          position: {
            ...position,
            ...getDefaultElementSize(type),
            zIndex: maxZIndex + 1
          }
        }

        set(state => ({
          elements: [...state.elements, newElement],
          selectedElementId: newElement.id
        }))
      },

      updateElement: (id, updates) => {
        set(state => ({
          elements: state.elements.map(el =>
            el.id === id ? { ...el, ...updates } : el
          )
        }))
      },

      deleteElement: id => {
        set(state => {
          const newElements = state.elements.filter(el => el.id !== id)
          const newZIndexes = reorderZIndexes(newElements)
          return {
            elements: newZIndexes,
            selectedElementId:
              state.selectedElementId === id ? null : state.selectedElementId
          }
        })
      },

      selectElement: id => {
        set({ selectedElementId: id })
      },

      moveElement: (id, newPosition) => {
        set(state => ({
          elements: state.elements.map(el =>
            el.id === id
              ? {
                  ...el,
                  position: { ...el.position, ...newPosition }
                }
              : el
          )
        }))
      },

      resizeElement: (id, width, height) => {
        set(state => ({
          elements: state.elements.map(el =>
            el.id === id
              ? {
                  ...el,
                  position: { ...el.position, width, height }
                }
              : el
          )
        }))
      },

      bringToFront: id => {
        set(state => {
          const newElements = [...state.elements]
          const elementIndex = newElements.findIndex(el => el.id === id)
          if (elementIndex === -1) return state

          const element = newElements[elementIndex]
          const maxZIndex = Math.max(
            ...newElements.map(el => el.position.zIndex)
          )

          newElements[elementIndex] = {
            ...element,
            position: { ...element.position, zIndex: maxZIndex + 1 }
          }

          return {
            elements: reorderZIndexes(newElements)
          }
        })
      },

      sendToBack: id => {
        set(state => {
          const newElements = [...state.elements]
          const elementIndex = newElements.findIndex(el => el.id === id)
          if (elementIndex === -1) return state

          const element = newElements[elementIndex]
          const minZIndex = Math.min(
            ...newElements.map(el => el.position.zIndex)
          )

          newElements[elementIndex] = {
            ...element,
            position: { ...element.position, zIndex: minZIndex - 1 }
          }

          return {
            elements: reorderZIndexes(newElements)
          }
        })
      },

      setDragging: (isDragging, elementType = null) => {
        set({ isDragging, dragElementType: elementType })
      },

      setElements: elements => {
        set({ elements })
      },

      setCanvasConfig: config => {
        set(state => ({
          canvasConfig: { ...state.canvasConfig, ...config }
        }))
      },

      setProjectMetadata: (created, lastModified) => {
        set({ projectCreated: created, projectLastModified: lastModified })
      }
    }
  })
)

/**
 * Reorders z-indexes to be sequential starting from 1.
 */
function reorderZIndexes (elements: readonly CanvasElement[]): CanvasElement[] {
  const sorted = [...elements].sort(
    (a, b) => a.position.zIndex - b.position.zIndex
  )
  return sorted.map((el, index) => ({
    ...el,
    position: { ...el.position, zIndex: index + 1 }
  }))
}

export const useCanvasElements = () => useCanvasStore(state => state.elements)
export const useCanvasSelectedElementId = () =>
  useCanvasStore(state => state.selectedElementId)
export const useCanvasActions = () => {
  const actions = useCanvasStore(state => state.actions)
  return actions ?? useCanvasStore.getState().actions
}
export const useCanvasConfig = () => useCanvasStore(state => state.canvasConfig)
export const useCanvasIsDragging = () =>
  useCanvasStore(state => state.isDragging)
export const useCanvasDragElementType = () =>
  useCanvasStore(state => state.dragElementType)
