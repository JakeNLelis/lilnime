import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

// Mime types mapping
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
}

const REPO_ROOT = path.join(process.cwd(), '..')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const pathArray = (await params).path

  // Prevent directory traversal attacks
  const joinedPath = pathArray.join('/')
  if (joinedPath.includes('..')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Prevent accessing gallery or .git
  if (pathArray[0] === 'gallery' || pathArray[0] === '.git') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const filePath = path.join(REPO_ROOT, ...pathArray)

  try {
    const stat = fs.statSync(filePath)

    // If it's a directory, try to serve index.html
    if (stat.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html')
      if (fs.existsSync(indexPath)) {
        const fileContent = fs.readFileSync(indexPath)
        return new NextResponse(fileContent, {
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        })
      } else {
        return new NextResponse('Not Found', { status: 404 })
      }
    }

    const fileContent = fs.readFileSync(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
}
