import type { IConfig } from 'next-sitemap'

const config: IConfig = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/dashboard/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
    ],
  },
}

export default config
