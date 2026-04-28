import type { Metadata, ResolvingMetadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/api/settings";
import { ThemeProvider } from "@/components/ThemeProvider";

const cormorant = Cormorant_Garamond({
  variable: "--app-font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--app-font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL("https://hutabaratlawoffice.com"), // Placeholder URL, can be updated
    title: {
      default: settings.tab_title || `${settings.site_name} | Blitar`,
      template: (settings as any).tab_title_template || `%s | ${settings.site_name}`,
    },
    description: settings.site_description || "Firma hukum profesional di Blitar khusus Perlindungan Konsumen & Gugatan Sipil.",
    openGraph: {
      title: settings.tab_title || settings.site_name,
      description: settings.site_description,
      images: [
        {
          url: (settings as any).og_image_default_url || "/images/hero-portrait.png",
          width: 1200,
          height: 630,
          alt: settings.site_name,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    icons: {
      icon: (settings as any).favicon_url || "/favicon.svg",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground font-sans flex flex-col min-h-screen selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>{children}</ThemeProvider>
      </body>
    </html>
  );
}


