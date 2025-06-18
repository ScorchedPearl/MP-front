import { FloatingAddButton } from './_components/addButton';
import { useDragContext } from '@/provider/dragprovider';
import NodePalettePanel from './_components/nonCollapsiblePannel';

const CollapsibleNodePalette: React.FC = () => {

  const {togglePalette, isPaletteOpen,setIsPaletteOpen} =useDragContext();
  return (
    <div className="h-screen bg-black relative">
      <FloatingAddButton 
        onClick={togglePalette ?? (() => {})}
        isOpen={isPaletteOpen ?? false}
      />
      <NodePalettePanel
        isOpen={isPaletteOpen ?? false}
        onClose={() => setIsPaletteOpen?.(false)}
      />
    </div>
  );
};

export default CollapsibleNodePalette;