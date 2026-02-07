import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UserType = "student" | "landlord";

export function useUserProfile() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const userType: UserType = (profile?.user_type as UserType) ?? "student";
  const isStudent = userType === "student";
  const isLandlord = userType === "landlord";

  return {
    profile,
    userType,
    isStudent,
    isLandlord,
    isLoading,
  };
}
