// Fixed version of the drag provider with proper node selection tracking
// src/provider/dragprovider.tsx

import { NodeTemplate, nodeTemplates, WorkflowNodeData } from "@/lib/mockdata";
import { Edge, useNodesState, useStore, Node, useEdgesState, OnConnect, Connection, addEdge, OnSelectionChangeParams } from "@xyflow/react";
import { useContext, createContext, useState, useMemo, useCallback } from "react";

const DragContext = createContext<{
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void; 
  draggedItem?: NodeTemplate | null;
  setDraggedItem?: (item: NodeTemplate | null) => void;
  clickedItem?: NodeTemplate | null;
  setClickedItem?: (item: NodeTemplate | null) => void;
  isPaletteOpen?: boolean;
  setIsPaletteOpen?: (isOpen: boolean) => void;
  selectedNodes?: Node<WorkflowNodeData>[];  // Changed to actual flow nodes
  setSelectedNodes?: (nodes: Node<WorkflowNodeData>[]) => void;
  selectedTemplateNodes?: NodeTemplate[];  // Separate for template selection
  setSelectedTemplateNodes?: (nodes: NodeTemplate[]) => void;
  handleDragStart?: (event: React.DragEvent, template: NodeTemplate) => void;
  handleClick?: (template: NodeTemplate) => void;
  handleNodeSelect?: (template: NodeTemplate) => void;
  togglePalette?: () => void;
  categories?: string[];
  filteredTemplates?: NodeTemplate[];
  nodes?: Node<WorkflowNodeData>[];
  setNodes?: (nodes: Node<WorkflowNodeData>[]) => void;
  edges?: Edge[];
  setEdges?: (edges: Edge[]) => void;
  onNodesChange?: (changes: any) => void;
  onEdgesChange?: (changes: any) => void;
  onSelectionChange?: (params: OnSelectionChangeParams) => void;  // Added
  nodeIdCounter?: number;
  setNodeIdCounter?: (count: number) => void; 
  isDragOver?: boolean;
  setIsDragOver?: (isOver: boolean) => void;
  dropPosition?: { x: number; y: number } | null;
  setDropPosition?: (position: { x: number; y: number } | null) => void;
  onConnect?: OnConnect;
  onNodesDelete?: (nodes: Node[]) => void;
  useProject: () => (pos: { x: number; y: number }) => { x: number; y: number };
}>({
  isDragging: false,
  setIsDragging: () => {},
  selectedCategory: "All",
  setSelectedCategory: () => {},
  draggedItem: null,
  setDraggedItem: () => {},
  clickedItem: null,
  setClickedItem: () => {},
  isPaletteOpen: false,
  setIsPaletteOpen: () => {},
  selectedNodes: [],
  setSelectedNodes: () => {},
  selectedTemplateNodes: [],
  setSelectedTemplateNodes: () => {},
  handleDragStart: () => {},
  handleClick: () => {},
  handleNodeSelect: () => {},
  togglePalette: () => {},
  categories: [],
  filteredTemplates: [],
  nodes: [],
  setNodes: () => {},
  edges: [],
  setEdges: () => {},
  onNodesChange: () => {},
  onEdgesChange: () => {},
  onSelectionChange: () => {},
  nodeIdCounter: 1,
  setNodeIdCounter: () => {},
  isDragOver: false, 
  setIsDragOver: () => {},
  dropPosition: null,
  setDropPosition: () => {},
  onConnect: () => {},
  onNodesDelete: () => {},
  useProject: () => (pos) => ({ x: pos.x, y: pos.y }),
});

export const FixedDragProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [draggedItem, setDraggedItem] = useState<NodeTemplate | null>(null);
  const [clickedItem, setClickedItem] = useState<NodeTemplate | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  
  // Separate state for flow nodes vs template nodes
  const [selectedNodes, setSelectedNodes] = useState<Node<WorkflowNodeData>[]>([]);
  const [selectedTemplateNodes, setSelectedTemplateNodes] = useState<NodeTemplate[]>([]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropPosition, setDropPosition] = useState<{ x: number; y: number } | null>(null);
  
  console.log('DragProvider state:', {
    selectedNodesCount: selectedNodes.length,
    selectedNodeIds: selectedNodes.map(n => n.id),
    nodesCount: nodes.length,
    isPaletteOpen
  });

  function useProject() {
    const [x, y, zoom] = useStore(state => state.transform);
    return (pos: { x: number; y: number }) => ({
      x: (pos.x - x) / zoom,
      y: (pos.y - y) / zoom,
    });
  }

  const categories: string[] = useMemo(() => {
    if (!nodeTemplates || nodeTemplates.length === 0) {
      return ["All"];
    }
    const cats = Array.from(new Set(nodeTemplates.map((t: NodeTemplate) => t.category))) as string[];
    return ["All", ...cats];
  }, []);

  const filteredTemplates = useMemo(() => {
    if (!nodeTemplates) {
      return [];
    }
    return selectedCategory === "All"
      ? nodeTemplates
      : nodeTemplates.filter((t: NodeTemplate) => t.category === selectedCategory);
  }, [selectedCategory]);

  // Handle React Flow selection changes
  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    console.log('Selection changed:', params);
    setSelectedNodes(params.nodes as Node<WorkflowNodeData>[]);
  }, []);

  const handleDragStart = (event: React.DragEvent, template: NodeTemplate) => {
    setDraggedItem(template);
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: template.type })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const handleClick = (template: NodeTemplate) => {
    setClickedItem(template);
    handleNodeSelect(template);
    setTimeout(() => setClickedItem(null), 1000);
  };

  const handleNodeSelect = (template: NodeTemplate) => {
    setSelectedTemplateNodes(prev => [...prev, template]);
  };

  const togglePalette = () => {
    setIsPaletteOpen(!isPaletteOpen);
  };

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        source: params.source ?? '',
        target: params.target ?? '',
        sourceHandle: params.sourceHandle ?? undefined,
        targetHandle: params.targetHandle ?? undefined,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onNodesDelete = useCallback((nodesToDelete: Node[]) => {
    const nodeIds = nodesToDelete.map(node => node.id);
    const filteredNodes = nodes.filter((node: Node<WorkflowNodeData>) => !nodeIds.includes(node.id));
    setNodes(filteredNodes);
    const filteredEdges = edges.filter((edge: Edge) =>
      !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
    );
    setEdges(filteredEdges);
    // Clear selection if deleted nodes were selected
    setSelectedNodes(prev => prev.filter(node => !nodeIds.includes(node.id)));
  }, [nodes, edges, setNodes, setEdges]);

  const contextValue = {
    isDragging,
    setIsDragging,
    selectedCategory,
    setSelectedCategory,
    draggedItem,
    setDraggedItem,
    clickedItem,
    setClickedItem,
    isPaletteOpen,
    setIsPaletteOpen,
    selectedNodes,
    setSelectedNodes,
    selectedTemplateNodes,
    setSelectedTemplateNodes,
    handleDragStart,
    handleClick,
    handleNodeSelect,
    togglePalette,
    categories,
    filteredTemplates,
    useProject,
    nodes,
    setNodes,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onSelectionChange,
    nodeIdCounter,
    setNodeIdCounter,
    isDragOver,
    setIsDragOver,
    dropPosition,
    setDropPosition,
    onConnect,
    onNodesDelete,
  };

  return (
    <DragContext.Provider value={contextValue}>
      {children}
    </DragContext.Provider>
  );
};

export const useDragContext = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error("useDragContext must be used within a DragProvider");
  }
  return context;
};