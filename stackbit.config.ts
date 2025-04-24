import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
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
            { name: "content", type: "markdown" },
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
    }) as any
  ],
  presetSource: {
    type: "files",
    presetDirs: ["content"]
  },
  devCommand: "npm run dev",
  buildCommand: "ENABLE_VISUAL_EDITOR=true node netlify-build.js",
  publishDir: "dist",
  siteMap: ({ documents }) => {
    return documents
      .filter(doc => doc.modelName === 'Page')
      .map(doc => ({
        stableId: doc.id,
        urlPath: `/${String(doc.fields?.slug?.toString() || '')}`,
        document: doc,
        isHomePage: String(doc.fields?.slug?.toString()) === 'home' || String(doc.fields?.slug?.toString()) === ''
      }));
  }
});