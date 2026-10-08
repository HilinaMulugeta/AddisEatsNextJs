/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.DAY45_BUILD_DIR || ".next",
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [],
    qualities: [55, 65, 75],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },};

export default nextConfig;
