/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable server actions for auth handling
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/admin-zone/:path*',
        destination: 'http://localhost:3001/admin-zone/:path*',
      },
    ];
  },
};

export default nextConfig;
