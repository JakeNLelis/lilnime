"use client"

import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { ProjectViewer } from "@/components/project-viewer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ProjectFile {
  name: string
  content: string
  language: string
}

interface Project {
  slug: string
  name: string
  files: ProjectFile[]
}

interface ProjectGalleryProps {
  projects: Project[]
}

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(
    projects.length > 0 ? projects[0].slug : null
  )

  const activeProject = projects.find((p) => p.slug === activeProjectSlug)

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/10 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="font-bold text-lg tracking-tight">Gallery</h1>
          <ModeToggle />
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {projects.map((project) => (
              <button
                key={project.slug}
                onClick={() => setActiveProjectSlug(project.slug)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                  activeProjectSlug === project.slug
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-muted"
                )}
              >
                {project.name}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeProject ? (
          <ProjectViewer project={activeProject} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No projects found.
          </div>
        )}
      </div>
    </div>
  )
}
