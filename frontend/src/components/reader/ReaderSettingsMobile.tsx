'use client';

import React from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Slider,
  Switch,
  FormControlLabel,
  Paper,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Close,
  TextFields,
  Brightness4,
  Brightness6,
  Brightness7,
  Palette,
  MenuBook,
  Settings,
} from '@/components/ui/phosphor-icons';

// Design constants matching your site's aesthetic
const FONT_FAMILY = 'Inter, sans-serif';
const TEXT_COLOR_PRIMARY = '#FFFAFA';
const TEXT_COLOR_SECONDARY = 'rgba(255, 249, 249, 0.6)';
const HEADER_GRADIENT = 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(184, 134, 11, 0.05) 100%), #1A1A1A';
const CARD_BACKGROUND = '#1A1A1A';
const ICON_GRADIENT = 'linear-gradient(46deg, rgba(255, 215, 0, 0.8) 0%, rgba(184, 134, 11, 0.8) 100%)';
const MODAL_MOBILE_PADDING = '20px';

interface ReaderSettingsMobileProps {
  open: boolean;
  onClose: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  lineHeight: number;
  onLineHeightChange: (height: number) => void;
  fontFamily: 'serif' | 'sans';
  onFontFamilyChange: (family: 'serif' | 'sans') => void;
  theme: 'light' | 'sepia' | 'dark';
  onThemeChange: (theme: 'light' | 'sepia' | 'dark') => void;
  focusMode: boolean;
  onFocusModeChange: (enabled: boolean) => void;
  processedHtml?: string; // For live preview
}

export default function ReaderSettingsMobile({
  open,
  onClose,
  fontSize,
  onFontSizeChange,
  lineHeight,
  onLineHeightChange,
  fontFamily,
  onFontFamilyChange,
  theme: readerTheme,
  onThemeChange,
  focusMode,
  onFocusModeChange,
  processedHtml = '',
}: ReaderSettingsMobileProps) {

  const handleFontSizeChange = (_event: Event, newValue: number | number[]) => {
    onFontSizeChange(newValue as number);
  };

  const handleLineHeightChange = (_event: Event, newValue: number | number[]) => {
    onLineHeightChange(newValue as number);
  };

  const themeOptions = [
    { 
      value: 'light', 
      icon: <Brightness7 />, 
      label: 'Light', 
      background: '#FFFFFF',
      color: '#000000'
    },
    { 
      value: 'sepia', 
      icon: <Brightness6 />, 
      label: 'Sepia', 
      background: '#F4F1E8',
      color: '#5C4B3A'
    },
    { 
      value: 'dark', 
      icon: <Brightness4 />, 
      label: 'Dark', 
      background: '#111111',
      color: '#FFFAFA'
    },
  ] as const;

  // Get font family for preview
  const getFontFamily = () => {
    return fontFamily === 'serif' 
      ? '"Literata", Georgia, "Times New Roman", serif'
      : 'var(--font-plus-jakarta), "Inter", "Helvetica", "Arial", sans-serif';
  };

  // Get theme colors for preview
  const getThemeColors = () => {
    switch (readerTheme) {
      case 'light':
        return {
          text: '#000000',
          background: '#FFFFFF',
        };
      case 'sepia':
        return {
          text: '#5C4B3A',
          background: '#F4F1E8',
        };
      case 'dark':
      default:
        return {
          text: '#FFFAFA',
          background: '#111111',
        };
    }
  };

  const previewColors = getThemeColors();

  // Custom slider styling
  const sliderSx = {
    '& .MuiSlider-track': {
      background: ICON_GRADIENT,
    },
    '& .MuiSlider-thumb': {
      background: ICON_GRADIENT,
      '&:hover': {
        boxShadow: '0px 4px 8px rgba(255, 215, 0, 0.3)',
      },
    },
    '& .MuiSlider-mark': {
      backgroundColor: TEXT_COLOR_SECONDARY,
    },
    '& .MuiSlider-markLabel': {
      color: TEXT_COLOR_SECONDARY,
      fontWeight: 500,
      fontSize: '11px',
    },
  };

  const mobileModalVariants = {
    hidden: { 
      opacity: 0, 
      y: '95vh'
    },
    visible: { 
      opacity: 1, 
      y: 0
    },
  };

  return (
    <>
      <style>{`
        .reader-settings-modal-mobile {
          top: 5vh !important;
          height: 95vh !important;
        }
        @supports (height: 100dvh) {
          .reader-settings-modal-mobile {
            top: 5dvh !important;
            height: 95dvh !important;
          }
        }
      `}</style>
      
      <Modal 
        open={open} 
        onClose={onClose} 
        closeAfterTransition
        disableAutoFocus
        disableEnforceFocus 
        sx={{ 
          backgroundColor: 'transparent',
          '&:focus-visible': { outline: 'none' },
          '&:focus': { outline: 'none' },
          '& .MuiModal-backdrop': { '&:focus-visible': { outline: 'none' }, '&:focus': { outline: 'none' } }
        }} 
        slotProps={{
          backdrop: {
            timeout: 300,
            style: { backgroundColor: 'rgba(25, 25, 25, 0.1)' }
          }
        }}
      >
        <motion.div
          className="reader-settings-modal-mobile"
          initial="hidden"
          animate={open ? "visible" : "hidden"}
          variants={mobileModalVariants}
          transition={{ 
            duration: 0.3, 
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '25px 25px 0 0',
            overflow: 'hidden',
            backgroundColor: 'black',
            color: TEXT_COLOR_PRIMARY,
            fontFamily: FONT_FAMILY,
            outline: 'none',
          }}
        >
          {/* Header */}
          <Box sx={{ 
            background: HEADER_GRADIENT,
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: ICON_GRADIENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Settings sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                color: TEXT_COLOR_PRIMARY, 
                fontWeight: 700,
                fontSize: '16px',
              }}>
                Reader Settings
              </Typography>
              <Typography variant="caption" sx={{ 
                color: TEXT_COLOR_SECONDARY,
                fontSize: '12px',
              }}>
                Customize your reading experience
              </Typography>
            </Box>
            <IconButton 
              onClick={onClose}
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                width: 36,
                height: 36,
                '&:hover': { 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Preview Section */}
          <Box sx={{
            p: 2,
            mx: 2,
            mt: 2,
            mb: 2,
            borderRadius: '12px',
            background: previewColors.background,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <Typography sx={{
              fontSize: `${fontSize * 0.8}px`,
              lineHeight: lineHeight,
              fontFamily: getFontFamily(),
              color: previewColors.text,
              textAlign: 'justify',
            }}>
              In the beginning was the Word, and the Word was with God, and the Word was God.
            </Typography>
          </Box>

          {/* Content - All sections visible */}
          <Box sx={{ 
            flex: 1,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            bgcolor: 'black',
            p: MODAL_MOBILE_PADDING,
            pb: 'calc(20px + env(safe-area-inset-bottom, 0px))'
          }}>

            {/* Typography Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: ICON_GRADIENT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <TextFields sx={{ color: 'white', fontSize: 16 }} />
                </Box>
                <Typography variant="h6" sx={{ 
                  color: TEXT_COLOR_PRIMARY,
                  fontWeight: 600,
                  fontSize: '16px',
                }}>
                  Typography
                </Typography>
              </Box>

              {/* Font Size */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ 
                  mb: 2, 
                  color: TEXT_COLOR_PRIMARY,
                  fontWeight: 600,
                  fontSize: '14px',
                }}>
                  Font Size
                </Typography>
                <Slider
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  min={12}
                  max={32}
                  step={1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}px`}
                  sx={sliderSx}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: TEXT_COLOR_SECONDARY, fontSize: '10px' }}>
                    Small
                  </Typography>
                  <Typography variant="caption" sx={{ color: TEXT_COLOR_SECONDARY, fontSize: '10px' }}>
                    Large
                  </Typography>
                </Box>
              </Box>

              {/* Line Height */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ 
                  mb: 2, 
                  color: TEXT_COLOR_PRIMARY,
                  fontWeight: 600,
                  fontSize: '14px',
                }}>
                  Line Spacing
                </Typography>
                <Slider
                  value={lineHeight}
                  onChange={handleLineHeightChange}
                  min={1.2}
                  max={2.4}
                  step={0.1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value.toFixed(1)}`}
                  sx={sliderSx}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: TEXT_COLOR_SECONDARY, fontSize: '10px' }}>
                    Tight
                  </Typography>
                  <Typography variant="caption" sx={{ color: TEXT_COLOR_SECONDARY, fontSize: '10px' }}>
                    Loose
                  </Typography>
                </Box>
              </Box>

              {/* Font Family */}
              <Box>
                <Typography variant="subtitle2" sx={{ 
                  mb: 2, 
                  color: TEXT_COLOR_PRIMARY,
                  fontWeight: 600,
                  fontSize: '14px',
                }}>
                  Font Style
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {['sans', 'serif'].map((family) => (
                    <Paper
                      key={family}
                      onClick={() => onFontFamilyChange(family as 'serif' | 'sans')}
                      sx={{
                        flex: 1,
                        p: 2,
                        cursor: 'pointer',
                        background: fontFamily === family 
                          ? ICON_GRADIENT 
                          : CARD_BACKGROUND,
                        border: fontFamily === family 
                          ? 'none'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
                        },
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: family === 'serif' ? 'Literata, Georgia, serif' : 'var(--font-plus-jakarta), sans-serif',
                          color: TEXT_COLOR_PRIMARY,
                          mb: 0.5,
                          fontSize: '18px',
                        }}
                      >
                        Aa
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: TEXT_COLOR_SECONDARY,
                        fontSize: '10px',
                      }}>
                        {family === 'serif' ? 'Serif' : 'Sans Serif'}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

            {/* Appearance Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: ICON_GRADIENT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <Palette sx={{ color: 'white', fontSize: 16 }} />
                </Box>
                <Typography variant="h6" sx={{ 
                  color: TEXT_COLOR_PRIMARY,
                  fontWeight: 600,
                  fontSize: '16px',
                }}>
                  Appearance
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ 
                mb: 2, 
                color: TEXT_COLOR_PRIMARY,
                fontWeight: 600,
                fontSize: '14px',
              }}>
                Reading Theme
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {themeOptions.map((option) => (
                  <Paper
                    key={option.value}
                    onClick={() => onThemeChange(option.value)}
                    sx={{
                      flex: 1,
                      p: 2,
                      cursor: 'pointer',
                      background: readerTheme === option.value 
                        ? ICON_GRADIENT 
                        : CARD_BACKGROUND,
                      border: readerTheme === option.value 
                        ? 'none'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: option.background,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.cloneElement(option.icon, {
                        sx: { color: option.color, fontSize: 18 }
                      })}
                    </Box>
                    <Typography sx={{ 
                      color: TEXT_COLOR_PRIMARY,
                      fontWeight: 500,
                      fontSize: '11px',
                    }}>
                      {option.label}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

            {/* Reading Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: ICON_GRADIENT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <MenuBook sx={{ color: 'white', fontSize: 16 }} />
                </Box>
                <Typography variant="h6" sx={{ 
                  color: TEXT_COLOR_PRIMARY,
                  fontWeight: 600,
                  fontSize: '16px',
                }}>
                  Reading
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={focusMode}
                    onChange={(e) => onFocusModeChange(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-track': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '& .MuiSwitch-thumb': {
                        background: focusMode ? ICON_GRADIENT : '#888',
                      },
                      '& .Mui-checked + .MuiSwitch-track': {
                        background: 'rgba(255, 215, 0, 0.3) !important',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" sx={{ 
                      color: TEXT_COLOR_PRIMARY,
                      fontWeight: 600,
                      fontSize: '14px',
                    }}>
                      Focus Mode
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: TEXT_COLOR_SECONDARY,
                      display: 'block',
                      fontSize: '11px',
                    }}>
                      Hide all controls for distraction-free reading
                    </Typography>
                  </Box>
                }
                sx={{
                  width: '100%',
                  justifyContent: 'space-between',
                  ml: 0,
                  '& .MuiFormControlLabel-label': {
                    flex: 1,
                  },
                }}
              />
            </Box>
          </Box>
        </motion.div>
      </Modal>
    </>
  );
}