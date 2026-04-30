"use client";

import React, { useState } from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function SafeImage({
  src,
  fallbackSrc = "/fallback-gambar.jpeg",
  alt,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt || "Image"}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}

