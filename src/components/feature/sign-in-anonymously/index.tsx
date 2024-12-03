"use client";

import { createDefaultProfile } from "@/actions/create-profile";
import { PlainButton } from "@/components/ui/buttons/plain";
import { useSupabase } from "@/hooks/use-supabase";
import { ClientRouting } from "@/models/routing/client";
import { VenetianMask } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignInAnonymouslyBtn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { supabase } = useSupabase();

  const router = useRouter();

  async function SignInAnonymously() {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInAnonymously();

      if (error) {
        setError("there has been an error");
        setLoading(false);
        return;
      }

      await createDefaultProfile();

      router.push(ClientRouting.app);
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <>
      <PlainButton
        className="bg-indigo-600 dark:bg-indigo-700 text-neutral-50"
        isLoading={loading}
        disabled={loading}
        onClick={() => SignInAnonymously()}
      >
        Sign In Anonymously <VenetianMask />
      </PlainButton>
      {error && <p className="dark:text-red-500">{error}</p>}
    </>
  );
}
