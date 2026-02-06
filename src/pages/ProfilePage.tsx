import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const profileSchema = z.object({
  userType: z.enum(["student", "landlord"]).optional(),
  introduction: z.string().optional(),
  maxBudget: z.coerce.number().min(0).optional().nullable(),
  minBedrooms: z.coerce.number().min(1).max(5).optional().nullable(),
  maxBedrooms: z.coerce.number().min(1).max(5).optional().nullable(),
  preferredAreas: z.string().optional(),
  moveInMonth: z.string().optional(),
  petFriendly: z.boolean().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5] as const;
const AREA_OPTIONS = ["Sandy Hill", "ByWard Market", "Lowertown", "Centretown", "Hintonburg", "Other"];
const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ProfilePage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery({
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
  });

  const updateProfile = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!user?.id) throw new Error("Not authenticated");
      const areas = values.preferredAreas
        ? values.preferredAreas.split(",").map((s) => s.trim()).filter(Boolean)
        : null;
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            user_type: values.userType || null,
            introduction: values.introduction || null,
            max_budget: values.maxBudget ?? null,
            min_bedrooms: values.minBedrooms ?? null,
            max_bedrooms: values.maxBedrooms ?? null,
            preferred_areas: areas,
            move_in_month: values.moveInMonth || null,
            pet_friendly: values.petFriendly ?? false,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Profile saved!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userType: "student",
      introduction: "",
      maxBudget: null,
      minBedrooms: null,
      maxBedrooms: null,
      preferredAreas: "",
      moveInMonth: "",
      petFriendly: false,
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        userType: (profile.user_type as "student" | "landlord") ?? "student",
        introduction: profile.introduction ?? "",
        maxBudget: profile.max_budget ?? null,
        minBedrooms: profile.min_bedrooms ?? null,
        maxBedrooms: profile.max_bedrooms ?? null,
        preferredAreas: profile.preferred_areas?.join(", ") ?? "",
        moveInMonth: profile.move_in_month ?? "",
        petFriendly: profile.pet_friendly ?? false,
      });
    } else if (!authLoading && !user) {
      navigate("/login");
    }
  }, [profile, authLoading, user, form, navigate]);

  if (authLoading || (user && profileLoading && !profile)) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading…</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 px-4 py-8">
        <div className="container max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold tracking-tight">Your profile</h1>
          <p className="mb-8 text-muted-foreground">
            Introduce yourself and set your housing preferences. This helps potential roommates find you.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => updateProfile.mutate(v))}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="landlord">Landlord</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Student: find housing and roommates. Landlord: list and manage properties.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="introduction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Introduction</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell potential roommates about yourself — your program, interests, lifestyle, and what you're looking for in a living situation."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be shown to other users in the roommate finder.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Housing preferences</h2>

                <FormField
                  control={form.control}
                  name="maxBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max budget (CAD/month)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 1200"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="minBedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min bedrooms</FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                          value={field.value?.toString() ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BEDROOM_OPTIONS.map((n) => (
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
                    name="maxBedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max bedrooms</FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                          value={field.value?.toString() ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BEDROOM_OPTIONS.map((n) => (
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
                  name="preferredAreas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred areas</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Sandy Hill, ByWard Market (comma-separated)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {AREA_OPTIONS.join(", ")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="moveInMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred move-in month</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MONTH_OPTIONS.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
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
                  name="petFriendly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel>Pet friendly</FormLabel>
                        <FormDescription>
                          Open to living with pets
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving…" : "Save profile"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
