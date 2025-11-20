import type { ElementType } from "@/types/element.types";
import { useCanvasActions, useCanvasIsDragging, useCanvasDragElementType } from "@/stores/canvas.store";

type ElementDefinition = {
  readonly type: ElementType;
  readonly label: string;
  readonly icon: string;
  readonly description: string;
};

const ELEMENT_DEFINITIONS: readonly ElementDefinition[] = [
  {
    type: "header",
    label: "Header",
    icon: "≡",
    description: "Page header with navigation",
  },
  {
    type: "footer",
    label: "Footer",
    icon: "▔",
    description: "Footer information area",
  },
  {
    type: "card",
    label: "Card",
    icon: "▢",
    description: "Content card",
  },
  {
    type: "text-content",
    label: "Text Content",
    icon: "📄",
    description: "Text content area",
  },
  {
    type: "slider",
    label: "Slider",
    icon: "🖼️",
    description: "Image slider carousel",
  },
] as const;

export function ElementList() {
  const actions = useCanvasActions();
  const isDragging = useCanvasIsDragging();
  const dragElementType = useCanvasDragElementType();

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, elementType: ElementType) => {
    if (!actions) return;
    actions.setDragging(true, elementType);
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("application/element-type", elementType);
  };

  const handleDragEnd = () => {
    if (!actions) return;
    actions.setDragging(false, null);
  };

  const handleNewPage = () => {
    if (!actions) return;
    if (confirm("Tüm elementleri temizlemek istediğinize emin misiniz?")) {
      actions.setElements([]);
      actions.selectElement(null);
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-4 h-screen overflow-y-auto">
      <div className="mb-6">
        <a href="/" className="text-sm text-indigo-200 hover:text-white mb-4 inline-block">
          ← back to home
        </a>
        <h1 className="text-2xl font-bold mb-4">Page Builder</h1>
        <button
          onClick={handleNewPage}
          className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          New Page
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-indigo-200 uppercase tracking-wide mb-3">
          COMPONENTS
        </h2>
        {ELEMENT_DEFINITIONS.map((element) => {
          const isActive = isDragging && dragElementType === element.type;
          return (
            <div
              key={element.type}
              draggable
              onDragStart={(e) => handleDragStart(e, element.type)}
              onDragEnd={handleDragEnd}
              className={`
                flex items-center gap-3 p-3 rounded-lg cursor-grab active:cursor-grabbing
                transition-all duration-200
                ${isActive ? "opacity-50 bg-purple-700" : "bg-indigo-800/50 hover:bg-indigo-700/70"}
              `}
            >
              <span className="text-2xl">{element.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{element.label}</div>
                <div className="text-xs text-indigo-300">{element.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

