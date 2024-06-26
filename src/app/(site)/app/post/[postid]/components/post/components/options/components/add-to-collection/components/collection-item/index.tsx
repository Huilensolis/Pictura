"use client";

import { revalidatePathOnEdge } from "@/actions/revalidate-path";
import { CollectionCover } from "@/components/feature/collection/cover";
import { PlainButton } from "@/components/ui/buttons/plain";
import { useSupabase } from "@/hooks/use-supabase";
import { ClientRouting } from "@/models/routing/client";
import { Database } from "@/supabase/types";
import { getShortName } from "@/utils/get-short-name";
import { useState } from "react";

export function CollectionItem({
  collection,
  postId,
}: {
  collection: Database["public"]["Tables"]["collection"]["Row"];
  postId: Database["public"]["Tables"]["posts"]["Row"]["id"];
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const { supabase } = useSupabase();

  async function addToCollection() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("collection_item")
      .insert({ post_id: postId, collection_id: collection.id });

    await revalidatePathOnEdge(
      ClientRouting.collection().list({ filter: "default" }),
      "page",
    );
    setLoading(false);
  }
  return (
    <PlainButton
      onClick={addToCollection}
      isLoading={loading}
      className="px-0 py-0"
    >
      <header className="h-14 w-14">
        <CollectionCover collectionId={collection.id} />
      </header>
      <div className="flex flex-col flex-1">
        <h1 className="font-bold text-lg text-start w-11/12">
          {getShortName(collection.title, 23)}
        </h1>
        <p className="text-sm text-pretty w-11/12 text-start">
          {collection.description && getShortName(collection.description, 50)}
        </p>
      </div>
    </PlainButton>
  );
}
