import type { CanvasElement } from "@/types/element.types";

type CardElementProps = {
  readonly element: CanvasElement;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
};

export function CardElement({ element, isSelected, onSelect }: CardElementProps) {
  const { content, position } = element;
  const title = content.title || "Card Title";
  const description = content.description || "Card description";

  return (
    <div
      onClick={onSelect}
      className={`
        absolute bg-white rounded-lg shadow-md p-4 border-2
        ${isSelected ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2" : "border-gray-200"}
        cursor-pointer
      `}
      style={{
        left: typeof position.x === "number" ? `${position.x}px` : position.x,
        top: typeof position.y === "number" ? `${position.y}px` : position.y,
        width: typeof position.width === "number" ? `${position.width}px` : position.width,
        height: `${position.height}px`,
        zIndex: position.zIndex,
      }}
    >
      <div className="flex justify-center mb-2">
        <span className="text-2xl">📌</span>
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

