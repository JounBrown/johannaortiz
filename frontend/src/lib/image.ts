const ALLOWED_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "localhost",
  "api.clicicor.online",
  "lmcndepbopshuqxdukhd.supabase.co",
]);

export function isAllowedImageSrc(src?: string | null): boolean {
  if (!src) return false;
  if (src.startsWith("data:") || src.startsWith("blob:")) return true;
  if (src.startsWith("/") || src.startsWith("./")) return true;

  try {
    const url = new URL(src);
    return ALLOWED_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}
