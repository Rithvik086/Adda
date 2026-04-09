/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/features", "@repo/types"],
};

export default nextConfig;
