import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { toast } from "sonner";
import { Shield, Trash2 } from "lucide-react";

const addAdminSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type AddAdminFormValues = z.infer<typeof addAdminSchema>;

const AdminDashboardPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isAdminLoading } = useIsAdmin();
  const { admins, isLoading: adminsLoading, addAdmin, removeAdmin } = useAdminUsers();
  const navigate = useNavigate();

  const form = useForm<AddAdminFormValues>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
    else if (!authLoading && user && !isAdminLoading && !isAdmin) navigate("/");
  }, [authLoading, user, isAdminLoading, isAdmin, navigate]);

  const onSubmit = async (values: AddAdminFormValues) => {
    addAdmin.mutate(values.email, {
      onSuccess: () => {
        toast.success(`${values.email} added as admin`);
        form.reset();
      },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleRemove = (email: string) => {
    if (!confirm(`Remove ${email} as admin?`)) return;
    removeAdmin.mutate(email, {
      onSuccess: () => toast.success(`${email} removed`),
      onError: (err: Error) => toast.error(err.message),
    });
  };

  if (authLoading || (user && isAdminLoading) || (user && !isAdminLoading && !isAdmin)) {
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
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage admin access by email</p>
            </div>
          </div>

          <div className="space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Add admin email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={addAdmin.isPending}>
                  {addAdmin.isPending ? "Adding…" : "Add admin"}
                </Button>
              </form>
            </Form>

            <div>
              <h2 className="mb-3 text-sm font-semibold">Admin users</h2>
              {admins.length === 0 ? (
                <p className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                  No admins yet. Add one above or insert via Supabase SQL Editor.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.email}>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemove(admin.email)}
                            disabled={removeAdmin.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
