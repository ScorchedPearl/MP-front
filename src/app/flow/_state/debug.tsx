import { useDragContext } from "@/provider/dragprovider";

export const NodeTemplateDebugger: React.FC = () => {
  const { categories, filteredTemplates, selectedCategory, setSelectedCategory } = useDragContext();
  
  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded border border-white/20 z-50 max-w-md">
      <h3 className="font-bold mb-2">Node Template Debug</h3>
      <div className="text-sm space-y-1">
        <div>Categories: {categories?.length || 0}</div>
        <div>Templates: {filteredTemplates?.length || 0}</div>
        <div>Selected: {selectedCategory}</div>
        <div>Categories: {categories?.join(', ') || 'None'}</div>
      </div>
      
      <div className="mt-2">
        <label className="block text-xs mb-1">Test Category Change:</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory?.(e.target.value)}
          className="w-full bg-black border border-white/20 text-white p-1 text-xs"
        >
          {categories?.map((cat: string) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      {filteredTemplates && filteredTemplates.length > 0 && (
        <div className="mt-2">
          <div className="text-xs font-bold">Available Templates:</div>
          <div className="text-xs max-h-20 overflow-y-auto">
            {filteredTemplates.map((template: any, index: number) => (
              <div key={index}>{template.label || template.type}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};