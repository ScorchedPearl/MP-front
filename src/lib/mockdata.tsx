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
  },
  {
    id: '6',
    type: 'calculator',
    label: 'Calculator',
    description: 'Perform basic arithmetic operations',
    category: 'Utilities',
    icon: '🧮',
    defaultConfig: { expression: '' },
    inputs: [
      { id: 'operand1', label: 'Operand 1', required:false ,type:'object' },
    ],
    outputs: [{ id: 'result', label: 'Result', type: 'object' }]
  },
  {
    id:'7',
    type:'text-generation',
    label:'Text Generation',
    description:'Generate text using AI model',
    category:'AI',
    icon:'🤖',
    defaultConfig: {  prompt: '' },
    inputs: [{ id: 'input', label: 'Prompt', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Generated Text', type: 'string' }]
  },
  {
    id:'8',
    type:'summarization',
    label:'Summarization',
    description:'Summarize text using AI model',
    category:'AI',
    icon:'📄',
    defaultConfig: { text: '' },
    inputs: [{ id: 'input', label: 'Text', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Summary', type: 'string' }]
  },
  {
    id: '9',
    type: 'ai-decision',
    label: 'AI Decision',
    description: 'Make a decision using an AI model',
    category: 'AI',
    icon: '🧠',
    defaultConfig: { input: '' },
    inputs: [{ id: 'input', label: 'Input', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Decision', type: 'string' }]
  },
  {
    id: '10',
    type: 'question-answer',
    label: 'Question Answer',
    description: 'Answer questions using AI model',
    category: 'AI',
    icon: '❓',
    defaultConfig: {  question: '', context: '' },
    inputs: [
      { id: 'question', label: 'Question', required: true, type: 'string' },
      { id: 'context', label: 'Context', required: false, type: 'string' }
    ],
    outputs: [{ id: 'output', label: 'Answer', type: 'string' }]
  },
  {
    id: '11',
    type: 'text-classification',
    label: 'Text Classification',
    description: 'Classify text using AI model',
    category: 'AI',
    icon: '🏷️',
    defaultConfig: { text: '' },
    inputs: [{ id: 'input', label: 'Text', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Class', type: 'string' }]
  },
  {
    id: '12',
    type: 'named-entity',
    label: 'Named Entity Recognition',
    description: 'Extract named entities from text',
    category: 'AI',
    icon: '🔖',
    defaultConfig: {  text: '' },
    inputs: [{ id: 'input', label: 'Text', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Entities', type: 'object' }]
  },
  {
    id: '13',
    type: 'translation',
    label: 'Translation',
    description: 'Translate text using AI model',
    category: 'AI',
    icon: '🌐',
    defaultConfig: { text: '', targetLanguage: 'en' },
    inputs: [
      { id: 'input', label: 'Text', required: true, type: 'string' },
      { id: 'targetLanguage', label: 'Target Language', required: true, type: 'string' }
    ],
    outputs: [{ id: 'output', label: 'Translated Text', type: 'string' }]
  },
  {
    id: '14',
    type: 'content-generation',
    label: 'Content Generation',
    description: 'Generate content using AI model',
    category: 'AI',
    icon: '✍️',
    defaultConfig: {  prompt: '' },
    inputs: [{ id: 'input', label: 'Prompt', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Content', type: 'string' }]
  },
  {
    id: '15',
    type: 'search-agent',
    label: 'Search Agent',
    description: 'Search information using AI agent',
    category: 'AI',
    icon: '🔍',
    defaultConfig: { query: '' },
    inputs: [{ id: 'input', label: 'Query', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Results', type: 'object' }]
  },
  {
    id: '16',
    type: 'data-analyst-agent',
    label: 'Data Analyst Agent',
    description: 'Analyze data using AI agent',
    category: 'AI',
    icon: '📊',
    defaultConfig: { data: '', analysisType: '' },
    inputs: [
      { id: 'data', label: 'Data', required: true, type: 'object' },
      { id: 'analysisType', label: 'Analysis Type', required: false, type: 'string' }
    ],
    outputs: [{ id: 'output', label: 'Analysis Result', type: 'object' }]
  }
];

