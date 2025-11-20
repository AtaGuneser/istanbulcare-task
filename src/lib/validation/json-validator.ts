import type { ProjectExport, CanvasElement } from '@/types/element.types'
import { isValidElementId } from '@/lib/utils/element-id'

type ValidationError = {
  readonly field: string
  readonly message: string
}

type ValidationResult = {
  readonly valid: boolean
  readonly errors: readonly ValidationError[]
}

/**
 * Validates JSON export structure
 */
export function validateProjectExport (data: unknown): ValidationResult {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Invalid JSON structure' }]
    }
  }

  const project = data as Partial<ProjectExport>

  if (!project.project) {
    errors.push({ field: 'project', message: 'Project metadata is required' })
  } else {
    if (!project.project.name || typeof project.project.name !== 'string') {
      errors.push({
        field: 'project.name',
        message: 'Project name is required'
      })
    }
    if (
      !project.project.version ||
      typeof project.project.version !== 'string'
    ) {
      errors.push({
        field: 'project.version',
        message: 'Project version is required'
      })
    }
  }

  if (!project.canvas) {
    errors.push({
      field: 'canvas',
      message: 'Canvas configuration is required'
    })
  } else {
    if (typeof project.canvas.width !== 'number' || project.canvas.width <= 0) {
      errors.push({
        field: 'canvas.width',
        message: 'Canvas width must be a positive number'
      })
    }
    if (
      typeof project.canvas.height !== 'number' ||
      project.canvas.height <= 0
    ) {
      errors.push({
        field: 'canvas.height',
        message: 'Canvas height must be a positive number'
      })
    }
  }

  if (!Array.isArray(project.elements)) {
    errors.push({ field: 'elements', message: 'Elements must be an array' })
  } else {
    const elementIds = new Set<string>()

    project.elements.forEach(
      (element: Partial<CanvasElement>, index: number) => {
        if (!element.id || typeof element.id !== 'string') {
          errors.push({
            field: `elements[${index}].id`,
            message: 'Element ID is required'
          })
        } else if (!isValidElementId(element.id)) {
          errors.push({
            field: `elements[${index}].id`,
            message: `Element ID must match format: elem_[type]_[3 digit number]`
          })
        } else if (elementIds.has(element.id)) {
          errors.push({
            field: `elements[${index}].id`,
            message: `Duplicate element ID: ${element.id}`
          })
        } else {
          elementIds.add(element.id)
        }

        if (!element.type) {
          errors.push({
            field: `elements[${index}].type`,
            message: 'Element type is required'
          })
        } else {
          const validTypes = [
            'header',
            'footer',
            'card',
            'text-content',
            'slider'
          ]
          if (!validTypes.includes(element.type)) {
            errors.push({
              field: `elements[${index}].type`,
              message: `Invalid element type: ${element.type}`
            })
          }
        }

        if (!element.position) {
          errors.push({
            field: `elements[${index}].position`,
            message: 'Element position is required'
          })
        } else {
          const pos = element.position
          const canvas = project.canvas

          if (canvas) {
            if (typeof pos.x === 'number') {
              if (pos.x < 0 || pos.x > canvas.width) {
                errors.push({
                  field: `elements[${index}].position.x`,
                  message: `X coordinate must be between 0 and ${canvas.width}`
                })
              }
            } else if (typeof pos.x !== 'string') {
              errors.push({
                field: `elements[${index}].position.x`,
                message: 'X coordinate must be a number or percentage string'
              })
            }

            if (typeof pos.y === 'number') {
              if (pos.y < 0 || pos.y > canvas.height) {
                errors.push({
                  field: `elements[${index}].position.y`,
                  message: `Y coordinate must be between 0 and ${canvas.height}`
                })
              }
            } else if (typeof pos.y !== 'string') {
              errors.push({
                field: `elements[${index}].position.y`,
                message: 'Y coordinate must be a number or percentage string'
              })
            }
          }

          if (typeof pos.width !== 'number' && typeof pos.width !== 'string') {
            errors.push({
              field: `elements[${index}].position.width`,
              message: 'Width must be a number or percentage string'
            })
          }

          if (
            typeof pos.height !== 'number' &&
            typeof pos.height !== 'string'
          ) {
            errors.push({
              field: `elements[${index}].position.height`,
              message: 'Height must be a number or percentage string'
            })
          }

          if (typeof pos.zIndex !== 'number' || pos.zIndex < 1) {
            errors.push({
              field: `elements[${index}].position.zIndex`,
              message: 'Z-index must be a positive number starting from 1'
            })
          }
        }
      }
    )

    const zIndexes = project.elements
      .map((el: Partial<CanvasElement>) => el.position?.zIndex)
      .filter((z): z is number => typeof z === 'number')
      .sort((a, b) => a - b)

    if (zIndexes.length > 0) {
      for (let i = 0; i < zIndexes.length; i++) {
        if (zIndexes[i] !== i + 1) {
          errors.push({
            field: 'elements',
            message: 'Z-index values must be sequential starting from 1'
          })
          break
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
