import type { Position, CanvasConfig } from "@/types/element.types";

type MousePosition = {
  readonly x: number;
  readonly y: number;
};

type CanvasOffset = {
  readonly x: number;
  readonly y: number;
};

/**
 * Calculates absolute position from mouse coordinates
 */
export function calculateAbsolutePosition(
  mousePos: MousePosition,
  canvasOffset: CanvasOffset
): { x: number; y: number } {
  return {
    x: mousePos.x - canvasOffset.x,
    y: mousePos.y - canvasOffset.y,
  };
}

/**
 * Calculates relative position as percentage
 */
export function calculateRelativePosition(
  absolutePos: { x: number; y: number },
  canvasDimensions: { width: number; height: number }
): { x: string; y: string } {
  const xPercent = (absolutePos.x / canvasDimensions.width) * 100;
  const yPercent = (absolutePos.y / canvasDimensions.height) * 100;
  return {
    x: `${xPercent.toFixed(2)}%`,
    y: `${yPercent.toFixed(2)}%`,
  };
}

/**
 * Applies grid snapping if enabled
 */
export function applyGridSnap(
  position: { x: number; y: number },
  grid: CanvasConfig["grid"]
): { x: number; y: number } {
  if (!grid.enabled || !grid.snap) {
    return position;
  }

  return {
    x: Math.round(position.x / grid.size) * grid.size,
    y: Math.round(position.y / grid.size) * grid.size,
  };
}

/**
 * Validates position is within canvas bounds
 */
export function isPositionValid(
  position: { x: number; y: number },
  canvasDimensions: { width: number; height: number }
): boolean {
  return (
    position.x >= 0 &&
    position.x <= canvasDimensions.width &&
    position.y >= 0 &&
    position.y <= canvasDimensions.height
  );
}

/**
 * Checks if two elements collide
 */
export function checkCollision(
  element1: { position: Position },
  element2: { position: Position }
): boolean {
  const getNumericValue = (value: number | string, dimension: number): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.endsWith("%")) {
      return (parseFloat(value) / 100) * dimension;
    }
    return 0;
  };

  // Simplified collision detection - can be enhanced
  const x1 = getNumericValue(element1.position.x, 1200);
  const y1 = getNumericValue(element1.position.y, 800);
  const w1 = getNumericValue(element1.position.width, 1200);
  const h1 = getNumericValue(element1.position.height, 800);

  const x2 = getNumericValue(element2.position.x, 1200);
  const y2 = getNumericValue(element2.position.y, 800);
  const w2 = getNumericValue(element2.position.width, 1200);
  const h2 = getNumericValue(element2.position.height, 800);

  return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
}

