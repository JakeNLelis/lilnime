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

const PROJECT_DISPLAY_NAMES: Record<string, string> = {
  '3d Rotate CSS Only': '3D Rotate CSS Only',
  'animation-svg-css': 'SVG Animation With CSS',
  auto_slider: 'Auto Slider',
  canvas: 'Canvas Animation',
  flex_css: 'Flex CSS Layout',
  gsap_animation: 'GSAP Animation',
  ImageZoom: 'Image Zoom',
  'ink-animation-css': 'Ink Animation With CSS',
  product_has_many_price: 'Product Price Cards',
  propertyCSS: 'Property CSS Demo',
  scroll_animation: 'Scroll Animation',
  slider_1: 'Slider 1',
  slider_2: 'Slider 2',
  slider_3d: '3D Slider',
  ThreeJs: 'Three.js Demo',
  'ThreeJs-Animation-Scroll': 'Three.js Animation Scroll',
  'threejs_convert_positon_clikc_from_2D_to_3D': 'Three.js Position Conversion 2D to 3D',
  validation_html_css: 'HTML CSS Validation',
}

function toTitleCase(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => {
      const normalized = word.toLowerCase()

      if (/^\d+[a-z]*$/i.test(word)) {
        return word.toUpperCase()
      }

      const acronym = normalized.toUpperCase()
      if (['css', 'html', 'js', 'svg', 'gsap', 'api', 'ui', 'glb', 'gltf', 'three.js'].includes(normalized)) {
        return acronym === 'THREE.JS' ? 'Three.js' : acronym
      }

      if (normalized === '3d') return '3D'
      if (normalized === '2d') return '2D'

      return normalized.charAt(0).toUpperCase() + normalized.slice(1)
    })
    .join(' ')
}

function getProjectDisplayName(slug: string): string {
  return PROJECT_DISPLAY_NAMES[slug] ?? toTitleCase(slug)
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
        name: getProjectDisplayName(dir.name),
        files,
      })
    }
  }

  // Sort alphabetically by name
  return projects.sort((a, b) => a.name.localeCompare(b.name))
}
