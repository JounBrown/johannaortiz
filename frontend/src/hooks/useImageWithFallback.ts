import { useState, useCallback, useEffect, useRef } from "react";
import { isAllowedImageSrc } from "@/lib/image";

interface UseImageWithFallbackProps {
  src: string;
  fallback: string;
  alt: string;
}

interface UseImageWithFallbackReturn {
  src: string;
  alt: string;
  onError: () => void;
  onLoad: () => void;
  hasError: boolean;
  isLoading: boolean;
}

export function useImageWithFallback({
  src,
  fallback,
  alt,
}: UseImageWithFallbackProps): UseImageWithFallbackReturn {
  const resolvedSrc = isAllowedImageSrc(src) ? src : fallback;

  const [imageSrc, setImageSrc] = useState(resolvedSrc);
  const [imageAlt, setImageAlt] = useState(alt);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const prevSrcRef = useRef(resolvedSrc);

  useEffect(() => {
    const newSrc = isAllowedImageSrc(src) ? src : fallback;
    if (newSrc !== prevSrcRef.current) {
      prevSrcRef.current = newSrc;
      setImageSrc(newSrc);
      setImageAlt(alt);
      setHasError(false);
      setIsLoading(true);
    }
  }, [src, fallback, alt]);

  const handleError = useCallback(() => {
    if (!hasError) {
      console.log(`Image failed to load: ${src}`);
      setImageSrc(fallback);
      setImageAlt(`Imagen no disponible - ${alt}`);
      setHasError(true);
      setIsLoading(false);
    }
  }, [hasError, src, fallback, alt]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    if (hasError && imageSrc === src) {
      setHasError(false);
    }
  }, [hasError, imageSrc, src]);

  return {
    src: imageSrc,
    alt: imageAlt,
    onError: handleError,
    onLoad: handleLoad,
    hasError,
    isLoading,
  };
}
