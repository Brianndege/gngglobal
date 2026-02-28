"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

interface TeamMemberPhotoProps {
  src: string;
  alt: string;
  className?: string;
}

export default function TeamMemberPhoto({ src, alt, className }: TeamMemberPhotoProps) {
  const [hasError, setHasError] = useState(false);

  const initials = useMemo(() => {
    return alt
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [alt]);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-800 to-charcoal-900">
        <span className="font-playfair text-4xl font-semibold text-ivory-100">{initials}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}
