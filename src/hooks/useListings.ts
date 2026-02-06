import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_LISTINGS } from "@/data/mockListings";
import type { HousingListing } from "@/types/listings";

/**
 * Fetches housing listings. Uses Supabase if a `listings` table exists with
 * compatible columns (id, title, address, lat, lng, price, bedrooms, bathrooms).
 * Falls back to mock data otherwise.
 */
export function useListings() {
  return useQuery({
    queryKey: ["listings"],
    queryFn: async (): Promise<HousingListing[]> => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("id, title, address, lat, lng, price, bedrooms, bathrooms, distance_to_campus")
          .limit(100);

        if (error) {
          // Table might not exist yet - use mock data
          console.info("Supabase listings not available, using mock data:", error.message);
          return MOCK_LISTINGS;
        }

        if (!data?.length) return MOCK_LISTINGS;

        return data.map((row: Record<string, unknown>) => ({
          id: String(row.id),
          title: String(row.title),
          address: String(row.address),
          lat: Number(row.lat),
          lng: Number(row.lng),
          price: Number(row.price),
          bedrooms: Number(row.bedrooms),
          bathrooms: Number(row.bathrooms),
          distanceToCampus: String(row.distance_to_campus ?? "—"),
        }));
      } catch {
        return MOCK_LISTINGS;
      }
    },
  });
}
