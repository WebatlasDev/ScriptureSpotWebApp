'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as Popover from '@radix-ui/react-popover';
import { 
  FilterList as FilterIcon, 
  Close as CloseIcon 
} from '@/components/ui/phosphor-icons';
import { BookmarkType, BookmarkFilters as BookmarkFiltersType } from '@/types/bookmark';

interface BookmarkFiltersProps {
  filters: BookmarkFiltersType;
  onFiltersChange: (filters: BookmarkFiltersType) => void;
}

const TriggerButton = styled('button')(({ theme }) => ({
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: '#FFFAFA',
  fontSize: 14,
  fontFamily: 'Inter',
  fontWeight: 500,
  lineHeight: 1.5,
  cursor: 'pointer',
  padding: 0,
  margin: 0,
  background: 'transparent',
  border: 'none',
  flexShrink: 0,
  '&:hover': {
    color: 'rgba(255, 255, 255, 0.85)',
  },
}));

const PopoverContent = styled(Popover.Content)(({ theme }) => ({
  background: '#1A1A1A',
  color: '#FFFFFF',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.08)',
  minWidth: 220,
  overflow: 'hidden',
  boxShadow: '0px 18px 45px rgba(0, 0, 0, 0.45)',
  zIndex: 1600,
  display: 'flex',
  flexDirection: 'column',
}));

const OptionsContainer = styled('div')(({ theme }) => ({
  padding: '4px 0',
  maxHeight: 280,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
}));

const OptionButton = styled('button')(({ theme }) => ({
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  width: '100%',
  padding: '7px 12px',
  borderRadius: theme.spacing(1.5),
  cursor: 'pointer',
  color: '#FFFFFF',
  fontSize: 13,
  fontFamily: 'Inter',
  fontWeight: 500,
  lineHeight: 1.4,
  transition: 'background 0.15s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
  '&[data-selected="true"]': {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  '&:focus-visible': {
    outline: '2px solid rgba(255, 255, 255, 0.25)',
    outlineOffset: 2,
  },
}));

const normalizeContentType = (type: BookmarkType) =>
  type === BookmarkType.VERSE_VERSION ? BookmarkType.VERSE : type;

function arraysEqual(a: BookmarkType[], b: BookmarkType[]) {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every(item => setB.has(item));
}

export default function BookmarkFilters({ filters, onFiltersChange }: BookmarkFiltersProps) {
  const [open, setOpen] = useState(false);

  const allContentTypes = [
    BookmarkType.COMMENTARY,
    BookmarkType.HYMN,
    BookmarkType.SERMON,
    BookmarkType.CATECHISM,
    BookmarkType.CREED,
    BookmarkType.DEVOTIONAL,
    BookmarkType.BOOK_HIGHLIGHT,
    BookmarkType.VERSE,
    BookmarkType.BOOK_OVERVIEW,
    BookmarkType.TAKEAWAY,
    BookmarkType.STRONGS_CONCORDANCE,
  ];

  const normalizedContentTypes = useMemo(
    () => Array.from(new Set(filters.contentTypes.map(normalizeContentType))),
    [filters.contentTypes]
  );

  const [draftContentTypes, setDraftContentTypes] = useState<BookmarkType[]>(normalizedContentTypes);

  useEffect(() => {
    const hadDuplicates = normalizedContentTypes.length !== filters.contentTypes.length;
    const hadVerseVersion = filters.contentTypes.some(type => type === BookmarkType.VERSE_VERSION);

    if (hadDuplicates || hadVerseVersion) {
      onFiltersChange({
        ...filters,
        contentTypes: normalizedContentTypes,
      });
    }
  }, [filters, normalizedContentTypes, onFiltersChange]);

  const draftHasChanges = useMemo(
    () => !arraysEqual(draftContentTypes, normalizedContentTypes),
    [draftContentTypes, normalizedContentTypes]
  );

  useEffect(() => {
    if (!draftHasChanges) {
      setDraftContentTypes(normalizedContentTypes);
    }
  }, [normalizedContentTypes, draftHasChanges]);

  const handleDraftContentTypeToggle = (contentType: BookmarkType) => {
    const normalizedType = normalizeContentType(contentType);
    setDraftContentTypes(previous => {
      const isSelected = previous.includes(normalizedType);
      return isSelected
        ? previous.filter(type => type !== normalizedType)
        : [...previous, normalizedType];
    });
  };

  const handleRemoveContentType = (contentType: BookmarkType) => {
    const normalizedType = normalizeContentType(contentType);
    const newContentTypes = normalizedContentTypes.filter(type => type !== normalizedType);
    onFiltersChange({
      ...filters,
      contentTypes: newContentTypes
    });
    setDraftContentTypes(newContentTypes);
  };

  const handleClearAll = () => {
    onFiltersChange({
      ...filters,
      contentTypes: []
    });
    setDraftContentTypes([]);
  };

  const getContentTypeLabel = (type: BookmarkType): string => {
    switch (type) {
      case BookmarkType.COMMENTARY:
        return 'Commentary';
      case BookmarkType.HYMN:
        return 'Hymn';
      case BookmarkType.SERMON:
        return 'Sermon';
      case BookmarkType.CATECHISM:
        return 'Catechism';
      case BookmarkType.CREED:
        return 'Creed';
      case BookmarkType.DEVOTIONAL:
        return 'Devotional';
      case BookmarkType.BOOK_HIGHLIGHT:
        return 'Book Highlight';
      case BookmarkType.VERSE:
        return 'Verse';
      case BookmarkType.BOOK_OVERVIEW:
        return 'Book Overview';
      case BookmarkType.TAKEAWAY:
        return 'Takeaway';
      case BookmarkType.STRONGS_CONCORDANCE:
        return "Strong's Concordance";
      default:
        return type;
    }
  };

  // Check if any filters are active
  const hasActiveFilters = normalizedContentTypes.length > 0;
  const totalFilterCount = normalizedContentTypes.length;
  const handleApply = () => {
    if (!draftHasChanges) {
      setOpen(false);
      return;
    }

    onFiltersChange({
      ...filters,
      contentTypes: draftContentTypes,
    });
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 4,
        py: 2,
        background: '#1a1a1a',
        borderRadius: 3.5,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        height: 56, // Fixed height instead of minHeight
      }}
    >
      {/* Filter Button */}
      <Popover.Root
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) {
            setDraftContentTypes(normalizedContentTypes);
          }
        }}
      >
        <Popover.Trigger asChild>
          <TriggerButton type="button">
            <FilterIcon sx={{ color: 'white', fontSize: 16 }} />
            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Filter {totalFilterCount > 0 && (
                <Box
                  component="span"
                  sx={{
                    fontSize: 12,
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginLeft: 0.5,
                  }}
                >
                  ({totalFilterCount})
                </Box>
              )}
            </Box>
            <Box sx={{ display: { xs: totalFilterCount > 0 ? 'none' : 'inline', sm: 'none' } }}>
              Filter
            </Box>
          </TriggerButton>
        </Popover.Trigger>

        <Popover.Portal>
          <PopoverContent sideOffset={10} align="start">
            <OptionsContainer>
              {allContentTypes.map((type) => {
                const isSelected = draftContentTypes.includes(type);
                return (
                  <OptionButton
                    key={type}
                    type="button"
                    data-selected={isSelected ? 'true' : undefined}
                    onClick={() => handleDraftContentTypeToggle(type)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox
                        checked={isSelected}
                        size="small"
                        disableRipple
                        sx={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          pointerEvents: 'none',
                          '&.Mui-checked': {
                            color: '#FFFFFF',
                          },
                        }}
                      />
                      <Box
                        component="span"
                        sx={{
                          fontSize: 13,
                          fontFamily: 'Inter',
                          fontWeight: 500,
                          color: '#FFFFFF',
                        }}
                      >
                        {getContentTypeLabel(type)}
                      </Box>
                    </Box>
                  </OptionButton>
                );
              })}
            </OptionsContainer>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 1.5,
                px: 1.5,
                py: 1.5,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
              }}
            >
              <Button
                onClick={() => {
                  setDraftContentTypes(normalizedContentTypes);
                  setOpen(false);
                }}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 13,
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  textTransform: 'none',
                  padding: '4px 10px',
                  minWidth: 0,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                disabled={!draftHasChanges}
                sx={{
                  fontSize: 13,
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  textTransform: 'none',
                  padding: '4px 12px',
                  minWidth: 0,
                  borderRadius: 1.5,
                  background: draftHasChanges
                    ? 'linear-gradient(135deg, #FFFFFF 0%, rgba(240, 242, 247, 0.85) 100%)'
                    : 'rgba(255, 255, 255, 0.12)',
                  color: draftHasChanges ? '#161616' : 'rgba(255, 255, 255, 0.45)',
                  '&:hover': {
                    background: draftHasChanges
                      ? 'linear-gradient(135deg, #FFFFFF 0%, rgba(240, 242, 247, 0.85) 100%)'
                      : 'rgba(255, 255, 255, 0.12)',
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(255, 255, 255, 0.12)',
                    color: 'rgba(255, 255, 255, 0.45)',
                  },
                }}
              >
                Apply
              </Button>
            </Box>
          </PopoverContent>
        </Popover.Portal>
      </Popover.Root>

      {/* Divider (only shown when filters are active and on desktop) */}
      {hasActiveFilters && (
        <Box
          sx={{
            width: 2,
            height: 22,
            background: 'rgba(255, 255, 255, 0.10)',
            flexShrink: 0,
            mx: { xs: 1, sm: 2 },
            display: { xs: 'none', sm: 'block' },
          }}
        />
      )}

      {/* Mobile spacing (only shown on mobile when filters are active) */}
      {hasActiveFilters && (
        <Box
          sx={{
            width: 8,
            display: { xs: 'block', sm: 'none' },
            flexShrink: 0,
          }}
        />
      )}

      {/* Scrollable Container for Filter Chips */}
      {hasActiveFilters && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            gap: 1,
            flex: 1,
            minWidth: 0,
            height: '100%', // Use full height of parent
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '20px',
              background: 'linear-gradient(to left, #1a1a1a, transparent)',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 0.2s ease',
            },
            '&:hover::after': {
              opacity: 1,
            },
          }}
        >
          {normalizedContentTypes.map((type) => (
            <Chip
              key={type}
              label={getContentTypeLabel(type)}
              onClick={() => handleRemoveContentType(type)}
              onDelete={() => handleRemoveContentType(type)}
              deleteIcon={<CloseIcon sx={{ fontSize: 14, color: '#f2f2f2 !important' }} />}
              sx={{
                px: .1,
                py: 0,
                background: 'rgba(255, 255, 255, 0.20)',
                borderRadius: 1.25,
                color: 'white',
                fontSize: 12,
                fontFamily: 'Inter',
                fontWeight: 500,
                cursor: 'pointer',
                flexShrink: 0,
                height: 24, // Reduced height for chips
                minHeight: 24, // Ensure minimum height
                maxHeight: 24, // Prevent expansion
                '& .MuiChip-label': {
                  padding: '0 8px',
                  lineHeight: 1,
                },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.30)',
                },
                '& .MuiChip-deleteIcon': {
                  color: 'white',
                  fontSize: 14,
                  margin: '0 4px 0 0',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.8)',
                  },
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Clear All Button (only shown when filters are active) */}
      {hasActiveFilters && (
        <Button
          onClick={handleClearAll}
          sx={{
            marginLeft: 2,
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 500,
            textTransform: 'none',
            flexShrink: 0,
            px: { xs: 0, sm: 'auto' },
            py: { xs: 0, sm: 'auto' },
            minWidth: { xs: 0, sm: 'auto' },
            '&:hover': {
              color: 'white',
              backgroundColor: 'transparent',
            },
          }}
        >
          <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Clear All
          </Box>
          <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>
            Clear
          </Box>
        </Button>
      )}
    </Box>
  );
}
