"use client";

import React, { useState } from "react";
import { SafeImage } from "./safe-image";
import { isVideoUrl } from "@/lib/gallery";
import { PlayCircle } from "lucide-react";

interface MediaPreviewProps {
  src: string;
  alt?: string;
  className?: string;
  showPlayIcon?: boolean;
}

export function MediaPreview({ src, alt, className = "", showPlayIcon = true }: MediaPreviewProps) {
  const isVideo = isVideoUrl(src);

  if (isVideo) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <video 
          src={src} 
          className="h-full w-full object-cover" 
          muted 
          loop 
          playsInline 
          controls={false}
          autoPlay={false} // don't autoplay everywhere
        />
        {showPlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <PlayCircle className="h-8 w-8 text-white opacity-80" />
          </div>
        )}
      </div>
    );
  }

  return (
    <SafeImage 
      src={src} 
      alt={alt || "Media preview"} 
      className={`object-cover ${className}`} 
    />
  );
}