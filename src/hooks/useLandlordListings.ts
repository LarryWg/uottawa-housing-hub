import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { HousingListing } from "@/types/listings";

export function useLandlordListings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings", "landlord", user?.id],
    queryFn: async (): Promise<HousingListing[]> => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("listings")
        .select("id, landlord_id, title, address, lat, lng, price, bedrooms, bathrooms, distance_to_campus, description")
        .eq("landlord_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: Record<string, unknown>) => ({
        id: String(row.id),
        landlordId: row.landlord_id ? String(row.landlord_id) : null,
        title: String(row.title),
        address: String(row.address),
        lat: Number(row.lat),
        lng: Number(row.lng),
        price: Number(row.price),
        bedrooms: Number(row.bedrooms),
        bathrooms: Number(row.bathrooms),
        distanceToCampus: String(row.distance_to_campus ?? "—"),
        description: row.description ? String(row.description) : undefined,
      }));
    },
    enabled: !!user?.id,
  });

  const createListing = useMutation({
    mutationFn: async (listing: Omit<HousingListing, "id">) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("listings")
        .insert({
          landlord_id: user.id,
          title: listing.title,
          address: listing.address,
          lat: listing.lat,
          lng: listing.lng,
          price: listing.price,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          distance_to_campus: listing.distanceToCampus,
          description: listing.description ?? null,
        })
        .select("id")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });

  const deleteListing = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", id)
        .eq("landlord_id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });

  return { listings, isLoading, createListing, deleteListing };
}
