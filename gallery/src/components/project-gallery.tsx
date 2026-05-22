"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { ProjectViewer } from "@/components/project-viewer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface ProjectFile {
  name: string;
  content: string;
  language: string;
}

interface Project {
  slug: string;
  name: string;
  files: ProjectFile[];
}

interface ProjectGalleryProps {
  projects: Project[];
}

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(
    projects.length > 0 ? projects[0].slug : null,
  );
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    const updateSidebarState = () => {
      setIsSidebarCollapsed(mediaQuery.matches);
    };

    updateSidebarState();
    mediaQuery.addEventListener("change", updateSidebarState);

    return () => {
      mediaQuery.removeEventListener("change", updateSidebarState);
    };
  }, []);

  const activeProject = projects.find((p) => p.slug === activeProjectSlug);

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <div
        className={cn(
          "border-r bg-muted/10 flex flex-col transition-all duration-300",
          isSidebarCollapsed ? "w-24" : "w-64",
        )}
      >
        <div className="p-2 border-b flex items-center gap-1 justify-between">
          <Button
            size="icon"
            variant="ghost"
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
          {!isSidebarCollapsed && (
            <div className="flex flex-1 items-center gap-3 min-w-0">
              <Link
                href="/"
                className="rounded-full border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                Back to Home
              </Link>
            </div>
          )}
          <ModeToggle />
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {projects.map((project) => (
              <button
                key={project.slug}
                onClick={() => {
                  setActiveProjectSlug(project.slug);
                  setActiveTab("preview");
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md transition-colors truncate",
                  activeProjectSlug === project.slug
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-muted",
                )}
                title={project.name}
              >
                {isSidebarCollapsed
                  ? project.name.charAt(0).toUpperCase()
                  : project.name}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeProject ? (
          <ProjectViewer
            project={activeProject}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
}
