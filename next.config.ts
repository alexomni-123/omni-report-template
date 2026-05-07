import type { NextConfig } from "next";

const isPages = process.env.GITHUB_PAGES === "1";
const repoName = "omni-report-template";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(isPages
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
  trailingSlash: true,
};

export default nextConfig;
