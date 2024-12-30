import { Link } from "react-router";
import { usePosts } from "../../hooks/usePosts";

export const EditorHome = () => {
  const { data, isPending } = usePosts({});
  if (isPending) {
    return "Loading...";
  }
  return (
    <div className="flex flex-col items-center justify-center">
      {data?.posts?.map((post) => {
        return (
          <div className="flex items-center">
            <Link
              className="underline text-2xl text-stone-600"
              to={`/edit/${post.fileName}`}
            >
              {post.attributes.title}
            </Link>
          </div>
        );
      })}
    </div>
  );
};
