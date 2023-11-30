import NextBundleAnalyzer from '@next/bundle-analyzer'

import './env.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: '100%',
          },
        },
      ],
    })
    return config
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
}

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
