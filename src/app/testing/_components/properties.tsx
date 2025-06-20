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
  PanelRightOpen
} from 'lucide-react';
import { useDragContext } from '@/provider/dragprovider';
import { NodeTemplate } from '@/lib/mockdata';


const TextInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-white placeholder-white/40 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm backdrop-blur-sm"
  />
);

const NumberInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}> = ({ value, onChange, min, max }) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    min={min}
    max={max}
    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-white focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm backdrop-blur-sm"
  />
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
      <div className={`w-4 h-4 border border-white/20 rounded-sm transition-all backdrop-blur-sm ${value ? 'bg-cyan-400 border-cyan-400' : 'bg-black/40'}`}>
        {value && (
          <svg className="w-3 h-3 text-black absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
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
}> = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-white placeholder-white/40 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm resize-none backdrop-blur-sm"
  />
);

const JsonEditor: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
}> = ({ value, onChange }) => {
  const [jsonText, setJsonText] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setJsonText(JSON.stringify(value, null, 2));
  }, [value]);

  const handleChange = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      setIsValid(true);
      onChange(parsed);
    } catch (error) {
      setIsValid(false);
      console.log(error);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={jsonText}
        onChange={(e) => handleChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-sm focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 text-xs font-mono resize-none backdrop-blur-sm transition-all ${
          isValid ? 'bg-black/40 border-white/10 text-white' : 'bg-red-900/20 border-red-400/50 text-red-300'
        }`}
        rows={6}
      />
      {!isValid && (
        <div className="flex items-center space-x-2 text-red-400 text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>Invalid JSON format</span>
        </div>
      )}
    </div>
  );
};

// Dynamic Field Renderer
const FieldRenderer: React.FC<{
  fieldKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
  onDelete?: () => void;
}> = ({ fieldKey, value, onChange, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderInput = () => {
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
            <JsonEditor value={value} onChange={onChange} />
          )}
        </div>
      );
    }
    
    // String input with smart detection
    if (fieldKey.toLowerCase().includes('email')) {
      return (
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-white placeholder-white/40 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm backdrop-blur-sm"
        />
      );
    }
    
    if (fieldKey.toLowerCase().includes('url')) {
      return (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-white placeholder-white/40 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm backdrop-blur-sm"
        />
      );
    }
    
    if (fieldKey.toLowerCase().includes('password') || fieldKey.toLowerCase().includes('token')) {
      return (
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-white placeholder-white/40 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-sm backdrop-blur-sm"
        />
      );
    }
    
    if (typeof value === 'string' && value.length > 50) {
      return (
        <TextAreaInput
          value={value}
          onChange={onChange}
          placeholder={`Enter ${fieldKey}...`}
        />
      );
    }
    
    return (
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={`Enter ${fieldKey}...`}
      />
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-white/80 capitalize">
          {fieldKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
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

// Main Properties Panel Component
const PropertiesPanel: React.FC = () => {
  const { clickedItem } = useDragContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [config, setConfig] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NodeTemplate|null|undefined>(clickedItem);
  const [panelWidth, setPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clickedItem) {
      setConfig(clickedItem.defaultConfig || {});
      setHasChanges(false);
      setSelectedNode(clickedItem);
    }
  }, [clickedItem]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isCollapsed) return;
    e.preventDefault();
    setIsResizing(true);
  }, [isCollapsed]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || isCollapsed) return;
    
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 280 && newWidth <= 600) {
      setPanelWidth(newWidth);
    }
  }, [isResizing, isCollapsed]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    setHasChanges(true);
  };

  const handleDeleteField = (key: string) => {
    const newConfig = { ...config };
    delete newConfig[key];
    setConfig(newConfig);
    setHasChanges(true);
  };

  const handleAddField = () => {
    const fieldName = prompt('Enter field name:');
    if (fieldName && !config.hasOwnProperty(fieldName)) {
      handleConfigChange(fieldName, '');
    }
  };

  const handleSave = () => {
    if (selectedNode) {
      setHasChanges(false);
      alert('Configuration saved successfully!');
    }
  };

  const handleReset = () => {
    if (selectedNode) {
      setConfig(selectedNode.defaultConfig || {});
      setHasChanges(false);
    }
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    alert('Configuration copied to clipboard!');
  };

  if (!selectedNode) {
    return (
      <div 
        ref={panelRef}
        style={{ width: isCollapsed ? 48 : panelWidth }}
        className={`bg-black/80 backdrop-blur-xl border-l border-white/10 h-screen relative transition-all duration-300 ${
          isCollapsed ? 'overflow-hidden' : ''
        }`}
      >
        {/* Resize Handle */}
        {!isCollapsed && (
          <div
            onMouseDown={handleMouseDown}
            className="absolute left-0 top-0 w-1 h-full cursor-ew-resize bg-white/10 hover:bg-cyan-400/50 transition-colors group"
          >
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-white/60" />
            </div>
          </div>
        )}

        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-sm transition-all z-10"
          title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {isCollapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
        </button>

        {isCollapsed ? (
          <div className="p-3 text-center">
            <Settings className="w-6 h-6 mx-auto text-white/40" />
          </div>
        ) : (
          <div className="p-6 pt-16">
            <div className="text-center text-white/40">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Select a node to configure</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={panelRef}
      style={{ width: isCollapsed ? 48 : panelWidth }}
      className={`bg-black/80 backdrop-blur-xl border-l border-white/10 h-screen flex flex-col relative transition-all duration-300 ${
        isCollapsed ? 'overflow-hidden' : ''
      }`}
    >
      {/* Resize Handle */}
      {!isCollapsed && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute left-0 top-0 w-1 h-full cursor-ew-resize bg-white/10 hover:bg-cyan-400/50 transition-colors group z-10"
        >
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-3 h-3 text-white/60" />
          </div>
        </div>
      )}

      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 right-6 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-sm transition-all z-10"
        title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
      >
        {isCollapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
      </button>

      {isCollapsed ? (
        <div className="p-3 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-400/20 to-white/10 rounded-sm backdrop-blur-sm border border-white/10 mx-auto">
            <span className="text-lg">{selectedNode.icon}</span>
          </div>
          {hasChanges && (
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mx-auto mt-2" title="Unsaved changes" />
          )}
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="p-6 pt-16 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-400/20 to-white/10 rounded-sm backdrop-blur-sm border border-white/10">
                  <span className="text-lg">{selectedNode.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">Properties</h3>
                  <p className="text-sm text-white/60 capitalize">{selectedNode.type}</p>
                </div>
              </div>
              {hasChanges && (
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" title="Unsaved changes" />
              )}
            </div>
          </div>

          {/* Node Basic Info */}
          <div className="p-6 border-b border-white/10">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Node Label</label>
                <TextInput
                  value={selectedNode.label}
                  onChange={(value) => {
                    console.log('Update label:', value);
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                <TextAreaInput
                  value={selectedNode.description || ''}
                  onChange={(value) => {
                    console.log('Update description:', value);
                  }}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-medium text-white">Configuration</h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyConfig}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-sm transition-all"
                    title="Copy configuration"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-sm transition-all"
                    title="Toggle advanced view"
                  >
                    {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(config).map(([key, value]) => (
                  <FieldRenderer
                    key={key}
                    fieldKey={key}
                    value={value}
                    onChange={(newValue) => handleConfigChange(key, newValue)}
                    onDelete={() => handleDeleteField(key)}
                  />
                ))}

                {/* Add Field Button */}
                <button
                  onClick={handleAddField}
                  className="flex items-center space-x-3 w-full p-4 border-2 border-dashed border-white/20 rounded-sm hover:border-cyan-400/50 hover:bg-white/5 transition-all text-white/60 hover:text-cyan-400 backdrop-blur-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Field</span>
                </button>
              </div>

              {/* Advanced JSON View */}
              {showAdvanced && (
                <div className="mt-8 p-4 bg-white/5 rounded-sm backdrop-blur-sm border border-white/10">
                  <h5 className="text-sm font-medium text-white/70 mb-3">Raw Configuration</h5>
                  <JsonEditor value={config} onChange={setConfig} />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-white/10 bg-gradient-to-t from-white/5 to-transparent">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-sm text-sm font-medium transition-all backdrop-blur-sm ${
                  hasChanges
                    ? 'bg-white text-black hover:bg-white/90 shadow-lg'
                    : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              
              <button
                onClick={handleReset}
                disabled={!hasChanges}
                className={`px-4 py-3 rounded-sm text-sm font-medium transition-all backdrop-blur-sm ${
                  hasChanges
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                }`}
              >
                Reset
              </button>
            </div>

            {/* Status */}
            <div className="mt-3 text-xs text-center">
              {hasChanges ? (
                <span className="text-cyan-400">● Unsaved changes</span>
              ) : (
                <span className="text-white/40">✓ All changes saved</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertiesPanel;