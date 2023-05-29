import NextBundleAnalyzer from '@next/bundle-analyzer'
import './src/env.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // useSession will called twice in strict mode, which will cause token refresh issues
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
