import type { CanvasElement } from "@/types/element.types";

type HeaderElementProps = {
  readonly element: CanvasElement;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
};

export function HeaderElement({ element, isSelected, onSelect }: HeaderElementProps) {
  const { content, position } = element;
  const text = content.text || "Site Başlığı";

  return (
    <div
      onClick={onSelect}
      className={`
        absolute bg-black text-white flex items-center justify-between px-6
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
      `}
      style={{
        left: typeof position.x === "number" ? `${position.x}px` : position.x,
        top: typeof position.y === "number" ? `${position.y}px` : position.y,
        width: typeof position.width === "number" ? `${position.width}px` : position.width,
        height: `${position.height}px`,
        zIndex: position.zIndex,
        position: position.fixed ? "fixed" : "absolute",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">🚀</span>
        <span className="font-bold">{text}</span>
      </div>
      <nav className="flex gap-4">
        <a href="#" className="hover:text-gray-300">
          Home
        </a>
        <a href="#" className="hover:text-gray-300">
          About Us
        </a>
        <a href="#" className="hover:text-gray-300">
          Contact
        </a>
      </nav>
    </div>
  );
}

