import { Globe2 } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTelegramPlane, FaYoutube } from "react-icons/fa";
import { SiThreads, SiTiktok, SiX } from "react-icons/si";
import { cn } from "@/lib/utils";

const iconMap = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  x: SiX,
  threads: SiThreads,
  tiktok: SiTiktok,
  telegram: FaTelegramPlane,
} as const;

export function SocialPlatformIcon({
  platform,
  className,
}: {
  platform?: string | null;
  className?: string;
}) {
  const normalizedPlatform = platform?.toLowerCase() ?? "";
  const Icon = iconMap[normalizedPlatform as keyof typeof iconMap] ?? Globe2;

  return <Icon className={cn("h-4 w-4", className)} />;
}
