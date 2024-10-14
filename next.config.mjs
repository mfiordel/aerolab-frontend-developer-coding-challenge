/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.igdb.com',
            pathname: '/igdb/image/upload/**',
          },
        ],
      }
};

export default nextConfig;
