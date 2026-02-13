'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Paper,
  CircularProgress,
} from '@mui/material';
import Image from 'next/image';
import { ChevronLeftIcon } from '@/components/ui/phosphor-icons';
import { ChevronRightIcon } from '@/components/ui/phosphor-icons';
import { MoreHorizIcon } from '@/components/ui/phosphor-icons';
import { ShareIcon } from '@/components/ui/phosphor-icons';
import { BookmarkBorderIcon } from '@/components/ui/phosphor-icons';
import { BookmarkIcon } from '@/components/ui/phosphor-icons';
import { FormatQuoteIcon } from '@/components/ui/phosphor-icons';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import { OpenInNewIcon } from '@/components/ui/phosphor-icons';
import { toast } from 'react-toastify';
import { Primitive } from '@radix-ui/react-primitive';
import { useCommentaryNavigation } from '@/hooks/useCommentaryNavigation';
import { useBibleBooks } from '@/hooks/useBibleBooks';
import { useBibleChapters } from '@/hooks/useBibleChapters';
import { useBibleVerses } from '@/hooks/useBibleVerses';
import { useBibleVerseTakeaways } from '@/hooks/useBibleVerseTakeaways';
import { useBibleVerseVersion } from '@/hooks/useBibleVerseVersion';
import { useAuthorsCommentaries } from '@/hooks/useAuthorsCommentaries';
import { useCreateBookmark, useDeleteBookmark } from '@/hooks/useBookmarkMutations';
import { BookmarkType } from '@/types/bookmark';
import { useUser } from '@clerk/nextjs';
import { usePremium } from '@/hooks/usePremium';
import CrossLoader from '@/components/ui/CrossLoader';
import BookmarkPromoModal from '@/components/marketing/BookmarkPromoModal';
import VerseCard from '@/components/commentary/VerseCard';
import CommentaryStickyBar from '@/components/commentary/CommentaryStickyBar';
import VerseTakeawaysHeader from '@/components/commentators/VerseTakeawaysHeader';
import { slugToBookName, replaceReferenceShortcodes } from '@/utils/stringHelpers';
import { resolveBookmarkId } from '@/utils/bookmarkUtils';
import ResponsiveAd from '@/components/ads/ResponsiveAd';

// Verse Takeaways color scheme
const VERSE_TAKEAWAYS_COLORS = {
  primary: '#ED27FF',
  secondary: '#164880',
  gradient: 'linear-gradient(135deg,rgba(237, 39, 255, 0.6) 0%,rgba(30, 77, 139, 0) 100%)',
  iconGradient: 'linear-gradient(46deg, #ED27FF 0%, #164880 100%)',
  headerGradient: 'linear-gradient(90deg, rgba(214, 31, 255, 0.1) 50%,rgba(54, 68, 145, 1) 100%), #1A1A1A',
  cardBackground: '#1A1A1A',
  sidebarGradient: 'linear-gradient(222deg,rgba(54, 68, 145, 0.7) 0%,rgba(147, 53, 202, 0.07) 100%)',
  quoteGradient: 'linear-gradient(222deg,rgba(147, 53, 202, 0.7) 0%,rgba(22, 71, 128, 0.07) 100%)'
};

const TEXT_COLOR_PRIMARY = '#FFFAFA';
const TEXT_COLOR_SECONDARY = 'rgba(255, 249.70, 249.70, 0.60)';

interface VerseTakeawaysChapterPageProps {
  initialBooks?: any[];
  initialChapters?: any[];
  initialVerses?: any[];
  initialVerseTakeaways?: Record<number, any>;
  initialVerseVersions?: Record<number, any>;
  initialVerseCommentaries?: Record<number, any>;
}

// Component for individual verse takeaways
interface VerseTakeawayCardProps {
  bookSlug: string;
  chapterNumber: number;
  verseNumber: number;
  initialTakeaway?: any;
  initialVerseContent?: any;
  initialCommentaries?: any[];
}

function VerseTakeawayCard({
  bookSlug,
  chapterNumber,
  verseNumber,
  initialTakeaway,
  initialVerseContent,
  initialCommentaries,
}: VerseTakeawayCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkPromoOpen, setBookmarkPromoOpen] = useState(false);
  const [isVerseCardVisible, setIsVerseCardVisible] = useState(false);
  
  const { data: verseTakeaways, isLoading } = useBibleVerseTakeaways(
    bookSlug,
    chapterNumber,
    verseNumber,
    { initialData: initialTakeaway },
  );
  const { data: verseContent } = useBibleVerseVersion(
    bookSlug,
    chapterNumber,
    verseNumber,
    'ASV',
    { initialData: initialVerseContent },
  );
  const { user } = useUser();
  const isPremium = usePremium();
  const { createBookmark } = useCreateBookmark();
  const { deleteBookmark } = useDeleteBookmark();
  const bookmarkId = useMemo(
    () =>
      resolveBookmarkId(
        verseTakeaways?.id,
        verseTakeaways?.takeawayId,
        verseTakeaways?.verseTakeawayId,
        verseTakeaways?.referenceId,
        verseTakeaways?.bibleVerseId,
        verseTakeaways?.verseId,
      ),
    [verseTakeaways],
  );

  // Fetch other commentaries for this verse
  const { data: otherCommentaries } = useAuthorsCommentaries(
    bookSlug,
    chapterNumber,
    verseNumber,
    'Combined',
    undefined,
    { initialData: initialCommentaries },
  );

  // Get unique authors for "View other commentaries" link
  const allOtherAuthors = otherCommentaries
    ? otherCommentaries.reduce((unique: any[], commentary: any) => {
        if (!unique.some(item => item.author.name === commentary.author.name)) {
          unique.push(commentary);
        }
        return unique;
      }, [])
    : [];

  // Limit to 5 for display but keep full count for text
  const otherAuthors = allOtherAuthors.slice(0, 5);

  const exploreOtherCommentariesHref = allOtherAuthors.length > 0
    ? `/kjv/${bookSlug}/${chapterNumber}/${verseNumber}`
    : '';

  const {
    isNavigating: isNavigatingOtherCommentaries,
    handleClick: handleOtherCommentariesClick,
  } = useCommentaryNavigation(exploreOtherCommentariesHref);

  const reference = `${slugToBookName(bookSlug)} ${chapterNumber}:${verseNumber}`;
  
  const handleMenuClick = (event: React.MouseEvent<SVGSVGElement | HTMLElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleVerseButtonClick = () => {
    setIsVerseCardVisible((prev) => !prev);
  };

  const handleShare = async () => {
    handleMenuClose();
    const shareUrl = `${window.location.origin}${window.location.pathname}#verse-${verseNumber}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${reference} - Key Takeaways`,
          text: `Explore key takeaways for ${reference}`,
          url: shareUrl,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          handleCopyLink(shareUrl);
        }
      }
    } else {
      handleCopyLink(shareUrl);
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleBookmark = async () => {
    handleMenuClose();
    if (!user || !isPremium) {
      setBookmarkPromoOpen(true);
      return;
    }

    if (!bookmarkId) {
      toast.error('Verse takeaway ID is required for bookmarking');
      return;
    }

    try {
      if (!isBookmarked) {
        await createBookmark({
          id: bookmarkId,
          type: BookmarkType.TAKEAWAY,
          userId: user.id,
        });
        setIsBookmarked(true);
      }
    } catch {
      toast.error('Bookmark error');
    }
  };

  const handleOpenVerseTakeaways = () => {
    // Create URL for individual verse takeaways page
    const verseTakeawaysUrl = `/commentators/verse-takeaways/commentaries/${bookSlug}/${chapterNumber}/${verseNumber}`;
    window.open(verseTakeawaysUrl, '_blank');
    handleMenuClose();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CrossLoader size={30} />
      </Box>
    );
  }

  if (!verseTakeaways || !verseTakeaways.excerpts || verseTakeaways.excerpts.length === 0) {
    return null; // Don't render if no takeaways
  }

  const commentatorsList = verseTakeaways.commentaryAuthors?.split(",") || [];

  return (
    <Box 
      id={`verse-${verseNumber}`}
      sx={{ 
        mb: 4,
        width: '100%',
        scrollMarginTop: '10vh',
      }}
    >
      {/* Commentary Content Box */}
      <Box
        sx={{
          backgroundColor: { xs: 'transparent', sm: 'rgba(255, 255, 255, 0.05)' },
          borderRadius: 3.5,
          p: { xs: 0, sm: 4, md: 4 },
          pb: { xs: 3, sm: 4, md: 4 },
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Verse Range Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
              size="medium"
              onClick={handleVerseButtonClick}
              sx={{
                color: 'rgba(255, 250, 250, 0.6)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                fontSize: 13,
                fontWeight: 400,
                textTransform: 'none',
                px: 2,
                py: 0,
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                '&:hover': {
                  color: '#FFFAFA',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              {isVerseCardVisible ? 'Hide verse' : 'Show verse'}
            </Button>
          </Box>
          <MoreHorizIcon
            onClick={handleMenuClick}
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 24,
              cursor: 'pointer',
              '&:hover': {
                color: '#FFFAFA',
              },
            }}
          />
        </Box>

        {/* Verse Card */}
        {isVerseCardVisible && (
          <VerseCard
            verseRange={`Verse ${verseNumber}`}
            verseContent={verseContent?.content || 'Loading verse...'}
            versionName="ASV"
            backgroundColor="rgba(255, 255, 255, 0.05)"
            verseReference={reference}
          />
        )}

        {/* Commentary Text */}
        <Box
          id={`takeaway-content-${verseNumber}`}
          sx={{
            mb: 3,
            lineHeight: '1.6em',
          }}
        >
          {verseTakeaways.excerpts.map((excerpt, index) => (
            <Box key={excerpt.id} sx={{ mb: index < verseTakeaways.excerpts.length - 1 ? 4 : 0 }}>
              <Typography sx={{
                color: '#FFFAFA',
                fontSize: { xs: 16, md: 18 },
                fontWeight: 400,
                lineHeight: 1.6,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}>
                <Box component="span" sx={{ fontWeight: 700 }}>
                  {excerpt.title.replace(':', '')}:{' '}
                </Box>
                <span dangerouslySetInnerHTML={{
                  __html: replaceReferenceShortcodes('ASV', excerpt.content, { chipText: VERSE_TAKEAWAYS_COLORS.primary })
                }} />
              </Typography>
            </Box>
          ))}

          {/* Divider before quote */}
          <Box
            sx={{
              width: '100%',
              maxWidth: '100%',
              background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0))',
              my: 4.5,
              display: 'block',
            }}
          />

          {/* Quote inside collapsible content */}
          {verseTakeaways.quotes && verseTakeaways.quotes.length > 0 && (
            <Box sx={{
              p: 3,
              background: VERSE_TAKEAWAYS_COLORS.quoteGradient,
              mb: 1,
              borderRadius: 3,
              width: '100%',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2
            }}>
              <Box sx={{
                width: 30,
                height: 30,
                background: VERSE_TAKEAWAYS_COLORS.iconGradient,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                mt: { xs: 0, sm: 0.5 },
                mb: { xs: 1, sm: 0 }
              }}>
                <FormatQuoteIcon sx={{ color: 'white', fontSize: 22 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ 
                  fontStyle: 'italic', 
                  mb: 2,
                  fontSize: 18,
                  lineHeight: 1.4,
                  color: TEXT_COLOR_PRIMARY
                }}>
                  {verseTakeaways.quotes[0].content}
                </Typography>
                <Typography component="h6" sx={{ 
                  fontWeight: 700,
                  fontSize: 14,
                  color: TEXT_COLOR_PRIMARY
                }}>
                  {verseTakeaways.quotes[0].author.name}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Other Authors Avatars - Always visible */}
        {allOtherAuthors.length > 0 && exploreOtherCommentariesHref && (
          <Box
            component={Primitive.button}
            type="button"
            onClick={handleOtherCommentariesClick}
            disabled={isNavigatingOtherCommentaries}
            aria-busy={isNavigatingOtherCommentaries}
            aria-label={`Explore ${allOtherAuthors.length} other commentaries on this passage`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mt: 2,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: isNavigatingOtherCommentaries ? 'not-allowed' : 'pointer',
              pointerEvents: isNavigatingOtherCommentaries ? 'none' : 'auto',
              '&:focus-visible': {
                outline: '2px solid rgba(255, 255, 255, 0.35)',
                outlineOffset: 4,
              },
              '&:hover .arrow-icon': {
                opacity: 1,
                transform: 'translateX(4px)',
              },
              '&:hover .link-text': {
                color: '#FFFAFA',
              },
              '&:disabled': {
                cursor: 'not-allowed',
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ display: 'flex', gap: -0.5 }}>
              {otherAuthors.map((commentaryItem: any, index: number) => (
                <Avatar
                  key={`${commentaryItem.author.name}-${index}`}
                  alt={commentaryItem.author.name}
                  sx={{
                    width: 24,
                    height: 24,
                    marginLeft: index > 0 ? '-6px' : 0,
                    zIndex: otherAuthors.length - index,
                    fontSize: 10,
                    background: commentaryItem.author.colorScheme?.primary
                      ? `linear-gradient(216deg, ${commentaryItem.author.colorScheme.primary} 0%, black 100%)`
                      : '#5B41DE',
                  }}
                >
                  <Image
                    src={commentaryItem.author.image}
                    alt={commentaryItem.author.name}
                    width={24}
                    height={24}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Avatar>
              ))}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Typography
                className="link-text"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 14,
                  fontWeight: 400,
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                {isNavigatingOtherCommentaries ? (
                  'Loading...'
                ) : (
                  <>
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                      Explore {allOtherAuthors.length} full commentar{allOtherAuthors.length === 1 ? 'y' : 'ies'} on this passage
                    </Box>
                    <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                      {allOtherAuthors.length} commentaries on this passage
                    </Box>
                  </>
                )}
              </Typography>
              {isNavigatingOtherCommentaries ? (
                <CircularProgress size={16} sx={{ color: '#FFFAFA' }} />
              ) : (
                <ArrowForwardIcon
                  className="arrow-icon"
                  sx={{
                    fontSize: 16,
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 0,
                    transform: 'translateX(0)',
                    transition: 'all 0.2s ease-in-out',
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: '#121212',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 2.5,
                minWidth: 200,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                '& .MuiMenuItem-root': {
                  borderRadius: 1,
                  mx: 0.5,
                  my: 0.25,
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                },
              },
            },
          }}
        >
          <MenuItem onClick={handleBookmark}>
            <ListItemIcon>
              {isBookmarked ? <BookmarkIcon sx={{ color: 'text.secondary', fontSize: 18 }} /> : <BookmarkBorderIcon sx={{ color: 'text.secondary', fontSize: 18 }} />}
            </ListItemIcon>
            <ListItemText 
              primary={isBookmarked ? 'Remove Bookmark' : 'Bookmark'} 
              sx={{ 
                '& .MuiTypography-root': { 
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: 400
                } 
              }} 
            />
          </MenuItem>
          <MenuItem onClick={handleShare}>
            <ListItemIcon>
              <ShareIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Share" 
              sx={{ 
                '& .MuiTypography-root': { 
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: 400
                } 
              }} 
            />
          </MenuItem>
          <MenuItem onClick={handleOpenVerseTakeaways}>
            <ListItemIcon>
              <OpenInNewIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Open verse takeaways" 
              sx={{ 
                '& .MuiTypography-root': { 
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: 400
                } 
              }} 
            />
          </MenuItem>
        </Menu>

        <BookmarkPromoModal
          open={bookmarkPromoOpen}
          onClose={() => setBookmarkPromoOpen(false)}
          onUpgrade={() => {
            setBookmarkPromoOpen(false);
          }}
        />
      </Box>
    </Box>
  );
}

export default function VerseTakeawaysChapterPage({
  initialBooks,
  initialChapters,
  initialVerses,
  initialVerseTakeaways,
  initialVerseVersions,
  initialVerseCommentaries,
}: VerseTakeawaysChapterPageProps) {
  const params = useParams();
  const router = useRouter();
  const {
    data: bibleBooks,
    isLoading: booksLoading,
    error: booksError,
  } = useBibleBooks({ initialData: initialBooks });
  const {
    data: chapters,
    isLoading: chaptersLoading,
  } = useBibleChapters(params.bookId as string, { initialData: initialChapters });
  const {
    data: verses,
    isLoading: versesLoading,
    error: versesError,
  } = useBibleVerses(params.bookId as string, parseInt(params.chapter as string), {
    initialData: initialVerses,
  });
  const [pendingNav, setPendingNav] = useState<'prev' | 'next' | null>(null);
  const [, startTransition] = useTransition();
  
  const book = bibleBooks?.find(b => b.slug === params.bookId);
  const currentChapter = parseInt(params.chapter as string);
  
  const isLoading = booksLoading || chaptersLoading || versesLoading;
  const error = booksError || versesError;
  
  // Navigation
  const prevChapter = currentChapter > 1 ? currentChapter - 1 : null;
  const nextChapter = chapters && currentChapter < chapters.length ? currentChapter + 1 : null;
  
  const handlePrevChapter = () => {
    if (!prevChapter || pendingNav) {
      return;
    }

    setPendingNav('prev');
    startTransition(() => {
      try {
        router.push(`/commentators/verse-takeaways/commentaries/${params.bookId}/${prevChapter}`);
      } catch {
        setPendingNav(null);
      }
    });
  };
  
  const handleNextChapter = () => {
    if (!nextChapter || pendingNav) {
      return;
    }

    setPendingNav('next');
    startTransition(() => {
      try {
        router.push(`/commentators/verse-takeaways/commentaries/${params.bookId}/${nextChapter}`);
      } catch {
        setPendingNav(null);
      }
    });
  };

  const handleJumpToVerse = (verseNumber: number) => {
    const element = document.getElementById(`verse-${verseNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CrossLoader size={60} />
      </Box>
    );
  }
  
  if (error || !book) {
    return (
      <Box sx={{ padding: 4, color: 'error.main' }}>
        Error loading verse takeaways
      </Box>
    );
  }

  const breadcrumbItems = [
    { label: 'Verse Takeaways', href: '/commentators/verse-takeaways/commentaries' },
    { label: book.name, href: `/commentators/verse-takeaways/commentaries/${params.bookId}` },
    { label: `Chapter ${currentChapter}` }
  ];

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
      {/* Header */}
      <VerseTakeawaysHeader
        title=""
        book={book.name}
        chapter={currentChapter.toString()}
        breadcrumbItems={breadcrumbItems}
      />
      
      {/* Verse takeaways */}
      <Box sx={{ width: '100%' }}>
        {verses?.map((verse, verseIndex) => (
          <React.Fragment key={verse.verseNumber}>
            <VerseTakeawayCard 
              bookSlug={params.bookId as string}
              chapterNumber={currentChapter}
              verseNumber={verse.verseNumber}
              initialTakeaway={initialVerseTakeaways?.[verse.verseNumber]}
              initialVerseContent={initialVerseVersions?.[verse.verseNumber]}
              initialCommentaries={initialVerseCommentaries?.[verse.verseNumber]}
            />
            
            {/* Mobile divider between individual verse takeaway components */}
            {verseIndex < verses.length - 1 && (
              <Box
                sx={{
                  display: { xs: 'block', sm: 'none' },
                  width: '100%',
                  height: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  my: 4,
                  borderRadius: 1,
                }}
              />
            )}
            
            {/* Desktop spacing */}
            <Box sx={{ display: { xs: 'none', sm: 'block' }, mb: 4 }} />
            
            {/* Responsive ad between every other verse takeaway component */}
            {verseIndex % 2 === 1 && verseIndex < verses.length - 1 && (
              <Box sx={{ my: 4 }}>
                <ResponsiveAd 
                  slotId="COMMENTARY_RESPONSIVE" 
                  showPlaceholder={false}
                />
              </Box>
            )}
          </React.Fragment>
        ))}
        
        {verses && verses.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4, 
            color: 'rgba(255, 255, 255, 0.7)' 
          }}>
            <Typography>No verses found for this chapter.</Typography>
          </Box>
        )}
      </Box>

      {/* Chapter Navigation Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mt: 6,
          mb: 4,
          width: '100%',
        }}
      >
        {/* Previous Chapter Button */}
        <Button
          component={Primitive.button as any}
        onClick={handlePrevChapter}
        disabled={!prevChapter || (pendingNav !== null && pendingNav !== 'prev')}
          aria-busy={pendingNav === 'prev'}
          aria-live={pendingNav === 'prev' ? 'polite' : undefined}
          type="button"
          sx={{
            flex: 1,
            minHeight: 56,
            borderRadius: 4.5,
            p: 2.5,
            border: '2px solid transparent',
            background: prevChapter 
              ? `linear-gradient(36deg, rgba(237, 39, 255, 0.30) 0%, rgba(21.54, 72.36, 128.11, 0.30) 100%) padding-box,
                 linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/background/commentary-card-gradient.jpg') border-box`
              : 'rgba(255, 255, 255, 0.05)',
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            color: prevChapter ? '#FFFAFA' : 'rgba(255, 255, 255, 0.3)',
            textTransform: 'none',
            fontSize: { xs: 14, sm: 16 },
            fontWeight: 500,
            cursor: prevChapter && (!pendingNav || pendingNav === 'prev') ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease-in-out',
            overflow: 'hidden',
            position: 'relative',
            '&::after': prevChapter ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              zIndex: 1,
              transition: 'background 0.3s ease',
            } : {},
            '& > *': {
              position: 'relative',
              zIndex: 2,
            },
            '&:hover': prevChapter && (!pendingNav || pendingNav === 'prev') ? {
              transform: 'scale(1.01)',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)',
              '&::after': {
                background: 'rgba(0, 0, 0, 0.6)',
              },
            } : {},
            '&:disabled': {
              transform: 'none',
              boxShadow: 'none',
            },
          }}
        >
          {pendingNav === 'prev' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CircularProgress size={20} sx={{ color: '#FFFAFA' }} />
              <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', color: '#FFFAFA' }}>
                Loading...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
              <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                {prevChapter ? `Chapter ${prevChapter}` : 'No Previous Chapter'}
              </Typography>
            </Box>
          )}
        </Button>

        {/* Next Chapter Button */}
        <Button
          component={Primitive.button as any}
          onClick={handleNextChapter}
          disabled={!nextChapter || (pendingNav !== null && pendingNav !== 'next')}
          aria-busy={pendingNav === 'next'}
          aria-live={pendingNav === 'next' ? 'polite' : undefined}
          type="button"
          sx={{
            flex: 1,
            minHeight: 56,
            borderRadius: 4.5,
            p: 2.5,
            border: '2px solid transparent',
            background: nextChapter 
              ? `linear-gradient(36deg, rgba(237, 39, 255, 0.30) 0%, rgba(21.54, 72.36, 128.11, 0.30) 100%) padding-box,
                 linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/background/commentary-card-gradient.jpg') border-box`
              : 'rgba(255, 255, 255, 0.05)',
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            color: nextChapter ? '#FFFAFA' : 'rgba(255, 255, 255, 0.3)',
            textTransform: 'none',
            fontSize: { xs: 14, sm: 16 },
            fontWeight: 500,
            cursor: nextChapter && (!pendingNav || pendingNav === 'next') ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease-in-out',
            overflow: 'hidden',
            position: 'relative',
            '&::after': nextChapter ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              zIndex: 1,
              transition: 'background 0.3s ease',
            } : {},
            '& > *': {
              position: 'relative',
              zIndex: 2,
            },
            '&:hover': nextChapter && (!pendingNav || pendingNav === 'next') ? {
              transform: 'scale(1.01)',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)',
              '&::after': {
                background: 'rgba(0, 0, 0, 0.6)',
              },
            } : {},
            '&:disabled': {
              transform: 'none',
              boxShadow: 'none',
            },
          }}
        >
          {pendingNav === 'next' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CircularProgress size={20} sx={{ color: '#FFFAFA' }} />
              <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', color: '#FFFAFA' }}>
                Loading...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                {nextChapter ? `Chapter ${nextChapter}` : 'No Next Chapter'}
              </Typography>
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            </Box>
          )}
        </Button>
      </Box>

      {verses && verses.length > 0 && (
        <CommentaryStickyBar
          verseRanges={verses.map((verse: any) => ({
            verseNumber: verse.verseNumber,
            verseRange: verse.verseNumber?.toString() ?? '',
          }))}
          onJumpToVerse={handleJumpToVerse}
          authorColorScheme={{
            chipBackground: 'rgba(237, 39, 255, 0.30)',
            chipText: '#FFFAFA',
          }}
        />
      )}
    </Box>
  );
}
