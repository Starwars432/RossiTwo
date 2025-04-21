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
        },
        {
          name: "Service",
          type: "data",
          filePath: "content/services/{slug}.md",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "icon", type: "string" },
            { name: "description", type: "text" },
            { name: "category", type: "string" },
            { name: "featured", type: "boolean" },
            { name: "price", type: "number" },
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
  buildCommand: "npm run build",
  publishDir: "dist",
  siteMap: ({ documents }) => {
    return documents
      .filter(doc => doc.modelName === 'Page')
      .map(doc => {
        return {
          stableId: doc.id,
          urlPath: `/${doc.fields.slug || ''}`,
          document: doc,
          isHomePage: doc.fields.slug === 'home' || doc.fields.slug === ''
        };
      });
  }
});