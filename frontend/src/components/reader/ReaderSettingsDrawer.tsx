'use client';

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  FormControlLabel,
  Paper,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Close,
  TextFields,
  Brightness4,
  Brightness6,
  Brightness7,
  FormatLineSpacing,
  Visibility,
  VisibilityOff,
  Settings,
  Palette,
  MenuBook,
  AccessibilityNew,
} from '@/components/ui/phosphor-icons';

// Design constants matching your site's aesthetic
const FONT_FAMILY = 'Inter, sans-serif';
const TEXT_COLOR_PRIMARY = '#FFFAFA';
const TEXT_COLOR_SECONDARY = 'rgba(255, 249, 249, 0.6)';
const HEADER_GRADIENT = 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(184, 134, 11, 0.05) 100%), #1A1A1A';
const CARD_BACKGROUND = '#1A1A1A';
const ICON_GRADIENT = 'linear-gradient(46deg, rgba(255, 215, 0, 0.8) 0%, rgba(184, 134, 11, 0.8) 100%)';

interface ReaderSettingsDrawerProps {
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

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  title, 
  icon, 
  children
}) => {
  return (
    <Paper
      sx={{
        background: CARD_BACKGROUND,
        borderRadius: '35px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mb: 3,
        overflow: 'hidden',
      }}
    >
      {/* Header with icon and title */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: ICON_GRADIENT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
          }}
        >
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<any>, {
                sx: { color: 'white', fontSize: 18 }
              })
            : icon}
        </Box>
        <Typography
          variant="h6"
          sx={{
            flex: 1,
            color: TEXT_COLOR_PRIMARY,
            fontWeight: 600,
            fontSize: '16px',
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Content - always visible */}
      <Box sx={{ px: 3, pb: 3, pt: 0 }}>
        <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        {children}
      </Box>
    </Paper>
  );
};

export default function ReaderSettingsDrawer({
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
}: ReaderSettingsDrawerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      fontSize: '12px',
    },
  };

  if (isMobile) {
    // Return null for mobile - will use separate mobile component
    return null;
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 480, // Increased width for two-panel layout
          maxWidth: '100%',
          background: '#000000',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
      ModalProps={{
        sx: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        color: TEXT_COLOR_PRIMARY,
        fontFamily: FONT_FAMILY,
      }}>
        {/* Enhanced Header */}
        <Box sx={{ 
          background: HEADER_GRADIENT,
          p: 3,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: ICON_GRADIENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Settings sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                color: TEXT_COLOR_PRIMARY, 
                fontWeight: 700,
                fontSize: '18px',
              }}>
                Reader Settings
              </Typography>
              <Typography variant="caption" sx={{ 
                color: TEXT_COLOR_SECONDARY,
                fontSize: '13px',
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
                }
              }}
            >
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Settings Panel */}
        <Box sx={{ 
          flex: 1, 
          p: 3, 
          overflowY: 'auto',
          minHeight: 0, // Allow flex item to shrink
        }}>
            {/* Typography Section */}
            <SettingsSection
              title="Typography"
              icon={<TextFields />}
            >
              {/* Font Size */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ 
                  mb: 2, 
                  color: TEXT_COLOR_PRIMARY,
                  fontWeight: 500,
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
                  <Typography variant="caption" sx={{ color: TEXT_COLOR_SECONDARY }}>
                    Small
                  </Typography>
                  <Typography variant="caption" sx={{ color: TEXT_COLOR_SECONDARY }}>
                    Large
                  </Typography>
                </Box>
              </Box>

              {/* Line Height */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ 
                  mb: 2, 
                  color: TEXT_COLOR_PRIMARY,
                  fontWeight: 500,
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
                  <Typography variant="caption" sx={{ color: TEXT_COLOR_SECONDARY }}>
                    Tight
                  </Typography>
                  <Typography variant="caption" sx={{ color: TEXT_COLOR_SECONDARY }}>
                    Loose
                  </Typography>
                </Box>
              </Box>

              {/* Font Family */}
              <Box>
                <Typography variant="subtitle2" sx={{ 
                  mb: 2, 
                  color: TEXT_COLOR_PRIMARY,
                  fontWeight: 500,
                }}>
                  Font Style
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
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
                        borderRadius: '16px',
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
                          fontFamily: family === 'serif' ? 'Georgia, serif' : 'Inter, sans-serif',
                          color: TEXT_COLOR_PRIMARY,
                          mb: 0.5,
                        }}
                      >
                        Aa
                      </Typography>
                      <Typography variant="caption" sx={{ color: TEXT_COLOR_SECONDARY }}>
                        {family === 'serif' ? 'Serif' : 'Sans Serif'}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </SettingsSection>

            {/* Appearance Section */}
            <SettingsSection
              title="Appearance"
              icon={<Palette />}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ 
                  mb: 2, 
                  color: TEXT_COLOR_PRIMARY,
                  fontWeight: 500,
                }}>
                  Reading Theme
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {themeOptions.map((option) => (
                    <Paper
                      key={option.value}
                      onClick={() => onThemeChange(option.value)}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        background: readerTheme === option.value 
                          ? ICON_GRADIENT 
                          : CARD_BACKGROUND,
                        border: readerTheme === option.value 
                          ? 'none'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
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
                      }}>
                        {option.label}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </SettingsSection>

            {/* Reading Section */}
            <SettingsSection
              title="Reading Experience"
              icon={<MenuBook />}
            >
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
                      fontWeight: 500,
                    }}>
                      Focus Mode
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: TEXT_COLOR_SECONDARY,
                      display: 'block',
                    }}>
                      Hide all controls for distraction-free reading
                    </Typography>
                  </Box>
                }
                sx={{
                  alignItems: 'flex-start',
                  '& .MuiFormControlLabel-label': {
                    pt: 0.5,
                  },
                }}
              />
            </SettingsSection>
          </Box>

        {/* Footer */}
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(26, 26, 26, 0.9)',
          textAlign: 'center',
        }}>
          <Typography variant="caption" sx={{ 
            color: TEXT_COLOR_SECONDARY,
            fontSize: '12px',
          }}>
            Settings are saved automatically
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}