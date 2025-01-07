import { Post } from "./src/components/Public/Post";
import { PostData, PostsResponse } from "./src/types";
import * as fs from "fs";
import * as path from "path";
import { createElement } from "react";
import * as ReactDOMServer from "react-dom/server";
import { fileURLToPath } from "url";
import { minify } from "html-minifier";
import OpenAi from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openai = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });
const OPENAI_AUDIO_CHARACTER_LIMIT = 4000 as const;

const generateAudio = async (text: string, target: string) => {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: text,
  });
  const speechFile = path.resolve(target);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
};

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
      <title>${data?.attributes.title}</title>
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
          .then(async () => {
            console.log(`Post rendered to ${outputPath}`);
            if (data?.body && data?.attributes.tts === "true") {
              const audioPath = `public/${data?.fileName}.mp3`;
              console.log(outputPath, "Generating audio...");
              try {
                if (data?.body.length < OPENAI_AUDIO_CHARACTER_LIMIT) {
                  await generateAudio(data?.body, audioPath);
                  console.log(audioPath, "Generated audio SUCCESS");
                } else {
                  console.log(
                    outputPath,
                    "Skipping audio generation, post too large",
                  );
                }
              } catch (e) {
                console.error("Failed to generate audio for post.", e);
              }
            }
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
        if (post.attributes.status === "public") {
          renderPost(post, {
            outputPath: `public/${post.fileName}.html`,
          }).catch(console.error);
        }
      }
    })
    .catch(console.error);
}
