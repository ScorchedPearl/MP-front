"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react"

interface ResizableSidebarProps {
  children: ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
}

export function ResizableSidebar({
  children,
  defaultWidth = 280,
  minWidth = 280,
  maxWidth = 480,
}: ResizableSidebarProps) {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setWidth(newWidth)
        }
      }
    },
    [isResizing, minWidth, maxWidth],
  )

  useEffect(() => {
    window.addEventListener("mousemove", resize)
    window.addEventListener("mouseup", stopResizing)
    return () => {
      window.removeEventListener("mousemove", resize)
      window.removeEventListener("mouseup", stopResizing)
    }
  }, [resize, stopResizing])

  return (
    <div className="flex">
      <div
        ref={sidebarRef}
        className="relative bg-sidebar border-r border-sidebar-border"
        style={{ width: `${width}px` }}
      >
        {children}

        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-cyan-500/10 transition-colors group"
          onMouseDown={startResizing}
        >
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-16 bg-cyan-500 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  )
}