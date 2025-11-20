import type { ProjectExport } from '@/types/element.types'
import { useCanvasStore } from '@/stores/canvas.store'

/**
 * Exports current canvas state to JSON format
 */
export function exportToJSON (): ProjectExport {
  const state = useCanvasStore.getState()
  const now = new Date().toISOString()

  return {
    project: {
      name: 'Test Builder Layout',
      version: '1.0',
      created: now,
      lastModified: now
    },
    canvas: state.canvasConfig,
    elements: state.elements,
    metadata: {
      totalElements: state.elements.length,
      exportFormat: 'json',
      exportVersion: '2.0'
    }
  }
}

/**
 * Imports JSON data to canvas
 */
export function importFromJSON (data: ProjectExport): void {
  const { actions } = useCanvasStore.getState()
  actions.setElements(data.elements)
  actions.setCanvasConfig(data.canvas)
}

/**
 * Opens JSON in Notepad (Windows) - Downloads as .txt file
 */
export function openJSONInNotepad (data: ProjectExport): void {
  const jsonString = JSON.stringify(data, null, 2)

  // Download as .txt file - Windows will open it with Notepad by default
  const textFile = new Blob([jsonString], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(textFile)
  const link = document.createElement('a')
  link.href = url
  link.download = 'page-builder-export.txt'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Downloads JSON as file
 */
export function downloadJSON (
  data: ProjectExport,
  filename = 'page-builder-export.json'
): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Reads JSON from file
 */
export function readJSONFromFile (file: File): Promise<ProjectExport> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = event => {
      try {
        const json = JSON.parse(event.target?.result as string) as ProjectExport
        resolve(json)
      } catch (error) {
        reject(
          new Error(
            `Invalid JSON file: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          )
        )
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
