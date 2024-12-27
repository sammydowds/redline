import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { FrontMatterResult } from "front-matter";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

interface Payload {
  data: FrontMatterResult<string>;
  raw: string;
}

interface Response {
  data: Payload;
}

const fetchPost = async (fileName: string): Promise<Response> => {
  const response = await fetch(`${BACKEND_URL}/editor/${fileName}`);
  if (!response.ok) {
    throw new Error("Unable to fetch posts.");
  }
  return response.json();
};

export const usePost = (
  fileName: string,
  options?: Partial<UseQueryOptions<Response, Error>>,
) => {
  return useQuery<Response, Error>({
    queryKey: ["post", fileName],
    queryFn: () => fetchPost(fileName),
    ...options,
  });
};
