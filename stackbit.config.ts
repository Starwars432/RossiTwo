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
            { name: "sections", type: "list", items: { type: "reference", models: ["Section"] } }
          ]
        },
        {
          name: "Section",
          type: "object",
          fields: [
            { name: "type", type: "string", required: true },
            { name: "title", type: "string" },
            { name: "content", type: "markdown" },
            { name: "image", type: "image" }
          ]
        }
      ]
    })
  ]
});