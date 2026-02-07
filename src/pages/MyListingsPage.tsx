import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLandlordListings } from "@/hooks/useLandlordListings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Bed,
  Bath,
  Plus,
  Trash2,
  LayoutList,
  Home,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { HousingListing } from "@/types/listings";

const UOTTAWA_LAT = 45.4215;
const UOTTAWA_LNG = -75.6919;

const listingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  address: z.string().min(1, "Address is required"),
  price: z.coerce.number().min(1, "Price is required"),
  bedrooms: z.coerce.number().min(1).max(10),
  bathrooms: z.coerce.number().min(1).max(10),
  distanceToCampus: z.string().min(1, "e.g. 10 min walk"),
  description: z.string().optional(),
});

type ListingFormValues = z.infer<typeof listingSchema>;

const toListing = (values: ListingFormValues, lat: number, lng: number): Omit<HousingListing, "id"> => ({
  title: values.title,
  address: values.address,
  lat,
  lng,
  price: values.price,
  bedrooms: values.bedrooms,
  bathrooms: values.bathrooms,
  distanceToCampus: values.distanceToCampus,
  description: values.description,
});

const MyListingsPage = () => {
  const { listings, isLoading, createListing, deleteListing } = useLandlordListings();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      address: "",
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      distanceToCampus: "10 min walk",
      description: "",
    },
  });

  const onSubmit = (values: ListingFormValues) => {
    const lat = selectedCoords?.lat ?? UOTTAWA_LAT + (Math.random() - 0.5) * 0.02;
    const lng = selectedCoords?.lng ?? UOTTAWA_LNG + (Math.random() - 0.5) * 0.02;
    createListing.mutate(toListing(values, lat, lng), {
      onSuccess: () => {
        toast.success("Listing created!");
        form.reset();
        setSelectedCoords(null);
        setDialogOpen(false);
      },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    deleteListing.mutate(id, {
      onSuccess: () => toast.success("Listing deleted"),
      onError: (err: Error) => toast.error(err.message),
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Listings</h1>
              <p className="text-muted-foreground">
                Manage your rental properties visible to students on the Housing Map.
              </p>
            </div>
            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) setSelectedCoords(null);
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add listing
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add new listing</DialogTitle>
                  <DialogDescription>
                    Enter the details of your rental property. It will appear on the Housing Map.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Cozy 2BR near campus" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <AddressAutocomplete
                              value={field.value}
                              onChange={field.onChange}
                              onSelect={(sel) => {
                                field.onChange(sel.address);
                                setSelectedCoords({ lat: sel.lat, lng: sel.lng });
                              }}
                              placeholder="Start typing address (e.g. 123 Main St, Ottawa)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (CAD/month)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="1200" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="distanceToCampus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Distance to campus</FormLabel>
                            <FormControl>
                              <Input placeholder="10 min walk" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <Select
                              onValueChange={(v) => field.onChange(Number(v))}
                              value={String(field.value)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <SelectItem key={n} value={String(n)}>
                                    {n}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bathrooms</FormLabel>
                            <Select
                              onValueChange={(v) => field.onChange(Number(v))}
                              value={String(field.value)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 2, 3].map((n) => (
                                  <SelectItem key={n} value={String(n)}>
                                    {n}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the property, amenities, etc."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createListing.isPending}>
                        {createListing.isPending ? "Creating…" : "Add listing"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <LayoutList className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="mb-2">No listings yet</CardTitle>
                <CardDescription className="mb-6 text-center">
                  Add your first rental property to appear on the Housing Map for students.
                </CardDescription>
                <Button onClick={() => setDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add your first listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="line-clamp-1 text-base">{listing.title}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-1 line-clamp-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {listing.address}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="shrink-0 font-semibold">
                        ${listing.price}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                    </div>
                    {listing.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {listing.description}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        asChild
                      >
                        <Link to={`/housing-map?listing=${listing.id}`}>
                          <MapPin className="h-3.5 w-3.5" />
                          View on map
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(listing.id, listing.title)}
                        disabled={deleteListing.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyListingsPage;
