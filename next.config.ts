import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: [
      '@tremor/react',
      'chart.js',
      'react-chartjs-2',
      'framer-motion',
      '@tanstack/react-table',
      'lucide-react'
    ],
  },
  
  // Webpack configuration for better code splitting
  webpack: (config, { dev, isServer }) => {
    // Add bundle analyzer in analyze mode
    if (!isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: '../bundle-analyzer-report.html',
          openAnalyzer: false,
        })
      );
    }
    
    // Simplified bundle splitting for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Group chart and visualization libraries
          charts: {
            name: 'charts',
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2|@tremor\/react|recharts)[\\/]/,
            chunks: 'all',
            priority: 20,
          },
          // Group UI libraries
          ui: {
            name: 'ui',
            test: /[\\/]node_modules[\\/](@radix-ui|@heroui|@nextui-org|lucide-react)[\\/]/,
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }

    return config;
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
