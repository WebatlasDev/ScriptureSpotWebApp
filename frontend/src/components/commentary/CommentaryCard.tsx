import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import { useEffect, useMemo, useCallback, useState, type KeyboardEvent } from 'react';
import { BaseButton, Pill } from '@/components/ui';
import { replaceReferenceShortcodes, slugToBookName } from '@/utils/stringHelpers';
import { refreshModalAds } from '@/utils/adUtils';
import { formatCenturyFromYear } from '@/utils/century';
import { useDeferredRender } from '@/hooks/useDeferredRender';
import { textStyles, type TextStyle } from '@/styles/textStyles';

const CommentaryModalDesktop = dynamic(() => import('./CommentaryModalDesktop'), { ssr: false });
const CommentaryModalMobile = dynamic(() => import('./CommentaryModalMobile'), { ssr: false });

interface CommentaryCardProps {
  commentary: any;
  commentaries: any;
  verseContent: string;
  verseVersion: string;
  initialAuthor?: string | null;
  isMdUp: boolean;
}

const toTypographySx = ({
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  textTransform,
}: TextStyle) => ({
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing: letterSpacing ?? '0px',
  textTransform,
});

const headingStyle = toTypographySx(textStyles.heading.medium.s);
const bodyStyle = toTypographySx(textStyles.body.regular.l);

const buildAuthorGradient = (primary: string) =>
  `linear-gradient(177deg, rgba(0, 0, 0, 0) 32%, #121212 100%), linear-gradient(345deg, ${alpha(primary, 0.32)} 0%, rgba(0, 0, 0, 0.32) 69%, ${alpha(primary, 0.32)} 69%, rgba(0, 0, 0, 0.13) 100%), linear-gradient(63deg, #121212 0%, ${primary} 100%), #121212`;

const buildAvatarGradient = (primary: string) => `linear-gradient(39deg, #121212 0%, ${primary} 100%)`;

export default function CommentaryCard({ commentary, commentaries, verseContent, verseVersion, initialAuthor, isMdUp }: CommentaryCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const shouldRenderModal = useDeferredRender(modalOpen);

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  useEffect(() => {
    if (initialAuthor && commentary.author.name.toLowerCase() === initialAuthor.toLowerCase()) {
      handleOpenModal();
    }
  }, [initialAuthor, commentary.author.name, handleOpenModal]);

  const handleCloseModal = () => {
    setModalOpen(false);
    refreshModalAds();
  };

  const formattedReference = useMemo(() => {
    if (!commentary.slug) {
      return '';
    }

    const parts = commentary.slug.split('/');
    const bookSlug = parts[4] ?? '';
    const chapter = parts[5] ?? '';
    const versePart = parts[6] ?? '';
    const [rangeStart, rangeEnd] = versePart.split('-');

    const book = slugToBookName(bookSlug);
    const baseReference = `${book} ${chapter}`;

    if (!versePart) {
      return `${baseReference}:`;
    }

    return rangeEnd ? `${baseReference}:${rangeStart}–${rangeEnd}` : `${baseReference}:${rangeStart}`;
  }, [commentary.slug]);

  const metadataTags = useMemo(() => {
    const tags: string[] = [];
    const centuryTag = formatCenturyFromYear(commentary.author?.birthYear);
    if (centuryTag) {
      tags.push(centuryTag);
    }
    if (commentary.author?.religiousTradition) {
      tags.push(commentary.author.religiousTradition);
    }
    return tags.filter(Boolean);
  }, [commentary.author?.birthYear, commentary.author?.religiousTradition]);

  const htmlWithLinks = useMemo(
    () => replaceReferenceShortcodes(verseVersion, commentary.previewContent, commentary.author?.colorScheme),
    [verseVersion, commentary.previewContent, commentary.author?.colorScheme]
  );

  const previewHtml = htmlWithLinks?.trim() || '<p>Commentary text</p>';
  const authorPrimary = commentary.author?.colorScheme?.primary || '#278EFF';
  const authorGradient = buildAuthorGradient(authorPrimary);
  const avatarGradient = buildAvatarGradient(authorPrimary);
  const authorOutline = alpha(authorPrimary, 0.2);

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpenModal();
    }
  };

  return (
    <>
      <Box
        role="button"
        tabIndex={0}
        onClick={handleOpenModal}
        onKeyDown={handleCardKeyDown}
        sx={{
          '--ss-commentary-header-overlay-opacity': 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          textDecoration: 'none',
          cursor: 'pointer',
          border: 'none',
          background: 'none',
          textAlign: 'left',
          font: 'inherit',
          color: 'inherit',
          position: 'relative',
          borderRadius: 'var(--ss-radius-semantic-layer-2-xl)',
          outline: `2px solid ${authorOutline}`,
          outlineOffset: '-2px',
          overflow: 'hidden',
          transition: isMdUp ? 'transform 0.1s ease-out' : 'none',
          WebkitTapHighlightColor: 'transparent',
          '&:focus-visible': {
            outline: '3px solid rgba(255,255,255,0.75)',
            outlineOffset: '4px',
          },
          '&:active': {
            transform: isMdUp ? 'scale(0.98)' : 'none',
          },
          '&:hover': {
            '--ss-commentary-header-overlay-opacity': 0.3,
          },
        }}
      >
        <Box
          sx={{
            padding: 'var(--ss-spacing-semantic-inset-container-loose)',
            background: authorGradient,
            borderTopLeftRadius: 'var(--ss-radius-semantic-layer-2-xl)',
            borderTopRightRadius: 'var(--ss-radius-semantic-layer-2-xl)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--ss-spacing-semantic-gap-small)',
            position: 'relative',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 1)',
              opacity: 'var(--ss-commentary-header-overlay-opacity)',
              transition: isMdUp ? 'opacity 0.55s ease' : 'none',
              borderTopLeftRadius: 'var(--ss-radius-semantic-layer-2-xl)',
              borderTopRightRadius: 'var(--ss-radius-semantic-layer-2-xl)',
              pointerEvents: 'none',
              zIndex: 0,
            },
            '& > *': {
              position: 'relative',
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--ss-spacing-semantic-gap-large)',
            }}
          >
            <Box
              sx={{
                width: 75,
                height: 75,
                borderRadius: 'var(--ss-radius-semantic-control-full)',
                background: avatarGradient,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 'var(--ss-radius-semantic-control-full)',
                  position: 'absolute',
                  zIndex: 1,
                  outline: `2px solid ${authorOutline}`,
                  outlineOffset: '-2px',
                }}
              />
              {commentary.author?.image && (
                <Image
                  src={commentary.author.image}
                  alt={commentary.author.name}
                  width={75}
                  height={75}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center bottom',
                    display: 'block',
                    position: 'relative',
                    zIndex: 2,
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--ss-spacing-semantic-gap-small)',
              }}
            >
              <Typography
                component="h3"
                sx={{
                  ...headingStyle,
                  color: 'var(--ss-color-semantic-content-text-primary)',
                  textAlign: 'center',
                }}
              >
                {commentary.author?.name || 'Author'}
              </Typography>
              <Typography
                component="p"
                sx={{
                  ...bodyStyle,
                  color: commentary.author?.colorScheme?.chipText || alpha(authorPrimary, 0.8),
                  textAlign: 'center',
                }}
              >
                On {formattedReference || 'Reference'}
              </Typography>
            </Box>
          </Box>

          {metadataTags.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                gap: 'var(--ss-spacing-semantic-gap-small)',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {metadataTags.map(tag => (
                <Pill
                  key={tag}
                  label={tag}
                  sx={{
                    backgroundColor: alpha(authorPrimary, 0.4),
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            padding: 'var(--ss-spacing-semantic-gap-extra-large)',
            background: 'var(--ss-color-semantic-background-surface-primary)',
            borderBottomLeftRadius: 'var(--ss-radius-semantic-layer-2-xl)',
            borderBottomRightRadius: 'var(--ss-radius-semantic-layer-2-xl)',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            gap: 'var(--ss-spacing-semantic-gap-medium)',
          }}
        >
          <Typography
            component="div"
            key={commentary.id}
            sx={{
              ...bodyStyle,
              color: 'var(--ss-color-semantic-content-text-secondary)',
              position: 'relative',
              overflow: 'hidden',
              maxHeight: 'calc(1.5em * 5)',
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              '& > *:first-child': {
                marginTop: 0,
              },
              '& > *:last-child': {
                marginBottom: 0,
              },
              '& a': {
                pointerEvents: 'none',
                cursor: 'pointer !important',
              },
            }}
            dangerouslySetInnerHTML={{
              __html: previewHtml,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              bottom: 'var(--ss-spacing-semantic-gap-extra-large)',
              right: 'var(--ss-spacing-semantic-gap-extra-large)',
              zIndex: 2,
            }}
          >
            <BaseButton
              size="medium"
              variant="secondary"
              iconOnly
              ariaLabel="Open commentary"
              startIcon={<ArrowForwardIcon />}
            />
          </Box>
        </Box>
      </Box>
      {shouldRenderModal &&
        (isMdUp ? (
          <CommentaryModalDesktop
            open={modalOpen}
            onClose={handleCloseModal}
            initialCommentaryId={commentary.id}
            reference={formattedReference}
            commentaries={commentaries}
            verseContent={verseContent}
            verseVersion={verseVersion}
          />
        ) : (
          <CommentaryModalMobile
            open={modalOpen}
            onClose={handleCloseModal}
            initialCommentaryId={commentary.id}
            reference={formattedReference}
            commentaries={commentaries}
            verseContent={verseContent}
            verseVersion={verseVersion}
          />
        ))}
    </>
  );
}
