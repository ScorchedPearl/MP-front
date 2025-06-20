import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Settings, 
  Save, 
  Plus, 
  Trash2, 
  Copy,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  GripVertical,
  PanelRightClose,
  PanelRightOpen,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useCompatibleWorkflow } from '@/app/flow/_state/statecontext';

// Input Components with validation
const TextInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}> = ({ value, onChange, placeholder, error, required }) => (
  <div className="space-y-1">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3 py-2 bg-black/40 border rounded-sm text-white placeholder-white/40 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm backdrop-blur-sm ${
        error ? 'border-red-400 ring-red-400/20' : 'border-white/10'
      }`}
    />
    {error && (
      <div className="flex items-center space-x-1 text-red-400 text-xs">
        <AlertCircle className="w-3 h-3" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const NumberInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  error?: string;
  required?: boolean;
}> = ({ value, onChange, min, max, error, required }) => (
  <div className="space-y-1">
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      required={required}
      className={`w-full px-3 py-2 bg-black/40 border rounded-sm text-white focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm backdrop-blur-sm ${
        error ? 'border-red-400 ring-red-400/20' : 'border-white/10'
      }`}
    />
    {error && (
      <div className="flex items-center space-x-1 text-red-400 text-xs">
        <AlertCircle className="w-3 h-3" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const SelectInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}> = ({ value, onChange, options, error, required }) => (
  <div className="space-y-1">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={`w-full px-3 py-2 bg-black/40 border rounded-sm text-white focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm backdrop-blur-sm ${
        error ? 'border-red-400 ring-red-400/20' : 'border-white/10'
      }`}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <div className="flex items-center space-x-1 text-red-400 text-xs">
        <AlertCircle className="w-3 h-3" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const CheckboxInput: React.FC<{
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}> = ({ value, onChange, label }) => (
  <label className="flex items-center space-x-3 cursor-pointer group">
    <div className="relative">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div className={`w-4 h-4 border border-white/20 rounded-sm transition-all backdrop-blur-sm ${
        value ? 'bg-cyan-400 border-cyan-400' : 'bg-black/40'
      }`}>
        {value && (
          <CheckCircle className="w-3 h-3 text-black absolute top-0.5 left-0.5" />
        )}
      </div>
    </div>
    <span className="text-sm text-white/70 group-hover:text-white transition-colors">{label}</span>
  </label>
);

const TextAreaInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  required?: boolean;
}> = ({ value, onChange, placeholder, rows = 3, error, required }) => (
  <div className="space-y-1">
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className={`w-full px-3 py-2 bg-black/40 border rounded-sm text-white placeholder-white/40 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm resize-none backdrop-blur-sm ${
        error ? 'border-red-400 ring-red-400/20' : 'border-white/10'
      }`}
    />
    {error && (
      <div className="flex items-center space-x-1 text-red-400 text-xs">
        <AlertCircle className="w-3 h-3" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

// Enhanced field renderer with validation
const FieldRenderer: React.FC<{
  fieldKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
  onDelete?: () => void;
  error?: string;
  fieldSchema?: {
    type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'email' | 'url' | 'password';
    required?: boolean;
    options?: { value: string; label: string }[];
    min?: number;
    max?: number;
    validation?: (value: any) => string | undefined;
  };
}> = ({ fieldKey, value, onChange, onDelete, error, fieldSchema }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderInput = () => {
    if (fieldSchema) {
      switch (fieldSchema.type) {
        case 'number':
          return (
            <NumberInput
              value={value}
              onChange={onChange}
              min={fieldSchema.min}
              max={fieldSchema.max}
              error={error}
              required={fieldSchema.required}
            />
          );
        case 'boolean':
          return (
            <CheckboxInput
              value={value}
              onChange={onChange}
              label={value ? 'Enabled' : 'Disabled'}
            />
          );
        case 'select':
          return (
            <SelectInput
              value={value}
              onChange={onChange}
              options={fieldSchema.options || []}
              error={error}
              required={fieldSchema.required}
            />
          );
        case 'textarea':
          return (
            <TextAreaInput
              value={value}
              onChange={onChange}
              placeholder={`Enter ${fieldKey}...`}
              error={error}
              required={fieldSchema.required}
            />
          );
        case 'email':
          return (
            <input
              type="email"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required={fieldSchema.required}
              className={`w-full px-3 py-2 bg-black/40 border rounded-sm text-white placeholder-white/40 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm backdrop-blur-sm ${
                error ? 'border-red-400 ring-red-400/20' : 'border-white/10'
              }`}
            />
          );
        case 'password':
          return (
            <input
              type="password"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required={fieldSchema.required}
              className={`w-full px-3 py-2 bg-black/40 border rounded-sm text-white placeholder-white/40 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm backdrop-blur-sm ${
                error ? 'border-red-400 ring-red-400/20' : 'border-white/10'
              }`}
            />
          );
        default:
          return (
            <TextInput
              value={value}
              onChange={onChange}
              placeholder={`Enter ${fieldKey}...`}
              error={error}
              required={fieldSchema.required}
            />
          );
      }
    }

    // Fallback to automatic type detection
    if (typeof value === 'boolean') {
      return (
        <CheckboxInput
          value={value}
          onChange={onChange}
          label={value ? 'Enabled' : 'Disabled'}
        />
      );
    }
    
    if (typeof value === 'number') {
      return (
        <NumberInput
          value={value}
          onChange={onChange}
          error={error}
        />
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-sm text-white/60 hover:text-cyan-400 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span>{isExpanded ? 'Collapse' : 'Expand'} object</span>
          </button>
          {isExpanded && (
            <pre className="text-xs text-white/70 bg-black/40 p-2 rounded border border-white/10">
              {JSON.stringify(value, null, 2)}
            </pre>
          )}
        </div>
      );
    }
    
    if (typeof value === 'string' && value.length > 50) {
      return (
        <TextAreaInput
          value={value}
          onChange={onChange}
          placeholder={`Enter ${fieldKey}...`}
          error={error}
        />
      );
    }
    
    return (
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={`Enter ${fieldKey}...`}
        error={error}
      />
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-white/80 capitalize">
          {fieldKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
          {fieldSchema?.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-sm transition-all"
            title="Delete field"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
      {renderInput()}
    </div>
  );
};

// Main Enhanced Properties Panel
export const CompatiblePropertiesPanel: React.FC = () => {
  const { selectedNodeId, enhancedNodes, updateNodeConfiguration, updateNodeData } = useCompatibleWorkflow();
  const [localConfiguration, setLocalConfiguration] = useState<Record<string, any>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const selectedNode = selectedNodeId ? enhancedNodes.find(n => n.id === selectedNodeId) : null;

  // Sync local configuration with selected node
  useEffect(() => {
    if (selectedNode) {
      setLocalConfiguration({ ...selectedNode.data.configuration });
      setHasUnsavedChanges(false);
    }
  }, [selectedNode]);

  // Configuration change handler
  const handleConfigurationChange = (key: string, value: any) => {
    const newConfig = { ...localConfiguration, [key]: value };
    setLocalConfiguration(newConfig);
    setHasUnsavedChanges(true);
  };

  // Save configuration
  const handleSave = () => {
    if (!selectedNode) return;
    updateNodeConfiguration(selectedNode.id, localConfiguration);
    setHasUnsavedChanges(false);
  };

  // Reset configuration
  const handleReset = () => {
    if (selectedNode) {
      setLocalConfiguration({ ...selectedNode.data.configuration });
      setHasUnsavedChanges(false);
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 h-screen flex items-center justify-center">
        <div className="text-center text-white/40">
          <div className="text-6xl mb-4">⚙️</div>
          <p className="text-sm">Select a node to edit its properties</p>
        </div>
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-black/80 backdrop-blur-xl border-l border-white/10 h-screen flex flex-col items-center justify-center">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-white/40 hover:text-white"
          title="Expand panel"
        >
          ▶️
        </button>
        {hasUnsavedChanges && (
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mt-2" />
        )}
      </div>
    );
  }

  return (
    <div className="w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400/20 to-white/10 rounded border border-white/10 flex items-center justify-center">
              <span className="text-lg">{selectedNode.data.icon}</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">{selectedNode.data.label}</h3>
              <p className="text-sm text-white/60 capitalize">{selectedNode.data.nodeType}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" title="Unsaved changes" />
            )}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 text-white/40 hover:text-white"
              title="Collapse panel"
            >
              ◀️
            </button>
          </div>
        </div>
      </div>

      {/* Node Info */}
      <div className="p-6 border-b border-white/10">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Node Label</label>
            <input
              type="text"
              value={selectedNode.data.label}
              onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white placeholder-white/40 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
            <textarea
              value={selectedNode.data.description || ''}
              onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white placeholder-white/40 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm resize-none"
            />
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="flex-1 overflow-y-auto p-6">
        <h4 className="font-medium text-white mb-4">Configuration</h4>
        
        <div className="space-y-4">
          {Object.entries(localConfiguration).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-white/80 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
              </label>
              {typeof value === 'boolean' ? (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleConfigurationChange(key, e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-white/70">{value ? 'Enabled' : 'Disabled'}</span>
                </label>
              ) : typeof value === 'number' ? (
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleConfigurationChange(key, Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm"
                />
              ) : (
                <input
                  type="text"
                  value={String(value)}
                  onChange={(e) => handleConfigurationChange(key, e.target.value)}
                  placeholder={`Enter ${key}...`}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white placeholder-white/40 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm"
                />
              )}
            </div>
          ))}

          {/* Add new field */}
          <button
            onClick={() => {
              const fieldName = prompt('Enter field name:');
              if (fieldName && !localConfiguration.hasOwnProperty(fieldName)) {
                handleConfigurationChange(fieldName, '');
              }
            }}
            className="w-full p-3 border-2 border-dashed border-white/20 rounded text-white/60 hover:text-cyan-400 hover:border-cyan-400/50 transition-all text-sm"
          >
            + Add Configuration Field
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`flex-1 py-3 px-4 rounded text-sm font-medium transition-all ${
              hasUnsavedChanges
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            Save Changes
          </button>
          
          <button
            onClick={handleReset}
            disabled={!hasUnsavedChanges}
            className={`px-4 py-3 rounded text-sm font-medium transition-all ${
              hasUnsavedChanges
                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            Reset
          </button>
        </div>

        <div className="mt-3 text-xs text-center">
          {hasUnsavedChanges ? (
            <span className="text-cyan-400">● Unsaved changes</span>
          ) : (
            <span className="text-white/40">✓ All changes saved</span>
          )}
        </div>
      </div>
    </div>
  );
};