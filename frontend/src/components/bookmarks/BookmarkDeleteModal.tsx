'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { BookmarkDisplay, BookmarkType } from '@/types/bookmark';

interface BookmarkDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookmark: BookmarkDisplay | null;
  isLoading: boolean;
}

export default function BookmarkDeleteModal({
  open,
  onClose,
  onConfirm,
  bookmark,
  isLoading,
}: BookmarkDeleteModalProps) {
  const sheetVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: '100%',
    },
    visible: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: '100%',
    },
  }), []);

  const overlayVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  }), []);

  const getBookmarkTitle = () => {
    if (!bookmark) return '';

    const contentType = String(bookmark.contentType);

    switch (contentType) {
      case BookmarkType.COMMENTARY:
      case 'commentary':
        return `${bookmark.author?.name || 'Unknown'} on ${bookmark.reference || 'Unknown'}`;
      case BookmarkType.HYMN:
      case 'hymn':
        return bookmark.title || 'Unknown Hymn';
      case BookmarkType.SERMON:
      case 'sermon':
        return bookmark.title || 'Unknown Sermon';
      case BookmarkType.BOOK_HIGHLIGHT:
      case 'book_highlight':
        return bookmark.bookTitle || bookmark.title || 'Unknown Book';
      default:
        return bookmark.title || 'Unknown Content';
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <Dialog.Overlay asChild>
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(12, 12, 12, 0.65)',
                  backdropFilter: 'none',
                  zIndex: 1300,
                  pointerEvents: 'auto',
                }}
              />
            </Dialog.Overlay>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <Dialog.Content
              asChild
              onEscapeKeyDown={(event) => {
                if (isLoading) {
                  event.preventDefault();
                }
              }}
            >
              <motion.div
                variants={sheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  position: 'fixed',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100vw',
                  maxWidth: 500,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  backgroundColor: '#1A1A1A',
                  borderRadius: '16px 16px 0 0',
                  outline: 'none',
                  zIndex: 1301,
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    pb: 'calc(16px + env(safe-area-inset-bottom, 0px))',
                    backgroundColor: '#1A1A1A',
                  }}
                >
          <Dialog.Title asChild>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                textAlign: 'center',
                color: '#FFFAFA',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              Remove Bookmark?
            </Typography>
          </Dialog.Title>

          <Dialog.Description asChild>
            <Typography
              sx={{
                mb: 3,
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to remove "{getBookmarkTitle()}" from your bookmarks?
            </Typography>
          </Dialog.Description>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Dialog.Close asChild>
              <Button
                disabled={isLoading}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 14,
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                }}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              variant="contained"
              sx={{
                backgroundColor: '#FF4444',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 500,
                px: 3,
                py: 1.5,
                '&:hover': { backgroundColor: '#E63333' },
                '&:disabled': { backgroundColor: 'rgba(255, 68, 68, 0.5)' }
              }}
            >
              {isLoading ? 'Removing...' : 'Remove'}
            </Button>
          </Box>
        </Box>
              </motion.div>
            </Dialog.Content>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
