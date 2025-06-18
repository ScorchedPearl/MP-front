
import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  SelectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeTemplate, nodeTemplates, WorkflowNodeData } from '@/lib/mockdata';
import WorkflowNode from './_components/wokrflowNode';
import { useDragContext } from '@/provider/dragprovider';

export type CustomNode = Node<WorkflowNodeData> 

const nodeTypes = {
  workflowNode: WorkflowNode,
};

const WorkflowCanvas = () => {
  const { useProject, nodes, setNodes, onEdgesChange, onNodesChange, edges, nodeIdCounter, setNodeIdCounter, isDragOver, setIsDragOver, dropPosition, setDropPosition, onConnect, onNodesDelete } = useDragContext();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const project: (pos: { x: number; y: number }) => { x: number; y: number } = (typeof useProject === 'function' ? useProject() : undefined) || ((pos) => pos);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const screenToFlowPosition = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (!reactFlowWrapper.current) return { x, y };
      const rect = reactFlowWrapper.current.getBoundingClientRect();
      return project({
        x: x - rect.left,
        y: y - rect.top,
      });
    },
    [project]
  );
  
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (setIsDragOver) {
      setIsDragOver(true);
    }
    if (reactFlowWrapper.current) {
      const rect = reactFlowWrapper.current.getBoundingClientRect();
      if (setDropPosition) {
        setDropPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        });
      }
    }
  }, [setIsDragOver, setDropPosition]);

  const onDragLeave = useCallback((event: React.DragEvent) => {
    if (!reactFlowWrapper.current?.contains(event.relatedTarget as Element | null)) {
      if (setIsDragOver) {
        setIsDragOver(false);
      }
      if (setDropPosition) {
        setDropPosition(null);
      }
    }
  }, [setIsDragOver, setDropPosition]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (setIsDragOver) {
        setIsDragOver(false);
      }
      if (setDropPosition) {
        setDropPosition(null);
      }

      if (!reactFlowWrapper.current) return;

      const templateData = event.dataTransfer.getData('application/reactflow');
      if (!templateData) return;

      try {
        const template: NodeTemplate = JSON.parse(templateData);
        const foundTemplate = nodeTemplates.find(t => t.type === template.type);
        if (!foundTemplate) {
          console.error('Template not found for type:', template.type);
          return;
        }
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: Node<WorkflowNodeData> = {
          id: `node-${nodeIdCounter}`,
          type: 'workflowNode',
          position,
          data: {
            label: foundTemplate.label,
            nodeType: foundTemplate.type,
            icon: foundTemplate.icon,
            config: foundTemplate.defaultConfig,
            inputs: foundTemplate.inputs,
            outputs: foundTemplate.outputs,
            description: foundTemplate.description,
          },
        };

        if (setNodes) {
          setNodes([...(nodes ?? []), newNode]);
        }
        if (setNodeIdCounter) {
          setNodeIdCounter((nodeIdCounter ?? 0) + 1);
        }
      } catch (error) {
        console.error('Error parsing dropped data:', error);
      }
    },
    [screenToFlowPosition, nodeIdCounter, setNodes, nodes, setNodeIdCounter, setIsDragOver, setDropPosition]
  );

  return (
    <div className="h-screen w-full relative bg-gray-950">
      <div 
        className="w-full h-full" 
        ref={reactFlowWrapper}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          minZoom={0.2}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#06b6d4', strokeWidth: 2 },
          }}
          deleteKeyCode={['Backspace', 'Delete']}
          multiSelectionKeyCode={['Meta', 'Ctrl']}
          panOnScroll
          selectionOnDrag
          selectionMode={SelectionMode.Partial}
        >
          <Background 
            color="#374151" 
            gap={20} 
            size={1}
            variant={BackgroundVariant.Dots}
          />
          <Controls 
            showInteractive={false}
            className="bg-gray-900/95 backdrop-blur border border-gray-700 rounded-xl shadow-xl [&>button]:bg-gray-800 [&>button]:border-gray-600 [&>button]:text-gray-300 [&>button:hover]:bg-gray-700 [&>button:hover]:text-white [&>button:hover]:border-gray-500"
          />
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="bg-gray-900/95 backdrop-blur border border-gray-700 rounded-xl shadow-xl"
            style={{
              backgroundColor: '#111827',
            }}
          />
        </ReactFlow>
        
 
        {isDragOver && (
          <div className="absolute inset-0 bg-cyan-500/10 border-4 border-dashed border-cyan-400 rounded-2xl pointer-events-none z-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-900/95 backdrop-blur border border-cyan-400 px-8 py-4 rounded-2xl shadow-2xl">
                <div className="text-cyan-400 font-semibold text-lg">Drop node here to add to workflow</div>
              </div>
            </div>
            {dropPosition && (
              <div 
                className="absolute w-6 h-6 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"
                style={{
                  left: dropPosition.x - 12,
                  top: dropPosition.y - 12,
                }}
              />
            )}
          </div>
        )}

        {(nodes?.length === 0) && !isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-6">
              <div className="text-8xl opacity-20">🎯</div>
              <div className="space-y-2">
                <div className="text-2xl font-semibold text-gray-300">
                  Start Building Your Workflow
                </div>
                <div className="text-gray-500 max-w-md mx-auto leading-relaxed">
                  Add nodes from the palette to create powerful automated workflows. 
                  Connect them together to build complex logic flows.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-6 bg-gray-900/95 backdrop-blur border border-gray-700 px-6 py-4 rounded-xl shadow-xl">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            <span className="text-gray-300">
              <span className="font-semibold text-white">{nodes?.length || 0}</span> nodes
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <span className="text-gray-300">
              <span className="font-semibold text-white">{edges?.length || 0}</span> connections
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 bg-gray-900/95 backdrop-blur border border-gray-700 p-4 rounded-xl shadow-xl max-w-sm">
        <div className="space-y-3">
          <div className="font-semibold text-white flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            <span>Workflow Controls</span>
          </div>
          <div className="text-gray-300 space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">•</span>
              <span>Click nodes to expand/minimize</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">•</span>
              <span>Drag from handles to connect</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">•</span>
              <span>Delete key to remove selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">•</span>
              <span>Cmd/Ctrl + click for multi-select</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CanvasDropZone: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  );
};

export default CanvasDropZone;