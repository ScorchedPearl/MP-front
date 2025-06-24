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
  defaultConfig?: Record<string, unknown>;
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
          email: 'user@example.com',
        },
      },
    },
    inputs: [],
    outputs: [{ id: 'output', label: 'Context', type: 'object' }],
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
    outputs: [{ id: 'output', label: 'Data', type: 'object' }],
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
      { id: 'false', label: 'False', type: 'object' },
    ],
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
    outputs: [{ id: 'output', label: 'Transformed', type: 'object' }],
  },
  {
    id: '5',
    type: 'delay',
    label: 'Delay',
    description: 'Add delay to workflow',
    category: 'Utilities',
    icon: '⏱️',
    defaultConfig: { 
      duration: 1000,
      message: 'Delay completed',
      reason: 'Workflow timing'
    },
    inputs: [{ id: 'input', label: 'Data', required: false, type: 'object' }],
    outputs: [{ id: 'output', label: 'Data', type: 'object' }],
  },
  {
    id: '6',
    type: 'httpGet',
    label: 'HTTP GET',
    description: 'Send a GET request to an external API',
    category: 'Actions',
    icon: '🔍',
    defaultConfig: {
      url: 'https://api.example.com/data',
      method: 'GET',
      headers: '{}',
      body: '{}',
      useGoogleAuth: false
    },
    inputs: [{ id: 'input', label: 'Input', required: false, type: 'object' }],
    outputs: [{ id: 'output', label: 'Response', type: 'object' }],
  },
  {
    id: '7',
    type: 'httpPost',
    label: 'HTTP POST',
    description: 'Send a POST request to an external API',
    category: 'Actions',
    icon: '📤',
    defaultConfig: {
      url: 'https://api.example.com/create',
      method: 'POST',
      headers: '{ "Content-Type": "application/json" }',
      body: '{ "key": "value" }',
      useGoogleAuth: false
    },
    inputs: [{ id: 'input', label: 'Input', required: false, type: 'object' }],
    outputs: [{ id: 'output', label: 'Response', type: 'object' }],
  },
  {
    id: '8',
    type: 'httpPut',
    label: 'HTTP PUT',
    description: 'Send a PUT request to update data on an external API',
    category: 'Actions',
    icon: '🛠️',
    defaultConfig: {
      url: 'https://api.example.com/resource',
      method: 'PUT',
      headers: '{ "Content-Type": "application/json" }',
      body: '{ "updatedKey": "updatedValue" }',
      useGoogleAuth: false
    },
    inputs: [{ id: 'input', label: 'Input', required: false, type: 'object' }],
    outputs: [{ id: 'output', label: 'Response', type: 'object' }],
  },
  {
    id: '9',
    type: 'httpDelete',
    label: 'HTTP DELETE',
    description: 'Send a DELETE request to an external API',
    category: 'Actions',
    icon: '🗑️',
    defaultConfig: {
      url: 'https://api.example.com/resource/123',
      method: 'DELETE',
      headers: '{}',
      body: '{}',
      useGoogleAuth: false
    },
    inputs: [{ id: 'input', label: 'Input', required: false, type: 'object' }],
    outputs: [{ id: 'output', label: 'Response', type: 'object' }],
  },
  {
    id: '10',
    type: 'text-generation',
    label: 'Text Generation',
    description: 'Generate text using AI model',
    category: 'AI',
    icon: '🤖',
    defaultConfig: { prompt: '' },
    inputs: [{ id: 'input', label: 'Prompt', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Generated Text', type: 'string' }],
  },
  {
    id: '11',
    type: 'summarization',
    label: 'Summarization',
    description: 'Summarize text using AI model',
    category: 'AI',
    icon: '📄',
    defaultConfig: { text: '' },
    inputs: [{ id: 'input', label: 'Text', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Summary', type: 'string' }],
  },
  {
    id: '12',
    type: 'ai-decision',
    label: 'AI Decision',
    description: 'Make a decision using an AI model',
    category: 'AI',
    icon: '🧠',
    defaultConfig: { input: '' },
    inputs: [{ id: 'input', label: 'Input', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Decision', type: 'string' }],
  },
  {
    id: '13',
    type: 'question-answer',
    label: 'Question Answer',
    description: 'Answer questions using AI model',
    category: 'AI',
    icon: '❓',
    defaultConfig: { question: '', context: '' },
    inputs: [
      { id: 'question', label: 'Question', required: true, type: 'string' },
      { id: 'context', label: 'Context', required: false, type: 'string' },
    ],
    outputs: [{ id: 'output', label: 'Answer', type: 'string' }],
  },
  {
    id: '14',
    type: 'text-classification',
    label: 'Text Classification',
    description: 'Classify text using AI model',
    category: 'AI',
    icon: '🏷️',
    defaultConfig: { text: '' },
    inputs: [{ id: 'input', label: 'Text', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Class', type: 'string' }],
  },
  {
    id: '15',
    type: 'named-entity',
    label: 'Named Entity Recognition',
    description: 'Extract named entities from text',
    category: 'AI',
    icon: '🔖',
    defaultConfig: { text: '' },
    inputs: [{ id: 'input', label: 'Text', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Entities', type: 'object' }],
  },
  {
    id: '16',
    type: 'translation',
    label: 'Translation',
    description: 'Translate text using AI model',
    category: 'AI',
    icon: '🌐',
    defaultConfig: { text: '', targetLanguage: 'en' },
    inputs: [
      { id: 'input', label: 'Text', required: true, type: 'string' },
      { id: 'targetLanguage', label: 'Target Language', required: true, type: 'string' },
    ],
    outputs: [{ id: 'output', label: 'Translated Text', type: 'string' }],
  },
  {
    id: '17',
    type: 'content-generation',
    label: 'Content Generation',
    description: 'Generate content using AI model',
    category: 'AI',
    icon: '✍️',
    defaultConfig: { prompt: '' },
    inputs: [{ id: 'input', label: 'Prompt', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Content', type: 'string' }],
  },
  {
    id: '18',
    type: 'search-agent',
    label: 'Search Agent',
    description: 'Search information using AI agent',
    category: 'AI',
    icon: '🔍',
    defaultConfig: { query: '' },
    inputs: [{ id: 'input', label: 'Query', required: true, type: 'string' }],
    outputs: [{ id: 'output', label: 'Results', type: 'object' }],
  },
  {
    id: '19',
    type: 'data-analyst-agent',
    label: 'Data Analyst Agent',
    description: 'Analyze data using AI agent',
    category: 'AI',
    icon: '📊',
    defaultConfig: { data: '', analysisType: '' },
    inputs: [
      { id: 'data', label: 'Data', required: true, type: 'object' },
      { id: 'analysisType', label: 'Analysis Type', required: false, type: 'string' },
    ],
    outputs: [{ id: 'output', label: 'Analysis Result', type: 'object' }],
  },
  {
    id: '20',
    type: 'googleCalendar',
    label: 'Google Calendar',
    description: 'Create an event in Google Calendar',
    category: 'Actions',
    icon: '📅',
    defaultConfig: {
      summary: '',
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      calendarId: 'primary',
      useGoogleAuth: true,
    },
    inputs: [{ id: 'input', label: 'Data', required: false, type: 'object' }],
    outputs: [{ id: 'output', label: 'Calendar Event', type: 'object' }],
  },
  {
    id: '21',
    type: 'calculator',
    label: 'Calculator',
    description: 'Evaluate math expression with variables',
    category: 'Utilities',
    icon: '🧮',
    defaultConfig: {
      expression: '2 + 3 * 5',
    },
    inputs: [
      {
        id: 'input',
        label: 'Context',
        type: 'object',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'output',
        label: 'Result',
        type: 'object',
      },
    ],
  },
  {
    id: '22',
    type: 'currentTime',
    label: 'Current Time',
    description: 'Get current time in a specific time zone',
    category: 'Utilities',
    icon: '🕒',
    defaultConfig: {
      timeZone: 'Asia/Kolkata',
    },
    inputs: [],
    outputs: [
      {
        id: 'output',
        label: 'Timestamp',
        type: 'object',
      },
    ],
  },
    {
      id: '23',
      type: 'gmailSend',
      label: 'Gmail Send',
      description: 'Send emails using Gmail API',
      category: 'Gmail',
      icon: '📧',
      defaultConfig: {
        to: '',
        subject: '',
        body: '',
        cc: '',
        bcc: '',
        useGoogleAuth: true,
      },
      inputs: [{ id: 'input', label: 'Data', required: false, type: 'object' }],
      outputs: [{ id: 'output', label: 'Email Result', type: 'object' }],
    },
    {
      id: '24',
      type: 'gmailSearch',
      label: 'Gmail Search',
      description: 'Search emails in Gmail',
      category: 'Gmail',
      icon: '🔍',
      defaultConfig: {
        query: 'is:unread',
        maxResults: 10,
        includeSpamTrash: false,
        useGoogleAuth: true,
      },
      inputs: [{ id: 'input', label: 'Search Data', required: false, type: 'object' }],
      outputs: [{ id: 'output', label: 'Search Results', type: 'object' }],
    },
    {
      id: '25',
      type: 'gmailMarkRead',
      label: 'Gmail Mark Read',
      description: 'Mark Gmail messages as read or unread',
      category: 'Gmail',
      icon: '👁️',
      defaultConfig: {
        messageIds: '',
        markAsRead: true,
        useGoogleAuth: true,
      },
      inputs: [{ id: 'input', label: 'Message Data', required: true, type: 'object' }],
      outputs: [{ id: 'output', label: 'Update Result', type: 'object' }],
    },
    {
      id: '26',
      type: 'gmailAddLabel',
      label: 'Gmail Add Label',
      description: 'Add or remove labels from Gmail messages',
      category: 'Gmail',
      icon: '🏷️',
      defaultConfig: {
        messageIds: '',
        labelsToAdd: '',
        labelsToRemove: '',
        useGoogleAuth: true,
      },
      inputs: [{ id: 'input', label: 'Message Data', required: true, type: 'object' }],
      outputs: [{ id: 'output', label: 'Label Result', type: 'object' }],
    },
    {
      id: '27',
      type: 'gmailCreateDraft',
      label: 'Gmail Create Draft',
      description: 'Create a draft email in Gmail',
      category: 'Gmail',
      icon: '📝',
      defaultConfig: {
        to: '',
        subject: '',
        body: '',
        cc: '',
        bcc: '',
        useGoogleAuth: true,
      },
      inputs: [{ id: 'input', label: 'Draft Data', required: false, type: 'object' }],
      outputs: [{ id: 'output', label: 'Draft Result', type: 'object' }],
    },
    {
      id: '2',
      type: 'gmailReply',
      label: 'Gmail Reply',
      description: 'Reply to a Gmail message',
      category: 'Gmail',
      icon: '↩️',
      defaultConfig: {
        messageId: '',
        replyBody: '',
        replyAll: false,
        useGoogleAuth: true,
      },
      inputs: [{ id: 'input', label: 'Reply Data', required: true, type: 'object' }],
      outputs: [{ id: 'output', label: 'Reply Result', type: 'object' }],
    },
  ];