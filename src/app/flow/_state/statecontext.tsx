
import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { Node, Edge, useNodesState, useEdgesState, OnConnect, Connection, addEdge  } from '@xyflow/react';
import { WorkflowNodeData, NodeTemplate } from '@/lib/mockdata';
import { useDragContext } from '@/provider/dragprovider';

// Enhanced node data structure that extends your existing one
export interface EnhancedWorkflowNodeData extends WorkflowNodeData {
  configuration: Record<string, any>;
  executionState?: 'idle' | 'running' | 'success' | 'error';
  lastExecuted?: Date;
  errors?: string[];
}

export interface EnhancedNode extends Node<EnhancedWorkflowNodeData> {
  data: EnhancedWorkflowNodeData;
}

// Workflow execution data structure for backend
export interface WorkflowExecutionData {
  nodes: Array<{
    id: string;
    type: string;
    configuration: Record<string, any>;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }>;
  metadata: {
    name: string;
    description: string;
    version: string;
    created: Date;
    lastModified: Date;
  };
}

interface CompatibleWorkflowContextType {
  // Enhanced state management that works with your existing system
  enhancedNodes: EnhancedNode[];
  setEnhancedNodes: (nodes: EnhancedNode[]) => void;
  selectedNodeId: string | null;
  
  // Configuration management
  updateNodeConfiguration: (nodeId: string, configuration: Record<string, any>) => void;
  updateNodeData: (nodeId: string, updates: Partial<EnhancedWorkflowNodeData>) => void;
  
  // Workflow operations
  getWorkflowExecutionData: () => WorkflowExecutionData;
  loadWorkflow: (data: WorkflowExecutionData) => void;
  
  // Validation
  validateWorkflow: () => { isValid: boolean; errors: string[] };
  
  // Metadata
  workflowMetadata: WorkflowExecutionData['metadata'];
  updateWorkflowMetadata: (metadata: Partial<WorkflowExecutionData['metadata']>) => void;
}

const CompatibleWorkflowContext = createContext<CompatibleWorkflowContextType | null>(null);

// Enhanced Provider that works with your existing DragProvider
export const CompatibleWorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { nodes, setNodes, edges, selectedNodes } = useDragContext();
  const [enhancedNodes, setEnhancedNodes] = useState<EnhancedNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [workflowMetadata, setWorkflowMetadata] = useState<WorkflowExecutionData['metadata']>({
    name: 'Untitled Workflow',
    description: '',
    version: '1.0.0',
    created: new Date(),
    lastModified: new Date(),
  });

  // Sync with existing drag provider nodes
  useEffect(() => {
    if (nodes) {
      const enhanced = nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          configuration: node.data.config || {},
          executionState: 'idle' as const,
        }
      })) as EnhancedNode[];
      setEnhancedNodes(enhanced);
    }
  }, [nodes]);

  // Track selected node
  useEffect(() => {
    if (selectedNodes && selectedNodes.length === 1) {
      setSelectedNodeId(selectedNodes[0].id);
    } else {
      setSelectedNodeId(null);
    }
  }, [selectedNodes]);

  // Update node configuration
  const updateNodeConfiguration = useCallback((nodeId: string, configuration: Record<string, any>) => {
    // Update enhanced nodes
    setEnhancedNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                configuration,
              },
            }
          : node
      )
    );

    // Also update original nodes if setNodes is available
    if (setNodes && nodes) {
      setNodes(
        nodes.map((node: any) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  config: configuration,
                },
              }
            : node
        )
      );
    }

    setWorkflowMetadata(prev => ({ ...prev, lastModified: new Date() }));
  }, [setNodes]);

  // Update any node data
  const updateNodeData = useCallback((nodeId: string, updates: Partial<EnhancedWorkflowNodeData>) => {
    setEnhancedNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...updates,
              },
            }
          : node
      )
    );
    setWorkflowMetadata(prev => ({ ...prev, lastModified: new Date() }));
  }, []);

  // Get workflow data for backend
  const getWorkflowExecutionData = useCallback((): WorkflowExecutionData => {
    return {
      nodes: enhancedNodes.map(node => ({
        id: node.id,
        type: node.data.nodeType,
        configuration: node.data.configuration,
        position: node.position,
      })),
      edges: (edges || []).map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle ?? undefined,
        targetHandle: edge.targetHandle ?? undefined,
      })),
      metadata: workflowMetadata,
    };
  }, [enhancedNodes, edges, workflowMetadata]);

  // Load workflow from backend data
  const loadWorkflow = useCallback((data: WorkflowExecutionData) => {
    // This would need to integrate with your existing drag provider
    // For now, just update the enhanced state
    const loadedNodes: EnhancedNode[] = data.nodes.map(nodeData => ({
      id: nodeData.id,
      type: 'workflowNode',
      position: nodeData.position,
      data: {
        id: nodeData.id,
        label: nodeData.type,
        nodeType: nodeData.type,
        icon: '🔧', // Default icon
        description: '',
        configuration: nodeData.configuration,
        executionState: 'idle',
      },
    }));

    setEnhancedNodes(loadedNodes);
    setWorkflowMetadata(data.metadata);
  }, []);

  // Validate workflow
  const validateWorkflow = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check for trigger nodes
    const triggerNodes = enhancedNodes.filter(node => node.data.nodeType === 'trigger');
    if (triggerNodes.length === 0) {
      errors.push('Workflow must have at least one trigger node');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [enhancedNodes]);

  // Update workflow metadata
  const updateWorkflowMetadata = useCallback((updates: Partial<WorkflowExecutionData['metadata']>) => {
    setWorkflowMetadata(prev => ({
      ...prev,
      ...updates,
      lastModified: new Date(),
    }));
  }, []);

  const contextValue: CompatibleWorkflowContextType = {
    enhancedNodes,
    setEnhancedNodes,
    selectedNodeId,
    updateNodeConfiguration,
    updateNodeData,
    getWorkflowExecutionData,
    loadWorkflow,
    validateWorkflow,
    workflowMetadata,
    updateWorkflowMetadata,
  };

  return (
    <CompatibleWorkflowContext.Provider value={contextValue}>
      {children}
    </CompatibleWorkflowContext.Provider>
  );
};

export const useCompatibleWorkflow = (): CompatibleWorkflowContextType => {
  const context = useContext(CompatibleWorkflowContext);
  if (!context) {
    throw new Error('useCompatibleWorkflow must be used within a CompatibleWorkflowProvider');
  }
  return context;
};