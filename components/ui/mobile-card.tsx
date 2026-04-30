"use client"

import * as React from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface MobileCardProps {
  avatar?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  badges?: React.ReactNode
  actions?: React.ReactNode
  viewTitle?: string
  viewContent?: React.ReactNode
}

export function MobileCard({
  avatar,
  title,
  subtitle,
  badges,
  actions,
  viewTitle = "Detail Data",
  viewContent,
}: MobileCardProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-4 shadow-sm md:hidden">
      <div className="flex items-center gap-4">
        {avatar && <div className="shrink-0">{avatar}</div>}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-foreground truncate">{title}</div>
          {subtitle && <div className="text-sm text-muted-foreground truncate">{subtitle}</div>}
        </div>
        {badges && <div className="shrink-0">{badges}</div>}
      </div>
      
      <div className="flex items-center justify-end gap-2 border-t border-border pt-3 mt-1">
        {viewContent && (
          <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="text-muted-foreground hover:text-primary border-border bg-background">
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
        )}
        {actions}
      </div>

      {viewContent && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-card border-border text-foreground w-[95vw] max-w-lg rounded-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-primary">{viewTitle}</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              {viewContent}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export function MobileCardList({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {children}
    </div>
  )
}

