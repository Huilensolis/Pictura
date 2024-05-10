import { PostsGridContainer } from "@/components/feature/posts-grid/components/posts-grid-container";
import { PostsGridSkeleton } from "@/components/feature/posts-grid/components/posts-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="w-24 h-6 rounded-sm" />
        <Skeleton className="w-full h-10" />
      </div>
      <PostsGridContainer>
        <PostsGridSkeleton />
      </PostsGridContainer>
    </>
  );
}
