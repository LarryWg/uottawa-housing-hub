import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserType } from "./LoginPage";

const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const { signUp, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) navigate("/", { replace: true });
  }, [authLoading, user, navigate]);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    if (!userType) {
      toast.error("Please select Student or Landlord");
      return;
    }
    setIsSubmitting(true);
    const { data, error } = await signUp(values.email, values.password);
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data?.user?.id) {
      await supabase
        .from("profiles")
        .upsert({ id: data.user.id, user_type: userType }, { onConflict: "id" });
    }

    toast.success("Account created! Set up your profile.");
    navigate("/profile");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
            <p className="mt-2 text-muted-foreground">
              Choose how you&apos;re using the platform, then sign up.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card
              className={cn(
                "cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
                userType === "student" && "border-primary ring-2 ring-primary/20"
              )}
              onClick={() => setUserType("student")}
            >
              <CardContent className="flex flex-col items-center gap-2 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="font-semibold">Student</span>
                <span className="text-center text-xs text-muted-foreground">
                  Find housing & roommates
                </span>
              </CardContent>
            </Card>
            <Card
              className={cn(
                "cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
                userType === "landlord" && "border-primary ring-2 ring-primary/20"
              )}
              onClick={() => setUserType("landlord")}
            >
              <CardContent className="flex flex-col items-center gap-2 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Home className="h-6 w-6" />
                </div>
                <span className="font-semibold">Landlord</span>
                <span className="text-center text-xs text-muted-foreground">
                  List & manage properties
                </span>
              </CardContent>
            </Card>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@uottawa.ca"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting || !userType}>
                {isSubmitting ? "Creating account…" : `Sign up as ${userType ?? "…"}`}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;
