"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      badge?: string
    }[]
  }[]
}) {
  return (
    <div className="space-y-1">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
        <div className="space-y-1">
          {items.map((item) => (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
              <div>
                <CollapsibleTrigger asChild>
                  <Button variant={item.isActive ? "secondary" : "ghost"} className="w-full justify-start">
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    <span>{item.title}</span>
                    {item.items && (
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                {item.items && (
                  <CollapsibleContent>
                    <div className="ml-6 space-y-1 border-l border-border pl-4">
                      {item.items?.map((subItem) => (
                        <Button key={subItem.title} variant="ghost" className="w-full justify-start h-8 px-2" asChild>
                          <a href={subItem.url} className="flex items-center justify-between">
                            <span className="text-sm">{subItem.title}</span>
                            {subItem.badge && (
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {subItem.badge}
                              </Badge>
                            )}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                )}
              </div>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  )
}
