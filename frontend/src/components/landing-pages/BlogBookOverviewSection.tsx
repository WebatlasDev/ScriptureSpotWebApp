'use client'

import { Box, Typography } from '@mui/material'
import { ResponsiveAd } from '../ads'
import { env } from '@/types/env'
import { replaceReferenceShortcodes } from '@/utils/stringHelpers'

interface BlogBookOverviewSectionProps {
  bookName?: string
  bookOverview: any
  currentSection?: string // Which specific section to show (e.g., 'author', 'audience', 'objective')
}

const sections: { key: string; title: string }[] = [
  { key: 'author', title: 'Author' },
  { key: 'audience', title: 'Audience' },
  { key: 'composition', title: 'Composition' },
  { key: 'objective', title: 'Objective' },
  { key: 'uniqueElements', title: 'Unique Elements' },
  { key: 'keyThemes', title: 'Key Themes' },
  { key: 'teachingHighlights', title: 'Teaching Highlights' },
  { key: 'historicalContext', title: 'Historical Context' },
  { key: 'culturalBackground', title: 'Cultural Background' },
  { key: 'politicalLandscape', title: 'Political Landscape' },
]

export default function BlogBookOverviewSection({ bookOverview, currentSection }: BlogBookOverviewSectionProps) {
  if (!bookOverview) return null

  const verseVersion = env.defaultVersion
  
  // Filter sections to only show the current one (if specified)
  const sectionsToRender = currentSection 
    ? sections.filter(s => s.key.toLowerCase() === currentSection.toLowerCase())
    : sections

  // Determine if we should show the Book Outline
  // Only show it if:
  // 1. No specific section is requested (showing all sections)
  // 2. OR the current section is specifically 'structure' or 'bookOutline'
  const shouldShowBookOutline = !currentSection || 
    currentSection === 'structure' || 
    currentSection === 'bookOutline' ||
    currentSection === 'bookStructure';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {shouldShowBookOutline && Array.isArray(bookOverview.bibleBookStructures) && bookOverview.bibleBookStructures.length > 0 && (
        <Box
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3.5,
            background: '#1A1A1A',
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              fontWeight: 600,
              mb: 1,
            }}
          >
            Book Outline
          </Typography>

          {bookOverview.bibleBookStructures.map((item: any, idx: number) => {
            const replacedHtml = replaceReferenceShortcodes(verseVersion, item.description)

            return (
              <Box key={idx} sx={{ mt: 2.5 }}>
                <Typography sx={{ 
                  fontWeight: 700,
                  color: '#FFFAFA',
                  fontSize: { xs: 16, md: 18 },
                  mb: 0.5
                }}>
                  {item.title}
                  {item.verses && (
                    <Typography component="span" sx={{ 
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 400,
                      ml: 1
                    }}>
                      - {item.verses}
                    </Typography>
                  )}
                </Typography>
                {item.description && (
                  <Typography
                    component="div"
                    sx={{ 
                      ml: 2,
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: { xs: 16, md: 18 },
                      lineHeight: 1.6,
                      '& a.scripture-link': {
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: replacedHtml }}
                  />
                )}
              </Box>
            )
          })}
        </Box>
      )}

      {sectionsToRender.map(({ key, title }) => {
        const content = replaceReferenceShortcodes(verseVersion, bookOverview[key])
        if (!content) return null

        return (
          <>
          <Box
            key={key}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3.5,
              background: '#1A1A1A',
            }}
          >
            <Typography
              component="h3"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 700,
                mb: 2,
                color: '#FFFAFA',
              }}
            >
              {title}
            </Typography>
            <Typography
              component="div"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.6,
                '& > *:first-child': {
                  marginTop: 0,
                },
                '& > *:last-child': {
                  marginBottom: 0,
                },
                '& p': {
                  margin: '0 0 1em 0',
                },
                '& p:last-child': {
                  marginBottom: 0,
                },
                '& ul, & ol': {
                  paddingLeft: '24px',
                  margin: '1em 0',
                  listStylePosition: 'outside',
                },
                '& ul': {
                  listStyleType: 'disc',
                },
                '& ol': {
                  listStyleType: 'decimal',
                },
                '& ul ul': {
                  listStyleType: 'circle',
                  paddingLeft: '20px',
                },
                '& ol ol': {
                  listStyleType: 'lower-alpha',
                  paddingLeft: '20px',
                },
                '& li': {
                  marginBottom: '0.5em',
                  lineHeight: 1.6,
                },
                '& li:last-child': {
                  marginBottom: 0,
                },
                '& strong': {
                  color: '#FFFAFA',
                  fontWeight: 600,
                },
                '& a.scripture-link': {
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                },
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Box>
          <ResponsiveAd slotId="CONTENT_RESPONSIVE" showPlaceholder />
          </>
        )
      })}
    </Box>
  )
}
