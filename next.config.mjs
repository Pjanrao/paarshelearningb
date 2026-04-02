/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // keep if you want (optional)

    domains: [
      "res.cloudinary.com",
      "upload.wikimedia.org",
    ],

    qualities: [25, 50, 75, 100],
  },

  trailingSlash: true,
};

export default nextConfig;