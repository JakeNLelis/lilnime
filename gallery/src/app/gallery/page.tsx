import { getProjects } from "@/lib/projects"
import { ProjectGallery } from "@/components/project-gallery"

export default async function GalleryPage() {
  const projects = await getProjects()
  const safeProjects = JSON.parse(JSON.stringify(projects).replace(/</g, "\\u003c"))

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <ProjectGallery projects={safeProjects} />
    </div>
  )
}