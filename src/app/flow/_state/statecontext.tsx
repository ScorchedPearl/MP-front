// Fixed version of the state context
// src/app/flow/_state/statecontext.tsx

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { WorkflowNodeData, NodeTemplate } from '@/lib/mockdata';
import { useDragContext } from '@/provider/dragprovider';

// Enhanced node data structure
export interface EnhancedWorkflowNodeData extends WorkflowNodeData {
  configuration: Record<string, any>;
  executionState?: 'idle' | 'running' | 'success' | 'error';
  lastExecuted?: Date;
  errors?: string[];
}

export interface EnhancedNode extends Node<EnhancedWorkflowNodeData> {
  data: EnhancedWorkflowNodeData;
}

// Workflow execution data structure
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
  enhancedNodes: EnhancedNode[];
  setEnhancedNodes: (nodes: EnhancedNode[]) => void;
  selectedNodeId: string | null;
  selectedNode: EnhancedNode | null;
  
  updateNodeConfiguration: (nodeId: string, configuration: Record<string, any>) => void;
  updateNodeData: (nodeId: string, updates: Partial<EnhancedWorkflowNodeData>) => void;
  
  getWorkflowExecutionData: () => WorkflowExecutionData;
  loadWorkflow: (data: WorkflowExecutionData) => void;
  
  validateWorkflow: () => { isValid: boolean; errors: string[] };
  
  workflowMetadata: WorkflowExecutionData['metadata'];
  updateWorkflowMetadata: (metadata: Partial<WorkflowExecutionData['metadata']>) => void;
}

const CompatibleWorkflowContext = createContext<CompatibleWorkflowContextType | null>(null);

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

  // Debug logging
  console.log('CompatibleWorkflowProvider state:', {
    nodesCount: nodes?.length || 0,
    enhancedNodesCount: enhancedNodes.length,
    selectedNodesCount: selectedNodes?.length || 0,
    selectedNodeId,
    selectedNodeIds: selectedNodes?.map(n => n.id) || []
  });

  // Sync with existing drag provider nodes
  useEffect(() => {
    if (nodes && nodes.length > 0) {
      const enhanced = nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          configuration: node.data.config || {},
          executionState: 'idle' as const,
        }
      })) as EnhancedNode[];
      
      console.log('Syncing enhanced nodes:', enhanced.map(n => ({ id: n.id, label: n.data.label })));
      setEnhancedNodes(enhanced);
    } else {
      setEnhancedNodes([]);
    }
  }, [nodes]);

  // Track selected node from React Flow
  useEffect(() => {
    console.log('Selected nodes changed:', selectedNodes?.map(n => n.id) || []);
    
    if (selectedNodes && selectedNodes.length === 1) {
      const selectedId = selectedNodes[0].id;
      console.log('Setting selected node ID to:', selectedId);
      setSelectedNodeId(selectedId);
    } else {
      console.log('Clearing selected node ID');
      setSelectedNodeId(null);
    }
  }, [selectedNodes]);

  // Get the selected enhanced node
  const selectedNode = selectedNodeId 
    ? enhancedNodes.find(n => n.id === selectedNodeId) || null 
    : null;

  console.log('Selected node:', selectedNode ? { id: selectedNode.id, label: selectedNode.data.label } : 'none');

  // Update node configuration
  const updateNodeConfiguration = useCallback((nodeId: string, configuration: Record<string, any>) => {
    console.log('Updating node configuration:', { nodeId, configuration });
    
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
  }, [setNodes, nodes]);

  // Update any node data
  const updateNodeData = useCallback((nodeId: string, updates: Partial<EnhancedWorkflowNodeData>) => {
    console.log('Updating node data:', { nodeId, updates });
    
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

    // Also update original nodes for basic data
    if (setNodes && nodes) {
      setNodes(
        nodes.map((node: any) =>
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
    }

    setWorkflowMetadata(prev => ({ ...prev, lastModified: new Date() }));
  }, [setNodes, nodes]);

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
    const loadedNodes: EnhancedNode[] = data.nodes.map(nodeData => ({
      id: nodeData.id,
      type: 'workflowNode',
      position: nodeData.position,
      data: {
        id: nodeData.id,
        label: nodeData.type,
        nodeType: nodeData.type,
        icon: '🔧',
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
    selectedNode,
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