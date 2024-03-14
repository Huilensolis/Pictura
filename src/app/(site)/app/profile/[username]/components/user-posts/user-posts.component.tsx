"use client";

import { PostsGridSkeleton } from "@/components/feature/posts-grid/components/posts-grid-skeleton";
import { PostsGrid } from "@/components/feature/posts-grid/posts-grid.component";
import { Heading } from "@/components/ui/typography/heading";
import { useSupabase } from "@/hooks/use-supabase";
import { Database } from "@/supabase/types";
import { useEffect, useState } from "react";

export function UserPosts({ profileId }: { profileId: string }) {
  const { supabase } = useSupabase();

  const [posts, setPosts] = useState<
    Database["public"]["Tables"]["posts"]["Row"][]
  >([]);

  const [error, setError] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [lastPostIndex, setLastPostIndex] = useState<number>(1);

  const [userHasNoMorePosts, setUserHasNoMorePosts] = useState<boolean>(false);

  useEffect(() => {
    if (userHasNoMorePosts) return;

    const controller = new AbortController();

    try {
      setIsLoading(true);
      setIsFetching(true);

      supabase
        .from("posts")
        .select("*")
        .eq("profile_id", profileId)
        .order("id", { ascending: false })
        .limit(32)
        .range(lastPostIndex, lastPostIndex + 32)
        .abortSignal(controller.signal)
        .then(({ data: posts, error }) => {
          if (error) return;

          if (!posts) return;

          if (posts.length === 0) setUserHasNoMorePosts(true);

          setPosts((prev) => [...prev, ...posts]);
        });
    } catch (error: unknown) {
      if ((error as Error).name === "AbortError") return;

      setError(true);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }

    return () => {
      controller.abort();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPostIndex]);

  function handleScroll() {
    setLastPostIndex((prev) => prev + 32);
  }

  return (
    <main className="w-full h-full flex flex-col gap-2">
      {isLoading && <PostsGridSkeleton cuantity={32} />}
      {!isLoading && !isFetching && (
        <>
          {!error ? (
            <div>
              <PostsGrid posts={posts} onFetchNewPosts={handleScroll} />
            </div>
          ) : (
            <article className="flex items-center justify-center w-full max-h-96 py-32 text-center border-y border-neutral-300">
              <Heading level={10}>
                Something wen wrong, please reload the page
              </Heading>
            </article>
          )}
        </>
      )}
    </main>
  );
}