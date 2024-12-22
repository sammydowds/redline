import { FrontMatterResult } from "front-matter";
import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const CustomComponents: Partial<Components> | null = {};

interface PostMetaDataObj {
}
export type PostData = FrontMatterResult<PostMetaDataObj>;

interface PostProps {
  data?: PostData;
}
export const Post = ({ data }: PostProps) => {
  return (
    <div className="flex flex-col">
      <Markdown components={CustomComponents} remarkPlugins={[remarkGfm]}>
        {data?.body}
      </Markdown>
    </div>
  );
};
