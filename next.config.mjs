/** @type {import('next').NextConfig} */
const defaultDatabaseUrl =
  "postgresql://neondb_owner:npg_QzI8Eh4xmtvZ@ep-noisy-wildflower-b2jclyv1-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require";
const defaultJwtSecret =
  "otj_super_secret_jwt_key_2026_luxury_studio_a3e635_9876543210";

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL || defaultDatabaseUrl,
    JWT_SECRET: process.env.JWT_SECRET || defaultJwtSecret,
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || "https://otj.studio",
    ADMIN_DEFAULT_EMAIL: process.env.ADMIN_DEFAULT_EMAIL || "Otajon2009$",
    ADMIN_DEFAULT_PASSWORD: process.env.ADMIN_DEFAULT_PASSWORD || "Otajon2009$",
    ADMIN_DEFAULT_NAME: process.env.ADMIN_DEFAULT_NAME || "Otajon2009$",
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
