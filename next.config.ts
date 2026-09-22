import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Leaflet est incompatible avec le double-montage du Strict Mode
};

export default nextConfig;
