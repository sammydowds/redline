import { Post } from "./src/components/Public/Post";
import { PostData, PostsResponse } from "./src/types";
import * as fs from "fs";
import * as path from "path";
import { createElement } from "react";
import * as ReactDOMServer from "react-dom/server";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

interface RenderOptions {
  outputPath?: string;
}

async function renderPost(
  data: PostData | undefined,
  options: RenderOptions = {},
) {
  const { outputPath = "dist/output.html" } = options;

  try {
    const componentHtml = ReactDOMServer.renderToString(
      createElement(Post, { data }),
    );

    const templateHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rendered Post</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
      </html>
    `;

    const finalHtml = templateHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${componentHtml}</div>`,
    );

    const outputDir = path.dirname(outputPath);
    fs.promises
      .mkdir(outputDir, { recursive: true })
      .then(() => {
        return fs.promises.writeFile(outputPath, finalHtml);
      })
      .then(() => {
        console.log(`Post rendered to ${outputPath}`);
      })
      .catch((error) => {
        console.error("Error rendering post:", error);
        throw error;
      });
  } catch (error) {
    console.error("Error rendering post:", error);
    throw error;
  } finally {
    console.log("Pre-render Complete.");
  }
}

if (import.meta.url === "file://" + process.argv[1]) {
  fetch(`${process.env.VITE_BACKEND_URL}/posts`)
    .then((response) => response.json())
    .then((posts: PostsResponse) => {
      for (const post of posts.posts) {
        renderPost(post, {
          outputPath: `dist/${post.fileName}.html`,
        }).catch(console.error);
      }
    })
    .catch(console.error);
}