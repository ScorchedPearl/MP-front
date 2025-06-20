"use client";
import EnhancedSidebar from "./sidebar"
import { DragProvider } from "@/provider/dragprovider";
import CanvasDropZone from "../testing/_components/drop-zone";
import CollapsibleNodePalette from "../testing/_components/node-pallete";
import PropertiesPanel from "../testing/_components/properties";
export default function Page() {
 return (
  <div className="flex min-h-screen bg-background">
   <EnhancedSidebar />
    <div className="flex-1 flex flex-col">

        <main className="flex-1 h-screen p-4">
          <DragProvider>
  <div className="overflow-hidden  bg-background flex">
   <CanvasDropZone></CanvasDropZone>
  <CollapsibleNodePalette></CollapsibleNodePalette>
  <PropertiesPanel></PropertiesPanel>
  </div>
  </DragProvider>
        </main>
        </div>
  </div>
 );
}