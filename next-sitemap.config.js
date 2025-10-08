/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://botinorbit.com",
  generateRobotsTxt: true,
  outDir: "public",
  sourceDir: "app",
  generateIndexSitemap: true,
  additionalPaths: async (config) => [
  ],
};
