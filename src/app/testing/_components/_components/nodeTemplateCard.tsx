
import { NodeTemplate } from "@/lib/mockdata";
import { useDragContext } from "@/provider/dragprovider";

export default function NodeTemplateCard({ template, onDragStart, onClick }: {
  template: NodeTemplate;
  onDragStart: (event: React.DragEvent, template: NodeTemplate) => void;
  onClick: (template: NodeTemplate) => void;
}) { 
  const { isDragging, setIsDragging } = useDragContext();

  const getNodeColors = () => {
    switch (template.type) {
      case 'trigger':
        return 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400';
      case 'condition':
        return 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400';
      case 'action':
        return 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400';
      default:
        return 'border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart(e, template);
      }}
      onDragEnd={() => setIsDragging(false)}
      onClick={() => onClick(template)}
      className={`
        p-4 bg-gray-900 border-2 rounded-xl cursor-pointer
        transition-all duration-200 select-none group
        hover:shadow-lg active:scale-95
        ${getNodeColors()}
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-800/50 rounded-lg border border-gray-700">
          <span className="text-lg">{template.icon}</span>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-white">{template.label}</div>
          <div className="text-xs font-medium uppercase tracking-wide opacity-75">
            {template.category}
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-300 leading-relaxed mb-2">
        {template.description}
      </p>

      <div className="flex items-center justify-between text-xs">
        <span className="opacity-60">Click to add or drag</span>
        <div className="w-2 h-2 rounded-full bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}