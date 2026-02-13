import { ISitemapService } from '@/application/common/interfaces/sitemap-service.interface';
import { ICacheService } from '@/application/common/interfaces/cache-service.interface';
import { prisma } from '@/lib/prisma';

/**
 * Service for generating and managing XML sitemaps
 * Creates sitemap groups for different content types with entries
 */
export class SitemapService implements ISitemapService {
  private static readonly MAX_ENTRIES_PER_SITEMAP = 49000;
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.scripturespot.com';

  constructor(private readonly cacheService: ICacheService) {}

  async updateSitemapAsync(): Promise<boolean> {
    try {
      console.log('Starting sitemap update...');

      const newGroups: any[] = [];

      // Core/Home pages group
      const coreGroup = this.createCoreGroup();
      newGroups.push(coreGroup);

      // Bible verse version groups (by version)
      const verseVersionGroups = await this.createVerseVersionGroups();
      newGroups.push(...verseVersionGroups);

      // Landing pages group
      const landingPagesGroup = await this.createLandingPagesGroup();
      if (landingPagesGroup) {
        newGroups.push(landingPagesGroup);
      }

      // Authors group
      const authorsGroup = await this.createAuthorsGroup();
      if (authorsGroup) {
        newGroups.push(authorsGroup);
      }

      // Commentaries group
      const commentariesGroup = await this.createCommentariesGroup();
      if (commentariesGroup) {
        newGroups.push(commentariesGroup);
      }

      // Clear existing sitemap groups and insert new ones
      console.log('Clearing existing sitemap groups...');
      await prisma.sitemapGroups.deleteMany({});

      console.log(`Inserting ${newGroups.length} sitemap groups...`);
      await prisma.sitemapGroups.createMany({
        data: newGroups
      });

      // Invalidate cache
      await this.cacheService.clear();

      console.log('Sitemap update completed successfully');
      return true;
    } catch (error) {
      console.error('Sitemap update failed:', error);
      return false;
    }
  }

  async getSitemapAsync(groupType: string, identifier: string): Promise<string> {
    const cacheKey = `sitemap:${groupType}:${identifier}`;
    
    // Check cache first
    const cached = await this.cacheService.get<string>(cacheKey);
    if (cached) {
      return cached;
    }

    // Find the sitemap group
    const group = await prisma.sitemapGroups.findFirst({
      where: {
        GroupType: groupType,
        GroupIdentifier: identifier
      },
      include: {
        SitemapEntries: true
      }
    });

    if (!group) {
      return '';
    }

    // Generate XML
    const xml = this.buildSitemapXml(group.SitemapEntries);

    // Cache for 24 hours
    await this.cacheService.set(cacheKey, xml, 86400);

    return xml;
  }

  async getSitemapIndexAsync(): Promise<string> {
    const cacheKey = 'sitemap:index';
    
    // Check cache first
    const cached = await this.cacheService.get<string>(cacheKey);
    if (cached) {
      return cached;
    }

    // Get all sitemap groups
    const groups = await prisma.sitemapGroups.findMany({
      select: {
        GroupType: true,
        GroupIdentifier: true
      },
      orderBy: [
        { GroupType: 'asc' },
        { GroupIdentifier: 'asc' }
      ]
    });

    // Generate sitemap index XML
    const xml = this.buildSitemapIndexXml(groups);

    // Cache for 24 hours
    await this.cacheService.set(cacheKey, xml, 86400);

    return xml;
  }

  private createCoreGroup(): any {
    const groupId = crypto.randomUUID();
    const now = new Date();

    const corePages = [
      { title: 'Home Page', loc: `${SitemapService.BASE_URL}` },
      { title: 'Study Plans', loc: `${SitemapService.BASE_URL}/study-plans` },
      { title: 'Bookmarks', loc: `${SitemapService.BASE_URL}/bookmarks` },
      { title: 'Commentators', loc: `${SitemapService.BASE_URL}/commentators` },
      { title: 'Hymns', loc: `${SitemapService.BASE_URL}/hymns` },
      { title: 'Login', loc: `${SitemapService.BASE_URL}/login` },
      { title: 'Remove Ads', loc: `${SitemapService.BASE_URL}/remove-ads` },
      { title: 'Donate', loc: `${SitemapService.BASE_URL}/donate` },
      { title: 'Terms', loc: `${SitemapService.BASE_URL}/terms` },
      { title: 'Privacy Policy', loc: `${SitemapService.BASE_URL}/privacy-policy` }
    ];

    return {
      id: groupId,
      generatedAt: now,
      identifier: 'root',
      groupType: 'home',
      entries: corePages.map(page => ({
        id: crypto.randomUUID(),
        createdAt: now,
        sitemapGroupId: groupId,
        title: page.title,
        loc: page.loc
      }))
    };
  }

  private async createVerseVersionGroups(): Promise<any[]> {
    // Get all Bible verse versions grouped by version
    const verseVersions = await prisma.bibleVerseVersions.findMany({
      include: {
        BibleVerses: {
          include: {
            BibleChapters: {
              include: {
                BibleBooks: true
              }
            }
          }
        },
        BibleVersions: true
      }
    });

    const groups: any[] = [];
    
    // Group by version abbreviation
    const versionGroups = new Map<string, any[]>();
    for (const vv of verseVersions) {
      const abbr = vv.BibleVersions?.Abbreviation?.toLowerCase();
      if (!abbr) continue;

      if (!versionGroups.has(abbr)) {
        versionGroups.set(abbr, []);
      }
      versionGroups.get(abbr)!.push(vv);
    }

    // Create sitemap groups for each version
    for (const [versionSlug, verses] of versionGroups.entries()) {
      const groupId = crypto.randomUUID();
      const now = new Date();

      const entries = verses.map(vv => {
        const book = vv.BibleVerses?.BibleChapters?.BibleBooks;
        const chapter = vv.BibleVerses?.BibleChapters;
        const verse = vv.BibleVerses;

        return {
          id: crypto.randomUUID(),
          createdAt: now,
          sitemapGroupId: groupId,
          title: `${book?.Name} ${chapter?.ChapterNumber}:${verse?.VerseNumber} (${versionSlug.toUpperCase()})`,
          loc: `${SitemapService.BASE_URL}/${book?.Slug}/${chapter?.ChapterNumber}/${verse?.VerseNumber}/${versionSlug}`
        };
      });

      groups.push({
        id: groupId,
        generatedAt: now,
        identifier: versionSlug,
        groupType: 'bible-verse-version',
        entries
      });
    }

    return groups;
  }

  private async createLandingPagesGroup(): Promise<any | null> {
    const landingPages = await prisma.landingPages.findMany();

    if (landingPages.length === 0) {
      return null;
    }

    const groupId = crypto.randomUUID();
    const now = new Date();

    return {
      id: groupId,
      generatedAt: now,
      identifier: 'landing-pages',
      groupType: 'landing-page',
      entries: landingPages.map(page => ({
        id: crypto.randomUUID(),
        createdAt: now,
        sitemapGroupId: groupId,
        title: page.Header ?? page.Slug ?? 'Untitled',
        loc: `${SitemapService.BASE_URL}/guides/${page.Slug}`
      }))
    };
  }

  private async createAuthorsGroup(): Promise<any | null> {
    const authors = await prisma.authors.findMany();

    if (authors.length === 0) {
      return null;
    }

    const groupId = crypto.randomUUID();
    const now = new Date();

    return {
      id: groupId,
      generatedAt: now,
      identifier: 'authors',
      groupType: 'author',
      entries: authors.map(author => ({
        id: crypto.randomUUID(),
        createdAt: now,
        sitemapGroupId: groupId,
        title: author.Name ?? 'Unknown Author',
        loc: `${SitemapService.BASE_URL}/commentators/${author.Slug}`
      }))
    };
  }

  private async createCommentariesGroup(): Promise<any | null> {
    const commentaries = await prisma.commentaries.findMany({
      include: {
        Authors: true,
        BibleVerseReferences: {
          include: {
            BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: {
              include: {
                BibleChapters: {
                  include: {
                    BibleBooks: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (commentaries.length === 0) {
      return null;
    }

    const groupId = crypto.randomUUID();
    const now = new Date();

    return {
      id: groupId,
      generatedAt: now,
      identifier: 'commentaries',
      groupType: 'commentary',
      entries: commentaries.map(c => {
        const book = c.BibleVerseReferences?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters?.BibleBooks;
        const chapter = c.BibleVerseReferences?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters;
        const verse = c.BibleVerseReferences?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses;

        return {
          id: crypto.randomUUID(),
          createdAt: now,
          sitemapGroupId: groupId,
          title: `${c.Authors?.Name} on ${book?.Name} ${chapter?.ChapterNumber}:${verse?.VerseNumber}`,
          loc: `${SitemapService.BASE_URL}${c.Slug}`
        };
      })
    };
  }

  private buildSitemapXml(entries: any[]): string {
    const urls = entries.map(entry => `
  <url>
    <loc>${this.escapeXml(entry.loc)}</loc>
    <lastmod>${entry.createdAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  private buildSitemapIndexXml(groups: any[]): string {
    const sitemaps = groups.map(group => `
  <sitemap>
    <loc>${SitemapService.BASE_URL}/api/seo/sitemap/${group.groupType}/${group.identifier}</loc>
    <lastmod>${group.generatedAt.toISOString()}</lastmod>
  </sitemap>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // Public interface methods (required by ISitemapService)
  async generateSitemapXml(identifier: string, signal?: AbortSignal): Promise<string> {
    // Parse identifier to extract groupType and groupIdentifier
    // Format expected: "groupType-groupIdentifier" or just identifier
    const parts = identifier.split('-');
    const groupType = parts[0] || identifier;
    const groupIdentifier = parts.slice(1).join('-') || identifier;
    
    return await this.getSitemapAsync(groupType, groupIdentifier);
  }

  async generateSitemapIndexXml(signal?: AbortSignal): Promise<string> {
    return await this.getSitemapIndexAsync();
  }
}
