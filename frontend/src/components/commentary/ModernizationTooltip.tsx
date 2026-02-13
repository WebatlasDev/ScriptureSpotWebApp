import React from 'react';
import { Box, Typography } from '@mui/material';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';

const ModernizationTooltip = () => {
  return (
    <Box sx={{ p: 2, maxWidth: 400 }}>
      <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2.5 }}>Modernized for Readability</Typography>

      {/* Example cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2.5 }}>
        {/* Language modernization example */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.06)',
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            fontSize: 12.5,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontStyle: 'italic'
          }}>
            "hath said"
          </Box>
          <ArrowForwardIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }} />
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.1)',
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            fontSize: 12.5,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            "has said"
          </Box>
        </Box>

        {/* Archaic terms example */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.06)',
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            fontSize: 12.5,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontStyle: 'italic'
          }}>
            "whereby"
          </Box>
          <ArrowForwardIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }} />
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.1)',
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            fontSize: 12.5,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            "by which"
          </Box>
        </Box>

        {/* Paragraph structure example */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.06)',
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            fontSize: 12.5,
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontStyle: 'italic'
          }}>
            Dense paragraphs
          </Box>
          <ArrowForwardIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }} />
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.1)',
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            fontSize: 12.5,
            color: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            Clear breaks
          </Box>
        </Box>
      </Box>

      <Typography sx={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)' }}>
        Carefully preserving original meaning and theological depth while improving accessibility for modern readers.
      </Typography>
    </Box>
  );
};

export default ModernizationTooltip;