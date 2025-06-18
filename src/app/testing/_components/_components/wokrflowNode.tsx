
import { useState } from "react";
import { CustomNode } from "../drop-zone";
import { Handle, Position } from "@xyflow/react";
import {  EyeOff, Settings } from "lucide-react";

export default function WorkflowNode({ 
  data,
  selected,
  dragging 
}: {
  data: CustomNode['data'],
  selected?: boolean;
  dragging?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const getNodeColors = () => {
    switch (data.nodeType) {
      case 'trigger':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          icon: 'text-emerald-400',
          iconBg: 'bg-emerald-500/20'
        };
      case 'condition':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          icon: 'text-amber-400',
          iconBg: 'bg-amber-500/20'
        };
      case 'action':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: 'text-blue-400',
          iconBg: 'bg-blue-500/20'
        };
      default:
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          icon: 'text-cyan-400',
          iconBg: 'bg-cyan-500/20'
        };
    }
  };

  const colors = getNodeColors();

  if (!isExpanded) {
    return (
      <div
        className={`
          w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border-2
          flex items-center justify-center cursor-pointer
          transition-all duration-200 hover:scale-110
          ${selected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900' : ''}
          ${dragging ? 'rotate-6 scale-110' : ''}
          relative group
        `}
        onClick={() => setIsExpanded(true)}
      >
        <div className={`text-xl ${colors.icon}`}>
          {data.icon}
        </div>
        
        {data.inputs?.map((input, index) => (
          <Handle
            key={`input-${index}`}
            type="target"
            position={Position.Left}
            id={input.id}
            className={`
              w-2 h-2 border border-gray-800 rounded-full opacity-0 group-hover:opacity-100
              ${input.required ? 'bg-red-400' : 'bg-cyan-400'}
              transition-opacity duration-200
            `}
            style={{ top: `${20 + index * 16}px`, left: '-4px' }}
          />
        ))}

        {data.outputs?.map((output, index) => (
          <Handle
            key={`output-${index}`}
            type="source"
            position={Position.Right}
            id={output.id}
            className="w-2 h-2 bg-emerald-400 border border-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ top: `${20 + index * 16}px`, right: '-4px' }}
          />
        ))}

        {selected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
        )}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
          {data.label}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-gray-900 border-2 ${colors.border} rounded-xl shadow-lg min-w-[280px] max-w-[320px]
        transition-all duration-300 relative text-white
        ${selected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900' : ''}
        ${dragging ? 'rotate-1 scale-105' : ''}
      `}
    >
      {data.inputs?.map((input, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={input.id}
          className={`
            w-3 h-3 border-2 border-gray-900 rounded-full transition-all duration-200
            ${input.required ? 'bg-red-400' : 'bg-cyan-400'}
            hover:scale-125
          `}
          style={{ top: `${40 + index * 32}px` }}
        />
      ))}

      <div className={`p-4 ${colors.bg} rounded-t-xl border-b border-gray-700/50`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-lg ${colors.iconBg}
            `}>
              <span className={`text-lg ${colors.icon}`}>{data.icon}</span>
            </div>
            <div>
              <div className="font-semibold text-sm text-white">{data.label}</div>
              <div className="text-xs text-gray-400 capitalize">{data.nodeType}</div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`
                p-2 rounded-lg transition-colors
                ${showConfig ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700/50 text-gray-400'}
              `}
              title="Toggle Configuration"
            >
              {showConfig ? <EyeOff className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 transition-colors"
              title="Minimize"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-sm text-gray-300 mb-3 leading-relaxed">
          {data.description}
        </div>

        <div className="space-y-2 text-xs">
          {data.inputs && data.inputs.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Inputs:</span>
              <div className="flex space-x-1">
                {data.inputs.map((input, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded text-xs ${
                      input.required ? 'bg-red-500/20 text-red-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {input.label}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {data.outputs && data.outputs.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Outputs:</span>
              <div className="flex space-x-1">
                {data.outputs.map((output, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-300"
                  >
                    {output.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {showConfig && data.config && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="font-medium text-gray-200 mb-2 text-sm">Configuration</div>
            <pre className="text-xs text-gray-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
              {JSON.stringify(data.config, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {data.outputs?.map((output, index) => (
        <Handle
          key={`output-${index}`}
          type="source"
          position={Position.Right}
          id={output.id}
          className="w-3 h-3 bg-emerald-400 border-2 border-gray-900 rounded-full hover:scale-125 transition-all duration-200"
          style={{ top: `${40 + index * 32}px` }}
        />
      ))}

      {selected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
      )}
    </div>
  );
}