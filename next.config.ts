import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	distDir: "nextjs",
	reactStrictMode: true,
	output: "standalone",
};

export default nextConfig;
