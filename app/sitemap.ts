import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://boxxond.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://boxxond.com/sets',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Soccer
    {
      url: 'https://boxxond.com/sets/topps-chrome',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://boxxond.com/sets/panini-prizm-epl',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://boxxond.com/sets/topps-match-attax',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://boxxond.com/sets/merlin',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://boxxond.com/sets/topps-stadium-club',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://boxxond.com/sets/panini-select',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Basketball
    {
      url: 'https://boxxond.com/sets/panini-prizm-nba',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://boxxond.com/sets/topps-chrome-nba',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://boxxond.com/sets/panini-select-nba',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Baseball
    {
      url: 'https://boxxond.com/sets/topps-chrome-baseball',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://boxxond.com/sets/topps-baseball',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://boxxond.com/sets/bowman-baseball',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // NFL
    {
      url: 'https://boxxond.com/sets/panini-prizm-nfl',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://boxxond.com/sets/topps-chrome-nfl',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://boxxond.com/sets/panini-select-nfl',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
}