import fs from 'fs'
import path from 'path'

// The root path of the repository
const REPO_ROOT = path.join(process.cwd(), '..')

export interface ProjectFile {
  name: string
  content: string
  language: string
}

export interface Project {
  slug: string
  name: string
  files: ProjectFile[]
}

// Function to read a file as utf-8 safely
function readProjectFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return null
  }
}

export async function getProjects(): Promise<Project[]> {
  const rootDirs = fs.readdirSync(REPO_ROOT, { withFileTypes: true })

  const projects: Project[] = []

  for (const dir of rootDirs) {
    // Exclude .git, gallery, and node_modules folders, also exclude files
    if (
      !dir.isDirectory() ||
      dir.name === '.git' ||
      dir.name === 'gallery' ||
      dir.name === 'node_modules' ||
      dir.name.startsWith('.')
    ) {
      continue
    }

    const projectDir = path.join(REPO_ROOT, dir.name)
    const projectFiles = fs.readdirSync(projectDir, { withFileTypes: true })

    // We only care about html, css, js files in the project root
    const files: ProjectFile[] = []

    for (const file of projectFiles) {
      if (file.isFile()) {
        const ext = path.extname(file.name).toLowerCase()
        if (['.html', '.css', '.js'].includes(ext)) {
          const content = readProjectFile(path.join(projectDir, file.name))
          if (content !== null) {
            files.push({
              name: file.name,
              content,
              language: ext === '.js' ? 'javascript' : ext.replace('.', ''),
            })
          }
        }
      }
    }

    // Only include projects that actually have files
    if (files.length > 0) {
      projects.push({
        slug: dir.name,
        name: dir.name,
        files,
      })
    }
  }

  // Sort alphabetically by name
  return projects.sort((a, b) => a.name.localeCompare(b.name))
}
