import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { HousingListing } from "@/types/listings";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const UOTTAWA_CENTER: [number, number] = [-75.6919, 45.4215];
const ROUTE_SOURCE_ID = "route-source";
const ROUTE_LAYER_ID = "route-layer";

interface HousingMapProps {
  listings: HousingListing[];
  selectedListingId?: string | null;
  onListingClick?: (listing: HousingListing) => void;
}

export function HousingMap({ listings, selectedListingId, onListingClick }: HousingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      setError("Mapbox access token is missing. Add VITE_MAPBOX_ACCESS_TOKEN to your .env file.");
      return;
    }

    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: UOTTAWA_CENTER,
      zoom: 14,
    });

    // Add uOttawa marker
    new mapboxgl.Marker({ color: "#8F001A" })
      .setLngLat(UOTTAWA_CENTER)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          '<div class="p-2"><strong>University of Ottawa</strong><br/>75 University Private</div>'
        )
      )
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (selectedListingId && mapRef.current) {
      const listing = listings.find((l) => l.id === selectedListingId);
      if (listing) {
        mapRef.current.flyTo({ center: [listing.lng, listing.lat], zoom: 16, duration: 800 });
      }
    }
  }, [selectedListingId, listings]);

  // Draw route line from campus to selected listing (walking path)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !MAPBOX_TOKEN) return;

    let cancelled = false;

    const removeRoute = () => {
      if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
      if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);
    };

    const addRoute = async (listing: HousingListing) => {
      const coords = `${UOTTAWA_CENTER[0]},${UOTTAWA_CENTER[1]};${listing.lng},${listing.lat}`;
      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coords}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (cancelled) return;
        const coordinates = data.routes?.[0]?.geometry?.coordinates;
        if (!coordinates?.length) return;

        const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates },
        };

        if (!map.getSource(ROUTE_SOURCE_ID)) {
          map.addSource(ROUTE_SOURCE_ID, { type: "geojson", data: geojson });
          map.addLayer({
            id: ROUTE_LAYER_ID,
            type: "line",
            source: ROUTE_SOURCE_ID,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#8F001A",
              "line-width": 4,
            },
          });
        } else {
          (map.getSource(ROUTE_SOURCE_ID) as mapboxgl.GeoJSONSource).setData(geojson);
        }
      } catch {
        if (!cancelled) removeRoute();
      }
    };

    if (!selectedListingId) {
      removeRoute();
      return;
    }
    const listing = listings.find((l) => l.id === selectedListingId);
    if (!listing) {
      removeRoute();
      return;
    }
    const onLoad = () => addRoute(listing);
    if (map.isStyleLoaded()) {
      onLoad();
    } else {
      map.once("load", onLoad);
    }

    return () => {
      cancelled = true;
      removeRoute();
    };
  }, [selectedListingId, listings]);

  useEffect(() => {
    if (!mapRef.current || !listings.length) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    listings.forEach((listing) => {
      const el = document.createElement("div");
      el.className = "housing-marker";
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "hsl(353 85% 35%)";
      el.style.border = "2px solid white";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `
        <div class="min-w-[200px] p-2">
          <h3 class="font-semibold text-sm">${listing.title}</h3>
          <p class="text-xs text-gray-500 mt-1">${listing.address}</p>
          <p class="font-bold text-primary mt-2">$${listing.price}/mo</p>
          <p class="text-xs mt-1">${listing.bedrooms} BR · ${listing.bathrooms} BA · ${listing.distanceToCampus} to campus</p>
        </div>
        `
      );

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([listing.lng, listing.lat])
        .setPopup(popup)
        .addTo(mapRef.current!);

      el.addEventListener("click", () => onListingClick?.(listing));
      markersRef.current.push(marker);
    });
  }, [listings, onListingClick]);

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-destructive/50 bg-destructive/5">
        <p className="max-w-md text-center text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className="h-full min-h-[400px] w-full rounded-lg"
    />
  );
}
