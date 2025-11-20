import type { ProjectExport } from '@/types/element.types'
import { useCanvasStore } from '@/stores/canvas.store'

/**
 * Converts local date to ISO string with timezone offset
 * Preserves local time instead of converting to UTC
 */
function getLocalISOString (): string {
  const now = new Date()
  const timezoneOffset = -now.getTimezoneOffset()
  const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60)
    .toString()
    .padStart(2, '0')
  const offsetMinutes = (Math.abs(timezoneOffset) % 60)
    .toString()
    .padStart(2, '0')
  const offsetSign = timezoneOffset >= 0 ? '+' : '-'
  const offset = `${offsetSign}${offsetHours}:${offsetMinutes}`

  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offset}`
}

/**
 * Exports current canvas state to JSON format
 * Sets created date on first export, updates lastModified on every export
 */
export function exportToJSON (): ProjectExport {
  const state = useCanvasStore.getState()
  const now = getLocalISOString()

  // If projectCreated is null, this is the first export - set created date
  // Otherwise, keep the original created date
  const created = state.projectCreated ?? now
  const lastModified = now

  // Update store with the current export timestamp
  if (state.actions) {
    state.actions.setProjectMetadata(created, lastModified)
  }

  return {
    project: {
      name: 'Test Builder Layout',
      version: '1.0',
      created,
      lastModified
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
 * Preserves created and lastModified dates from imported data
 */
export function importFromJSON (data: ProjectExport): void {
  const { actions } = useCanvasStore.getState()
  actions.setElements(data.elements)
  actions.setCanvasConfig(data.canvas)

  // Preserve project metadata from imported data
  if (actions.setProjectMetadata) {
    actions.setProjectMetadata(data.project.created, data.project.lastModified)
  }
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
