import { Box } from '@mui/material';
import { ReactNode, useMemo } from 'react';

interface CommentarySliderProps<T = any> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey: (item: T, index: number) => string;
  peekOffset?: number;
}

const DEFAULT_PEEK_OFFSET = 72; // amount of the next card left visible

export default function CommentarySlider<T>({
  items,
  renderItem,
  getItemKey,
  peekOffset = DEFAULT_PEEK_OFFSET,
}: CommentarySliderProps<T>) {
  if (!items?.length) {
    return null;
  }

  const renderedItems = useMemo(
    () => items.map((item, index) => (
      <Box
        key={getItemKey(item, index)}
        sx={{
          flex: `0 0 calc(100% - ${peekOffset}px)`,
          maxWidth: `calc(100% - ${peekOffset}px)`,
          scrollSnapAlign: 'start',
          display: 'flex',
        }}
      >
        {renderItem(item, index)}
      </Box>
    )),
    [getItemKey, items, peekOffset, renderItem]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          overflowX: 'auto',
          gap: 2,
          px: 2,
          py: 1,
          ml: -2,
          mr: -2,
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: '16px',
          scrollPaddingRight: `${peekOffset + 16}px`,
          touchAction: 'manipulation',
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {renderedItems}
      </Box>
    </Box>
  );
}
