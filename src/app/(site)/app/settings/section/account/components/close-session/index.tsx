"use client";

import { PrimaryButton } from "@/components/ui/buttons/primary"
import { useSupabase } from "@/hooks/use-supabase"
import { useRouting } from "@/hooks/useRouting"
import { useState } from "react"

export function CloseSession() {
  const [loading, setLoading] = useState<boolean>(false);
  const { goTo } = useRouting()

  const { supabase } = useSupabase();

  async function closeSession() {
    setLoading(true);
    await supabase.auth.signOut({ scope: "local" });
    setLoading(false);
    goTo('/auth/log-in')
  }

  return (
    <PrimaryButton
      type="button"
      onClick={closeSession}
      disabled={loading}
      isLoading={loading}
    >
      Close Session
    </PrimaryButton>
  );
}
