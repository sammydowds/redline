import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

interface Post {
  attributes: { title: string };
  fileName: string;
}

interface Posts {
  posts: Post[];
}

const fetchPosts = async (): Promise<Posts> => {
  const response = await fetch(`${BACKEND_URL}/posts`);
  if (!response.ok) {
    throw new Error("Unable to fetch posts.");
  }
  return response.json();
};

export const usePosts = (options?: Partial<UseQueryOptions<Posts, Error>>) => {
  return useQuery<Posts, Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    ...options,
  });
};
