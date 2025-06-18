
import { useDragContext } from "@/provider/dragprovider";
import { Settings, X } from "lucide-react";
import NodeTemplateCard from "./nodeTemplateCard";

export default function NodePalettePanel({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { selectedCategory, setSelectedCategory, draggedItem, clickedItem, categories, filteredTemplates, handleDragStart, handleClick } = useDragContext();
  
  if (!isOpen) return null;
  
  return (
    <>
      <div 
        className=" inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className={`
        fixed left-6 top-24 bottom-6 w-96 bg-gray-900 rounded-2xl shadow-2xl z-50 
        border border-gray-700 
        transform transition-all duration-300 ease-out overflow-auto
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
      `}>
        <div className="p-6 border-b border-gray-700/50 bg-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="font-semibold text-xl text-white">Node Library</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400">Categories</label>
            <div className="flex flex-wrap gap-2">
              {(categories ?? []).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory?.(category)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${selectedCategory === category 
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
                      : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-950/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
              <span className="font-medium">
                {filteredTemplates?.length} available nodes
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </span>
              <div className="flex items-center space-x-2 text-xs bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                <span>Drag or Click</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {(filteredTemplates ?? []).map(template => (
                <NodeTemplateCard
                  key={template.type}
                  template={template}
                  onDragStart={handleDragStart ?? (() => {})}
                  onClick={handleClick ?? (() => {})}
                />
              ))}
            </div>
          </div>
        </div>

 
        <div className="p-6 border-t border-gray-700/50 bg-gray-800/50">
          <div className="space-y-3">
            <div className="font-medium text-white text-sm">Activity Status</div>
            {draggedItem && (
              <div className="text-cyan-400 flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span>Dragging: {draggedItem.label}</span>
              </div>
            )}
            {clickedItem && (
              <div className="text-emerald-400 flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span>Selected: {clickedItem.label}</span>
              </div>
            )}
            {!draggedItem && !clickedItem && (
              <div className="text-gray-500 flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                <span>Ready to add nodes to workflow</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}