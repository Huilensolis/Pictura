import { BackwardsNav } from "@/components/feature/nav/backwards";
import { Heading } from "@/components/ui/typography/heading";
import { getSuapabaseServerComponent } from "@/supabase/models/index.models";
import { Post } from "./components/post";
import { RecentPosts } from "./components/recent-posts";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postid: string }>;
}): Promise<Metadata> {
  const { postid } = await params;
  const supabase = getSuapabaseServerComponent();

  const { data: postData } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postid)
    .single();

  if (!postData) {
    return {
      title: "Post Not Found - Pictura",
      description: "The requested post could not be found.",
    };
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("username, name")
    .eq("id", postData.profile_id)
    .single();

  return {
    title: `${postData.title} - Pictura`,
    description: postData.title,
    openGraph: {
      title: postData.title,
      description: postData.title,
      type: "article",
      images: [
        {
          url: postData.asset_url,
          width: postData.asset_width,
          height: postData.asset_height,
          alt: postData.title,
        },
      ],
      authors: profileData?.username ? [profileData.username] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: postData.title,
      description: postData.title,
      images: [postData.asset_url],
    },
  };
}

export default async function PostPage({
  params: { postid },
}: {
  params: { postid: string };
}) {
  const supabase = getSuapabaseServerComponent();

  const { data: postData, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postid)
    .single();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const doesUserOwnPost = Boolean(
    user && user.id && !error && user.id === postData?.user_id,
  );

  return (
    <>
      <nav className="w-full flex items-center gap-4 pb-2 border-b border-neutral-300 dark:border-cm-lighter-gray">
        <BackwardsNav catchHref="/app" />
        <Heading level={9}>Back</Heading>
      </nav>
      {postData && !postError ? (
        <section className="flex flex-col gap-2">
          <Post post={postData} doesUserOwnPost={doesUserOwnPost} />
          <RecentPosts excludedPostId={postData.id} userId={user?.id || ""} />
        </section>
      ) : (
        <Error404Box />
      )}
    </>
  );
}

function Error404Box() {
  return (
    <div className="w-full flex flex-col gap-2 items-center justify-center py-32 border-y border-neutral-300 dark:border-cm-lighter-gray">
      <span className="text-neutral-800 dark:text-neutral-300">
        404 not found
      </span>
      <p className="text-neutral-800 dark:text-neutral-300 ">
        we could not find this post, we are sorry : (
      </p>
    </div>
  );
}
