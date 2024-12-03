"use server";

import { getSuapabaseServerComponent } from "@/supabase/models/index.models";
import { randomUUID } from "crypto";

export async function createDefaultProfile() {
  const supabase = getSuapabaseServerComponent();

  const randomUsername = randomUUID({ disableEntropyCache: true }).slice(0, 12);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("error getting user");

  const { error: errorCreatingUserProfile } = await supabase
    .from("profiles")
    .insert({
      name: randomUsername,
      user_id: user.id,
      username: randomUsername,
    });

  if (errorCreatingUserProfile) {
    throw new Error("error creating profile");
  }
}
