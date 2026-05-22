# Lilnime Project Gallery

Lilnime Project Gallery is a Next.js app that indexes the HTML, CSS, and JavaScript projects in the workspace root and previews them inside the site.

The app has two main routes:

- `/` - a landing page with an intro section and a button that opens the gallery
- `/gallery` - the project browser, with a collapsible sidebar, preview/code tabs, and iframe-based project rendering

## What it does

- Scans the workspace root for project folders
- Displays friendly project names instead of raw folder names
- Serves each project through an internal preview route so static HTML, CSS, JS, GSAP, and Three.js demos can run inside an iframe
- Lets you inspect each project’s source files inside the gallery

## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open the app in your browser at `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Project structure

- `src/app/page.tsx` - homepage
- `src/app/gallery/page.tsx` - gallery route
- `src/app/api/serve/[...path]/route.ts` - file server used by the iframe preview
- `src/components/project-gallery.tsx` - gallery shell and sidebar
- `src/components/project-viewer.tsx` - preview and code tabs
- `src/lib/projects.ts` - workspace scanner and project name formatting

## Notes

- Project folders should live next to the `gallery` folder in the workspace root.
- Asset paths inside the demo projects should be relative, not root-absolute, so they continue to work when loaded through the iframe preview route.
- The preview server intentionally blocks access to the `gallery` folder and `.git` directory.
