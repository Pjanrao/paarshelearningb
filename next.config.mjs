/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: "export", // Commented out to enable API routes for NextAuth
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
