import { LazyImage } from "@/components/feature/lazy-image";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientRouting } from "@/models/routing/client";
import { getSuapabaseServerComponent } from "@/supabase/models/index.models";
import { getShortName } from "@/utils/get-short-name";
import Link from "next/link";
import { Suspense } from "react";
import { CollectionPosts } from "./collection-posts";

export default async function CollectionPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const supabase = getSuapabaseServerComponent();
  const { data: collection } = await supabase
    .from("collection")
    .select("*")
    .eq("id", id)
    .single();

  if (!collection) return <p>not found</p>;

  const { data: collectionItems } = await supabase
    .from("collection_item")
    .select("*")
    .limit(3)
    .eq("collection_id", collection.id)
    .order("created_at", { ascending: false });

  const { data: collectionPosts } = collectionItems
    ? await supabase
        .from("posts")
        .select("*")
        .in(
          "id",
          collectionItems.map((item) => item.post_id),
        )
    : { data: null };

  return (
    <main className="flex flex-col px-2 py-10">
      <header className="md:grid md:grid-cols-2 flex flex-col gap-4 w-full max-w-3xl">
        <div className="h-60 w-full rounded-sm overflow-hidden">
          <ul className="grid grid-cols-2 grid-rows-2 h-full">
            {collectionPosts &&
              collectionPosts.length > 0 &&
              collectionPosts.map((post, i, posts) => (
                <li
                  key={post.id}
                  className={`${
                    posts.length === 2
                      ? "col-span-1 row-span-2"
                      : posts.length === 3
                        ? `${
                            i === 0
                              ? "row-span-2 col-span-1"
                              : "row-span-1 col-span-1"
                          }`
                        : "col-span-2 row-span-2"
                  }`}
                >
                  <LazyImage
                    src={post.asset_url}
                    alt={post.title}
                    className="w-full object-cover object-center h-full"
                    skeletonBgColor={post.asset_color || undefined}
                  />
                </li>
              ))}{" "}
            {!collectionPosts ||
              (collectionPosts.length === 0 && (
                <Skeleton className="w-full h-full row-span-2 col-span-2" />
              ))}
          </ul>
        </div>
        <section className="flex flex-col gap-2">
          <h1 className="font-bold text-2xl">{collection.title}</h1>
          {collection.description && (
            <p className="text-pretty text-neutral-700">
              {getShortName(collection.description, 250)}
            </p>
          )}
          <div>
            <Suspense
              fallback={
                <div className="flex gap-2 w-full">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex flex-col justify-between">
                    <Skeleton className="w-20 h-4 rounded-full" />
                    <Skeleton className="w-48 h-4 rounded-full" />
                  </div>
                </div>
              }
            >
              <CollectionOwner userId={collection.user_id} />
            </Suspense>
          </div>
        </section>
      </header>
      <CollectionPosts collection_id={collection.id} />
    </main>
  );
}

async function CollectionOwner({ userId }: { userId: string }) {
  const supabase = getSuapabaseServerComponent();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!profile) return <></>;

  return (
    <Link href={ClientRouting.profile(profile.username || "")}>
      <article className="flex gap-2">
        {profile.avatar_url ? (
          <LazyImage
            src={profile.avatar_url}
            alt={profile.name || ""}
            className="h-12 w-12 rounded-full"
            skeletonClassName="h-12 w-12 rounded-full"
          />
        ) : (
          <Skeleton />
        )}
        <div className="flex flex-col justify-between">
          <span className="font-bold">{profile.username}</span>{" "}
          <span>created this collection</span>
        </div>
      </article>
    </Link>
  );
}
