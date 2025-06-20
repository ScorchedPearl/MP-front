"use client";
import { FixedDragProvider } from '@/provider/dragprovider';
// import { DragProvider } from "@/provider/dragprovider";
// import { WorkflowProvider } from "./_state/statecontext";
// import EnhancedCanvasDropZone from "../testing/_components/drop-zone";
// import CollapsibleNodePalette from "../testing/_components/node-pallete";
// import EnhancedPropertiesPanel from "../testing/_components/properties";
// import EnhancedSidebar from "./sidebar";

// // Enhanced Flow Page that integrates all the new components
// export default function EnhancedFlowPage() {
//   return (
//     <div className="flex min-h-screen bg-background">
//       <EnhancedSidebar />
//       <div className="flex-1 flex flex-col">
//         <main className="flex-1 h-screen">
//           {/* Wrap everything in both providers for compatibility */}
//           <DragProvider>
//             <WorkflowProvider>
//               <div className="overflow-hidden bg-background flex h-full">
//                 {/* Main Canvas - now with enhanced state management */}
//                 <EnhancedCanvasDropZone />
                
//                 {/* Node Palette - existing component, still works */}
//                 <CollapsibleNodePalette />
                
//                 {/* Enhanced Properties Panel - now integrated with workflow state */}
//                 <EnhancedPropertiesPanel />
//               </div>
//             </WorkflowProvider>
//           </DragProvider>
//         </main>
//       </div>
//     </div>
//   );
// }

// // Workflow Management Hook for External Use
// export { useWorkflow, WorkflowProvider } from "./_state/statecontext"

// // Types for backend integration
// export type { 
//   WorkflowNode, 
//   WorkflowExecutionData 
// } from "./_state/statecontext"

// /*
// USAGE INSTRUCTIONS:

// 1. Replace your existing flow page with this enhanced version:
   
//    // In src/app/flow/page.tsx
//    import EnhancedFlowPage from './enhanced-flow-page';
//    export default EnhancedFlowPage;

// 2. For backend integration, use the workflow data:

//    import { useWorkflow } from './enhanced-flow-page';
   
//    function MyComponent() {
//      const { getWorkflowExecutionData, loadWorkflow } = useWorkflow();
     
//      const saveToBackend = async () => {
//        const workflowData = getWorkflowExecutionData();
//        await fetch('/api/workflows', {
//          method: 'POST',
//          body: JSON.stringify(workflowData),
//          headers: { 'Content-Type': 'application/json' }
//        });
//      };
     
//      const loadFromBackend = async (workflowId: string) => {
//        const response = await fetch(`/api/workflows/${workflowId}`);
//        const workflowData = await response.json();
//        loadWorkflow(workflowData);
//      };
//    }

// 3. The workflow execution data structure sent to backend:
//    {
//      nodes: [
//        {
//          id: "node-1",
//          type: "trigger",
//          configuration: { url: "https://api.example.com", method: "POST" },
//          position: { x: 100, y: 200 }
//        }
//      ],
//      edges: [
//        {
//          id: "edge-1",
//          source: "node-1",
//          target: "node-2",
//          sourceHandle: "output",
//          targetHandle: "input"
//        }
//      ],
//      metadata: {
//        name: "My Workflow",
//        description: "Example workflow",
//        version: "1.0.0",
//        created: "2024-01-01T00:00:00Z",
//        lastModified: "2024-01-01T00:00:00Z"
//      }
//    }

// 4. Key improvements:
//    - Proper state management for node configurations
//    - Real-time property editing with validation
//    - Backend-ready data structure
//    - Execution state tracking
//    - Workflow validation
//    - Better visual feedback
//    - Enhanced node components with execution states
// */



import CanvasDropZone from '../testing/_components/drop-zone';
import FixedCollapsibleNodePalette from '../testing/_components/node-pallete';
   import { CompatiblePropertiesPanel } from '../testing/_components/properties';
import { CompatibleWorkflowProvider } from './_state/statecontext';
   export const SimpleWorkingFlowPage: React.FC = () => {
  return (
      <CompatibleWorkflowProvider>
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 h-screen p-4">
          <FixedDragProvider>
            <div className="overflow-hidden bg-background flex">
              {/* Your existing canvas */}
              <CanvasDropZone />
              
              {/* Fixed node palette */}
              <FixedCollapsibleNodePalette />
              
              {/* Debug component - remove this after testing */}
              <CompatiblePropertiesPanel />
            </div>
          </FixedDragProvider>
        </main>
      </div>
    </div>
    </CompatibleWorkflowProvider>
  );
};
export default SimpleWorkingFlowPage;