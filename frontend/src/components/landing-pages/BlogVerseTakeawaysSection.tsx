'use client'

import React, { useState } from 'react'

import { Box, Typography, Button, Collapse, Avatar } from '@mui/material'
import PurpleQuoteBox from '@/components/common/PurpleQuoteBox'
import Link from 'next/link'
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons'
import Image from 'next/image'
import { ResponsiveAd } from '../ads'
import { replaceReferenceShortcodes, slugToBookName } from '@/utils/stringHelpers'
import VerseCard from '@/components/commentary/VerseCard'
import { useBibleVerseVersion } from '@/hooks/useBibleVerseVersion'
import { useAuthorsAuthors } from '@/hooks/useAuthorsAuthors'

interface BlogVerseTakeawaysSectionProps {
  reference?: string
  verseTakeaways: any
}

export default function BlogVerseTakeawaysSection({ verseTakeaways }: BlogVerseTakeawaysSectionProps) {
  const [isVerseCardVisible, setIsVerseCardVisible] = useState(false)
  
  // Fetch authors for the avatars
  const { data: authorsData } = useAuthorsAuthors()
  const displayAuthors = authorsData?.slice(0, 5) || []
  
  if (!verseTakeaways) return null

  const excerpts = verseTakeaways.excerpts || []
  const quotes = verseTakeaways.quotes || []
  const authors = verseTakeaways.commentaryAuthors as string | undefined
  const moreUrl = verseTakeaways.slug as string | undefined
  
  // Try different ways to get verse info based on available data
  let verseNumber = verseTakeaways.bibleVerseReference?.startVerse?.verseNumber || 
                     verseTakeaways.bibleVerseReference?.startVerse || 
                     verseTakeaways.verseNumber
  let chapterNumber = verseTakeaways.bibleVerseReference?.startVerse?.chapterNumber || 
                      verseTakeaways.bibleVerseReference?.chapterNumber || 
                      verseTakeaways.chapterNumber
  let bookSlug = verseTakeaways.bibleVerseReference?.startVerse?.bookSlug || 
                 verseTakeaways.bibleVerseReference?.bookSlug || 
                 verseTakeaways.bookSlug
  
  // Fallback: try to parse from slug if direct properties not available
  if ((!bookSlug || !chapterNumber || !verseNumber) && moreUrl) {
    // Parse from URL like "/commentators/verse-takeaways/commentaries/genesis/1/1"
    const urlParts = moreUrl.split('/')
    if (urlParts.length >= 7) {
      bookSlug = bookSlug || urlParts[4]
      chapterNumber = chapterNumber || parseInt(urlParts[5])
      verseNumber = verseNumber || parseInt(urlParts[6])
    }
  }
  
  // Fetch verse content
  const { data: verseContent } = useBibleVerseVersion(
    bookSlug || '',
    chapterNumber || 1,
    verseNumber || 1,
    'ASV'
  )
  
  // Format reference for display
  const bookName = bookSlug ? slugToBookName(bookSlug) : ''
  const formattedReference = verseTakeaways.bibleVerseReference?.referenceText || 
    (bookName && chapterNumber && verseNumber ? `${bookName} ${chapterNumber}:${verseNumber}` : '')
  
  const handleVerseButtonClick = () => {
    setIsVerseCardVisible(!isVerseCardVisible)
  }

  return (
    <>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: { xs: 3, sm: 4 },
        borderRadius: 3.5,
        background: '#1A1A1A',
      }}
    >
      {/* Verse Header with Read Verse Button */}
      {verseNumber && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 0,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#FFFAFA',
              fontSize: { xs: 20, sm: 20, md: 24 },
              fontWeight: 400,
              '& span:last-child': {
                fontWeight: 700,
              }
            }}
          >
            <span>Verse </span><span>{verseNumber}</span>
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={handleVerseButtonClick}
            sx={{
              color: 'rgba(255, 250, 250, 0.6)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              fontSize: 12,
              fontWeight: 400,
              textTransform: 'none',
              px: 1.5,
              py: 0.25,
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              height: 'fit-content',
              '&:hover': {
                color: '#FFFAFA',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            {isVerseCardVisible ? 'Hide verse' : 'Read verse'}
          </Button>
        </Box>
      )}
      
      {/* Collapsible Verse Card */}
      {verseContent && verseContent.content && (
        <Collapse in={isVerseCardVisible}>
          <Box sx={{ mb: 3 }}>
            <VerseCard
              verseRange={`${verseNumber}`}
              verseContent={verseContent.content}
              versionName="ASV"
              verseReference={formattedReference}
            />
          </Box>
        </Collapse>
      )}
      {excerpts.map((ex: any, idx: number) => (
        <React.Fragment key={ex.id || idx}>
          <Box sx={{ mb: excerpts.length > 1 && idx < excerpts.length - 1 ? 1 : 0 }}>
            {ex.title && ex.content ? (
              // Combined format with title embedded in content
              <Typography 
                component="div"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: { xs: 16, md: 18 },
                  lineHeight: 1.6,
                  '& p': {
                    margin: '0 0 1em 0',
                  },
                  '& p:last-child': {
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
              >
                <span>
                  <strong style={{ color: '#FFFAFA' }}>
                    {ex.title.replace(/:\s*$/, '')}
                  </strong>
                  {': '}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: replaceReferenceShortcodes('ASV', ex.content, { chipText: '#ED27FF' })
                    }}
                  />
                </span>
              </Typography>
            ) : (
              // Fallback to original format if only title or only content
              <>
                {ex.title && (
                  <Typography component="h3" sx={{ 
                    fontSize: { xs: '1.1rem', md: '1.25rem' }, 
                    fontWeight: 700,
                    color: '#FFFAFA',
                    mb: 1
                  }}>
                    {ex.title.replace(/:\s*$/, '')}
                  </Typography>
                )}
                {ex.content && (
                  <Typography 
                    component="div"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: { xs: 16, md: 18 },
                      lineHeight: 1.6,
                      '& p': {
                        margin: '0 0 1em 0',
                      },
                      '& p:last-child': {
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
                    dangerouslySetInnerHTML={{
                      __html: replaceReferenceShortcodes('ASV', ex.content, { chipText: '#ED27FF' })
                    }}
                  />
                )}
              </>
            )}
          </Box>
        </React.Fragment>
      ))}
      {quotes.length > 0 && (
        <PurpleQuoteBox quote={quotes[0].content} author={quotes[0].author?.name} />
      )}
      {authors && (
        <Typography sx={{ 
          mt: 2, 
          fontSize: '0.875rem', 
          color: 'rgba(255, 255, 255, 0.5)',
          fontStyle: 'italic'
        }}>
          Sources: {authors}
        </Typography>
      )}
      {moreUrl && (
        <Link href={moreUrl} style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mt: 3,
              p: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2.5,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
              '&:hover .arrow-icon': {
                opacity: 1,
                transform: 'translateX(4px)',
              },
              '&:hover .link-text': {
                color: '#FFFAFA',
              },
            }}
          >
            {/* Author Avatars */}
            {displayAuthors.length > 0 && (
              <Box sx={{ display: 'flex', gap: -0.5 }}>
                {displayAuthors.map((author: any, index: number) => (
                  <Avatar
                    key={author.id}
                    alt={author.name}
                    sx={{
                      width: 32,
                      height: 32,
                      marginLeft: index > 0 ? '-8px' : 0,
                      zIndex: displayAuthors.length - index,
                      border: '2px solid rgba(0, 0, 0, 0.8)',
                      fontSize: 10,
                      background: author.colorScheme?.primary
                        ? `linear-gradient(216deg, ${author.colorScheme.primary} 0%, black 100%)`
                        : '#5B41DE',
                    }}
                  >
                    {author.image && (
                      <Image
                        src={author.image}
                        alt={author.name}
                        width={32}
                        height={32}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </Avatar>
                ))}
              </Box>
            )}
            
            {/* Link Text */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                flex: 1,
              }}
            >
              <Typography
                className="link-text"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 16,
                  fontWeight: 400,
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                {bookSlug && chapterNumber && verseNumber
                  ? `Read all ${slugToBookName(bookSlug)} ${chapterNumber}:${verseNumber} commentaries`
                  : 'Read all commentaries'}
              </Typography>
              <ArrowForwardIcon
                className="arrow-icon"
                sx={{
                  fontSize: 18,
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 0,
                  transform: 'translateX(0)',
                  transition: 'all 0.2s ease-in-out',
                }}
              />
            </Box>
          </Box>
        </Link>
      )}
    </Box>
    
    <Box sx={{ my: 3 }}>
      <ResponsiveAd slotId="CONTENT_RESPONSIVE" showPlaceholder />
    </Box>
    
    {/* View Full Chapter Button - below the ad */}
    {bookSlug && chapterNumber && (
      <Box sx={{ mt: 3 }}>
        <Link 
          href={`/commentators/verse-takeaways/commentaries/${bookSlug}/${chapterNumber}`} 
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <Button
            fullWidth
            sx={{
              minHeight: 56,
              borderRadius: 4.5,
              p: 2.5,
              border: '2px solid transparent',
              background: `linear-gradient(36deg, rgba(237, 39, 255, 0.30) 0%, rgba(21.54, 72.36, 128.11, 0.30) 100%) padding-box,
                         linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/background/commentary-card-gradient.jpg') border-box`,
              backgroundSize: 'cover, cover',
              backgroundPosition: 'center, center',
              color: '#FFFFFF !important', // Force white text
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 600,
              transition: 'all 0.2s ease-in-out',
              overflow: 'hidden',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)', // Reduced from 0.7 to 0.4 for better readability
                zIndex: 1,
                transition: 'background 0.3s ease',
              },
              '& > *': {
                position: 'relative',
                zIndex: 2,
                color: '#FFFFFF', // Ensure text stays white
              },
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)',
                color: '#FFFFFF !important', // Keep white on hover
                '&::after': {
                  background: 'rgba(0, 0, 0, 0.3)', // Lighter on hover
                },
              },
            }}
          >
            View Full Chapter {chapterNumber}
          </Button>
        </Link>
      </Box>
    )}
    </>
  )
}
