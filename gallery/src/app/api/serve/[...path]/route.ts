import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

// Mime types mapping
const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".gltf": "model/gltf+json",
  ".glb": "model/gltf-binary",
  ".bin": "application/octet-stream",
};

const REPO_ROOT = path.join(process.cwd(), "..");

function getRequestedPathSegments(request: NextRequest): string[] {
  const pathname = new URL(request.url).pathname;
  const marker = "/api/serve/";
  const rawPath = pathname.includes(marker) ? pathname.split(marker)[1] : "";

  if (!rawPath) {
    return [];
  }

  return rawPath
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));
}

export async function GET(
  request: NextRequest,
  _context: { params: Promise<{ path: string[] }> },
) {
  const pathArray = getRequestedPathSegments(request);

  if (pathArray.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Prevent directory traversal attacks
  const joinedPath = pathArray.join("/");
  if (joinedPath.includes("..")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Prevent accessing gallery or .git
  if (pathArray[0] === "gallery" || pathArray[0] === ".git") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const filePath = path.join(REPO_ROOT, ...pathArray);

  try {
    const stat = fs.statSync(filePath);

    // If it's a directory, try to serve index.html
    if (stat.isDirectory()) {
      const indexPath = path.join(filePath, "index.html");
      if (fs.existsSync(indexPath)) {
        let fileContent = fs.readFileSync(indexPath, "utf8");
        // Inject helper script to allow the parent to request animation refreshes
        if (fileContent.includes("</body>")) {
          fileContent = fileContent.replace(
            "</body>",
            `\n<script>\n(function(){function refresh(){try{if(window.gsap&&window.ScrollTrigger&&window.ScrollTrigger.refresh){window.ScrollTrigger.refresh()}if(window.gsap&&window.gsap.ticker&&window.gsap.ticker.fps){try{window.gsap.ticker.fps(60)}catch(e){}}window.dispatchEvent(new Event('resize'))}catch(e){}}window.addEventListener('message',function(e){try{if(e&&e.data&&e.data.type==='refresh-animations'){refresh();document.body.style.transform='translateZ(0)';setTimeout(function(){document.body.style.transform=''},50)}}catch(e){}},false);window.addEventListener('load',function(){setTimeout(refresh,50)});})();\n</script>\n</body>`,
          );
        }

        return new NextResponse(fileContent, {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
      } else {
        return new NextResponse("Not Found", { status: 404 });
      }
    }

    let fileContentBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    // If serving HTML files, inject the helper script to enable refresh messaging
    if (contentType === "text/html") {
      let fileContent = fileContentBuffer.toString("utf8");
      if (fileContent.includes("</body>")) {
        fileContent = fileContent.replace(
          "</body>",
          `\n<script>\n(function(){function refresh(){try{if(window.gsap&&window.ScrollTrigger&&window.ScrollTrigger.refresh){window.ScrollTrigger.refresh()}if(window.gsap&&window.gsap.ticker&&window.gsap.ticker.fps){try{window.gsap.gsap&&window.gsap.ticker&&window.gsap.ticker.fps}catch(e){};try{window.gsap.ticker.fps(60)}catch(e){}}window.dispatchEvent(new Event('resize'))}catch(e){}}window.addEventListener('message',function(e){try{if(e&&e.data&&e.data.type==='refresh-animations'){refresh();document.body.style.transform='translateZ(0)';setTimeout(function(){document.body.style.transform=''},50)}}catch(e){}},false);window.addEventListener('load',function(){setTimeout(refresh,50)});})();\n</script>\n</body>`,
        );
      }

      return new NextResponse(fileContent, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    return new NextResponse(fileContentBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
