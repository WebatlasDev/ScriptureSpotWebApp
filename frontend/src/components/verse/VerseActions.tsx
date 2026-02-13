'use client';

import { Box } from '@mui/material';
import type { MouseEvent } from 'react';
import { SubjectIcon } from '@/components/ui/phosphor-icons';
import { BookmarkBorderIcon } from '@/components/ui/phosphor-icons';
import { BookmarkIcon } from '@/components/ui/phosphor-icons';
import { IosShareIcon } from '@/components/ui/phosphor-icons';
import { ContentCopyIcon } from '@/components/ui/phosphor-icons';

import IconActionButton from './IconActionButton';
import { toGlowColor, toHoverColor, toIconColor } from '@/utils/colorUtils';

interface VerseActionsProps {
  chapterUrl: string;
  onBookmark: () => void;
  onShare: () => void;
  onCopy: () => void;
  isBookmarked: boolean;
  isMobile: boolean;
  shareHoverColor?: string;
  bookmarkHoverColor?: string;
  onFullChapterClick?: (event: MouseEvent<HTMLElement>) => void;
  fullChapterLoading?: boolean;
}

const FULL_CHAPTER_BASE_COLOR = '#9B59B6';
const SHARE_BASE_COLOR = '#4A9EFF';
const BOOKMARK_BASE_COLOR = '#FF9800';
const COPY_BASE_COLOR = '#92AEFF';

export default function VerseActions({
  chapterUrl,
  onBookmark,
  onShare,
  onCopy,
  isBookmarked,
  isMobile,
  shareHoverColor = SHARE_BASE_COLOR,
  bookmarkHoverColor = BOOKMARK_BASE_COLOR,
  onFullChapterClick,
  fullChapterLoading = false,
}: VerseActionsProps) {
  const sharedButtonProps = {
    baseColor: 'rgba(255, 255, 255, 0.10)',
    iconColor: 'rgba(255, 255, 255, 0.70)',
    hoverIconColor: 'rgba(255, 255, 255, 1.0)',
  } as const;

  if (isMobile) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexShrink: 0,
          flexWrap: 'nowrap',
        }}
      >
        <IconActionButton
          label="View chapter"
          icon={<SubjectIcon sx={{ fontSize: 20 }} />}
          hoverColor={toHoverColor(FULL_CHAPTER_BASE_COLOR, 0.30)}
          href={chapterUrl}
          onClick={onFullChapterClick}
          text="Full Chapter"
          baseColor={sharedButtonProps.baseColor}
          iconColor={sharedButtonProps.iconColor}
          hoverIconColor={toIconColor(FULL_CHAPTER_BASE_COLOR, 1.0)}
          loading={fullChapterLoading}
        />
        <IconActionButton
          label={isBookmarked ? 'Bookmarked' : 'Bookmark verse'}
          icon={
            isBookmarked ? (
              <BookmarkIcon sx={{ fontSize: 21 }} />
            ) : (
              <BookmarkBorderIcon sx={{ fontSize: 21 }} />
            )
          }
          hoverColor={toHoverColor(bookmarkHoverColor, 0.30)}
          onClick={onBookmark}
          active={isBookmarked}
          text={isBookmarked ? 'Bookmarked' : 'Bookmark'}
          baseColor={sharedButtonProps.baseColor}
          iconColor={isBookmarked ? toIconColor(bookmarkHoverColor, 1.0) : sharedButtonProps.iconColor}
          hoverIconColor={toIconColor(bookmarkHoverColor, 1.0)}
        />
        <IconActionButton
          label="Copy verse"
          icon={<ContentCopyIcon sx={{ fontSize: 19 }} />}
          hoverColor={toHoverColor(COPY_BASE_COLOR, 0.30)}
          onClick={onCopy}
          text="Copy"
          baseColor={sharedButtonProps.baseColor}
          iconColor={sharedButtonProps.iconColor}
          hoverIconColor={toIconColor(COPY_BASE_COLOR, 1.0)}
        />
        <IconActionButton
          label="Share verse"
          icon={<IosShareIcon sx={{ fontSize: 20 }} />}
          hoverColor={toHoverColor(shareHoverColor, 0.30)}
          onClick={onShare}
          text="Share"
          baseColor={sharedButtonProps.baseColor}
          iconColor={sharedButtonProps.iconColor}
          hoverIconColor={toIconColor(shareHoverColor, 1.0)}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <IconActionButton
        label="View chapter"
        tooltip="View chapter"
        tooltipPlacement="bottom"
        icon={<SubjectIcon sx={{ fontSize: 20 }} />}
        hoverColor={toHoverColor(FULL_CHAPTER_BASE_COLOR, 0.30)}
        href={chapterUrl}
        onClick={onFullChapterClick}
        baseColor={sharedButtonProps.baseColor}
        iconColor={sharedButtonProps.iconColor}
        hoverIconColor={toIconColor(FULL_CHAPTER_BASE_COLOR, 1.0)}
        glowColor={toGlowColor(FULL_CHAPTER_BASE_COLOR, 0.12)}
        loading={fullChapterLoading}
      />
      <IconActionButton
        label={isBookmarked ? 'Bookmarked' : 'Bookmark verse'}
        tooltip={isBookmarked ? 'Bookmarked' : 'Bookmark verse'}
        tooltipPlacement="bottom"
        icon={isBookmarked ? <BookmarkIcon sx={{ fontSize: 21 }} /> : <BookmarkBorderIcon sx={{ fontSize: 21 }} />}
        hoverColor={toHoverColor(bookmarkHoverColor, 0.30)}
        onClick={onBookmark}
        active={isBookmarked}
        baseColor={sharedButtonProps.baseColor}
        iconColor={isBookmarked ? toIconColor(bookmarkHoverColor, 1.0) : sharedButtonProps.iconColor}
        hoverIconColor={toIconColor(bookmarkHoverColor, 1.0)}
        glowColor={toGlowColor(bookmarkHoverColor, 0.12)}
      />
      <IconActionButton
        label="Share verse"
        tooltip="Share verse"
        tooltipPlacement="bottom"
        icon={<IosShareIcon sx={{ fontSize: 20 }} />}
        hoverColor={toHoverColor(shareHoverColor, 0.30)}
        onClick={onShare}
        baseColor={sharedButtonProps.baseColor}
        iconColor={sharedButtonProps.iconColor}
        hoverIconColor={toIconColor(shareHoverColor, 1.0)}
        glowColor={toGlowColor(shareHoverColor, 0.12)}
      />
      <IconActionButton
        label="Copy verse"
        tooltip="Copy verse"
        tooltipPlacement="bottom"
        icon={<ContentCopyIcon sx={{ fontSize: 19 }} />}
        hoverColor={toHoverColor(COPY_BASE_COLOR, 0.30)}
        onClick={onCopy}
        baseColor={sharedButtonProps.baseColor}
        iconColor={sharedButtonProps.iconColor}
        hoverIconColor={toIconColor(COPY_BASE_COLOR, 1.0)}
        glowColor={toGlowColor(COPY_BASE_COLOR, 0.12)}
      />
    </Box>
  );
}
