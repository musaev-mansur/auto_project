// next.config.mjs
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    // ВКЛЮЧИ оптимизацию Next/Image (если хочешь без оптимизации — поставь true)
    unoptimized: false,

    // Старый короткий список (можно оставить для удобства)
    domains: [
      'localhost',
      'autoproject-xi78.onrender.com',
      'autodealer-images.s3.eu-north-1.amazonaws.com',
    ],

    // Точный список удалённых источников картинок
    remotePatterns: [
      // S3: https://autodealer-images.s3.eu-north-1.amazonaws.com/...
      {
        protocol: 'https',
        hostname: 'autodealer-images.s3.eu-north-1.amazonaws.com',
      },
      // S3 вариант через общий endpoint: https://s3.eu-north-1.amazonaws.com/autodealer-images/...
      {
        protocol: 'https',
        hostname: 's3.eu-north-1.amazonaws.com',
        pathname: '/autodealer-images/**',
      },
      // твой прод-домен Render (на случай абсолютных URL на себя)
      {
        protocol: 'https',
        hostname: 'autoproject-xi78.onrender.com',
      },
      // локалка
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },

  // прод-режим: standalone
  output: 'standalone',

  // алиас '@/...' на корень проекта
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    }
    return config
  },
}

export default nextConfig
