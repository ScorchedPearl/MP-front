
import React from 'react';
import { FloatingAddButton } from './_components/addButton';
import { useDragContext } from '@/provider/dragprovider';
import NodePalettePanel from './_components/nonCollapsiblePannel';

const FixedCollapsibleNodePalette: React.FC = () => {
  const { togglePalette, isPaletteOpen, setIsPaletteOpen } = useDragContext();

  // Debug logging to see what's happening
  console.log('Node Palette State:', {
    isPaletteOpen,
    togglePalette: !!togglePalette,
    setIsPaletteOpen: !!setIsPaletteOpen
  });

  const handleToggle = () => {
    console.log('Toggle clicked, current state:', isPaletteOpen);
    if (togglePalette) {
      togglePalette();
    } else if (setIsPaletteOpen) {
      setIsPaletteOpen(!isPaletteOpen);
    }
  };

  const handleClose = () => {
    console.log('Close clicked');
    if (setIsPaletteOpen) {
      setIsPaletteOpen(false);
    }
  };

  return (
    <div className="h-screen bg-transparent relative">
      <FloatingAddButton 
        onClick={handleToggle}
        isOpen={isPaletteOpen ?? false}
      />
      <NodePalettePanel
        isOpen={isPaletteOpen ?? false}
        onClose={handleClose}
      />
    </div>
  );
};

export default FixedCollapsibleNodePalette;