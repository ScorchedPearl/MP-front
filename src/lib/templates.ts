import { WorkflowExecutionData } from "@/app/flow/_state/statecontext";

// Predefined workflow templates for common use cases
export const workflowTemplates: Array<{
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  estimatedTime: string;
  workflow: WorkflowExecutionData;
  thumbnail?: string;
  videoUrl?: string;
  documentation?: string;
}> = [
  {
    id: 'email-notification-workflow',
    name: 'Email Notification Workflow',
    description: 'Send email notifications when a webhook is triggered',
    category: 'Communication',
    difficulty: 'beginner',
    tags: ['email', 'webhook', 'notification', 'basic'],
    estimatedTime: '5 minutes',
    workflow: {
      nodes: [
        {
          id: 'trigger-1',
          type: 'webhook',
          configuration: {
            url: 'https://your-domain.com/webhook',
            method: 'POST',
            authentication: 'none'
          },
          position: { x: 100, y: 100 }
        },
        {
          id: 'email-1',
          type: 'email',
          configuration: {
            to: 'admin@example.com',
            subject: 'New Event Triggered',
            body: 'A new event was received: {{trigger.data}}',
            provider: 'smtp'
          },
          position: { x: 400, y: 100 }
        }
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'trigger-1',
          target: 'email-1',
          sourceHandle: 'output',
          targetHandle: 'input'
        }
      ],
      metadata: {
        name: 'Email Notification Workflow',
        description: 'Basic webhook to email notification',
        version: '1.0.0',
        created: new Date('2024-01-01'),
        lastModified: new Date('2024-01-01')
      }
    },
    documentation: `
# Email Notification Workflow

This template creates a simple workflow that sends email notifications when a webhook is triggered.

## How it works:
1. **Webhook Trigger**: Receives HTTP requests
2. **Email Action**: Sends formatted email notification

## Setup:
1. Configure the webhook URL in the trigger node
2. Set up email credentials in the email node
3. Customize the email template with dynamic data

## Use cases:
- Form submissions
- System alerts
- User registrations
- Order confirmations
    `
  },
  {
    id: 'data-processing-pipeline',
    name: 'Data Processing Pipeline',
    description: 'Process data through validation, transformation, and storage',
    category: 'Data Processing',
    difficulty: 'intermediate',
    tags: ['data', 'validation', 'transform', 'database'],
    estimatedTime: '15 minutes',
    workflow: {
      nodes: [
        {
          id: 'webhook-1',
          type: 'webhook',
          configuration: {
            url: 'https://api.example.com/data',
            method: 'POST'
          },
          position: { x: 50, y: 150 }
        },
        {
          id: 'validation-1',
          type: 'condition',
          configuration: {
            condition: 'data.email && data.name',
            operator: 'exists'
          },
          position: { x: 300, y: 150 }
        },
        {
          id: 'transform-1',
          type: 'transform',
          configuration: {
            mapping: {
              user_id: '{{data.id}}',
              full_name: '{{data.name}}',
              email_address: '{{data.email}}',
              created_at: '{{now()}}'
            }
          },
          position: { x: 550, y: 100 }
        },
        {
          id: 'database-1',
          type: 'database-query',
          configuration: {
            connection: 'main_db',
            query: 'INSERT INTO users (user_id, full_name, email_address, created_at) VALUES (?, ?, ?, ?)',
            parameters: ['{{user_id}}', '{{full_name}}', '{{email_address}}', '{{created_at}}']
          },
          position: { x: 800, y: 100 }
        },
        {
          id: 'error-email-1',
          type: 'email',
          configuration: {
            to: 'admin@example.com',
            subject: 'Data Validation Failed',
            body: 'Invalid data received: {{data}}'
          },
          position: { x: 550, y: 250 }
        }
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'webhook-1',
          target: 'validation-1',
          sourceHandle: 'output',
          targetHandle: 'input'
        },
        {
          id: 'edge-2',
          source: 'validation-1',
          target: 'transform-1',
          sourceHandle: 'true',
          targetHandle: 'input'
        },
        {
          id: 'edge-3',
          source: 'validation-1',
          target: 'error-email-1',
          sourceHandle: 'false',
          targetHandle: 'input'
        },
        {
          id: 'edge-4',
          source: 'transform-1',
          target: 'database-1',
          sourceHandle: 'output',
          targetHandle: 'input'
        }
      ],
      metadata: {
        name: 'Data Processing Pipeline',
        description: 'Validate, transform, and store incoming data',
        version: '1.2.0',
        created: new Date('2024-01-01'),
        lastModified: new Date('2024-01-15')
      }
    },
    documentation: `
# Data Processing Pipeline

A comprehensive workflow for processing incoming data with validation, transformation, and storage.

## Workflow Steps:
1. **Data Reception**: Webhook receives incoming data
2. **Validation**: Check if required fields exist
3. **Valid Path**: Transform and store data
4. **Invalid Path**: Send error notification

## Features:
- Data validation with conditional routing
- Field mapping and transformation
- Database storage with parameterized queries
- Error handling and notifications

## Configuration:
- Set up webhook endpoint
- Configure database connection
- Customize validation rules
- Set up error notification recipients
    `
  },
  {
    id: 'api-integration-workflow',
    name: 'API Integration Workflow',
    description: 'Fetch data from external APIs and process responses',
    category: 'Integration',
    difficulty: 'intermediate',
    tags: ['api', 'http', 'integration', 'data'],
    estimatedTime: '12 minutes',
    workflow: {
      nodes: [
        {
          id: 'trigger-1',
          type: 'webhook',
          configuration: {
            url: 'https://your-domain.com/api-trigger',
            method: 'POST'
          },
          position: { x: 50, y: 150 }
        },
        {
          id: 'api-call-1',
          type: 'http-request',
          configuration: {
            url: 'https://api.external-service.com/users/{{data.userId}}',
            method: 'GET',
            headers: {
              'Authorization': 'Bearer {{env.API_TOKEN}}',
              'Content-Type': 'application/json'
            },
            timeout: 10000
          },
          position: { x: 300, y: 150 }
        },
        {
          id: 'success-check-1',
          type: 'condition',
          configuration: {
            condition: 'response.status === 200',
            operator: 'equals'
          },
          position: { x: 550, y: 150 }
        },
        {
          id: 'process-data-1',
          type: 'transform',
          configuration: {
            mapping: {
              userId: '{{response.data.id}}',
              userName: '{{response.data.name}}',
              email: '{{response.data.email}}',
              lastUpdated: '{{now()}}'
            }
          },
          position: { x: 800, y: 100 }
        },
        {
          id: 'notification-1',
          type: 'slack-message',
          configuration: {
            channel: '#integrations',
            message: 'Successfully processed user: {{userName}} ({{email}})',
            username: 'API Bot'
          },
          position: { x: 1050, y: 100 }
        },
        {
          id: 'error-handler-1',
          type: 'email',
          configuration: {
            to: 'tech@example.com',
            subject: 'API Integration Error',
            body: 'Failed to fetch user data. Status: {{response.status}}, Error: {{response.error}}'
          },
          position: { x: 800, y: 250 }
        }
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'trigger-1',
          target: 'api-call-1',
          sourceHandle: 'output',
          targetHandle: 'input'
        },
        {
          id: 'edge-2',
          source: 'api-call-1',
          target: 'success-check-1',
          sourceHandle: 'output',
          targetHandle: 'input'
        },
        {
          id: 'edge-3',
          source: 'success-check-1',
          target: 'process-data-1',
          sourceHandle: 'true',
          targetHandle: 'input'
        },
        {
          id: 'edge-4',
          source: 'success-check-1',
          target: 'error-handler-1',
          sourceHandle: 'false',
          targetHandle: 'input'
        },
        {
          id: 'edge-5',
          source: 'process-data-1',
          target: 'notification-1',
          sourceHandle: 'output',
          targetHandle: 'input'
        }
      ],
      metadata: {
        name: 'API Integration Workflow',
        description: 'Fetch and process data from external APIs',
        version: '1.1.0',
        created: new Date('2024-01-01'),
        lastModified: new Date('2024-01-10')
      }
    }
  },
  {
    id: 'customer-onboarding-workflow',
    name: 'Customer Onboarding Workflow',
    description: 'Complete customer onboarding with multiple touchpoints',
    category: 'Customer Success',
    difficulty: 'advanced',
    tags: ['onboarding', 'customer', 'email', 'delay', 'crm'],
    estimatedTime: '25 minutes',
    workflow: {
      nodes: [
        {
          id: 'signup-webhook',
          type: 'webhook',
          configuration: {
            url: 'https://app.example.com/signup-webhook',
            method: 'POST'
          },
          position: { x: 50, y: 200 }
        },
        {
          id: 'welcome-email',
          type: 'email',
          configuration: {
            to: '{{data.email}}',
            subject: 'Welcome to {{company.name}}!',
            body: 'Hi {{data.firstName}}, welcome to our platform! Here\'s how to get started...',
            template: 'welcome'
          },
          position: { x: 300, y: 150 }
        },
        {
          id: 'crm-update',
          type: 'http-request',
          configuration: {
            url: 'https://api.crm.com/contacts',
            method: 'POST',
            headers: {
              'Authorization': 'Bearer {{env.CRM_TOKEN}}'
            },
            body: {
              email: '{{data.email}}',
              firstName: '{{data.firstName}}',
              lastName: '{{data.lastName}}',
              source: 'website',
              status: 'new'
            }
          },
          position: { x: 300, y: 250 }
        },
        {
          id: 'delay-1',
          type: 'delay',
          configuration: {
            duration: 86400000,
            unit: 'milliseconds'
          },
          position: { x: 550, y: 150 }
        },
        {
          id: 'check-activity',
          type: 'http-request',
          configuration: {
            url: 'https://api.analytics.com/user-activity/{{data.userId}}',
            method: 'GET'
          },
          position: { x: 800, y: 150 }
        },
        {
          id: 'activity-check',
          type: 'condition',
          configuration: {
            condition: 'activity.loginCount > 0',
            operator: 'greater_than'
          },
          position: { x: 1050, y: 150 }
        },
        {
          id: 'engagement-email',
          type: 'email',
          configuration: {
            to: '{{data.email}}',
            subject: 'How are you finding {{company.name}}?',
            template: 'engagement'
          },
          position: { x: 1300, y: 100 }
        },
        {
          id: 'nudge-email',
          type: 'email',
          configuration: {
            to: '{{data.email}}',
            subject: 'Don\'t forget to complete your setup!',
            template: 'nudge'
          },
          position: { x: 1300, y: 200 }
        }
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'signup-webhook',
          target: 'welcome-email',
          sourceHandle: 'output',
          targetHandle: 'input'
        },
        {
          id: 'edge-2',
          source: 'signup-webhook',
          target: 'crm-update',
          sourceHandle: 'output',
          targetHandle: 'input'
        },
        {
          id: 'edge-3',
          source: 'welcome-email',
          target: 'delay-1',
          sourceHandle: 'output',
          targetHandle: 'input'
        },
        {
          id: 'edge-4',
          source: 'delay-1',
          target: 'check-activity',
          sourceHandle: 'output',
          targetHandle: 'input'
        },
        {
          id: 'edge-5',
          source: 'check-activity',
          target: 'activity-check',
          sourceHandle: 'output',
          targetHandle: 'input'
        },
        {
          id: 'edge-6',
          source: 'activity-check',
          target: 'engagement-email',
          sourceHandle: 'true',
          targetHandle: 'input'
        },
        {
          id: 'edge-7',
          source: 'activity-check',
          target: 'nudge-email',
          sourceHandle: 'false',
          targetHandle: 'input'
        }
      ],
      metadata: {
        name: 'Customer Onboarding Workflow',
        description: 'Complete automated customer onboarding sequence',
        version: '2.0.0',
        created: new Date('2024-01-01'),
        lastModified: new Date('2024-01-20')
      }
    }
  },
  {
    id: 'social-media-monitoring',
    name: 'Social Media Monitoring',
    description: 'Monitor social media mentions and respond automatically',
    category: 'Marketing',
    difficulty: 'advanced',
    tags: ['social media', 'monitoring', 'sentiment', 'response'],
    estimatedTime: '30 minutes',
    workflow: {
      nodes: [
        {
          id: 'social-webhook',
          type: 'webhook',
          configuration: {
            url: 'https://api.socialmedia.com/mentions-webhook',
            method: 'POST'
          },
          position: { x: 50, y: 250 }
        },
        {
          id: 'sentiment-analysis',
          type: 'http-request',
          configuration: {
            url: 'https://api.sentiment.com/analyze',
            method: 'POST',
            body: {
              text: '{{data.message}}'
            }
          },
          position: { x: 300, y: 250 }
        },
        {
          id: 'sentiment-check',
          type: 'condition',
          configuration: {
            condition: 'sentiment.score < -0.5',
            operator: 'less_than'
          },
          position: { x: 550, y: 250 }
        },
        {
          id: 'priority-alert',
          type: 'slack-message',
          configuration: {
            channel: '#customer-success',
            message: '🚨 Negative mention detected!\nUser: {{data.user}}\nMessage: {{data.message}}\nSentiment: {{sentiment.score}}'
          },
          position: { x: 800, y: 150 }
        },
        {
          id: 'auto-response',
          type: 'http-request',
          configuration: {
            url: 'https://api.socialmedia.com/reply',
            method: 'POST',
            body: {
              postId: '{{data.postId}}',
              message: 'Hi! We noticed your feedback and would love to help. Please DM us or email support@example.com'
            }
          },
          position: { x: 1050, y: 150 }
        },
        {
          id: 'positive-log',
          type: 'database-query',
          configuration: {
            connection: 'analytics_db',
            query: 'INSERT INTO positive_mentions (user, message, sentiment, timestamp) VALUES (?, ?, ?, ?)',
            parameters: ['{{data.user}}', '{{data.message}}', '{{sentiment.score}}', '{{now()}}']
          },
          position: { x: 800, y: 350 }
        }
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'social-webhook',
          target: 'sentiment-analysis',
          sourceHandle: 'output',
          targetHandle: 'input'
        },
        {
          id: 'edge-2',
          source: 'sentiment-analysis',
          target: 'sentiment-check',
          sourceHandle: 'output',
          targetHandle: 'input'
        },
        {
          id: 'edge-3',
          source: 'sentiment-check',
          target: 'priority-alert',
          sourceHandle: 'true',
          targetHandle: 'input'
        },
        {
          id: 'edge-4',
          source: 'priority-alert',
          target: 'auto-response',
          sourceHandle: 'output',
          targetHandle: 'input'
        },
        {
          id: 'edge-5',
          source: 'sentiment-check',
          target: 'positive-log',
          sourceHandle: 'false',
          targetHandle: 'input'
        }
      ],
      metadata: {
        name: 'Social Media Monitoring',
        description: 'Automated social media mention monitoring and response',
        version: '1.5.0',
        created: new Date('2024-01-01'),
        lastModified: new Date('2024-01-25')
      }
    }
  }
];

// Template categories for organization
export const templateCategories = [
  {
    id: 'communication',
    name: 'Communication',
    description: 'Email, SMS, Slack, and other messaging workflows',
    icon: '💬',
    templates: workflowTemplates.filter(t => t.category === 'Communication')
  },
  {
    id: 'data-processing',
    name: 'Data Processing',
    description: 'Data validation, transformation, and storage workflows',
    icon: '🔄',
    templates: workflowTemplates.filter(t => t.category === 'Data Processing')
  },
  {
    id: 'integration',
    name: 'Integration',
    description: 'API integrations and external service connections',
    icon: '🔗',
    templates: workflowTemplates.filter(t => t.category === 'Integration')
  },
  {
    id: 'customer-success',
    name: 'Customer Success',
    description: 'Customer onboarding, support, and engagement workflows',
    icon: '👥',
    templates: workflowTemplates.filter(t => t.category === 'Customer Success')
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing automation and lead generation workflows',
    icon: '📈',
    templates: workflowTemplates.filter(t => t.category === 'Marketing')
  }
];

// Workflow builder helper functions
export class WorkflowTemplateManager {
  // Load a template into the workflow editor
  static loadTemplate(templateId: string): WorkflowExecutionData | null {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (!template) return null;

    // Create a copy with updated metadata
    const workflow: WorkflowExecutionData = {
      ...template.workflow,
      metadata: {
        ...template.workflow.metadata,
        name: `${template.workflow.metadata.name} (Copy)`,
        created: new Date(),
        lastModified: new Date(),
        version: '1.0.0'
      }
    };

    return workflow;
  }

  // Get templates by category
  static getTemplatesByCategory(category: string) {
    return workflowTemplates.filter(t => t.category === category);
  }

  // Get templates by difficulty
  static getTemplatesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced') {
    return workflowTemplates.filter(t => t.difficulty === difficulty);
  }

  // Search templates
  static searchTemplates(query: string) {
    const lowerQuery = query.toLowerCase();
    return workflowTemplates.filter(t => 
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Get recommended templates based on used nodes
  static getRecommendedTemplates(usedNodeTypes: string[]) {
    return workflowTemplates
      .map(template => {
        const templateNodeTypes = template.workflow.nodes.map(n => n.type);
        const overlap = usedNodeTypes.filter(type => templateNodeTypes.includes(type)).length;
        const similarity = overlap / Math.max(usedNodeTypes.length, templateNodeTypes.length);
        
        return { template, similarity };
      })
      .filter(({ similarity }) => similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .map(({ template }) => template)
      .slice(0, 5);
  }

  // Create a custom template from current workflow
  static createTemplate(
    workflow: WorkflowExecutionData,
    metadata: {
      name: string;
      description: string;
      category: string;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      tags: string[];
      estimatedTime: string;
    }
  ) {
    return {
      id: `custom-${Date.now()}`,
      ...metadata,
      workflow: {
        ...workflow,
        metadata: {
          ...workflow.metadata,
          name: metadata.name,
          description: metadata.description
        }
      }
    };
  }

  // Validate template before saving
  static validateTemplate(template: typeof workflowTemplates[0]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check required fields
    if (!template.name) errors.push('Template name is required');
    if (!template.description) errors.push('Template description is required');
    if (!template.category) errors.push('Template category is required');
    if (!template.workflow.nodes.length) errors.push('Template must have at least one node');

    // Check workflow structure
    const triggerNodes = template.workflow.nodes.filter(n => n.type === 'trigger' || n.type === 'webhook');
    if (triggerNodes.length === 0) {
      errors.push('Template workflow must have at least one trigger node');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Usage examples and documentation
export const TemplateUsageExamples = {
  // Basic template loading
  loadEmailNotificationTemplate: () => {
    return WorkflowTemplateManager.loadTemplate('email-notification-workflow');
  },

  // Search for data processing templates
  findDataProcessingTemplates: () => {
    return WorkflowTemplateManager.getTemplatesByCategory('Data Processing');
  },

  // Get beginner-friendly templates
  getBeginnerTemplates: () => {
    return WorkflowTemplateManager.getTemplatesByDifficulty('beginner');
  },

  // Search templates by keyword
  searchEmailTemplates: () => {
    return WorkflowTemplateManager.searchTemplates('email');
  },

  // Get recommendations based on current workflow
  getRecommendations: (currentNodeTypes: string[]) => {
    return WorkflowTemplateManager.getRecommendedTemplates(currentNodeTypes);
  }
};

/*
INTEGRATION EXAMPLE:

// In your workflow component
import { WorkflowTemplateManager, workflowTemplates } from './workflow-templates';
import { useWorkflow } from './workflow-state-provider';

function TemplateSelector() {
  const { loadWorkflow } = useWorkflow();
  
  const handleSelectTemplate = (templateId: string) => {
    const template = WorkflowTemplateManager.loadTemplate(templateId);
    if (template) {
      loadWorkflow(template);
    }
  };

  return (
    <div className="template-grid">
      {workflowTemplates.map(template => (
        <div key={template.id} onClick={() => handleSelectTemplate(template.id)}>
          <h3>{template.name}</h3>
          <p>{template.description}</p>
          <span className={`difficulty-${template.difficulty}`}>
            {template.difficulty}
          </span>
        </div>
      ))}
    </div>
  );
}
*/