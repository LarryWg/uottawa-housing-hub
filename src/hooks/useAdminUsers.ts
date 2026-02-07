import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdminUsers() {
  const queryClient = useQueryClient();

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_users")
        .select("email, created_at")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const addAdmin = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase
        .from("admin_users")
        .insert({ email: email.toLowerCase().trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });

  const removeAdmin = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase
        .from("admin_users")
        .delete()
        .eq("email", email.toLowerCase());
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });

  return { admins, isLoading, addAdmin, removeAdmin };
}
