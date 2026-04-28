"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error("Gagal masuk. Email atau kata sandi salah.");
        setIsLoading(false);
      } else {
        toast.success("Berhasil masuk ke Panel Admin");
        // Force hard refresh to clear any cached states and re-run middleware
        window.location.href = "/admin";
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 bg-background noise-bg" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl text-foreground font-bold mb-2">
              Panel Admin
            </h1>
            <p className="text-muted-foreground text-sm">
              Masuk untuk mengelola website Hutabarat Law
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                          placeholder="admin@hutabaratlawoffice.com"
                          className="pl-10 bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Kata Sandi</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-bold uppercase tracking-wider mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="bg-background p-4 text-center border-t border-border">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

