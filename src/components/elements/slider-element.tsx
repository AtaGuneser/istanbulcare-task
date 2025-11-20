import type { CanvasElement } from "@/types/element.types";

type SliderElementProps = {
  readonly element: CanvasElement;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
};

export function SliderElement({ element, isSelected, onSelect }: SliderElementProps) {
  const { position } = element;

  return (
    <div
      onClick={onSelect}
      className={`
        absolute bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg border-2
        ${isSelected ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2" : "border-gray-200"}
        cursor-pointer flex items-center justify-center
      `}
      style={{
        left: typeof position.x === "number" ? `${position.x}px` : position.x,
        top: typeof position.y === "number" ? `${position.y}px` : position.y,
        width: typeof position.width === "number" ? `${position.width}px` : position.width,
        height: `${position.height}px`,
        zIndex: position.zIndex,
      }}
    >
      <div className="text-center text-gray-500">
        <span className="text-4xl mb-2 block">🖼️</span>
        <span className="text-sm">Image Slider</span>
      </div>
    </div>
  );
}

