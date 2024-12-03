"use server";

import { deleteImageAsset } from "@/services/images/delete";
import { postImage } from "@/services/images/upload";
import { getSuapabaseServerComponent } from "@/supabase/models/index.models";
import { getMostUsedColorInImageColors } from "@/utils/get-most-used-colors-image";
import { Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { headers } from "next/headers";

const PostSchema = Type.Object({
  title: Type.String(),
});

const ImageSchema = Type.String();

const FormDataSchema = Type.Object({
  image: ImageSchema,
  post: PostSchema,
});

type TFormData = Static<typeof FormDataSchema>;

export async function createNewPost(
  formData: TFormData,
): Promise<{ newPostId: number }> {
  try {
    const areFieldsValid = Value.Check(PostSchema, formData.post);
    if (!areFieldsValid) throw new Error();
  } catch (error) {
    throw new Error("error validating formData schema");
  }

  const supabase = getSuapabaseServerComponent();

  let imageUrl: string | null = null;

  try {
    const {
      data: { session },
      error: errorGettingSession,
    } = await supabase.auth.getSession();

    if (!session || !session.user || errorGettingSession)
      throw new Error("error getting session");

    const { user } = session;

    const { data: userPosts, error: errorGettingPosts } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id);

    if (errorGettingPosts) throw new Error("error getting posts");

    if (
      userPosts &&
      userPosts.length >= (Number(process.env.MAX_POSTS_PER_USER) || 24)
    )
      throw new Error("limit reached");

    const { data: userProfile, error: errorGettingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!userProfile || errorGettingProfile)
      throw new Error("error getting profile");

    const origin = headers().get("origin");

    if (!origin) throw new Error("error getting origin");

    const {
      image,
      post: { title },
    } = formData;

    const { error: errorUploadingImage, data } = await postImage({
      image,
      origin,
    });

    if (errorUploadingImage || !data) throw new Error("error uploading image");

    const imageData = data;

    imageUrl = imageData.secure_url;

    const mostUsedColorHex = getMostUsedColorInImageColors(imageData.colors);

    const { error, data: newPost } = await supabase
      .from("posts")
      .insert({
        asset_url: imageData.secure_url,
        title,
        profile_id: userProfile.id,
        user_id: user.id,
        asset_width: imageData.width,
        asset_height: imageData.height,
        asset_color: mostUsedColorHex,
      })
      .eq("profile_id", userProfile.id)
      .select("*")
      .single();

    if (error || !newPost) throw new Error("error creating post");

    return { newPostId: newPost.id };
  } catch (error) {
    if (imageUrl) await deleteImageAsset(imageUrl);
    console.log(error);
    throw new Error("error posting psot");
  }
}
