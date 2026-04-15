import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com", "images.pexels.com", "res.cloudinary.com"],
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'hooks', 'store'], // Specify directories to lint
  },
};

export default nextConfig;
