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
  return (
    <MDXEditor
      markdown="hello world [world](https://virtuoso.dev/)"
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
  );
}

export default App;