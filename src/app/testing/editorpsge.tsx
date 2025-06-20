// // Complete Integration Guide for Enhanced Workflow System
// // This file demonstrates how to integrate all the enhanced components

// import React, { useState, useEffect } from 'react';
// import { useWorkflow } from '../flow/_state/statecontext';
// import { WorkflowUtils, WorkflowApiClient } from '@/lib/workflow';
// import { WorkflowTemplateManager, workflowTemplates } from '@/lib/templates';
// import EnhancedCanvasDropZone from './_components/drop-zone';
// import EnhancedPropertiesPanel from './_components/properties';
// import EnhancedNodePalette from './_components/_components/nodeTemplateCard';

// // 1. COMPLETE WORKFLOW MANAGEMENT COMPONENT
// // This shows how to integrate all the enhanced features
// const CompleteWorkflowEditor: React.FC = () => {
//   const {
//     nodes,
//     edges,
//     getWorkflowExecutionData,
//     loadWorkflow,
//     clearWorkflow,
//     validateWorkflow,
//     workflowMetadata,
//     updateWorkflowMetadata,
//     isExecuting,
//     setIsExecuting
//   } = useWorkflow();

//   const [apiClient] = useState(() => new WorkflowApiClient('/api/workflows'));
//   const [showTemplates, setShowTemplates] = useState(false);
//   const [showNodePalette, setShowNodePalette] = useState(false);
//   const [executionResults, setExecutionResults] = useState<any>(null);
//   const [validationErrors, setValidationErrors] = useState<string[]>([]);

//   // Auto-validate workflow when it changes
//   useEffect(() => {
//     const validation = validateWorkflow();
//     setValidationErrors(validation.errors);
//   }, [nodes, edges, validateWorkflow]);

//   // Save workflow to backend
//   const handleSaveWorkflow = async () => {
//     try {
//       const workflowData = getWorkflowExecutionData();
//       const result = await apiClient.saveWorkflow(workflowData);
//       console.log('Workflow saved:', result);
//       // Show success notification
//     } catch (error) {
//       console.error('Failed to save workflow:', error);
//       // Show error notification
//     }
//   };

//   // Load workflow from backend
//   const handleLoadWorkflow = async (workflowId: string) => {
//     try {
//       const workflowData = await apiClient.loadWorkflow(workflowId);
//       loadWorkflow(workflowData);
//       console.log('Workflow loaded successfully');
//     } catch (error) {
//       console.error('Failed to load workflow:', error);
//     }
//   };

//   // Execute workflow
//   const handleExecuteWorkflow = async () => {
//     if (validationErrors.length > 0) {
//       alert('Cannot execute workflow with validation errors');
//       return;
//     }

//     setIsExecuting(true);
//     try {
//       const workflowData = getWorkflowExecutionData();
      
//       // For demonstration, use the mock execution
//       const results = await WorkflowUtils.simulateExecution(
//         workflowData,
//         (nodeId, status, result) => {
//           console.log(`Node ${nodeId}: ${status}`, result);
//           // Update node execution state in real-time
//         }
//       );
      
//       setExecutionResults(results);
//       console.log('Execution completed:', results);
//     } catch (error) {
//       console.error('Execution failed:', error);
//     } finally {
//       setIsExecuting(false);
//     }
//   };

//   // Load template
//   const handleLoadTemplate = (templateId: string) => {
//     const template = WorkflowTemplateManager.loadTemplate(templateId);
//     if (template) {
//       loadWorkflow(template);
//       setShowTemplates(false);
//     }
//   };

//   // Export workflow
//   const handleExportWorkflow = () => {
//     const workflowData = getWorkflowExecutionData();
//     WorkflowUtils.exportToFile(workflowData);
//   };

//   // Import workflow
//   const handleImportWorkflow = async () => {
//     try {
//       const workflowData = await WorkflowUtils.importFromFile();
//       loadWorkflow(workflowData);
//     } catch (error) {
//       console.error('Import failed:', error);
//       alert('Failed to import workflow');
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col bg-black">
//       {/* Toolbar */}
//       <div className="bg-black/90 backdrop-blur border-b border-white/10 p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <h1 className="text-xl font-bold text-white">{workflowMetadata.name}</h1>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setShowTemplates(true)}
//                 className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm"
//               >
//                 Templates
//               </button>
//               <button
//                 onClick={() => setShowNodePalette(true)}
//                 className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
//               >
//                 Add Nodes
//               </button>
//               <button
//                 onClick={handleSaveWorkflow}
//                 className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={handleExportWorkflow}
//                 className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
//               >
//                 Export
//               </button>
//               <button
//                 onClick={handleImportWorkflow}
//                 className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm"
//               >
//                 Import
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             {validationErrors.length > 0 && (
//               <div className="text-red-400 text-sm">
//                 {validationErrors.length} validation errors
//               </div>
//             )}
//             <button
//               onClick={handleExecuteWorkflow}
//               disabled={isExecuting || validationErrors.length > 0}
//               className={`px-4 py-2 rounded text-sm font-medium ${
//                 isExecuting || validationErrors.length > 0
//                   ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//                   : 'bg-green-600 hover:bg-green-700 text-white'
//               }`}
//             >
//               {isExecuting ? 'Executing...' : 'Execute Workflow'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex">
//         {/* Canvas */}
//         <div className="flex-1">
//           <EnhancedCanvasDropZone />
//         </div>

//         {/* Properties Panel */}
//         <EnhancedPropertiesPanel />
//       </div>

//       {/* Node Palette Modal */}
//       <EnhancedNodePalette 
//         isOpen={showNodePalette}
//         onClose={() => setShowNodePalette(false)}
//       />

//       {/* Template Modal */}
//       {showTemplates && (
//         <TemplateModal
//           onClose={() => setShowTemplates(false)}
//           onSelectTemplate={handleLoadTemplate}
//         />
//       )}

//       {/* Execution Results Modal */}
//       {executionResults && (
//         <ExecutionResultsModal
//           results={executionResults}
//           onClose={() => setExecutionResults(null)}
//         />
//       )}
//     </div>
//   );
// };

// // 2. TEMPLATE SELECTION MODAL
// const TemplateModal: React.FC<{
//   onClose: () => void;
//   onSelectTemplate: (templateId: string) => void;
// }> = ({ onClose, onSelectTemplate }) => {
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');

//   const filteredTemplates = workflowTemplates.filter(template => {
//     const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
//     const matchesSearch = !searchQuery || 
//       template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
//     return matchesCategory && matchesSearch;
//   });

//   const categories = ['All', ...Array.from(new Set(workflowTemplates.map(t => t.category)))];

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur z-50 flex items-center justify-center">
//       <div className="bg-black/90 border border-white/10 rounded-lg w-4/5 h-4/5 flex flex-col">
//         <div className="p-6 border-b border-white/10">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-2xl font-bold text-white">Workflow Templates</h2>
//             <button
//               onClick={onClose}
//               className="text-white/60 hover:text-white p-2"
//             >
//               ✕
//             </button>
//           </div>

//           <div className="flex items-center space-x-4">
//             <input
//               type="text"
//               placeholder="Search templates..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded text-white"
//             />
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="px-4 py-2 bg-black/40 border border-white/10 rounded text-white"
//             >
//               {categories.map(category => (
//                 <option key={category} value={category}>{category}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredTemplates.map(template => (
//               <div
//                 key={template.id}
//                 className="bg-black/60 border border-white/10 rounded-lg p-6 cursor-pointer hover:border-cyan-400/50 transition-all"
//                 onClick={() => onSelectTemplate(template.id)}
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-white">{template.name}</h3>
//                   <span className={`text-xs px-2 py-1 rounded ${
//                     template.difficulty === 'beginner' ? 'bg-green-600/20 text-green-400' :
//                     template.difficulty === 'intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
//                     'bg-red-600/20 text-red-400'
//                   }`}>
//                     {template.difficulty}
//                   </span>
//                 </div>
                
//                 <p className="text-white/70 text-sm mb-4">{template.description}</p>
                
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs text-white/50">{template.estimatedTime}</span>
//                   <div className="flex space-x-1">
//                     {template.tags.slice(0, 3).map(tag => (
//                       <span key={tag} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // 3. EXECUTION RESULTS MODAL
// const ExecutionResultsModal: React.FC<{
//   results: any;
//   onClose: () => void;
// }> = ({ results, onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur z-50 flex items-center justify-center">
//       <div className="bg-black/90 border border-white/10 rounded-lg w-3/4 h-3/4 flex flex-col">
//         <div className="p-6 border-b border-white/10">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-bold text-white">Execution Results</h2>
//             <button
//               onClick={onClose}
//               className="text-white/60 hover:text-white p-2"
//             >
//               ✕
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6">
//           <div className="space-y-6">
//             <div className="flex items-center space-x-4">
//               <div className={`w-4 h-4 rounded-full ${
//                 results.success ? 'bg-green-400' : 'bg-red-400'
//               }`} />
//               <span className="text-white font-semibold">
//                 {results.success ? 'Execution Successful' : 'Execution Failed'}
//               </span>
//             </div>

//             {results.errors.length > 0 && (
//               <div>
//                 <h3 className="text-lg font-semibold text-red-400 mb-2">Errors</h3>
//                 <div className="space-y-2">
//                   {results.errors.map((error: string, index: number) => (
//                     <div key={index} className="bg-red-600/20 border border-red-600/30 rounded p-3">
//                       <span className="text-red-400">{error}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div>
//               <h3 className="text-lg font-semibold text-white mb-2">Node Results</h3>
//               <div className="space-y-3">
//                 {Object.entries(results.results).map(([nodeId, result]) => (
//                   <div key={nodeId} className="bg-white/5 border border-white/10 rounded p-4">
//                     <div className="font-semibold text-white mb-2">{nodeId}</div>
//                     <pre className="text-sm text-white/70 overflow-x-auto">
//                       {JSON.stringify(result, null, 2)}
//                     </pre>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // 4. BACKEND API INTEGRATION EXAMPLE
// class WorkflowBackendService {
//   private apiClient: WorkflowApiClient;

//   constructor(baseUrl: string, token?: string) {
//     this.apiClient = new WorkflowApiClient(baseUrl, token);
//   }

//   // Save workflow with error handling
//   async saveWorkflow(workflow: any): Promise<{ success: boolean; id?: string; error?: string }> {
//     try {
//       const result = await this.apiClient.saveWorkflow(workflow);
//       return { success: true, id: result.id };
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error instanceof Error ? error.message : 'Unknown error' 
//       };
//     }
//   }

//   // Execute workflow with progress tracking
//   async executeWorkflow(workflowId: string, input?: any): Promise<{
//     success: boolean;
//     executionId?: string;
//     error?: string;
//   }> {
//     try {
//       const result = await this.apiClient.executeWorkflow(workflowId, input);
//       return { success: true, executionId: result.executionId };
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error instanceof Error ? error.message : 'Unknown error' 
//       };
//     }
//   }

//   // Monitor execution progress
//   async monitorExecution(executionId: string, onProgress: (status: any) => void): Promise<any> {
//     const pollInterval = 1000; // 1 second
//     const maxAttempts = 300; // 5 minutes max
//     let attempts = 0;

//     return new Promise((resolve, reject) => {
//       const poll = async () => {
//         try {
//           const status = await this.apiClient.getExecutionStatus(executionId);
//           onProgress(status);

//           if (status.status === 'completed' || status.status === 'failed') {
//             resolve(status);
//             return;
//           }

//           attempts++;
//           if (attempts >= maxAttempts) {
//             reject(new Error('Execution monitoring timed out'));
//             return;
//           }

//           setTimeout(poll, pollInterval);
//         } catch (error) {
//           reject(error);
//         }
//       };

//       poll();
//     });
//   }
// }

// // 5. REACT HOOK FOR WORKFLOW MANAGEMENT
// export const useWorkflowManager = () => {
//   const workflow = useWorkflow();
//   const [backendService] = useState(() => 
//     new WorkflowBackendService('/api/workflows', localStorage.getItem('auth_token') || undefined)
//   );

//   const saveToBackend = async () => {
//     const workflowData = workflow.getWorkflowExecutionData();
//     return await backendService.saveWorkflow(workflowData);
//   };

//   const executeOnBackend = async (input?: any) => {
//     // First save the workflow
//     const saveResult = await saveToBackend();
//     if (!saveResult.success || !saveResult.id) {
//       throw new Error(saveResult.error || 'Failed to save workflow');
//     }

//     // Then execute it
//     const executeResult = await backendService.executeWorkflow(saveResult.id, input);
//     if (!executeResult.success || !executeResult.executionId) {
//       throw new Error(executeResult.error || 'Failed to start execution');
//     }

//     // Monitor progress
//     return await backendService.monitorExecution(
//       executeResult.executionId,
//       (status) => {
//         console.log('Execution progress:', status);
//         // Update UI with progress
//       }
//     );
//   };

//   return {
//     ...workflow,
//     saveToBackend,
//     executeOnBackend,
//   };
// };

// // 6. USAGE EXAMPLE IN YOUR APP
// export const ExampleApp: React.FC = () => {
//   return (
//     <div className="app">
//       {/* Your existing layout */}
//       <CompleteWorkflowEditor />
//     </div>
//   );
// };

// export default CompleteWorkflowEditor;

// /*
// INTEGRATION STEPS:

// 1. Replace your existing flow page:
//    ```tsx
//    // In src/app/flow/page.tsx
//    import { WorkflowProvider } from './workflow-state-provider';
//    import { DragProvider } from '@/provider/dragprovider';
//    import CompleteWorkflowEditor from './complete-integration-guide';
   
//    export default function FlowPage() {
//      return (
//        <DragProvider>
//          <WorkflowProvider>
//            <CompleteWorkflowEditor />
//          </WorkflowProvider>
//        </DragProvider>
//      );
//    }
//    ```

// 2. Set up your backend API endpoints:
//    ```
//    POST /api/workflows - Save workflow
//    GET /api/workflows/:id - Load workflow
//    POST /api/workflows/:id/execute - Execute workflow
//    GET /api/executions/:id - Get execution status
//    ```

// 3. Configure environment variables:
//    ```
//    WORKFLOW_API_URL=http://localhost:3001/api
//    WORKFLOW_AUTH_TOKEN=your-auth-token
//    ```

// 4. Use the enhanced hooks:
//    ```tsx
//    import { useWorkflowManager } from './complete-integration-guide';
   
//    function MyComponent() {
//      const { nodes, edges, saveToBackend, executeOnBackend } = useWorkflowManager();
     
//      const handleExecute = async () => {
//        try {
//          const result = await executeOnBackend({ inputData: 'test' });
//          console.log('Execution completed:', result);
//        } catch (error) {
//          console.error('Execution failed:', error);
//        }
//      };
//    }
//    ```

// FEATURES INCLUDED:
// ✅ Complete state management for node configurations
// ✅ Real-time properties panel with validation
// ✅ Backend integration with API client
// ✅ Workflow templates and examples
// ✅ Import/export functionality
// ✅ Execution monitoring and progress tracking
// ✅ Enhanced node palette with search and filtering
// ✅ Workflow validation and error handling
// ✅ Template management system
// ✅ Execution results visualization
// */