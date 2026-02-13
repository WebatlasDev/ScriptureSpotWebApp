'use client';

import React, { useState } from 'react';
import {
  Popover,
  Paper,
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  Divider,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  NoteOutlined,
  ShareOutlined,
  ContentCopyOutlined,
  CloseOutlined,
  FormatUnderlinedOutlined,
  ClearOutlined,
} from '@/components/ui/phosphor-icons';

interface TextSelection {
  text: string;
  sentenceId?: string;
  range: Range;
  x: number;
  y: number;
}

interface ActionPopoverProps {
  selection: TextSelection | null;
  onHighlight: (color: string) => void;
  onRemoveHighlight: () => void;
  onToggleUnderline: () => void;
  onNote: (note: string) => void;
  onClose: () => void;
  hasHighlight?: boolean;
  hasUnderline?: boolean;
}

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: 'yellow', color: '#FFEB3B' },
  { name: 'Green', value: 'green', color: '#4CAF50' },
  { name: 'Blue', value: 'blue', color: '#2196F3' },
  { name: 'Red', value: 'red', color: '#F44336' },
  { name: 'Purple', value: 'purple', color: '#9C27B0' },
];

export default function ActionPopover({
  selection,
  onHighlight,
  onRemoveHighlight,
  onToggleUnderline,
  onNote,
  onClose,
  hasHighlight = false,
  hasUnderline = false,
}: ActionPopoverProps) {
  const theme = useTheme();
  const [noteMode, setNoteMode] = useState(false);
  const [noteText, setNoteText] = useState('');

  if (!selection) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selection.text);
      onClose();
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Selected Text',
          text: selection.text,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      handleCopy(); // Fallback to copy
    }
    onClose();
  };

  const handleHighlightColor = (color: string) => {
    console.log('🔥 HIGHLIGHT BUTTON CLICKED:', color);
    console.log('🔥 Selection data:', selection);
    console.log('🔥 About to call onHighlight with:', color);
    onHighlight(color);
    console.log('🔥 onHighlight called, now closing popover');
    onClose();
  };

  const handleNoteSubmit = () => {
    if (noteText.trim()) {
      onNote(noteText.trim());
      setNoteText('');
      setNoteMode(false);
    }
  };


  // Calculate popover position with viewport constraints
  const calculatePosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popoverWidth = 320; // Max width of popover
    const popoverHeight = noteMode ? 200 : 150; // Estimated height
    
    let x = selection.x;
    let y = selection.y - 10;
    
    // Horizontal positioning
    if (x + popoverWidth / 2 > viewportWidth - 20) {
      x = viewportWidth - popoverWidth / 2 - 20;
    } else if (x - popoverWidth / 2 < 20) {
      x = popoverWidth / 2 + 20;
    }
    
    // Vertical positioning - prefer above, fallback to below
    if (y - popoverHeight < 20) {
      y = selection.y + 30; // Position below selection
    }
    
    return { top: y, left: x };
  };

  const anchorPosition = calculatePosition();

  return (
    <Popover
      open={true}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: theme.shadows[8],
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'visible',
          maxWidth: 320,
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: `8px solid ${theme.palette.background.paper}`,
          },
        },
      }}
    >
      <Paper sx={{ p: 0 }}>
        {!noteMode ? (
          <Box>
            {/* Highlight Colors */}
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                Highlight
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {HIGHLIGHT_COLORS.map((color) => (
                  <Box
                    key={color.value}
                      onClick={() => handleHighlightColor(color.value)}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: color.color,
                        border: `2px solid ${theme.palette.background.paper}`,
                        boxShadow: `0 0 0 1px ${theme.palette.divider}`,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.15)',
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    />
                ))}
                {hasHighlight && (
                  <Tooltip 
                    title="Remove Highlight"
                    slotProps={{
                      tooltip: {
                        sx: {
                          bgcolor: '#0E0E0E',
                          color: '#FFFAFA',
                          fontSize: '12px',
                          fontWeight: 500,
                          border: '1px solid rgba(255, 215, 0, 0.2)',
                          '& .MuiTooltip-arrow': {
                            color: '#0E0E0E',
                            '&::before': {
                              border: '1px solid rgba(255, 215, 0, 0.2)',
                            }
                          }
                        }
                      }
                    }}
                  >
                    <Box
                      onClick={onRemoveHighlight}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'transparent',
                        border: `2px solid ${theme.palette.divider}`,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          transform: 'scale(1.15)',
                          boxShadow: theme.shadows[2],
                          bgcolor: 'rgba(244, 67, 54, 0.1)',
                          borderColor: theme.palette.error.main,
                        },
                      }}
                    >
                      <ClearOutlined sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                    </Box>
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Divider />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', p: 1 }}>
              <Tooltip 
                title={hasUnderline ? "Remove Underline" : "Add Underline"}
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#0E0E0E',
                      color: '#FFFAFA',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      '& .MuiTooltip-arrow': {
                        color: '#0E0E0E',
                        '&::before': {
                          border: '1px solid rgba(255, 215, 0, 0.2)',
                        }
                      }
                    }
                  }
                }}
              >
                <IconButton
                  onClick={onToggleUnderline}
                  sx={{ 
                    flex: 1,
                    borderRadius: 1,
                    color: hasUnderline ? theme.palette.primary.main : theme.palette.text.primary,
                    '&:hover': { bgcolor: 'rgba(40, 142, 255, 0.1)' },
                  }}
                >
                  <FormatUnderlinedOutlined />
                </IconButton>
              </Tooltip>

              <Tooltip 
                title="Add Note"
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#0E0E0E',
                      color: '#FFFAFA',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      '& .MuiTooltip-arrow': {
                        color: '#0E0E0E',
                        '&::before': {
                          border: '1px solid rgba(255, 215, 0, 0.2)',
                        }
                      }
                    }
                  }
                }}
              >
                <IconButton
                  onClick={() => setNoteMode(true)}
                  sx={{ 
                    flex: 1,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'rgba(40, 142, 255, 0.1)' },
                  }}
                >
                  <NoteOutlined />
                </IconButton>
              </Tooltip>

              <Tooltip 
                title="Copy"
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#0E0E0E',
                      color: '#FFFAFA',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      '& .MuiTooltip-arrow': {
                        color: '#0E0E0E',
                        '&::before': {
                          border: '1px solid rgba(255, 215, 0, 0.2)',
                        }
                      }
                    }
                  }
                }}
              >
                <IconButton
                  onClick={handleCopy}
                  sx={{ 
                    flex: 1,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.1)' },
                  }}
                >
                  <ContentCopyOutlined />
                </IconButton>
              </Tooltip>

              <Tooltip 
                title="Share"
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#0E0E0E',
                      color: '#FFFAFA',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      '& .MuiTooltip-arrow': {
                        color: '#0E0E0E',
                        '&::before': {
                          border: '1px solid rgba(255, 215, 0, 0.2)',
                        }
                      }
                    }
                  }
                }}
              >
                <IconButton
                  onClick={handleShare}
                  sx={{ 
                    flex: 1,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'rgba(156, 39, 176, 0.1)' },
                  }}
                >
                  <ShareOutlined />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ) : (
          /* Note Mode */
          <Box sx={{ p: 2, minWidth: 280 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                Add Note
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => {
                  setNoteMode(false);
                  setNoteText('');
                }}
              >
                <CloseOutlined />
              </IconButton>
            </Box>

            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="Add your note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setNoteMode(false);
                  setNoteText('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleNoteSubmit}
                disabled={!noteText.trim()}
              >
                Save Note
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Popover>
  );
}