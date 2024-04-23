"use client";

import { useRouter } from "next/navigation";
import { deleteImageAsset } from "@/services/images/delete";
import { Download, Pencil, Trash2 } from "lucide-react";
import { PlainButton } from "@/components/ui/buttons/plain";
import { useSupabase } from "@/hooks/use-supabase";
import { Option } from "./option.models";
import { downloadImage } from "@/services/images/download";
import Link from "next/link";
import { ClientRouting } from "@/models/routing/client";
import { DeletePostBtn } from "./components/delete";
import { DownloadPostImage } from "./components/download";

export function PostOptions({
  post_id,
  image_url,
  doesUserOwnPost,
}: {
  post_id: number;
  image_url: string;
  doesUserOwnPost: boolean;
}) {
  return (
    <ul id="dropdown" className="flex gap-2">
      {doesUserOwnPost && (
        <>
          <li className="flex w-full">
            <DeletePostBtn postId={post_id} imageUrl={image_url} />
          </li>
          <li className="flex w-full">
            <Link
              href={ClientRouting.post().edit(post_id)}
              className="px-2 py-2 dark:hover:brightness-125 hover:brightness-90 transition-all duration-75 bg-neutral-300 dark:bg-neutral-700"
            >
              <Pencil className="text-neutral-800 dark:text-neutral-300" />
            </Link>
          </li>
          <li className="flex w-full">
            <DownloadPostImage image_url={image_url} />
          </li>
        </>
      )}
    </ul>
  );
}
