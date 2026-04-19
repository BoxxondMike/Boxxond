import { MetadataRoute } from 'next';
import { supabase } from '../lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://boxxhq.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/sets`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/breaks`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/games`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collection`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    // Football sets
    { url: `${baseUrl}/sets/topps-chrome`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/panini-prizm-epl`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/topps-stadium-club`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/panini-select`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/topps-chrome-sapphire`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/topps-now`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/topps-inception`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/topps-chrome-ucc-2526`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/topps-finest-premier-league-2026`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    // Basketball sets
    { url: `${baseUrl}/sets/panini-prizm-nba`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/topps-chrome-nba`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/panini-select-nba`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    // Baseball sets
    { url: `${baseUrl}/sets/topps-chrome-baseball`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/topps-baseball`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/bowman-baseball`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    // NFL sets
    { url: `${baseUrl}/sets/panini-prizm-nfl`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/topps-chrome-nfl`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/panini-select-nfl`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sets/topps-nfl`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  // All player pages from Supabase
  const { data: players } = await supabase
    .from('players')
    .select('name')
    .eq('sport', 'Football');

  const playerPages: MetadataRoute.Sitemap = (players || []).map((player: any) => ({
    url: `${baseUrl}/players/${player.name.toLowerCase().replace(/ /g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...playerPages];
}