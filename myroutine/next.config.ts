import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output to ship a self-contained server bundle for Docker.
  output: "standalone",
};

export default nextConfig;
