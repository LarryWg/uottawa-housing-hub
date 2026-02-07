export interface HousingListing {
  id: string;
  landlordId?: string | null;
  title: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  distanceToCampus: string; // e.g. "10 min walk"
  description?: string;
  landlordId?: string | null;
  landlordName?: string | null;
  landlordEmail?: string | null;
}
