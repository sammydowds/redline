import { FrontMatterResult } from "front-matter";

export interface Payload {
  data: FrontMatterResult<string>;
  raw: string;
}

export interface PostResponse {
  data: Payload;
}

interface PostMetaDataObj {
  title: string;
}
export interface PostData extends FrontMatterResult<PostMetaDataObj> {
  fileName?: string;
}

export interface PostsResponse {
  posts: PostData[];
}
