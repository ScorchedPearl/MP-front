"use client";
import { FixedDragProvider } from "@/provider/dragprovider";
import CanvasDropZone from "./_components/drop-zone";
import CollapsibleNodePalette from "./_components/node-pallete";
import { CompatiblePropertiesPanel } from "./_components/properties";
import { CompatibleWorkflowProvider } from "../flow/_state/statecontext";

export default function Page() {
 return (
  <CompatibleWorkflowProvider>
  <FixedDragProvider>
  <div className="overflow-hidden h-screen bg-background flex">
   <CanvasDropZone></CanvasDropZone>
  <CollapsibleNodePalette></CollapsibleNodePalette>
  <CompatiblePropertiesPanel></CompatiblePropertiesPanel>
  </div>
  </FixedDragProvider>
  </CompatibleWorkflowProvider>
 );
}