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
import { Post } from "../Public/Post";
import matter from "front-matter";
import { Logo } from "../Logo";
import { Eye, EyeOff } from "lucide-react";
import { useParams } from "react-router";
import { usePost } from "../../hooks/usePost";
import { PostData } from "@/types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const save = async (markdown: string) => {
  await fetch(`${BACKEND_URL}/post/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ markdown }),
  });
};

export function Editor() {
  const [post, setPost] = useState<PostData>();
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState<string>("");
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { fileName } = useParams<{ fileName: string }>();
  const { data, isPending: loadingPost } = usePost(fileName ?? "", {
    enabled: !!fileName,
  });

  async function imageUploadHandler(image: File) {
    const formData = new FormData();
    formData.append("image", image);
    const response = await fetch(`${BACKEND_URL}/photo/upload`, {
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

  const handleClickPreview = () => {
    setShowPreview((prevShowPreview) => !prevShowPreview);
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      setSyncing(true);
      setError(undefined);
      if (!post?.attributes.title) {
        console.log("Skipping save, due to no title");
        setSyncing(false);
        return;
      }
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
      {syncing ? (
        <div className="absolute top-2 right-4 text-xs">Syncing</div>
      ) : null}
      {error ? (
        <div className="absolute top-2 right-4 text-xs text-red-600">
          {error}
        </div>
      ) : null}
      <div className="w-full flex gap-[18px] justify-center">
        <div className="flex flex-col h-full w-[600px]">
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-[4px]">
              <Logo />
            </div>
            <button onClick={handleClickPreview}>
              {showPreview ? (
                <div className="flex items-center gap-[4px] text-stone-500 text-xs">
                  Hide Preview
                  <EyeOff size={16} />
                </div>
              ) : (
                <div className="flex items-center gap-[4px] text-stone-500 text-xs">
                  Show Preview
                  <Eye size={16} />
                </div>
              )}
            </button>
          </div>
          <div className="prose">
            {loadingPost ? (
              <div>Loading...</div>
            ) : (
              <MDXEditor
                markdown={data?.data.raw ?? ""}
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
            )}
          </div>
        </div>
        {showPreview ? (
          <div className="">
            <Post data={post} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
