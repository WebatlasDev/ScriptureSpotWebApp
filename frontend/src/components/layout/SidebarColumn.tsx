'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import CommentaryStickySidebarAd from '../ads/CommentaryStickySidebarAd';

const COMMENTARY_SEGMENT_INDEX = {
  ROOT: 0,
  AUTHOR: 1,
  COMMENTARIES: 2,
  BOOK: 3,
  CHAPTER: 4,
} as const;

const STICKY_AD_OFFSET = 120; // Covers header height plus breathing room

const isCommentaryChapterPath = (pathname?: string | null) => {
  if (!pathname) {
    return false;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length !== 5) {
    return false;
  }

  return (
    segments[COMMENTARY_SEGMENT_INDEX.ROOT] === 'commentators' &&
    segments[COMMENTARY_SEGMENT_INDEX.COMMENTARIES] === 'commentaries' &&
    segments[COMMENTARY_SEGMENT_INDEX.AUTHOR] !== 'verse-takeaways'
  );
};

export default function SidebarColumn() {
  const pathname = usePathname();
  const showCommentaryStickyAd = isCommentaryChapterPath(pathname);

  return (
    <Box
      sx={{
        display: { xs: 'none', lg: 'flex' },
        width: { lg: 300 },
        flexDirection: 'column',
        gap: 3,
        flexShrink: 0,
      }}
    >
      <Sidebar />

      {showCommentaryStickyAd && (
        <Box
          sx={{
            position: 'sticky',
            top: `${STICKY_AD_OFFSET}px`,
            alignSelf: 'flex-start',
            width: '100%',
            marginTop: 2,
          }}
        >
          <CommentaryStickySidebarAd />
        </Box>
      )}
    </Box>
  );
}
