import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "vite",
  nodeVersion: "20",
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"],
      assetsConfig: {
        referenceType: "static",
        staticDir: "public",
        uploadDir: "uploads",
        publicPath: "/"
      },
      models: [
        {
          name: "Page",
          type: "page",
          urlPath: "/{slug}",
          filePath: "content/pages/{slug}.md",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "slug", type: "string", required: true },
            { name: "content", type: "markdown" }
          ]
        }
      ]
    })
  ],
  presetSource: {
    type: "files",
    basePath: "/"
  },
  devCommand: "npm run dev",
  buildCommand: "ENABLE_VISUAL_EDITOR=true node netlify-build.js",
  publishDir: "dist",
  previewSettings: {
    enable: true,
    buildCommand: "ENABLE_VISUAL_EDITOR=true node netlify-build.js",
    outputDir: "dist",
    rootDir: "/"
  }
});