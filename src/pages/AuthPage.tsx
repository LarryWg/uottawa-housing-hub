import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Home, LogIn, UserPlus, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type UserType = "student" | "landlord";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

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

type LoginFormValues = z.infer<typeof loginSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

const campusImage =
  "https://upload.wikimedia.org/wikipedia/commons/f/f7/UOttawa-Tabaret_Hall-2008-05-05.jpg";

const AuthPage = () => {
  const location = useLocation();
  const isSignUp = location.pathname === "/signup";
  const defaultTab = isSignUp ? "signup" : "signin";
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const { signIn, signUp, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [userType, setUserType] = useState<UserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [authLoading, user, navigate, from]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onLogin = async (values: LoginFormValues) => {
    if (!userType) {
      toast.error("Please select Student or Landlord");
      return;
    }
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

  const onSignUp = async (values: SignUpFormValues) => {
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
    <div className="flex min-h-screen">
      {/* Left panel - branded visual */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${campusImage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="relative z-10 p-12">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              UOttawa Housing Hub
            </span>
          </Link>
        </div>
        <div className="relative z-10 px-12 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md"
          >
            <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
              Find your place in the Gee-Gees community
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Connect with roommates, explore housing near campus, and get
              AI-powered lease analysis — all in one place.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="relative flex flex-1 flex-col justify-center px-6 py-12 pt-24 lg:px-12 lg:pt-12">
        {/* Mobile header - visible when left panel is hidden */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-foreground">
              UOttawa <span className="text-primary">Housing Hub</span>
            </span>
          </Link>
        </div>
        <div className="mx-auto w-full max-w-[420px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-1.5 text-muted-foreground">
                {isSignUp
                  ? "Join UOttawa Housing Hub to get started."
                  : "Sign in to continue to your account."}
              </p>
            </div>

            <Tabs
              value={defaultTab}
              onValueChange={(v) => navigate(v === "signup" ? "/signup" : "/login")}
              className="w-full"
            >
              <TabsList className="mb-6 grid w-full grid-cols-2 bg-muted/60 p-1">
                <TabsTrigger
                  value="signin"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign up
                </TabsTrigger>
              </TabsList>

              <div className="mb-6">
                <p className="mb-3 text-sm font-medium text-foreground">
                  I am a
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      {
                        type: "student" as const,
                        icon: GraduationCap,
                        label: "Student",
                        desc: "Find housing & roommates",
                      },
                      {
                        type: "landlord" as const,
                        icon: Home,
                        label: "Landlord",
                        desc: "List & manage properties",
                      },
                    ]
                  ).map(({ type, icon: Icon, label, desc }) => (
                    <Card
                      key={type}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:border-primary/40 hover:shadow-md",
                        userType === type &&
                          "border-primary bg-primary/5 ring-2 ring-primary/20"
                      )}
                      onClick={() => setUserType(type)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div
                          className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                            userType === type ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold">{label}</span>
                          <p className="text-xs text-muted-foreground">
                            {desc}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <TabsContent value="signin" className="mt-0">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLogin)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@uottawa.ca"
                              autoComplete="email"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              autoComplete="current-password"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="h-11 w-full"
                      disabled={isSubmitting || !userType}
                    >
                      {isSubmitting
                        ? "Signing in…"
                        : `Sign in as ${userType ?? "…"}`}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <Form {...signUpForm}>
                  <form
                    onSubmit={signUpForm.handleSubmit(onSignUp)}
                    className="space-y-4"
                  >
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@uottawa.ca"
                              autoComplete="email"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="At least 6 characters"
                              autoComplete="new-password"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              autoComplete="new-password"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="h-11 w-full"
                      disabled={isSubmitting || !userType}
                    >
                      {isSubmitting
                        ? "Creating account…"
                        : `Create account as ${userType ?? "…"}`}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <Link
                to={isSignUp ? "/login" : "/signup"}
                className="font-semibold text-primary hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Link>
            </p>

            <p className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to home
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
