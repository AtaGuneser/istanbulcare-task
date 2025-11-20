/**
 * Generates a unique element ID based on element type
 * Format: elem_[type]_[3 digit number]
 */
export function generateElementId (type: string): string {
  const random = Math.floor(Math.random() * 1000)
  const typePrefix = type.replace('-', '_')
  const number = String(random).padStart(3, '0')
  return `elem_${typePrefix}_${number}`
}

/**
 * Validates element ID format
 * Must match: elem_[type]_[3 digit number]
 */
export function isValidElementId (id: string): boolean {
  const pattern = /^elem_[a-z-]+_\d{3}$/
  return pattern.test(id)
}
