// Fixed Properties Panel with proper state management
// src/app/testing/_components/properties.tsx

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Plus, 
  Trash2, 
  RotateCcw,
  AlertCircle
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
          <div className="w-3 h-3 text-black absolute top-0.5 left-0.5 text-xs">✓</div>
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

// Main Properties Panel
export const CompatiblePropertiesPanel: React.FC = () => {
  const { selectedNode, updateNodeConfiguration, updateNodeData } = useCompatibleWorkflow();
  const [localConfiguration, setLocalConfiguration] = useState<Record<string, any>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Debug logging
  console.log('PropertiesPanel render:', {
    selectedNode: selectedNode ? { id: selectedNode.id, label: selectedNode.data.label } : null,
    hasUnsavedChanges,
    localConfigKeys: Object.keys(localConfiguration)
  });

  // Sync local configuration with selected node
  useEffect(() => {
    if (selectedNode) {
      console.log('Syncing configuration for node:', selectedNode.id, selectedNode.data.configuration);
      setLocalConfiguration({ ...selectedNode.data.configuration });
      setHasUnsavedChanges(false);
    } else {
      setLocalConfiguration({});
      setHasUnsavedChanges(false);
    }
  }, [selectedNode]);

  // Configuration change handler
  const handleConfigurationChange = (key: string, value: any) => {
    console.log('Configuration change:', { key, value });
    const newConfig = { ...localConfiguration, [key]: value };
    setLocalConfiguration(newConfig);
    setHasUnsavedChanges(true);
  };

  // Save configuration
  const handleSave = () => {
    if (!selectedNode) return;
    console.log('Saving configuration for node:', selectedNode.id, localConfiguration);
    updateNodeConfiguration(selectedNode.id, localConfiguration);
    setHasUnsavedChanges(false);
  };

  // Reset configuration
  const handleReset = () => {
    if (selectedNode) {
      console.log('Resetting configuration for node:', selectedNode.id);
      setLocalConfiguration({ ...selectedNode.data.configuration });
      setHasUnsavedChanges(false);
    }
  };

  // Add new configuration field
  const handleAddField = () => {
    const fieldName = prompt('Enter field name:');
    if (fieldName && !localConfiguration.hasOwnProperty(fieldName)) {
      handleConfigurationChange(fieldName, '');
    }
  };

  // Delete configuration field
  const handleDeleteField = (key: string) => {
    const newConfig = { ...localConfiguration };
    delete newConfig[key];
    setLocalConfiguration(newConfig);
    setHasUnsavedChanges(true);
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 h-screen flex items-center justify-center">
        <div className="text-center text-white/40 p-6">
          <div className="text-6xl mb-4">⚙️</div>
          <h3 className="text-lg font-semibold mb-2">No Node Selected</h3>
          <p className="text-sm">Click on a node in the canvas to edit its properties</p>
        </div>
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-black/80 backdrop-blur-xl border-l border-white/10 h-screen flex flex-col items-center justify-center">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-white/40 hover:text-white transition-colors"
          title="Expand panel"
        >
          <Settings className="w-5 h-5" />
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
              className="p-2 text-white/40 hover:text-white transition-colors"
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
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-white">Configuration</h4>
          <button
            onClick={handleAddField}
            className="p-1 text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 rounded transition-all"
            title="Add field"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          {Object.entries(localConfiguration).length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No configuration fields</p>
              <button
                onClick={handleAddField}
                className="mt-2 text-cyan-400 hover:text-cyan-300 text-xs"
              >
                Add your first field
              </button>
            </div>
          ) : (
            Object.entries(localConfiguration).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-white/80 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                  </label>
                  <button
                    onClick={() => handleDeleteField(key)}
                    className="p-1 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-sm transition-all"
                    title="Delete field"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                
                {typeof value === 'boolean' ? (
                  <CheckboxInput
                    value={value}
                    onChange={(newValue) => handleConfigurationChange(key, newValue)}
                    label={value ? 'Enabled' : 'Disabled'}
                  />
                ) : typeof value === 'number' ? (
                  <NumberInput
                    value={value}
                    onChange={(newValue) => handleConfigurationChange(key, newValue)}
                  />
                ) : (
                  <TextInput
                    value={String(value)}
                    onChange={(newValue) => handleConfigurationChange(key, newValue)}
                    placeholder={`Enter ${key}...`}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`flex-1 py-3 px-4 rounded text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              hasUnsavedChanges
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          
          <button
            onClick={handleReset}
            disabled={!hasUnsavedChanges}
            className={`px-4 py-3 rounded text-sm font-medium transition-all ${
              hasUnsavedChanges
                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
            title="Reset to saved"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 text-xs text-center">
          {hasUnsavedChanges ? (
            <span className="text-cyan-400 flex items-center justify-center space-x-1">
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
              <span>Unsaved changes</span>
            </span>
          ) : (
            <span className="text-white/40 flex items-center justify-center space-x-1">
              <div className="w-1 h-1 bg-green-400 rounded-full" />
              <span>All changes saved</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};