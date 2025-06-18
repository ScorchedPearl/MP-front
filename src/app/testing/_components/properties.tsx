// import React, { useState, useEffect } from 'react';
// import { 
//   Settings, 
//   Save, 
//   X, 
//   Plus, 
//   Trash2, 
//   Copy,
//   Eye,
//   EyeOff,
//   ChevronDown,
//   ChevronRight,
//   AlertCircle
// } from 'lucide-react';

// // Types
// interface WorkflowNodeData {
//   label: string;
//   nodeType: 'trigger' | 'action' | 'condition' | 'transform';
//   icon: React.ReactNode;
//   config: Record<string, any>;
//   inputs?: Array<{ id: string; type: string; required: boolean }>;
//   outputs?: Array<{ id: string; type: string }>;
//   description?: string;
// }

// interface MockNode {
//   id: string;
//   data: WorkflowNodeData;
// }

// // Mock data for testing
// const mockNodes: MockNode[] = [
//   {
//     id: 'node-1',
//     data: {
//       label: 'HTTP Request',
//       nodeType: 'action',
//       icon: '🌐',
//       description: 'Make HTTP requests to external APIs',
//       config: {
//         method: 'GET',
//         url: 'https://api.example.com/data',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer token123'
//         },
//         timeout: 5000,
//         retries: 3,
//         enabled: true
//       },
//       inputs: [{ id: 'input', type: 'data', required: false }],
//       outputs: [{ id: 'output', type: 'data' }]
//     }
//   },
//   {
//     id: 'node-2', 
//     data: {
//       label: 'Send Email',
//       nodeType: 'action',
//       icon: '📧',
//       description: 'Send emails via SMTP',
//       config: {
//         to: 'user@example.com',
//         subject: 'Workflow Notification',
//         body: 'Hello from workflow!',
//         smtp: {
//           host: 'smtp.gmail.com',
//           port: 587,
//           secure: false
//         }
//       },
//       inputs: [{ id: 'input', type: 'data', required: true }],
//       outputs: [{ id: 'output', type: 'data' }]
//     }
//   }
// ];

// // Field Editor Components
// const TextInput: React.FC<{
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }> = ({ value, onChange, placeholder }) => (
//   <input
//     type="text"
//     value={value}
//     onChange={(e) => onChange(e.target.value)}
//     placeholder={placeholder}
//     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//   />
// );

// const NumberInput: React.FC<{
//   value: number;
//   onChange: (value: number) => void;
//   min?: number;
//   max?: number;
// }> = ({ value, onChange, min, max }) => (
//   <input
//     type="number"
//     value={value}
//     onChange={(e) => onChange(Number(e.target.value))}
//     min={min}
//     max={max}
//     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//   />
// );

// const CheckboxInput: React.FC<{
//   value: boolean;
//   onChange: (value: boolean) => void;
//   label: string;
// }> = ({ value, onChange, label }) => (
//   <label className="flex items-center space-x-2 cursor-pointer">
//     <input
//       type="checkbox"
//       checked={value}
//       onChange={(e) => onChange(e.target.checked)}
//       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//     />
//     <span className="text-sm text-gray-700">{label}</span>
//   </label>
// );

// const TextAreaInput: React.FC<{
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   rows?: number;
// }> = ({ value, onChange, placeholder, rows = 3 }) => (
//   <textarea
//     value={value}
//     onChange={(e) => onChange(e.target.value)}
//     placeholder={placeholder}
//     rows={rows}
//     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
//   />
// );

// const JsonEditor: React.FC<{
//   value: any;
//   onChange: (value: any) => void;
// }> = ({ value, onChange }) => {
//   const [jsonText, setJsonText] = useState('');
//   const [isValid, setIsValid] = useState(true);

//   useEffect(() => {
//     setJsonText(JSON.stringify(value, null, 2));
//   }, [value]);

//   const handleChange = (text: string) => {
//     setJsonText(text);
//     try {
//       const parsed = JSON.parse(text);
//       setIsValid(true);
//       onChange(parsed);
//     } catch (error) {
//       setIsValid(false);
//     }
//   };

//   return (
//     <div className="space-y-1">
//       <textarea
//         value={jsonText}
//         onChange={(e) => handleChange(e.target.value)}
//         className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs font-mono resize-none ${
//           isValid ? 'border-gray-300' : 'border-red-300 bg-red-50'
//         }`}
//         rows={6}
//       />
//       {!isValid && (
//         <div className="flex items-center space-x-1 text-red-600 text-xs">
//           <AlertCircle className="w-3 h-3" />
//           <span>Invalid JSON format</span>
//         </div>
//       )}
//     </div>
//   );
// };

// // Dynamic Field Renderer
// const FieldRenderer: React.FC<{
//   fieldKey: string;
//   value: any;
//   onChange: (value: any) => void;
//   onDelete?: () => void;
// }> = ({ fieldKey, value, onChange, onDelete }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const renderInput = () => {
//     if (typeof value === 'boolean') {
//       return (
//         <CheckboxInput
//           value={value}
//           onChange={onChange}
//           label={value ? 'Enabled' : 'Disabled'}
//         />
//       );
//     }
    
//     if (typeof value === 'number') {
//       return (
//         <NumberInput
//           value={value}
//           onChange={onChange}
//         />
//       );
//     }
    
//     if (typeof value === 'object' && value !== null) {
//       return (
//         <div className="space-y-2">
//           <button
//             onClick={() => setIsExpanded(!isExpanded)}
//             className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
//           >
//             {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//             <span>{isExpanded ? 'Collapse' : 'Expand'} object</span>
//           </button>
//           {isExpanded && (
//             <JsonEditor value={value} onChange={onChange} />
//           )}
//         </div>
//       );
//     }
    
//     // String input with smart detection
//     if (fieldKey.toLowerCase().includes('email')) {
//       return (
//         <input
//           type="email"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//         />
//       );
//     }
    
//     if (fieldKey.toLowerCase().includes('url')) {
//       return (
//         <input
//           type="url"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder="https://example.com"
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//         />
//       );
//     }
    
//     if (fieldKey.toLowerCase().includes('password') || fieldKey.toLowerCase().includes('token')) {
//       return (
//         <input
//           type="password"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//         />
//       );
//     }
    
//     if (typeof value === 'string' && value.length > 50) {
//       return (
//         <TextAreaInput
//           value={value}
//           onChange={onChange}
//           placeholder={`Enter ${fieldKey}...`}
//         />
//       );
//     }
    
//     return (
//       <TextInput
//         value={value}
//         onChange={onChange}
//         placeholder={`Enter ${fieldKey}...`}
//       />
//     );
//   };

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <label className="block text-sm font-medium text-gray-700 capitalize">
//           {fieldKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
//         </label>
//         {onDelete && (
//           <button
//             onClick={onDelete}
//             className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
//             title="Delete field"
//           >
//             <Trash2 className="w-3 h-3" />
//           </button>
//         )}
//       </div>
//       {renderInput()}
//     </div>
//   );
// };

// // Main Properties Panel Component
// const PropertiesPanel: React.FC = () => {
//   const [selectedNode, setSelectedNode] = useState<MockNode | null>(mockNodes[0]);
//   const [config, setConfig] = useState<Record<string, any>>({});
//   const [hasChanges, setHasChanges] = useState(false);
//   const [showAdvanced, setShowAdvanced] = useState(false);

//   useEffect(() => {
//     if (selectedNode) {
//       setConfig(selectedNode.data.config || {});
//       setHasChanges(false);
//     }
//   }, [selectedNode]);

//   const handleConfigChange = (key: string, value: any) => {
//     const newConfig = { ...config, [key]: value };
//     setConfig(newConfig);
//     setHasChanges(true);
//   };

//   const handleDeleteField = (key: string) => {
//     const newConfig = { ...config };
//     delete newConfig[key];
//     setConfig(newConfig);
//     setHasChanges(true);
//   };

//   const handleAddField = () => {
//     const fieldName = prompt('Enter field name:');
//     if (fieldName && !config.hasOwnProperty(fieldName)) {
//       handleConfigChange(fieldName, '');
//     }
//   };

//   const handleSave = () => {
//     if (selectedNode) {
//       // In real app, this would update the node
//       console.log('Saving node config:', { nodeId: selectedNode.id, config });
//       setHasChanges(false);
//       alert('Configuration saved successfully!');
//     }
//   };

//   const handleReset = () => {
//     if (selectedNode) {
//       setConfig(selectedNode.data.config || {});
//       setHasChanges(false);
//     }
//   };

//   const handleCopyConfig = () => {
//     navigator.clipboard.writeText(JSON.stringify(config, null, 2));
//     alert('Configuration copied to clipboard!');
//   };

//   if (!selectedNode) {
//     return (
//       <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 h-screen">
//         <div className="text-center text-gray-500 mt-8">
//           <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
//           <p>Select a node to configure</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-80 bg-white border-l border-gray-200 h-screen flex flex-col">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center space-x-2">
//             <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
//               <span className="text-lg">{selectedNode.data.icon}</span>
//             </div>
//             <div>
//               <h3 className="font-semibold text-lg text-gray-800">Properties</h3>
//               <p className="text-sm text-gray-600">{selectedNode.data.nodeType}</p>
//             </div>
//           </div>
//           {hasChanges && (
//             <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" title="Unsaved changes" />
//           )}
//         </div>

//         {/* Node Selector (for testing) */}
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-gray-600">Test Node:</label>
//           <select
//             value={selectedNode.id}
//             onChange={(e) => {
//               const node = mockNodes.find(n => n.id === e.target.value);
//               setSelectedNode(node || null);
//             }}
//             className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
//           >
//             {mockNodes.map(node => (
//               <option key={node.id} value={node.id}>
//                 {node.data.label}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Node Basic Info */}
//       <div className="p-4 border-b border-gray-200">
//         <div className="space-y-3">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Node Label</label>
//             <TextInput
//               value={selectedNode.data.label}
//               onChange={(value) => {
//                 // In real app, update node label
//                 console.log('Update label:', value);
//               }}
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <TextAreaInput
//               value={selectedNode.data.description || ''}
//               onChange={(value) => {
//                 // In real app, update node description
//                 console.log('Update description:', value);
//               }}
//               rows={2}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Configuration */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h4 className="font-medium text-gray-800">Configuration</h4>
//             <div className="flex items-center space-x-1">
//               <button
//                 onClick={handleCopyConfig}
//                 className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
//                 title="Copy configuration"
//               >
//                 <Copy className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => setShowAdvanced(!showAdvanced)}
//                 className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
//                 title="Toggle advanced view"
//               >
//                 {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               </button>
//             </div>
//           </div>

//           <div className="space-y-4">
//             {Object.entries(config).map(([key, value]) => (
//               <FieldRenderer
//                 key={key}
//                 fieldKey={key}
//                 value={value}
//                 onChange={(newValue) => handleConfigChange(key, newValue)}
//                 onDelete={() => handleDeleteField(key)}
//               />
//             ))}

//             {/* Add Field Button */}
//             <button
//               onClick={handleAddField}
//               className="flex items-center space-x-2 w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600"
//             >
//               <Plus className="w-4 h-4" />
//               <span className="text-sm">Add Field</span>
//             </button>
//           </div>

//           {/* Advanced JSON View */}
//           {showAdvanced && (
//             <div className="mt-6 p-3 bg-gray-50 rounded-lg">
//               <h5 className="text-sm font-medium text-gray-700 mb-2">Raw Configuration</h5>
//               <JsonEditor value={config} onChange={setConfig} />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="p-4 border-t border-gray-200 bg-gray-50">
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={handleSave}
//             disabled={!hasChanges}
//             className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
//               hasChanges
//                 ? 'bg-blue-600 text-white hover:bg-blue-700'
//                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             }`}
//           >
//             <Save className="w-4 h-4" />
//             <span>Save</span>
//           </button>
          
//           <button
//             onClick={handleReset}
//             disabled={!hasChanges}
//             className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//               hasChanges
//                 ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//             }`}
//           >
//             Reset
//           </button>
//         </div>

//         {/* Status */}
//         <div className="mt-2 text-xs text-gray-500 text-center">
//           {hasChanges ? (
//             <span className="text-orange-600">● Unsaved changes</span>
//           ) : (
//             <span>✓ All changes saved</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertiesPanel;