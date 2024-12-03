import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { Database } from "@/supabase/types";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    });

    try {
      const {
        data: { user },
        error: errorExangingCodeForSession,
      } = await supabase.auth.exchangeCodeForSession(code);

      if (!user || errorExangingCodeForSession)
        throw new Error("error exchanging code for session");

      const randomUsername = randomUUID({ disableEntropyCache: true }).slice(
        0,
        12,
      );

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

      return NextResponse.redirect(`${requestUrl.origin}/app`);
    } catch (error) {
      return NextResponse.redirect(`${requestUrl.origin}/auth/log-in`);
    }
  }
  return NextResponse.redirect(`${requestUrl.origin}/auth/log-in`);
}
