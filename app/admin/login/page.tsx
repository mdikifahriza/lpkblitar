"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, Eye, EyeOff, User } from "lucide-react";
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
import { getEmailByUsername } from "./actions";

// Accept either a valid email OR a non-empty string as a username
const loginSchema = z.object({
  identifier: z.string().min(2, { message: "Email atau Username wajib diisi" }),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    let loginEmail = values.identifier;

    // Cek apakah inputnya BUKAN format email (asumsikan username)
    if (!loginEmail.includes("@")) {
      const result = await getEmailByUsername(values.identifier);
      if (result.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }
      if (result.email) {
        loginEmail = result.email;
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: values.password,
      });

      if (error) {
        toast.error("Gagal masuk. Identitas atau kata sandi salah.");
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
    <div className="theme-admin min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 bg-background noise-bg" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

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
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email / Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                          placeholder="admin@contoh.com / adminhari"
                          className="pl-10 bg-background border-border text-foreground h-12 focus-visible:ring-primary"
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
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 bg-background border-border text-foreground h-12 focus-visible:ring-primary pr-10"
                          {...field}
                        />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 shadow-md hover:shadow-lg transition-all duration-300 font-bold uppercase tracking-wider mt-4"
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
