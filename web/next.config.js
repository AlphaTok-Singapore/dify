/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {}
});

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
    NEXT_PUBLIC_DIFY_API_URL: process.env.NEXT_PUBLIC_DIFY_API_URL || 'http://localhost:5001',
  },
  async rewrites() {
    return [
      {
        source: '/alphamind/:path*',
        destination: '/alphamind/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/console',
        destination: '/console/apps',
        permanent: false,
      },
    ]
  },
}

module.exports = withMDX(nextConfig)

