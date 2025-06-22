"use client"

import {
  HelpCircle,
  Plus,
  Save,
  Settings2,
  Play
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { useSidebar } from "@/provider/sidebarContext";
import { useWorkflow } from "@/provider/statecontext"
import { useState } from "react"
import { serializeWorkflowForBackend } from "@/lib/serializeWorkflowData"
import { createWorkflow, runWorkflow } from "@/lib/api"
import { set } from "react-hook-form"

export function AppSidebar() {
  const { user, navMain } = useSidebar() 
   const { getWorkflowExecutionData } = useWorkflow();
   const [isRunning, setIsRunning] = useState(false);
    const [workflowId, setWorkflowId] = useState<string | null>(null);
  return (
    <div className="relative flex flex-col h-full bg-gray-950 text-gray-200">
      <div className="relative flex flex-col h-full">
        <div className="p-4 border-b border-gray-700 backdrop-blur-sm bg-gray-900/50">
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="text-xl font-bold text-white">MarcelPearl</span>
            </Link>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-4">
            <NavMain items={navMain} />

            <div className="space-y-1">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-gray-100">
                  Quick Actions
                </h2>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-600 hover:bg-gray-700 text-gray-200"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Workflow
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-600 hover:bg-gray-700 text-gray-200 mt-3"
                  onClick={async () => {
                  const fullWorkflow = getWorkflowExecutionData();
                  const payload = {
                    name: fullWorkflow.metadata.name,
                    description: fullWorkflow.metadata.description,
                    workflowData: serializeWorkflowForBackend(fullWorkflow),
                  };
                  try {
                    const response = await createWorkflow(payload);
                    setWorkflowId(response.id); 
                  } catch (error) {
                    console.error('❌ Error saving workflow:', error);
                  }
                  }}
                >
                  <Save></Save>
                  Save Workflow
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-600 hover:bg-gray-700 text-gray-200 mt-3"
                  disabled={!workflowId}
                  onClick={async () => {
                  if (!workflowId) return;
                  try {
                    setIsRunning(true);
                    const result = await runWorkflow(workflowId);
                    console.log('🚀 Workflow run started:', result);
                  } catch (error) {
                    console.error('❌ Failed to run workflow:', error);
                  } finally {
                    setIsRunning(false);
                  }
                  }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isRunning ? 'Running...' : 'Run Workflow'}
                  
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="px-3 py-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-gray-700 text-gray-200"
                    asChild
                  >
                    <a href="/contact" className="flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-gray-700 text-gray-200"
                    asChild
                  >
                    <a href="/" className="flex items-center">
                      <Settings2 className="mr-2 h-4 w-4" />
                      Home
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-700 backdrop-blur-sm bg-gray-900/50">
          <NavUser user={user} />
        </div>
      </div>
    </div>
  )
}
