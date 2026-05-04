import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
      allowedOrigins: [
        'landin-page-sm.nexadigital.dev',
        '*.nexadigital.dev',
        'nexadigital.dev'
      ],
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'www.transparenttextures.com' },
      { protocol: 'https', hostname: 'sefqikeblpugukodcron.supabase.co' },
      { protocol: 'https', hostname: 'qrzvjmxnablsncgqndxs.supabase.co' },
    ],
  },
};

export default nextConfig;
