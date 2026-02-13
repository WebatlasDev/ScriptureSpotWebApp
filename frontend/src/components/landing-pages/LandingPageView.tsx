'use client'

import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useLandingPage } from '@/hooks/useLandingPage'
import { getBlogComponent } from './components'
import SkinnyHorizontalAd from '@/components/ads/SkinnyHorizontalAd'
import ResponsiveAd from '@/components/ads/ResponsiveAd'
import CrossLoader from '@/components/ui/CrossLoader'
import LandingPageVerseTakeawaysHeader from './LandingPageVerseTakeawaysHeader'
import LandingPageBookOverviewHeader from './LandingPageBookOverviewHeader'
import LandingPageNavigation from './LandingPageNavigation'

function renderComponent(component: any, currentSection?: string) {
  const Component = getBlogComponent(component.componentType)
  switch (component.componentType) {
    case 'VerseTakeawaySection':
      return (
        <Component
          reference={component.data?.reference}
          verseTakeaways={component.data}
        />
      )
    case 'BookOverviewSection':
      return (
        <Component
          bookName={component.data?.BookName || ''}
          bookOverview={component.data}
          currentSection={currentSection}
        />
      )
    case 'ChapterStudySection':
      return (
        <Component
          chapterData={component.data}
        />
      )
    default:
      return <Component componentType={component.componentType} />
  }
}

export default function LandingPageView() {
  const params = useParams()
  const slug = params.slug as string
  const { data: page, isLoading, error } = useLandingPage(slug)
  
  // Extract current section from slug for book overview pages
  let currentBookSection: string | undefined
  if (slug) {
    // Parse section from slug like "author-of-1-chronicles" or "audience-of-genesis"
    const slugParts = slug.split('-of-')
    if (slugParts.length === 2) {
      const sectionSlug = slugParts[0]
      // Map slug to section key that matches BlogBookOverviewSection
      const sectionMap: Record<string, string> = {
        'author': 'author',
        'audience': 'audience',
        'composition': 'composition',
        'objective': 'objective',
        'unique-elements': 'uniqueElements',
        'key-themes': 'keyThemes',
        'teaching-highlights': 'teachingHighlights',
        'historical-background': 'historicalContext',
        'historical-context': 'historicalContext',
        'cultural-background': 'culturalBackground',
        'political-landscape': 'politicalLandscape',
        'structure': 'structure',
        'what-does': 'whatDoes'
      }
      currentBookSection = sectionMap[sectionSlug]
    }
  }

  const orderedComponents = useMemo(() => {
    if (!page?.components) return []
    const comps = [...page.components].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    if (comps.some(c => c.allowRandomOrder)) {
      for (let i = comps.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[comps[i], comps[j]] = [comps[j], comps[i]]
      }
    }
    return comps
  }, [page?.components])

  const adMap = useMemo(() => {
    const map: Record<number, 'skinny' | 'responsive'> = {}
    if (!orderedComponents.length) return map
    const count = Math.min(2, orderedComponents.length)
    while (Object.keys(map).length < count) {
      const idx = Math.floor(Math.random() * orderedComponents.length)
      if (map[idx] === undefined) {
        map[idx] = Math.random() < 0.5 ? 'skinny' : 'responsive'
      }
    }
    return map
  }, [orderedComponents])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CrossLoader size={60} />
      </Box>
    )
  }

  if (error || !page) {
    return <Box sx={{ p: 4, color: 'error.main' }}>Error loading page</Box>
  }

  // Determine header type based on the components present
  const hasVerseTakeaways = orderedComponents.some((c: any) => c.componentType === 'VerseTakeawaySection')
  const hasBookOverview = orderedComponents.some((c: any) => c.componentType === 'BookOverviewSection')
  const hasChapterStudy = orderedComponents.some((c: any) => c.componentType === 'ChapterStudySection')

  // Render appropriate header based on content type
  const renderHeader = () => {
    if (hasVerseTakeaways) {
      return (
        <LandingPageVerseTakeawaysHeader
          title={page.header || ''}
          subtitle={page.subheader}
        />
      )
    } else if (hasBookOverview || hasChapterStudy) {
      // Extract book name from title for dynamic subtitle
      let bookName = ''
      const title = page.header || ''
      
      // Try to extract book name from various title patterns
      const overviewMatch = title.match(/^(.+?)\s+Overview$/i)
      const authorMatch = title.match(/^Author of\s+(.+)$/i)
      const studyGuideMatch = title.match(/^(.+?)\s+\d+\s+study guide$/i)
      
      if (overviewMatch) {
        bookName = overviewMatch[1]
      } else if (authorMatch) {
        bookName = authorMatch[1]
      } else if (studyGuideMatch) {
        bookName = studyGuideMatch[1]
      }
      
      // Generate dynamic subtitle with book name
      const dynamicSubtitle = bookName 
        ? `Expert commentary on the background and meaning of ${bookName}`
        : page.subheader
      
      return (
        <LandingPageBookOverviewHeader
          title={title}
          subtitle={dynamicSubtitle}
        />
      )
    } else {
      // Fallback to generic header for unknown types
      return (
        <Box
          sx={{
            background: '#1A1A1A',
            p: { xs: 2, sm: 3 },
            borderRadius: 3.5,
          }}
        >
          <Typography component="h1" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 700, color: 'text.primary' }}>
            {page.header}
          </Typography>
          {page.metaDescription && (
            <Typography sx={{ mt: 1, color: 'text.secondary' }}>{page.metaDescription}</Typography>
          )}
        </Box>
      )
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pb: 2.5 }}>
      {renderHeader()}
      {orderedComponents.map((component: any, idx: number) => (
        <Box key={component.id}>
          {renderComponent(component, currentBookSection)}
          {adMap[idx] && (
            <Box sx={{ my: 4 }}>
              {adMap[idx] === 'skinny' ? (
                <SkinnyHorizontalAd slotId="CONTENT_RESPONSIVE" showPlaceholder />
              ) : (
                <ResponsiveAd slotId="CONTENT_RESPONSIVE" showPlaceholder />
              )}
            </Box>
          )}
        </Box>
      ))}
      {page.referenceSlug && (
        <Box sx={{ mt: 4 }}>
          <Link href={page.referenceSlug} style={{ textDecoration: 'none', color: '#278EFF' }}>
            Explore more »
          </Link>
        </Box>
      )}
      
      {/* Landing Page Navigation */}
      {(() => {
        // Determine page type and extract context
        let pageType: 'chapter-study' | 'verse-takeaway' | 'book-overview' | undefined;
        let bookSlug: string | undefined;
        let bookName: string | undefined;
        let chapterNumber: number | undefined;
        let verseNumber: number | undefined;
        let verseRange: string | undefined;
        let currentSection: string | undefined;
        
        const title = page.header || '';
        
        // Check for chapter study guide
        const chapterStudyMatch = title.match(/^(.+?)\s+(\d+)\s+Study Guide$/i);
        if (chapterStudyMatch || hasChapterStudy) {
          pageType = 'chapter-study';
          const matchBook = chapterStudyMatch?.[1];
          const matchChapter = chapterStudyMatch?.[2];
          if (matchBook && matchChapter) {
            bookName = matchBook;
            chapterNumber = parseInt(matchChapter);
            // Convert book name to slug (basic conversion)
            bookSlug = matchBook.toLowerCase().replace(/\s+/g, '-');
          } else if (hasChapterStudy && slug) {
            // Try to extract from slug like "genesis-1-study-guide"
            const slugMatch = slug.match(/^(.+?)-(\d+)-study-guide$/i);
            if (slugMatch) {
              bookSlug = slugMatch[1];
              chapterNumber = parseInt(slugMatch[2]);
              // Convert slug to book name
              bookName = bookSlug.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ');
            }
          }
        }

        // Check for verse takeaways
        else if (hasVerseTakeaways) {
          pageType = 'verse-takeaway';
          // Try to extract context from the first verse takeaway component
          const firstVerseTakeaway = orderedComponents.find((c: any) => c.componentType === 'VerseTakeawaySection');
          if (firstVerseTakeaway?.data?.reference) {
            // Parse reference like "Genesis 1:1-3"
            const refMatch = firstVerseTakeaway.data.reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
            if (refMatch) {
              const refBook = refMatch[1];
              const refChapter = refMatch[2];
              const refVerse = refMatch[3];
              if (refBook && refChapter && refVerse) {
                bookName = refBook;
                bookSlug = refBook.toLowerCase().replace(/\s+/g, '-');
                chapterNumber = parseInt(refChapter);
                verseNumber = parseInt(refVerse);
                verseRange = `Verse${refMatch[4] ? 's' : ''} ${refVerse}${refMatch[4] ? `-${refMatch[4]}` : ''}`;
              }
            }
          }
        }
        
        // Check for book overview
        else if (hasBookOverview) {
          pageType = 'book-overview';
          let currentSectionName = 'Author'; // Default
          
          // First try to extract from the slug which is more reliable
          if (slug) {
            // Parse section from slug like "author-of-1-chronicles" or "audience-of-genesis"
            const slugParts = slug.split('-of-');
            if (slugParts.length === 2) {
              const sectionSlug = slugParts[0];
              const bookSlugFromUrl = slugParts[1];
              
              // Use the book slug from URL
              bookSlug = bookSlugFromUrl;
              // Convert book slug to name (basic conversion)
              bookName = bookSlugFromUrl.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ');
              
              // Map slug to section name
              const sectionMap: Record<string, string> = {
                'author': 'Author',
                'audience': 'Audience',
                'composition': 'Composition',
                'objective': 'Objective',
                'unique-elements': 'Unique Elements',
                'key-themes': 'Key Themes',
                'teaching-highlights': 'Teaching Highlights',
                'historical-background': 'Historical Context',
                'historical-context': 'Historical Context',
                'cultural-background': 'Cultural Background',
                'political-landscape': 'Political Landscape',
                'structure': 'Structure',
                'what-does': 'What Does'
              };
              currentSectionName = sectionMap[sectionSlug] || 'Author';
            }
          }
          
          // Fallback: Extract book name from title patterns if not found from slug
          if (!bookName || !bookSlug) {
            // Try various title patterns
            const patterns = [
              /^(.+?)\s+Overview$/i,
              /^Author of\s+(.+)$/i,
              /^Audience of\s+(.+)$/i,
              /^Composition of\s+(.+)$/i,
              /^Objective of\s+(.+)$/i,
              /^Unique Elements of\s+(.+)$/i,
              /^Key Themes of\s+(.+)$/i,
              /^Teaching Highlights of\s+(.+)$/i,
              /^Historical (?:Context|Background) of\s+(.+)$/i,
              /^Cultural Background of\s+(.+)$/i,
              /^Political Landscape of\s+(.+)$/i,
              /^Structure of\s+(.+)$/i,
              /^Book Outline of\s+(.+)$/i,
              /^What does\s+(.+)\s+mean$/i
            ];
            
              for (const pattern of patterns) {
                const match = title.match(pattern);
                if (match) {
                  const matchedName = match[1];
                  if (matchedName) {
                    bookName = matchedName;
                    bookSlug = matchedName.toLowerCase().replace(/\s+/g, '-');
                    break;
                  }
                }
              }
            }
          
          // Store the current section
          currentSection = currentSectionName;
        }
        
        // Only render navigation if we have a valid page type
        if (pageType) {
          // For chapter study, we need to know the total chapters in the book
          // This would ideally come from an API, but for now we'll use a reasonable default
            let totalChapters: number | undefined = undefined;
          if (pageType === 'chapter-study' && bookSlug) {
            // Common book chapter counts (you'd want to get this from an API ideally)
            const bookChapterCounts: Record<string, number> = {
              'genesis': 50,
              'exodus': 40,
              'leviticus': 27,
              'numbers': 36,
              'deuteronomy': 34,
              '1-chronicles': 29,
              '2-chronicles': 36,
              'matthew': 28,
              'mark': 16,
              'luke': 24,
              'john': 21,
              'acts': 28,
              'romans': 16,
              '1-corinthians': 16,
              '2-corinthians': 13,
              'galatians': 6,
              'ephesians': 6,
              'philippians': 4,
              'colossians': 4,
              '1-thessalonians': 5,
              '2-thessalonians': 3,
              '1-timothy': 6,
              '2-timothy': 4,
              'titus': 3,
              'philemon': 1,
              'hebrews': 13,
              'james': 5,
              '1-peter': 5,
              '2-peter': 3,
              '1-john': 5,
              '2-john': 1,
              '3-john': 1,
              'jude': 1,
              'revelation': 22,
              // Add more books as needed
            };
            totalChapters = bookChapterCounts[bookSlug] || 50; // Default to 50 if not found
          }
          
          return (
            <LandingPageNavigation
              pageType={pageType}
              bookSlug={bookSlug}
              bookName={bookName}
              chapterNumber={chapterNumber}
              verseNumber={verseNumber}
              verseRange={verseRange}
              currentSection={currentSection}
              totalChapters={totalChapters}
            />
          );
        }
        
        return null;
      })()}
    </Box>
  )
}
