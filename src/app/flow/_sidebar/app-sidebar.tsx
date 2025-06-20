"use client"

import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Home,
  Users,
  Database,
  Zap,
  HelpCircle,
  Plus,
  Search,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

// This is sample data.
const data = {
  user: {
    name: "Johannes Schneider",
    email: "j.schneider@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "n8n Workflows",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Personal",
      logo: AudioWaveform,
      plan: "Free",
    },
    {
      name: "Team Alpha",
      logo: Command,
      plan: "Pro",
    },
  ],
  // Fetch this data from your API or state management  (Context, etc.) SidebarContext
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Workflows",
      url: "#",
      icon: Zap,
      items: [
        {
          title: "Active Workflows",
          url: "#",
          badge: "12",
        },
        {
          title: "Draft Workflows",
          url: "#",
          badge: "3",
        }
      ],
    },
    {
      title: "Executions",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Recent Runs",
          url: "#",
        },
        {
          title: "Failed Executions",
          url: "#",
          badge: "2",
        },
        {
          title: "Scheduled",
          url: "#",
        },
      ],
    },
    
  ],
 
}

export function AppSidebar() {
  return (
  <div className=" relative flex flex-col h-full bg-gray-950 text-gray-200 ">
      <div className="relative flex flex-col h-full">
        <div className="p-4 border-b border-gray-700 backdrop-blur-sm bg-gray-900/50">
{/* Icon */}
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-4">
            <NavMain items={data.navMain}  />
           
            <div className="space-y-1">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-gray-100">
                  Quick Actions
                </h2>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-600 hover:bg-gray-700 text-gray-200"
                >
                   {/* MainButton */}
                  <Plus className="mr-2 h-4 w-4" />
                  New Workflow
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="px-3 py-2">
                <div className="space-y-1">
                  <Link href="/contact">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-gray-700 text-gray-200"
                    asChild
                  >
                    <a href="#" className="flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </a>
                  </Button>
                  </Link>
                  <Link href="/">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-gray-700 text-gray-200"
                    asChild
                  >
                    <a href="#" className="flex items-center">
                      <Settings2 className="mr-2 h-4 w-4" />
                      Home
                    </a>
                  </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 backdrop-blur-sm bg-gray-900/50">
          <NavUser user={data.user} />
        </div>
      </div>
    </div>
  )
}