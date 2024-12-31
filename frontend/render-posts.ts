import { Post } from "./src/components/Public/Post";
import { PostData, PostsResponse } from "./src/types";
import * as fs from "fs";
import * as path from "path";
import { createElement } from "react";
import * as ReactDOMServer from "react-dom/server";
import { fileURLToPath } from "url";
import { minify } from "html-minifier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    let templateHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rendered Post</title>
      <!-- INLINE_STYLES -->
    </head>
    <body>
      <!-- BODY -->
    </body>
    </html>
  `;

    fs.promises
      .readFile(path.join(__dirname, "style.css"), "utf-8")
      .then((styles) => {
        // update body and inline styles
        templateHtml = templateHtml
          .replace("<!-- BODY -->", `<div id="root">${componentHtml}</div>`)
          .replace("<!-- INLINE_STYLES -->", `<style>${styles}</style>`);

        const minifiedHtml = minify(templateHtml, { collapseWhitespace: true });
        const outputDir = path.dirname(outputPath);
        fs.promises
          .mkdir(outputDir, { recursive: true })
          .then(() => {
            return fs.promises.writeFile(outputPath, minifiedHtml);
          })
          .then(() => {
            console.log(`Post rendered to ${outputPath}`);
          })
          .catch((error) => {
            console.error("Error rendering post:", error);
            throw error;
          });
      })
      .catch((error) => {
        console.error("Error reading styles:", error);
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
  fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`)
    .then((response) => response.json())
    .then((posts: PostsResponse) => {
      for (const post of posts.posts) {
        renderPost(post, {
          outputPath: `public/${post.fileName}.html`,
        }).catch(console.error);
      }
    })
    .catch(console.error);
}
