import type { CanvasElement } from "@/types/element.types";

type FooterElementProps = {
  readonly element: CanvasElement;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
};

export function FooterElement({ element, isSelected, onSelect }: FooterElementProps) {
  const { content, position } = element;
  const copyright = content.copyright || "© 2024 Test Builder";

  return (
    <div
      onClick={onSelect}
      className={`
        absolute bg-gray-800 text-white flex items-center justify-center
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
      `}
      style={{
        left: typeof position.x === "number" ? `${position.x}px` : position.x,
        top: typeof position.y === "number" ? `${position.y}px` : position.y,
        width: typeof position.width === "number" ? `${position.width}px` : position.width,
        height: `${position.height}px`,
        zIndex: position.zIndex,
        position: position.fixed ? "fixed" : "absolute",
        bottom: position.fixed ? 0 : undefined,
      }}
    >
      <span className="text-sm">{copyright}</span>
    </div>
  );
}

