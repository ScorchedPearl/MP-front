
import { Plus } from "lucide-react";

export function FloatingAddButton({ onClick, isOpen }: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed top-6 left-6 z-50
        w-14 h-14 bg-gray-900 hover:bg-gray-800 border border-gray-700
        text-white rounded-2xl shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-105 active:scale-95 hover:shadow-2xl hover:border-cyan-400
        ${isOpen ? 'rotate-45 bg-gray-800 border-cyan-400' : 'rotate-0'}
      `}
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
