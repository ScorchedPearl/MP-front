"use client";
import { DragProvider } from "@/provider/dragprovider";
import CanvasDropZone from "./_components/drop-zone";
import CollapsibleNodePalette from "./_components/node-pallete";
import PropertiesPanel from "./_components/properties";

export default function Page() {
 return (
  <DragProvider>
  <div className="overflow-hidden h-screen bg-background flex">
   <CanvasDropZone></CanvasDropZone>
  <CollapsibleNodePalette></CollapsibleNodePalette>
  <PropertiesPanel></PropertiesPanel>
  </div>
  </DragProvider>
 );
}