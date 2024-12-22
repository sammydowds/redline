import {
  MDXEditor,
  toolbarPlugin,
  headingsPlugin,
  markdownShortcutPlugin,
  InsertImage,
  tablePlugin,
  imagePlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  linkDialogPlugin,
  linkPlugin,
  CreateLink,
  InsertTable,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [markdown, setMarkdown] = useState("");
  async function imageUploadHandler(image: File) {
    const formData = new FormData();
    formData.append("image", image);
    // send the file to your server and return
    // the URL of the uploaded image in the response
    const response = await fetch("/post/new", {
      method: "POST",
      body: formData,
    });
    const json = (await response.json()) as { url: string };
    return json.url;
  }

  const handleChange = async (markdown: string) => {
    setMarkdown(markdown);
    await fetch("http://localhost:5000/post/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ markdown }),
    });
  };
  return (
    <div className="flex flex-col gap-4 p-2 items-center">
      <div className="text-black uppercase line-through text-2xl font-semibold decoration-red-600 decoration-[2px]">
        Redlines
      </div>
      <div className="w-full flex gap-[4px] justify-center">
        <div className="h-full prose w-[600px]">
          <MDXEditor
            markdown="hello world [world](https://virtuoso.dev/)"
            onChange={handleChange}
            plugins={[
              headingsPlugin(),
              markdownShortcutPlugin(),
              tablePlugin(),
              imagePlugin({
                imageUploadHandler,
              }),
              linkDialogPlugin(),
              linkPlugin(),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              tablePlugin(),
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <BlockTypeSelect />
                    <CreateLink />
                    <InsertTable />
                    <InsertImage />
                  </>
                ),
              }),
            ]}
          />
        </div>
        <div className="h-full border-[1px] p-2 shadow min-h-[800px] w-[600px] prose">
          <Markdown
            components={{
              h1: ({ children }) => (
                <div className="font-bold text-5xl text-stone-800">
                  {children}
                </div>
              ),
            }}
            remarkPlugins={[remarkGfm]}
          >
            {markdown}
          </Markdown>
        </div>
      </div>
    </div>
  );
}

export default App;
