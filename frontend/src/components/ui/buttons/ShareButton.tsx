'use client';

import React, { useState } from 'react';
import { 
  IconButton, 
  IconButtonProps, 
  Tooltip, 
  Modal, 
  Box, 
  Typography, 
  Button, 
  Fade 
} from '@mui/material';
import { ShareIcon } from '@/components/ui/phosphor-icons';
import { ContentCopyIcon } from '@/components/ui/phosphor-icons';
import { CheckIcon } from '@/components/ui/phosphor-icons';
import { CloseIcon } from '@/components/ui/phosphor-icons';
import { FacebookIcon } from '@/components/ui/phosphor-icons';
import { TwitterIcon } from '@/components/ui/phosphor-icons';
import { EmailIcon } from '@/components/ui/phosphor-icons';
import { WhatsAppIcon } from '@/components/ui/phosphor-icons';

export interface ShareButtonProps extends Omit<IconButtonProps, 'color'> {
  /**
   * Icon color (CSS color string)
   */
  iconColor?: string;
  /**
   * Size of the icon
   */
  iconSize?: string | number;
  /**
   * Tooltip text (no tooltip if not provided)
   */
  tooltipText?: string;
  /**
   * URL to share (defaults to current URL)
   */
  shareUrl?: string;
  /**
   * Title to share
   */
  shareTitle?: string;
  /**
   * Additional content to share
   */
  shareText?: string;
  /**
   * Custom sharing platforms to display (defaults to all)
   */
  platforms?: ('facebook' | 'twitter' | 'email' | 'whatsapp' | 'copy')[];
  /**
   * Background color for modal
   */
  modalBgColor?: string;
  /**
   * Text color for modal
   */
  modalTextColor?: string;
  /**
   * Whether to use the built-in share modal (true) or handle share action externally (false)
   */
  useModal?: boolean;
  /**
   * Custom modal title
   */
  modalTitle?: string;
}

/**
 * A reusable share button component with optional built-in share modal
 */
export const ShareButton: React.FC<ShareButtonProps> = ({
  iconColor = 'white',
  iconSize = 'default',
  tooltipText = 'Share',
  shareUrl,
  shareTitle = 'Check this out!',
  shareText = '',
  platforms = ['facebook', 'twitter', 'email', 'whatsapp', 'copy'],
  modalBgColor = '#1A1A1A',
  modalTextColor = '#FFFFFF',
  useModal = true,
  modalTitle = 'Share',
  sx,
  ...rest
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Use provided URL or current URL
  const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
  
  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (useModal) {
      setModalOpen(true);
    }
    
    // Call original onClick if provided
    if (rest.onClick) {
      rest.onClick(e);
    }
  };
  
  const handleClose = () => {
    setModalOpen(false);
  };
  
  const handleCopyLink = async () => {
    if (typeof navigator !== 'undefined') {
      try {
        await navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch {
      }
    }
  };
  
  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + '\n\n' + url)}`;
        break;
      default:
        return;
    }
    
    if (typeof window !== 'undefined' && shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };
  
  const renderButton = () => (
    <IconButton
      size="small"
      onClick={handleOpen}
      sx={{ 
        color: iconColor,
        p: 1,
        ...sx
      }}
      {...rest}
    >
      <ShareIcon sx={{ fontSize: iconSize }} />
    </IconButton>
  );
  
  // Render share platforms
  const renderPlatforms = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        {platforms.includes('facebook') && (
          <IconButton 
            onClick={() => handleShare('facebook')} 
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#4267B2', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <FacebookIcon />
          </IconButton>
        )}
        {platforms.includes('twitter') && (
          <IconButton 
            onClick={() => handleShare('twitter')} 
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#1DA1F2', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <TwitterIcon />
          </IconButton>
        )}
        {platforms.includes('email') && (
          <IconButton 
            onClick={() => handleShare('email')} 
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: modalTextColor, '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <EmailIcon />
          </IconButton>
        )}
        {platforms.includes('whatsapp') && (
          <IconButton 
            onClick={() => handleShare('whatsapp')} 
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#25D366', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <WhatsAppIcon />
          </IconButton>
        )}
      </Box>
    );
  };
  
  // Wrap with tooltip if tooltip text provided
  const buttonWithTooltip = tooltipText ? (
    <Tooltip title={tooltipText} arrow>
      {renderButton()}
    </Tooltip>
  ) : renderButton();
  
  return (
    <>
      {buttonWithTooltip}
      
      {useModal && (
        <Modal
          open={modalOpen}
          onClose={handleClose}
          closeAfterTransition
          sx={{ backdropFilter: 'blur(8px)' }}
          BackdropProps={{ timeout: 300, style: { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }}
        >
          <Fade in={modalOpen} timeout={300}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '85%', sm: '450px' },
              bgcolor: modalBgColor,
              boxShadow: 24,
              p: 4,
              borderRadius: 3,
              color: modalTextColor,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {modalTitle}
                </Typography>
                <IconButton onClick={handleClose} sx={{ color: modalTextColor }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              
              {/* Copy link section */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  mt: 2,
                  p: 1.5, 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  borderRadius: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ overflow: 'hidden', maxWidth: '75%' }}>
                  <Typography 
                    noWrap 
                    sx={{ 
                      fontSize: 14,
                      opacity: 0.8
                    }}
                  >
                    {url}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  onClick={handleCopyLink}
                  startIcon={copySuccess ? <CheckIcon /> : <ContentCopyIcon />}
                  sx={{
                    bgcolor: copySuccess ? 'success.main' : 'primary.main',
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: copySuccess ? 'success.dark' : 'primary.dark',
                    }
                  }}
                >
                  {copySuccess ? 'Copied!' : 'Copy'}
                </Button>
              </Box>
              
              {renderPlatforms()}
            </Box>
          </Fade>
        </Modal>
      )}
    </>
  );
};

export default ShareButton;
