'use client';

import React, { useState } from 'react';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import { BookmarkBorderIcon } from '@/components/ui/phosphor-icons';
import { BookmarkIcon } from '@/components/ui/phosphor-icons';
import { useCreateBookmark, useDeleteBookmark } from '@/hooks/useBookmarkMutations';
import { BookmarkType } from '@/types/bookmark';

export interface BookmarkButtonProps extends Omit<IconButtonProps, 'color' | 'type'> {
  /**
   * Whether the item is bookmarked (controlled usage)
   */
  isBookmarked?: boolean;
  /**
   * Identifier for the item to bookmark (commentaryId, etc.)
   */
  id: string;
  /**
   * Content type of the bookmark, e.g., "Commentary"
   */
  type: BookmarkType | string;
  /**
   * Clerk user ID
   */
  userId: string;
  /**
   * Callback when bookmark status changes
   */
  onBookmarkChange?: (isBookmarked: boolean) => void;
  /**
   * Icon color (CSS color string)
   */
  iconColor?: string;
  /**
   * Size of the icon
   */
  iconSize?: string | number;
  /**
   * Tooltip text (optional)
   */
  tooltipText?: string;
  /**
   * Initial state if uncontrolled
   */
  defaultBookmarked?: boolean;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked: isBookmarkedProp,
  id,
  type,
  userId,
  onBookmarkChange,
  iconColor = 'white',
  iconSize = 'default',
  tooltipText,
  defaultBookmarked = false,
  sx,
  ...rest
}) => {
  const [internalBookmarked, setInternalBookmarked] = useState(defaultBookmarked);

  const isBookmarked = isBookmarkedProp !== undefined ? isBookmarkedProp : internalBookmarked;

  const { createBookmark } = useCreateBookmark();
  const { deleteBookmark } = useDeleteBookmark();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isBookmarked) {
      // Deletion is only allowed on the bookmarks page
      return;
    }

    if (isBookmarkedProp === undefined) {
      setInternalBookmarked(true);
    }

    try {
      await createBookmark({ id, type, userId });
    } catch {
    }

    if (onBookmarkChange) {
      onBookmarkChange(true);
    }

    if (rest.onClick) {
      rest.onClick(e);
    }
  };

  const renderButton = () => (
    <IconButton
      size="small"
      onClick={handleClick}
      sx={{
        color: iconColor,
        p: 1,
        ...sx,
      }}
      {...rest}
    >
      {isBookmarked ? (
        <BookmarkIcon sx={{ fontSize: iconSize }} />
      ) : (
        <BookmarkBorderIcon sx={{ fontSize: iconSize }} />
      )}
    </IconButton>
  );

  return tooltipText ? (
    <Tooltip title={tooltipText} arrow>
      {renderButton()}
    </Tooltip>
  ) : (
    renderButton()
  );
};

export default BookmarkButton;
