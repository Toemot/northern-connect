import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin workspace root to silence multi-lockfile warning
  outputFileTracingRoot: path.join(__dirname),
  // Required for react-leaflet SSR compatibility
  transpilePackages: ["leaflet", "react-leaflet"],
};

export default nextConfig;
