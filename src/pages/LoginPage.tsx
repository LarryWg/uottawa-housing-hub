import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { GraduationCap, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export type UserType = "student" | "landlord";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [userType, setUserType] = useState<UserType | null>(null);
  const { signIn, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [authLoading, user, navigate, from]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    const { error } = await signIn(values.email, values.password);
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Welcome back!");
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12 md:flex-row md:gap-12">
        {/* uOttawa campus image - left on desktop */}
        <div className="hidden w-full max-w-md overflow-hidden rounded-2xl shadow-xl md:block md:max-w-lg">
          <img
            src="https://cms.macleans.ca/wp-content/uploads/2024/08/University-of-Ottawa-20221006-BF-FALL-CAMPUS-072-scaled.jpg"
            alt="University of Ottawa - Tabaret Hall"
            className="h-full w-full object-cover"
          />
        </div>
        {/* uOttawa image on mobile - above form */}
        <div className="block w-full max-w-xs overflow-hidden rounded-2xl shadow-lg md:hidden">
          <img
            src="https://cms.macleans.ca/wp-content/uploads/2024/08/University-of-Ottawa-20221006-BF-FALL-CAMPUS-072-scaled.jpg"
            alt="University of Ottawa"
            className="h-40 w-full object-cover"
          />
        </div>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
            <p className="mt-2 text-muted-foreground">
              Choose how you&apos;re using the platform, then sign in.
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

          {userType && (
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
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in…" : `Sign in as ${userType}`}
              </Button>
            </form>
          </Form>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
