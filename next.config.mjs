/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable server actions for auth handling
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
