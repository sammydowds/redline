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

function App() {
  const handleChange = async (markdown: string) => {
    await fetch("http://localhost:5000/post/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ markdown }),
    });
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="text-black uppercase line-through text-2xl font-semibold decoration-red-600 decoration-[2px]">
        Redlines
      </div>
      <div className="prose w-[1000px]">
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
    </div>
  );
}

export default App;
