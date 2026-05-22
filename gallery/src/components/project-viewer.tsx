"use client";

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

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

interface ProjectViewerProps {
  project: Project;
  activeTab: "preview" | "code";
  onTabChange: (value: "preview" | "code") => void;
}

export function ProjectViewer({
  project,
  activeTab,
  onTabChange,
}: ProjectViewerProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleCopy = async (fileName: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(fileName);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (error) {
      console.error("Failed to copy file content to clipboard:", error);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as "preview" | "code")}
        className="flex h-full flex-col"
      >
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h2 className="text-lg font-semibold">{project.name}</h2>
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="preview"
          className="flex-1 m-0 p-0 overflow-hidden relative"
        >
          {/* Iframe pointing to the serve API route. Keep sandbox but allow same-origin so parent can postMessage and call resize. */}
          <iframe
            ref={iframeRef}
            src={`/api/serve/${project.slug}/index.html`}
            className="absolute inset-0 w-full h-full border-0 bg-white"
            title={`${project.name} preview`}
            sandbox="allow-scripts allow-same-origin"
            onLoad={() => {
              try {
                const w = iframeRef.current?.contentWindow;
                if (w) {
                  // Ask the iframe to refresh animations (injected script listens for this)
                  w.postMessage({ type: "refresh-animations" }, "*");
                  // Also dispatch a resize event inside the iframe
                  try {
                    w.dispatchEvent(new Event("resize"));
                  } catch (e) {
                    console.log(e);
                  }
                }
              } catch (e) {
                // ignore cross-origin or other access errors
                console.log(e);
              }
            }}
          />
        </TabsContent>

        <TabsContent
          value="code"
          className="flex-1 m-0 overflow-hidden flex flex-col"
        >
          <Tabs
            key={project.slug}
            defaultValue={project.files[0]?.name}
            className="flex h-full flex-col"
          >
            <div className="border-b px-4 py-2 overflow-x-auto">
              <TabsList className="w-auto inline-flex">
                {project.files.map((file) => (
                  <TabsTrigger key={file.name} value={file.name}>
                    {file.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex-1 relative overflow-hidden bg-muted/30">
              {project.files.map((file) => (
                <TabsContent
                  key={file.name}
                  value={file.name}
                  className="h-full m-0 data-[state=active]:flex flex-col relative"
                >
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-4 top-4 z-10"
                    onClick={() => handleCopy(file.name, file.content)}
                  >
                    {copiedFile === file.name ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <ScrollArea className="h-full">
                    <pre className="p-4 text-sm whitespace-pre-wrap">
                      <code>{file.content}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
