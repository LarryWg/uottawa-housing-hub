import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HousingMap } from "@/components/housing-map/HousingMap";
import { useListings } from "@/hooks/useListings";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Bed, Bath, Home, MessageCircle } from "lucide-react";
import type { HousingListing } from "@/types/listings";
import { Button } from "@/components/ui/button";
import { LocalChatPopup } from "@/components/messaging/LocalChatPopup";

const HousingMapPage = () => {
  const { data: listings = [], isLoading } = useListings();
  const [selectedListing, setSelectedListing] = useState<HousingListing | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <div className="border-b bg-muted/30 px-4 py-6">
          <div className="container">
            <h1 className="mb-1 text-2xl font-bold tracking-tight">Housing Map</h1>
            <p className="text-muted-foreground">
              Explore apartments near uOttawa campus. Click a marker or listing for details.
            </p>
          </div>
        </div>

        <div className="container flex flex-1 flex-col gap-4 py-6 lg:flex-row">
          {/* Listings sidebar */}
          <aside className="w-full shrink-0 space-y-4 lg:w-80">
            <h2 className="text-sm font-semibold text-muted-foreground">Listings</h2>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))
            ) : (
              <div className="space-y-3">
                {listings.map((listing) => (
                  <Card
                    key={listing.id}
                    className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
                      selectedListing?.id === listing.id ? "border-primary ring-2 ring-primary/20" : ""
                    }`}
                    onClick={() => setSelectedListing(listing)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm line-clamp-1">{listing.title}</p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="line-clamp-1">{listing.address}</span>
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0 font-semibold">
                          ${listing.price}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4 pt-0 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bed className="h-3.5 w-3" />
                        {listing.bedrooms} BR
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-3.5 w-3" />
                        {listing.bathrooms} BA
                      </span>
                      <span className="flex items-center gap-1">
                        <Home className="h-3.5 w-3" />
                        {listing.distanceToCampus}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  Message a landlord
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  {selectedListing
                    ? `Selected: ${selectedListing.title}`
                    : "Select a listing to start a message."}
                </div>
                <Button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full"
                  disabled={!selectedListing}
                >
                  Open chat
                </Button>
                <p className="text-xs text-muted-foreground">
                  Opens a local-only chat in the corner.
                </p>
              </CardContent>
            </Card>
          </aside>

          {/* Map */}
          <div className="min-h-[400px] flex-1 rounded-lg border bg-muted/20">
            <HousingMap
              listings={listings}
              selectedListingId={selectedListing?.id}
              onListingClick={setSelectedListing}
            />
          </div>
        </div>
      </main>
      <Footer />
      {selectedListing && (
        <LocalChatPopup
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          threadId={`listing-${selectedListing.id}`}
          recipientName={selectedListing.landlordName ?? "Listing owner"}
          contextLabel={selectedListing.title}
        />
      )}
    </div>
  );
};

export default HousingMapPage;
