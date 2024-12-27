import { FrontMatterResult } from "front-matter";
import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Logo } from "./Logo";
import rehypeRaw from "rehype-raw";

const CustomComponents: Partial<Components> | null = {
    img: ({ node, ...props }) => (
        <div className="flex justify-center">
          <img {...props} className="max-w-full h-auto rounded-[2px]" />
        </div>
      ),
};

interface PostMetaDataObj {
  title: string;
}
export type PostData = FrontMatterResult<PostMetaDataObj>;

interface PostProps {
  data?: PostData;
}
export const Post = ({ data }: PostProps) => {
  return (
    <div className="h-full border-[1px] shadow min-h-[800px] w-[600px] p-4 flex flex-col items-center">
      <div className="w-full flex justify-end items-center">
        <Logo />
      </div>
      {data?.attributes.title ? (
        <div className="text-3xl tracking-tighter text-stone-800 font-semibold mt-4">
          {data?.attributes.title}
        </div>
      ) : null}
      <div className="w-full prose prose-slate">
        <Markdown
          className="py-2 px-4"
          components={CustomComponents}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {data?.body}
        </Markdown>
      </div>
    </div>
  );
};
