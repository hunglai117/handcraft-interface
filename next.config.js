/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // domains: ['localhost'],
    domains: ['bizweb.dktcdn.net'],
  },
};

export default nextConfig;
