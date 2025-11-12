import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
	eslint: {
		ignoreDuringBuilds: true,
	},
	distDir: "nextjs",
	reactStrictMode: true,
	output: "standalone",
};

export default nextConfig;