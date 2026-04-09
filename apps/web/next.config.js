/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/features", "@repo/types"],
};

module.exports = nextConfig;
