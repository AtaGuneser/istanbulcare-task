import { ElementList } from "@/components/sidebar/element-list";
import { CanvasPreview } from "@/components/canvas/canvas-preview";
import { useCanvasStore } from "@/stores/canvas.store";
import { exportToJSON, openJSONInNotepad } from "@/lib/utils/json-export";

export function PageBuilder() {
  const elements = useCanvasStore((state) => state.elements);
  const selectedElementId = useCanvasStore((state) => state.selectedElementId);

  const handleExport = () => {
    const json = exportToJSON();
    openJSONInNotepad(json);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ElementList />
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Page Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export JSON
            </button>
            <div className="text-sm text-gray-600">
              Elements: {elements.length} | Selected: {selectedElementId ? "Yes" : "No"}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8 flex items-start justify-center bg-gray-100">
          <CanvasPreview />
        </div>
      </div>
    </div>
  );
}

