import type { CanvasElement } from "@/types/element.types";

type TextContentElementProps = {
  readonly element: CanvasElement;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
};

export function TextContentElement({ element, isSelected, onSelect }: TextContentElementProps) {
  const { content, position } = element;
  const text = content.plainText || content.html || "Metin içeriği buraya gelecek";

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
        width: typeof position.width === "number" ? `${position.width}px` : position.width === "auto" ? "400px" : position.width,
        minHeight: typeof position.height === "number" ? `${position.height}px` : "100px",
        zIndex: position.zIndex,
      }}
    >
      <p className="text-gray-700">{text}</p>
    </div>
  );
}

