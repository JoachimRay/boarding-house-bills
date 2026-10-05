import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    let live = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!live) return;
      setSession(error ? null : data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      if (live) setSession(next);
    });

    return () => {
      live = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return session;
}