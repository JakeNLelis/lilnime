import { getProjects } from "@/lib/projects"
import { ProjectGallery } from "@/components/project-gallery"

export default async function Home() {
  const projects = await getProjects()

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <ProjectGallery projects={projects} />
    </div>
  )
}
