// utils/image.ts

export const getImgPath = (path: string): string => {
  if (!path) return "";

  // Always return relative path (Next.js handles domain automatically)
  return path.startsWith("/") ? path : `/${path}`;
};

export const getDataPath = (path: string): string => {
  if (!path) return "";

  // Just return path directly (no basePath logic needed)
  return path.startsWith("/") ? path : `/${path}`;
};



export const getAssetUrl = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;

  const isProd = process.env.NODE_ENV === "production";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // Ensure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (isProd && apiUrl) {
    return `${apiUrl}${cleanPath}`;
  }

  return cleanPath;
};