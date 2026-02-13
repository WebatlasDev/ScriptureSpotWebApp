'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Bookmark, Search, ContentCopy, Close } from '@/components/ui/phosphor-icons';
import { IosShareIcon } from '@/components/ui/phosphor-icons';
import { useVerseCrossReferences } from '@/hooks/useVerseCrossReferences';
import { Primitive } from '@radix-ui/react-primitive';
import * as Dialog from '@radix-ui/react-dialog';
import IconActionButton from './IconActionButton';
import { skeletonBaseSx } from '@/styles/skeletonStyles';
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden';

// Golden/Amber color scheme constants (matching Cross References button theme)
const GOLDEN_BASE = 'rgb(255, 193, 7)';
const GOLDEN_BG = 'rgba(255, 193, 7, 0.10)';
const GOLDEN_ICON = 'rgba(255, 193, 7, 0.90)';
const GOLDEN_ICON_FULL = '#FFC107';
const GOLDEN_BUTTON_BG = 'rgba(255, 193, 7, 0.15)';
const GOLDEN_BUTTON_HOVER = 'rgba(255, 193, 7, 0.25)';
const GOLDEN_GLOW = 'rgba(255, 193, 7, 0.15)';
const GOLDEN_GLOW_RADIAL = 'rgba(255, 193, 7, 0.6)';
const MOBILE_SHEET_BG = '#221F19'; // Dark background for mobile sheet

interface ApiReference {
  label: string;
  slug: string;
  text: string;
}

interface ApiKeyword {
  keyword: string;
  bibleVerseReferences: ApiReference[];
}

interface CrossReferencesDrawerProps {
  currentVerse: {
    book: string;
    chapter: number;
    verse: number;
  };
  version: string;
}

export default function CrossReferencesDrawer({ currentVerse, version = 'ASV' }: CrossReferencesDrawerProps) {
  const bookSlug = currentVerse.book.toLowerCase().replace(/\s+/g, '-');
  const { data, isLoading, isFetching, error } = useVerseCrossReferences(
    bookSlug,
    currentVerse.chapter,
    currentVerse.verse,
    version
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const referenceGroups: ApiKeyword[] = useMemo(() => data ?? [], [data]);
  const referenceMap = useMemo(() => {
    const map = new Map<string, ApiReference>();
    referenceGroups.forEach((keyword) => {
      keyword.bibleVerseReferences.forEach((ref) => {
        map.set(ref.slug, ref);
      });
    });
    return map;
  }, [referenceGroups]);

  const firstReferenceSlug = useMemo(() => {
    for (const keyword of referenceGroups) {
      const first = keyword.bibleVerseReferences[0];
      if (first) {
        return first.slug;
      }
    }
    return null;
  }, [referenceGroups]);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(firstReferenceSlug);
  const [showCopied, setShowCopied] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const copyFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showCopyFeedback = useCallback(() => {
    setShowCopied(true);
    if (copyFeedbackTimeoutRef.current) {
      clearTimeout(copyFeedbackTimeoutRef.current);
    }
    copyFeedbackTimeoutRef.current = setTimeout(() => {
      setShowCopied(false);
      copyFeedbackTimeoutRef.current = null;
    }, 2500);
  }, []);

  useEffect(() => {
    if (!referenceMap.size) {
      setSelectedSlug(null);
      return;
    }

    if (!selectedSlug || !referenceMap.has(selectedSlug)) {
      setSelectedSlug(firstReferenceSlug);
    }
  }, [selectedSlug, referenceMap, firstReferenceSlug]);

  useEffect(() => {
    if (!isMobile && mobileSheetOpen) {
      setMobileSheetOpen(false);
    }
  }, [isMobile, mobileSheetOpen]);

  const selectedReference = selectedSlug ? referenceMap.get(selectedSlug) ?? null : null;

  const verseText = selectedReference?.text || '';
  const referenceLabel = selectedReference?.label || '';

  // Helper function to check if reference contains a verse range
  const isVerseRange = (label: string) => {
    // Check for patterns like "John 3:16-17", "Romans 1:1-5", "Psalms 91:5–10", etc.
    // Handle both regular hyphen (-) and en dash (–)
    return /\d+:\d+[-–]\d+/.test(label);
  };

  // Helper function to strip superscript tags for single verses
  const processVerseText = (text: string, label: string) => {
    if (!isVerseRange(label)) {
      // Remove <sup> tags for single verses
      return text.replace(/<sup[^>]*>.*?<\/sup>/gi, '');
    }
    return text; // Keep superscript for verse ranges
  };

  const displayVerseText = processVerseText(verseText, referenceLabel);

  const getExplorePassageUrl = () => (selectedReference ? `/${version}${selectedReference.slug}` : '#');

  const handleCopyVerse = useCallback(async () => {
    if (!selectedReference) return;
    try {
      const url = `${window.location.origin}/${version}${selectedReference.slug}`;
      const copyText = `"${verseText}"\n\n- ${referenceLabel} (${version})\n\nSee more on Scripture Spot: ${url}`;
      await navigator.clipboard.writeText(copyText);
      showCopyFeedback();
    } catch {
    }
  }, [selectedReference, verseText, referenceLabel, version, showCopyFeedback]);

  const handleShareVerse = useCallback(async () => {
    if (!selectedReference) return;
    const url = `${window.location.origin}/${version}${selectedReference.slug}`;
    const shareData = {
      title: `${referenceLabel} (${version})`,
      text: `"${verseText}"\n\n- ${referenceLabel} (${version})`,
      url,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n\nSee more on Scripture Spot: ${shareData.url}`);
        showCopyFeedback();
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(`${shareData.text}\n\nSee more on Scripture Spot: ${shareData.url}`);
          showCopyFeedback();
        } catch {
        }
      }
    }
  }, [selectedReference, verseText, referenceLabel, version, showCopyFeedback]);

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current) {
        clearTimeout(copyFeedbackTimeoutRef.current);
        copyFeedbackTimeoutRef.current = null;
      }
    };
  }, []);

  const isQueryLoading = (isLoading || isFetching) && !referenceGroups.length;

  if (isQueryLoading) {
    return (
      <Box
        role="status"
        aria-live="polite"
        sx={{
          p: { xs: 2.5, md: 4 },
          background: '#1A1A1A',
          borderRadius: { xs: 2, sm: 3, md: 4.5 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, md: 3 },
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, flex: 1, minHeight: 0 }}>
          <Box
            sx={{
              flex: 1,
              overflow: 'hidden',
              p: { xs: 2, md: 3 },
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, md: 3 },
              height: { xs: '250px', lg: '350px' },
              outline: '2px rgba(255, 255, 255, 0.10) solid',
              outlineOffset: '-2px',
              borderRadius: { xs: 2, sm: 3, md: 4.5 },
            }}
          >
            {Array.from({ length: 3 }).map((_, keywordIndex) => (
              <Box key={`keyword-skeleton-${keywordIndex}`} sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.25, md: 1.75 } }}>
                <Box
                  sx={{
                    ...skeletonBaseSx,
                    width: { xs: '60%', md: '45%' },
                    height: { xs: 18, md: 22 },
                    borderRadius: 1.5,
                  }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, md: 1.25 } }}>
                  {Array.from({ length: 4 }).map((_, chipIndex) => (
                    <Box
                      key={`keyword-chip-skeleton-${keywordIndex}-${chipIndex}`}
                      sx={{
                        ...skeletonBaseSx,
                        width: { xs: 92, md: 110 },
                        height: 36,
                        borderRadius: 999,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
            <Box
              sx={{
                mt: 'auto',
                ...skeletonBaseSx,
                width: { xs: '70%', md: '50%' },
                height: 14,
                borderRadius: 1.5,
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              background: GOLDEN_BG,
              borderRadius: { xs: 2, sm: 3, md: 4.5 },
              display: { xs: 'none', lg: 'flex' },
              flexDirection: 'column',
              height: { xs: '350px', lg: '350px' },
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 }, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                <Box
                  sx={{
                    ...skeletonBaseSx,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                  }}
                />
                <Box
                  sx={{
                    ...skeletonBaseSx,
                    width: '65%',
                    height: 18,
                    borderRadius: 1.5,
                  }}
                />
                <Box
                  sx={{
                    ...skeletonBaseSx,
                    width: 58,
                    height: 20,
                    borderRadius: 999,
                  }}
                />
              </Box>

              {Array.from({ length: 5 }).map((_, lineIndex) => (
                <Box
                  key={`detail-line-${lineIndex}`}
                  sx={{
                    ...skeletonBaseSx,
                    width: lineIndex % 2 === 0 ? '100%' : '85%',
                    height: 14,
                    borderRadius: 1.5,
                  }}
                />
              ))}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3, mt: 'auto' }}>
                <Box
                  sx={{
                    ...skeletonBaseSx,
                    width: 148,
                    height: 40,
                    borderRadius: 999,
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {Array.from({ length: 2 }).map((_, buttonIndex) => (
                    <Box
                      key={`detail-button-${buttonIndex}`}
                      sx={{
                        ...skeletonBaseSx,
                        width: 44,
                        height: 40,
                        borderRadius: 999,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: { xs: 'flex', lg: 'none' }, flexDirection: 'column', gap: 1.5 }}>
          <Box
            sx={{
              ...skeletonBaseSx,
              width: '100%',
              height: 18,
              borderRadius: 1.5,
            }}
          />
          <Box
            sx={{
              ...skeletonBaseSx,
              width: '100%',
              height: 160,
              borderRadius: 2,
            }}
          />
          <Box sx={{ display: 'flex', gap: 1.25, justifyContent: 'flex-end' }}>
            <Box
              sx={{
                ...skeletonBaseSx,
                width: 44,
                height: 40,
                borderRadius: 999,
              }}
            />
            <Box
              sx={{
                ...skeletonBaseSx,
                width: 44,
                height: 40,
                borderRadius: 999,
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return <Box sx={{ p: 2, color: 'error.main' }}>Error loading cross references.</Box>;
  }

  if (!referenceGroups.length) {
    return <Box sx={{ p: 2, color: 'white' }}>No cross references available.</Box>;
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, background: '#1A1A1A', borderRadius: { xs: 2, sm: 3, md: 4.5 }, display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, flex: 1, minHeight: 0 }}>
        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, height: { xs: '250px', lg: '350px' }, outline: '2px rgba(255, 255, 255, 0.10) solid', outlineOffset: '-2px', borderRadius: { xs: 2, sm: 3, md: 4.5 } }}>
          {referenceGroups.map((keyword: ApiKeyword) => (
            <Box key={keyword.keyword} sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 2.5 } }}>
              <Typography sx={{ color: 'white', fontSize: { xs: 16, md: 20 }, fontFamily: 'Inter', fontWeight: 700, lineHeight: { xs: '24px', md: '36px' } }}>
                {keyword.keyword}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, md: 1.25 }, alignItems: 'flex-start' }}>
                {keyword.bibleVerseReferences.map((ref) => {
                  const isSelected = selectedSlug === ref.slug;
                  const glowColor = isMobile ? undefined : 'rgba(255, 193, 7, 0.08)';
                  return (
                    <IconActionButton
                      key={ref.slug}
                      label={`View cross reference ${ref.label}`}
                      text={ref.label}
                      hoverColor="rgba(255, 193, 7, 0.22)"
                      baseColor="rgba(255, 255, 255, 0.10)"
                      iconColor="rgba(255, 255, 255, 0.70)"
                      hoverIconColor="rgba(255, 255, 255, 1)"
                      textColor="rgba(255, 255, 255, 0.85)"
                      glowColor={glowColor}
                      active={isSelected}
                      onClick={() => {
                        setSelectedSlug(ref.slug);
                        if (isMobile) setMobileSheetOpen(true);
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
          <Box sx={{ mt: 'auto' }}>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.60)', fontSize: 12, fontFamily: 'Inter', fontWeight: 400, lineHeight: 1.6, mt: 0.75, mb: 1 }}>
              Cross references sourced from Treasury of Scriptural Knowledge (1830)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, background: GOLDEN_BG, borderRadius: { xs: 2, sm: 3, md: 4.5 }, display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', height: { xs: '350px', lg: '350px' }, overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 }, height: '100%', overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Radial gradient glow effect */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '450px',
                    height: '450px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${GOLDEN_GLOW_RADIAL} 0%, rgba(255, 193, 7, 0.3) 25%, rgba(255, 193, 7, 0.15) 50%, transparent 70%)`,
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 0.5,
                    transition: 'opacity 0.15s ease-out',
                    pointerEvents: 'none',
                    zIndex: 0,
                    filter: 'blur(20px)',
                    '@media (hover: hover)': {
                      '&:hover': {
                        opacity: 1,
                      }
                    }
                  }}
                />
                {/* Amber dot */}
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: GOLDEN_ICON_FULL,
                    position: 'relative',
                    zIndex: 2,
                  }}
                />
              </Box>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.90)', fontSize: 16, fontFamily: 'Inter', fontWeight: 400, lineHeight: '27px' }}>
                {referenceLabel || 'Select a reference'}
              </Typography>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  background: GOLDEN_BUTTON_BG,
                  borderRadius: 999,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ color: GOLDEN_ICON, fontSize: 11, fontFamily: 'Inter', fontWeight: 600, lineHeight: 1 }}>
                  {version.toUpperCase()}
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ 
              color: 'white', 
              fontSize: { xs: 16, md: 20 }, 
              fontFamily: 'Inter', 
              fontWeight: 400, 
              lineHeight: 1.4,
              '& sup': {
                fontSize: '0.7em',
                opacity: 0.6
              }
            }} dangerouslySetInnerHTML={{ __html: displayVerseText }}/>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3, flexShrink: 0, mt: 'auto' }}>
              <IconActionButton
                label="Explore passage"
                icon={<Search sx={{ fontSize: 20, color: 'inherit' }} />}
                text="Explore Passage"
                hoverColor={GOLDEN_BUTTON_HOVER}
                baseColor={GOLDEN_BUTTON_BG}
                iconColor={GOLDEN_ICON}
                hoverIconColor="rgba(255, 255, 255, 1.0)"
                textColor="rgba(255, 255, 255, 0.90)"
                href={getExplorePassageUrl()}
              />
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <IconActionButton
                  label="Copy verse to clipboard"
                  icon={<ContentCopy sx={{ fontSize: 18, color: 'inherit' }} />}
                  hoverColor={GOLDEN_BUTTON_HOVER}
                  baseColor="rgba(255, 255, 255, 0.10)"
                  iconColor={GOLDEN_ICON}
                  hoverIconColor="rgba(255, 255, 255, 1.0)"
                  onClick={handleCopyVerse}
                />
                <IconActionButton
                  label="Share verse"
                  icon={<IosShareIcon sx={{ fontSize: 18, color: 'inherit' }} />}
                  hoverColor={GOLDEN_BUTTON_HOVER}
                  baseColor="rgba(255, 255, 255, 0.10)"
                  iconColor={GOLDEN_ICON}
                  hoverIconColor="rgba(255, 255, 255, 1.0)"
                  onClick={handleShareVerse}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog.Root open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <Box
              sx={{
                display: { xs: 'block', lg: 'none' },
                position: 'fixed',
                inset: 0,
                backdropFilter: 'blur(2px)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                opacity: 0,
                transition: 'opacity 0.25s ease',
                pointerEvents: 'auto',
                zIndex: 1400,
                '&[data-state="open"]': { opacity: 1 },
                '&[data-state="closed"]': { pointerEvents: 'none' },
              }}
            />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <Box
              sx={{
                display: { xs: 'flex', lg: 'none' },
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 'calc(40vh + env(safe-area-inset-bottom))',
                backgroundColor: MOBILE_SHEET_BG,
                border: `1px solid ${GOLDEN_BG}`,
                borderRadius: '20px 20px 0 0',
                outline: 'none',
                '&:focus-visible': { outline: 'none' },
                flexDirection: 'column',
                paddingBottom: 'env(safe-area-inset-bottom)',
                transform: 'translateY(100%)',
                opacity: 0,
                transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease',
                '&[data-state="open"]': {
                  transform: 'translateY(0)',
                  opacity: 1,
                },
                '&[data-state="closed"]': {
                  transform: 'translateY(100%)',
                  opacity: 0,
                  pointerEvents: 'none',
                },
                zIndex: 1401,
                pointerEvents: 'auto',
                boxShadow: '0px -8px 40px rgba(0, 0, 0, 0.45)',
                overflow: 'hidden',
              }}
            >
              <Dialog.Title asChild>
                <VisuallyHidden>
                  {`Cross references for ${currentVerse.book} ${currentVerse.chapter}:${currentVerse.verse}`}
                </VisuallyHidden>
              </Dialog.Title>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, px: 2, pt: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Radial gradient glow effect - no hover on mobile */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '450px',
                        height: '450px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${GOLDEN_GLOW_RADIAL} 0%, rgba(255, 193, 7, 0.3) 25%, rgba(255, 193, 7, 0.15) 50%, transparent 70%)`,
                        transform: 'translate(-50%, -50%) scale(1)',
                        opacity: 0.5,
                        pointerEvents: 'none',
                        zIndex: -1,
                        filter: 'blur(20px)',
                      }}
                    />
                    {/* Amber dot */}
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: GOLDEN_ICON_FULL,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    />
                  </Box>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.90)', fontSize: 16, fontFamily: 'Inter', fontWeight: 400, lineHeight: '27px' }}>
                    {referenceLabel || 'Select a reference'}
                  </Typography>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      background: GOLDEN_BUTTON_BG,
                      borderRadius: 999,
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ color: GOLDEN_ICON, fontSize: 11, fontFamily: 'Inter', fontWeight: 600, lineHeight: 1 }}>
                      {version.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Dialog.Close asChild>
                    <Box
                      component={Primitive.button}
                      type="button"
                      sx={{
                        p: 0.5,
                        color: 'rgba(255, 255, 255, 0.64)',
                        border: 'none',
                        background: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease, background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                        },
                        '&:focus-visible': {
                          outline: '2px solid rgba(255,255,255,0.5)',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      <Close sx={{ fontSize: 18 }} />
                    </Box>
                  </Dialog.Close>
                </Box>
              </Box>
              <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
                <Typography sx={{ 
                  color: 'white', 
                  fontSize: { xs: 16, md: 20 }, 
                  fontFamily: 'Inter', 
                  fontWeight: 400, 
                  lineHeight: 1.4,
                  '& sup': {
                    fontSize: '0.7em',
                    opacity: 0.6
                  }
                }} dangerouslySetInnerHTML={{ __html: displayVerseText || 'Verse not found.' }}/>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3, flexShrink: 0, px: 2, pb: 2 }}>
                <IconActionButton
                  label="Explore passage"
                  icon={<Search sx={{ fontSize: 20, color: 'inherit' }} />}
                  text="Explore Passage"
                  hoverColor={GOLDEN_BUTTON_HOVER}
                  baseColor={GOLDEN_BUTTON_BG}
                  iconColor={GOLDEN_ICON}
                  hoverIconColor="rgba(255, 255, 255, 1.0)"
                  textColor="rgba(255, 255, 255, 0.90)"
                  href={getExplorePassageUrl()}
                />
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <IconActionButton
                    label="Copy verse to clipboard"
                    icon={<ContentCopy sx={{ fontSize: 18, color: 'inherit' }} />}
                    hoverColor={GOLDEN_BUTTON_HOVER}
                    baseColor="rgba(255, 255, 255, 0.10)"
                    iconColor={GOLDEN_ICON}
                    hoverIconColor="rgba(255, 255, 255, 1.0)"
                    onClick={handleCopyVerse}
                  />
                  <IconActionButton
                    label="Share verse"
                    icon={<IosShareIcon sx={{ fontSize: 18, color: 'inherit' }} />}
                    hoverColor={GOLDEN_BUTTON_HOVER}
                    baseColor="rgba(255, 255, 255, 0.10)"
                    iconColor={GOLDEN_ICON}
                    hoverIconColor="rgba(255, 255, 255, 1.0)"
                    onClick={handleShareVerse}
                  />
                </Box>
              </Box>
            </Box>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {showCopied && (
        <Box sx={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #4CAF50, #45A049)', color: 'white', px: 3, py: 1.5, borderRadius: 3, boxShadow: '0px 4px 16px rgba(76, 175, 80, 0.3)', fontSize: 14, fontFamily: 'Inter', fontWeight: 500, zIndex: 1000, animation: 'slideUpAndFade 2.5s ease-out forwards', '@keyframes slideUpAndFade': { '0%': { opacity: 0, transform: 'translateX(-50%) translateY(20px)' }, '10%': { opacity: 1, transform: 'translateX(-50%) translateY(0)' }, '80%': { opacity: 1, transform: 'translateX(-50%) translateY(0)' }, '100%': { opacity: 0, transform: 'translateX(-50%) translateY(-10px)' } } }}>
          ✓ Verse copied to clipboard!
        </Box>
      )}
    </Box>
  );
}
