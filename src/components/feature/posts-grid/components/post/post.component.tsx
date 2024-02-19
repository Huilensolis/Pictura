"use client";

import { LazyImage } from "@/components/feature/lazy-image";
import { ClientRouting } from "@/models/routing/client";
import { Database } from "@/supabase/types";
import Link from "next/link";

export function PostsGridRow({
  post,
}: {
  post: Database["public"]["Tables"]["posts"]["Row"];
}) {
  return (
    <li key={post.id} className={`flex w-full h-full py-2`}>
      <Link
        href={ClientRouting.post().page(JSON.stringify(post.id) || "")}
        className="w-full"
      >
        <LazyImage
          src={post.asset_url}
          alt={post.title}
          className="flex w-full h-auto rounded-md"
          skeletonClassName="w-full h-96"
        />
      </Link>
    </li>
  );
}
