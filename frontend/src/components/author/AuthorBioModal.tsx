'use client';

import React, { useMemo } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Primitive } from '@radix-ui/react-primitive';
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { CloseIcon } from '@/components/ui/phosphor-icons';
import Image from 'next/image';
import { AuthorFromAPI } from '@/types/author';
import { getAuthorBiography } from '@/utils/getAuthorBiography';
import { formatCenturyFromYear } from '@/utils/century';
import { CustomChip } from '@/components/ui';

interface AuthorBioModalProps {
  open: boolean;
  onClose: () => void;
  author: AuthorFromAPI;
}

const TEXT_COLOR_PRIMARY = '#FFFAFA';
const TEXT_COLOR_SECONDARY = 'rgba(255, 249.70, 249.70, 0.60)';
const FONT_FAMILY = 'Inter, sans-serif';
const CLOSE_HOVER_COLOR = '#FF4D57';
const ICON_BOX_SIZE = 36;
const ICON_BOX_BACKGROUND = 'rgba(255, 255, 255, 0.10)';

const buildAuthorBadges = (author: AuthorFromAPI): string[] => {
  const badges: string[] = [];

  const rawTags = (author as unknown as { tags?: string[] }).tags;
  if (Array.isArray(rawTags) && rawTags.length > 0) {
    badges.push(...rawTags);
  }

  if (author.religiousTradition) badges.push(author.religiousTradition);
  if (author.occupation) badges.push(author.occupation);
  if (author.nationality) badges.push(author.nationality);
  if (author.birthYear) {
    const century = formatCenturyFromYear(author.birthYear);
    if (century && !badges.includes(century)) badges.push(century);
  }

  return badges;
};

export default function AuthorBioModal({ open, onClose, author }: AuthorBioModalProps) {
  const biography = getAuthorBiography(author);

  const yearsDisplay = (() => {
    if (author.birthYear && author.deathYear) {
      return `${author.birthYear}–${author.deathYear}`;
    } else if (author.birthYear) {
      return `${author.birthYear}–`;
    }
    return '';
  })();

  const biographyText = biography?.fullText || biography?.summary || 'We’re gathering more information on this commentator. Check back soon.';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const desktopVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const sheetVariants = {
    hidden: { opacity: 0, y: '100%' },
    visible: { opacity: 1, y: 0 },
  };

  const authorBadges = useMemo(() => buildAuthorBadges(author), [author]);
  const chipBackground = author.colorScheme?.chipBackground || 'rgba(233, 36, 154, 0.30)';
  const chipTextColor = author.colorScheme?.chipText || '#FF72C6';

  return (
    <Dialog.Root open={open} onOpenChange={state => { if (!state) onClose(); }}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: isMobile ? 'rgba(0, 0, 0, 0.88)' : 'rgba(0, 0, 0, 0.94)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  zIndex: 2500,
                }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={isMobile ? sheetVariants : desktopVariants}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  display: 'flex',
                  alignItems: isMobile ? 'flex-end' : 'center',
                  justifyContent: 'center',
                  zIndex: 2501,
                  outline: 'none',
                }}
              >
                <Box
                  onClick={event => event.stopPropagation()}
                  sx={{
                    position: 'relative',
                    width: isMobile ? '100vw' : { xs: '90vw', sm: '80vw', md: 600 },
                    maxHeight: isMobile ? '85vh' : { xs: '75vh', md: '65vh' },
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: isMobile ? '28px 28px 0 0' : '20px',
                    overflow: 'hidden',
                    bgcolor: 'black',
                    color: TEXT_COLOR_PRIMARY,
                    fontFamily: FONT_FAMILY,
                    outline: 'none',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.45)',
                      pointerEvents: 'none',
                      zIndex: 0,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
                    <Dialog.Title asChild>
                      <VisuallyHidden>{author.name} biography</VisuallyHidden>
                    </Dialog.Title>
                    <Dialog.Description asChild>
                      <VisuallyHidden>
                        Historical background and details for commentator {author.name}
                      </VisuallyHidden>
                    </Dialog.Description>
                    {/* Header with author info */}
                    <Box
                      sx={{
                        px: { xs: 3, sm: 4 },
                        pt: { xs: 3, sm: 4 },
                        pb: { xs: 2.5, sm: 3 },
                        background: author.colorScheme?.gradient || 'linear-gradient(90deg, rgba(233, 36, 154, 0.10) 0%, rgba(233, 36, 154, 0.05) 100%)',
                        position: 'relative',
                        flexShrink: 0,
                      }}
                    >
                      <Dialog.Close asChild>
                        <Box
                          component={Primitive.button}
                          type="button"
                          aria-label="Close"
                          sx={{
                            position: 'absolute',
                            top: { xs: 16, sm: 24 },
                            right: { xs: 16, sm: 24 },
                            width: ICON_BOX_SIZE,
                            height: ICON_BOX_SIZE,
                            borderRadius: '10px',
                            backgroundColor: ICON_BOX_BACKGROUND,
                            color: 'rgba(255, 255, 255, 0.8)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.25s ease',
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: CLOSE_HOVER_COLOR,
                              color: 'rgba(255, 255, 255, 0.95)',
                            },
                            '&:active': {
                              transform: 'scale(0.9)',
                            },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 23 }} />
                        </Box>
                      </Dialog.Close>

                      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, pr: { xs: 1, sm: 6 }, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Box
                          sx={{
                            width: 51,
                            height: 51,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            background: `linear-gradient(216deg, ${author.colorScheme?.primary || '#E9249A'} 0%, black 100%)`,
                            flexShrink: 0,
                          }}
                        >
                          <Image
                            src={author.image}
                            alt={author.name}
                            width={51}
                            height={51}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }}
                          />
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: 22,
                              fontWeight: 700,
                              lineHeight: 1.2,
                              color: TEXT_COLOR_PRIMARY,
                              mb: 0.5,
                            }}
                          >
                            {author.name}
                          </Typography>
                          {yearsDisplay && (
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: TEXT_COLOR_SECONDARY,
                                lineHeight: 1.3
                              }}
                            >
                              {yearsDisplay}
                            </Typography>
                          )}
                          {authorBadges.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', mt: 1 }}>
                              {authorBadges.map((badge, idx) => (
                                <CustomChip
                                  key={`${badge}-${idx}`}
                                  label={badge}
                                  bgColor={chipBackground}
                                  textColor={chipTextColor}
                                  fontSize={11}
                                  fontWeight={500}
                                  padding="3px 8px"
                                  borderRadius={1}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    {/* Biography content */}
                    <Box
                      sx={{
                        flex: 1,
                        overflowY: 'auto',
                        px: { xs: 3, sm: 4 },
                        py: { xs: 2.5, sm: 3 },
                        minHeight: 0,
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '4px',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.3)',
                          },
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 400,
                          lineHeight: 1.7,
                          color: TEXT_COLOR_PRIMARY,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {biographyText}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
