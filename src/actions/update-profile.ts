"use server";

import { deleteImageAsset } from "@/services/images/delete";
import { postImage } from "@/services/images/upload";
import { getSuapabaseServerComponent } from "@/supabase/models/index.models";
import { Database } from "@/supabase/types";
import { Static, TSchema, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { headers } from "next/headers";

const Nullable = <T extends TSchema>(schema: T) =>
  Type.Union([schema, Type.Null()]);

const ProfileSchema = Type.Object({
  name: Type.Optional(Nullable(Type.String())),
  website: Type.Optional(Nullable(Type.String())),
  location: Type.Optional(Nullable(Type.String())),
  description: Type.Optional(Nullable(Type.String())),
  banner_image_base64: Type.Optional(Nullable(Type.String())),
  avatar_image_base64: Type.Optional(Nullable(Type.String())),
});

type TFormData = Static<typeof ProfileSchema>;

export async function updateProfile(formData: TFormData) {
  try {
    const areFieldsValid = Value.Check(ProfileSchema, formData);
    if (!areFieldsValid) throw new Error();
  } catch (error) {
    throw new Error("error validating formData schema");
  }

  const originUrl = headers().get("origin");

  if (!originUrl) throw new Error("no origin header found");

  const supabase = getSuapabaseServerComponent();

  const {
    data: { session },
    error: errorGettingSession,
  } = await supabase.auth.getSession();

  const userId = session?.user.id;

  if (errorGettingSession || !userId) throw new Error("error getting session");

  const { data: userOldProfile, error: errorGettingOldProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!userOldProfile || errorGettingOldProfile)
    throw new Error("error getting old profile");

  let newAvatarImageUrl: string | null = null;
  let newBannerImageUrl: string | null = null;

  try {
    const finalUpdateBody: Database["public"]["Tables"]["profiles"]["Update"] =
      {
        ...(formData.name && { name: formData.name }),
        ...(formData.website && { website: formData.website }),
        ...(formData.location && { location: formData.location }),
        ...(formData.description && { description: formData.description }),
      };

    if (formData.avatar_image_base64) {
      const { data: avatarImage, error } = await postImage({
        image: formData.avatar_image_base64,
        origin: originUrl,
      });

      if (!avatarImage) throw new Error("error posting avatar image");

      newAvatarImageUrl = avatarImage.secure_url;

      if (error) throw new Error("error posting avata image");

      finalUpdateBody.avatar_url = avatarImage.secure_url;
    }

    if (formData.banner_image_base64) {
      const { data: bannerImage, error } = await postImage({
        image: formData.banner_image_base64,
        origin: originUrl,
      });

      if (!bannerImage) throw new Error("error posting banner image");

      newBannerImageUrl = bannerImage.secure_url;

      if (error) throw new Error("error posting banner image");

      finalUpdateBody.banner_url = bannerImage.secure_url;
    }

    const { error } = await supabase
      .from("profiles")
      .update(finalUpdateBody)
      .eq("user_id", userId);

    if (error) throw new Error("error updating profile data");

    // delete old banner
    if (
      finalUpdateBody.banner_url &&
      formData.banner_image_base64 &&
      userOldProfile.banner_url
    ) {
      try {
        console.log("deleting former banner image asset");
        await deleteImageAsset(userOldProfile.banner_url, originUrl);
      } catch (error) {
        console.log("could not delete banner former image asset");
      }
    }

    // delete old avatar
    if (
      finalUpdateBody.avatar_url &&
      formData.avatar_image_base64 &&
      userOldProfile.avatar_url
    ) {
      try {
        console.log("deleting former avatar image asset");
        await deleteImageAsset(userOldProfile.avatar_url, originUrl);
      } catch (error) {
        console.log("could not delete avatar former image asset");
      }
    }

    return "OK";
  } catch (error) {
    // if the code above fails, delete the images uploaded

    if (newAvatarImageUrl) {
      try {
        await deleteImageAsset(newAvatarImageUrl, originUrl);
      } catch (error) {}
    }

    if (newBannerImageUrl) {
      try {
        await deleteImageAsset(newBannerImageUrl, originUrl);
      } catch (error) {}
    }

    await supabase
      .from("profiles")
      .update(userOldProfile)
      .eq("user_id", userId);

    throw new Error("error updating profile");
  }
}
