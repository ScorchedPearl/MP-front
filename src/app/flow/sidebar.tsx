"use client"

import { AppSidebar } from "./_sidebar/app-sidebar"
import { ResizableSidebar } from "./_sidebar/resizable-sidebar"

export default function Page() {
  return (
    <div className="flex max-h-screen bg-background overflow-auto">
      <ResizableSidebar defaultWidth={280} minWidth={280} maxWidth={480}>
      <div className="h-full overflow-auto">
        <AppSidebar />
      </div>
      </ResizableSidebar>
    </div>
  )
}