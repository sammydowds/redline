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
  frontmatterPlugin,
  InsertFrontmatter,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useState, useEffect } from "react";
import { Post, PostData } from "./components/Post";
import matter from "front-matter";

const save = async (markdown: string) => {
  await fetch("http://localhost:5000/post/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ markdown }),
  });
};

function App() {
  const [post, setPost] = useState<PostData>();
  const [markdown, setMarkdown] = useState<string>("");
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | undefined>();

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

  const handleChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
    setPost(matter(newMarkdown));
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      setSyncing(true);
      setError(undefined);
      try {
        await save(markdown);
      } catch {
        setError("Unable to save to server");
      }
      setSyncing(false);
    }, 3000);

    return () => {
      clearTimeout(handler);
    };
  }, [markdown]);

  return (
    <div className="flex flex-col gap-4 p-2 items-center relative">
      {syncing ? <div className="absolute top-2 right-4 text-xs">Syncing</div> : null}
      {error ? <div className="absolute top-2 right-4 text-xs text-red-600">{error}</div> : null}
      <div className="text-black uppercase line-through text-2xl font-semibold decoration-red-600 decoration-[2px]">
        Redlines
      </div>
      <div className="w-full flex gap-[4px] justify-center">
        <div className="flex flex-col h-full w-[600px]">
          <div className="prose">
            <MDXEditor
              markdown="hello world [world](https://virtuoso.dev/)"
              onChange={handleChange}
              plugins={[
                headingsPlugin(),
                markdownShortcutPlugin(),
                imagePlugin({
                  imageUploadHandler,
                }),
                frontmatterPlugin(),
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
                      <InsertFrontmatter />
                    </>
                  ),
                }),
              ]}
            />
          </div>
        </div>
        <div className="h-full border-[1px] p-2 shadow min-h-[800px] w-[600px] prose">
          <Post data={post} />
        </div>
      </div>
    </div>
  );
}

export default App;
