export interface NodeInput {
  id: string;
  label: string;
  required: boolean;
  type: string;
}

export interface NodeOutput {
  id: string;
  label: string;
  type: string;
}
export interface WorkflowNodeData {
  id: string;
  [key: string]: unknown;
  label: string;
  nodeType: string;
  icon: React.ReactNode;
  config?: Record<string, unknown>;
  inputs?: NodeInput[];
  outputs?: NodeOutput[];
  description: string;
}

export interface NodeTemplate {
  id: string;
  type: string;
  label: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  defaultConfig?:Record<string, unknown>;
  inputs?: NodeInput[];
  outputs?: NodeOutput[];
}
export const nodeTemplates: NodeTemplate[] = [
  {
    id: '0',
    type: 'start',
    label: 'Start',
    description: 'Start of the workflow with initial context',
    category: 'Triggers',
    icon: '🚀',
    defaultConfig: {
      context: {
        user: {
          name: 'user',
          email: 'user@example.com'
        }
      }
    },
    inputs: [],
    outputs: [{ id: 'output', label: 'Context', type: 'object' }]
  },
  {
    id: '1',
    type: 'trigger',
    label: 'Webhook',
    description: 'Trigger workflow via HTTP webhook',
    category: 'Triggers',
    icon: '🔗',
    defaultConfig: { url: '', method: 'POST' },
    inputs: [],
    outputs: [{ id: 'output', label: 'Data', type: 'object' }]
  },
  {
    id: '2',
    type: 'action',
    label: 'Send Email',
    description: 'Send email notification',
    category: 'Actions',
    icon: '📧',
    defaultConfig: { to: '', subject: '', body: '' },
    inputs: [{ id: 'input', label: 'Data', required: true, type: 'object' }],
    outputs: [{ id: 'output', label: 'Result', type: 'object' }]
  },
  {
    id: '3',
    type: 'condition',
    label: 'Filter',
    description: 'Filter data based on conditions',
    category: 'Logic',
    icon: '🎯',
    defaultConfig: { condition: '' },
    inputs: [{ id: 'input', label: 'Data', required: true, type: 'object' }],
    outputs: [
      { id: 'true', label: 'True', type: 'object' },
      { id: 'false', label: 'False', type: 'object' }
    ]
  },
  {
    id: '4',
    type: 'transform',
    label: 'Transform',
    description: 'Transform and map data',
    category: 'Processing',
    icon: '🔄',
    defaultConfig: { mapping: {} },
    inputs: [{ id: 'input', label: 'Data', required: true, type: 'object' }],
    outputs: [{ id: 'output', label: 'Transformed', type: 'object' }]
  },
  {
    id: '5',
    type: 'delay',
    label: 'Delay',
    description: 'Add delay to workflow',
    category: 'Utilities',
    icon: '⏱️',
    defaultConfig: { duration: 1000 },
    inputs: [{ id: 'input', label: 'Data', required: false, type: 'object' }],
    outputs: [{ id: 'output', label: 'Data', type: 'object' }]
  }
];

