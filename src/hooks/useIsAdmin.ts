import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const BOOTSTRAP_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

/**
 * Returns whether the current user is an admin.
 * Checks: 1) VITE_ADMIN_EMAIL env (bootstrap), 2) admin_users table.
 */
export function useIsAdmin() {
  const { user } = useAuth();

  const { data: isAdmin = false, isLoading: isAdminLoading } = useQuery({
    queryKey: ["isAdmin", user?.id, user?.email],
    queryFn: async () => {
      if (!user?.email) return false;
      if (BOOTSTRAP_EMAIL && user.email.toLowerCase() === BOOTSTRAP_EMAIL.toLowerCase()) {
        return true;
      }
      const { data } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", user.email.toLowerCase())
        .maybeSingle();
      return !!data;
    },
    enabled: !!user?.email,
  });

  return { isAdmin, isAdminLoading };
}
