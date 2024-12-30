import { PostsResponse } from "@/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const fetchPosts = async (): Promise<PostsResponse> => {
  const response = await fetch(`${BACKEND_URL}/posts`);
  if (!response.ok) {
    throw new Error("Unable to fetch posts.");
  }
  return response.json();
};

export const usePosts = (
  options?: Partial<UseQueryOptions<PostsResponse, Error>>,
) => {
  return useQuery<PostsResponse, Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    ...options,
  });
};
