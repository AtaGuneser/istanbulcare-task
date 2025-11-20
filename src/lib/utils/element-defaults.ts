import type { ElementType } from "@/types/element.types";

/**
 * Returns default size for element types
 */
export function getDefaultElementSize(type: ElementType): { width: number | string; height: number } {
  switch (type) {
    case "header":
      return { width: "100%", height: 80 };
    case "footer":
      return { width: "100%", height: 60 };
    case "card":
      return { width: 300, height: 200 };
    case "text-content":
      return { width: 400, height: 100 };
    case "slider":
      return { width: "100%", height: 400 };
    default:
      return { width: 300, height: 200 };
  }
}

