import { Link } from "react-router";
import { usePosts } from "../hooks/usePosts";

export const EditorHome = () => {
  const { data, isPending } = usePosts({});
  if (isPending) {
    return "Loading...";
  }
  return (
    <div className="flex flex-col items-center justify-center">
      {data?.posts?.map((post) => {
        return (
          <div>
            <h2>{post.attributes.title}</h2>
            <Link to={`/edit/${post.fileName}`}>{post.attributes.title}</Link>
          </div>
        );
      })}
    </div>
  );
};
