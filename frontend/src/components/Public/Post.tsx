import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Logo } from "../Logo";
import rehypeRaw from "rehype-raw";
import { PostData } from "../../types";
import "../../index.css";

const CustomComponents: Partial<Components> | null = {
  img: ({ node, ...props }) => (
    <div className="flex justify-center">
      <img {...props} className="max-w-full h-auto rounded-[2px]" />
    </div>
  ),
};

interface PostProps {
  data?: PostData;
}
export const Post = ({ data }: PostProps) => {
  return (
    <div className="h-full w-full p-4 flex flex-col items-center">
      <div className="w-full flex justify-end items-center">
        <Logo />
      </div>
      {data?.attributes.title ? (
        <div className="text-3xl tracking-tighter text-stone-800 font-semibold mt-4">
          {data?.attributes.title}
        </div>
      ) : null}
      {
        data?.attributes.tags ? (
          <div className="flex items-center gap-[4px] flex-wrap mt-2">
            {
              data.attributes.tags.split(",").map(tag => {
                return (
                  <div key={tag} className="text-[12px] px-[4px] py-[2px] bg-stone-100">{tag}</div>
                )
              })
            }
          </div>
        ) : null 
      }
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
