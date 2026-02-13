'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { ArrowForward } from '@/components/ui/phosphor-icons';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface BookmarkPromoModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function BookmarkPromoModal({ 
  open, 
  onClose, 
  onUpgrade 
}: BookmarkPromoModalProps) {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setMounted(true);
  }, []);
  const mobileModalVariants = {
    hidden: { 
      opacity: 0, 
      y: '100vh'
    },
    visible: { 
      opacity: 1, 
      y: 0
    },
  };

  const desktopModalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      scale: 1
    },
  };

  if (!mounted) {
    return null;
  }

  const MobileContent = (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={mobileModalVariants}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{
        position: 'fixed',
        top: '5vh',
        left: '2.5vw',
        right: '2.5vw',
        width: '95vw',
        maxHeight: '90vh',
        backgroundColor: 'transparent',
        color: '#FFFFFF',
        borderRadius: 3.5,
        overflow: 'hidden',
      }}
    >
      <Box sx={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        borderRadius: 3.5,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
      }}>
        {/* Image Section */}
        <Box sx={{ position: 'relative', width: '100%', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', overflow: 'hidden' }}>
          <Image
            src="/assets/images/marketing/premium-subscription-tier/Premium-bookmark-promo-mobile.webp"
            alt="Premium bookmark promotion"
            width={1080}
            height={1350}
            layout="responsive"
          />
        </Box>

        {/* Close Button */}
        <Button
          onClick={event => {
            event.stopPropagation();
            onClose();
          }}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            minWidth: 40,
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#FFFFFF',
            zIndex: 10,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }
          }}
          >
            ✕
        </Button>

        {/* Content Section */}
        <Box sx={{
          p: 4,
        }}>
          {/* Premium Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Image
              src="/assets/images/marketing/premium-subscription-tier/Premium-icon.webp"
              alt="Premium icon"
              width={22}
              height={22}
              style={{ filter: 'drop-shadow(0 0 12px #D4AF37)' }}
            />
            <Typography sx={{ 
              background: 'linear-gradient(135deg, #FFFFFF 0%,rgb(226, 198, 105) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: 14, 
              fontWeight: 700, 
              letterSpacing: .75, 
              textTransform: 'uppercase' 
            }}>
              PREMIUM
            </Typography>
          </Box>

          {/* Title */}
          <Typography sx={{
            color: '#FFFFFF',
            fontSize: 24,
            fontWeight: 300,
            lineHeight: 1.2,
            mb: 2
          }}>
            Upgrade Your <Box component="span" sx={{ color: '#FFFFFF', fontWeight: 700 }}>Scripture Spot</Box> Experience
          </Typography>

          {/* Features */}
          <Box sx={{ mb: 3 }}>
            {[
              'Read Ad-Free',
              'Bookmark Anything',
              'Get Exclusive Updates',
              'Support Biblical Literacy'
            ].map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75 }}>
                <Typography sx={{ color: '#D4AF37', fontSize: 16 }}>•</Typography>
                <Typography sx={{ color: '#FFFFFF', fontSize: 16 }}>
                  {feature.split(' ').map((word, i) =>
                    i === 1 && (feature.includes('Ad-Free') || feature.includes('Anything') || feature.includes('Exclusive')) ? (
                      <Box key={i} component="span" sx={{ fontWeight: 700 }}>{word} </Box>
                    ) : word + ' '
                  )}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* CTA Button */}
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Box
              sx={{
                position: 'absolute',
                top: -3,
                left: -3,
                right: -3,
                bottom: -3,
                backgroundImage: 'url(/assets/images/marketing/premium-subscription-tier/Premium-bg-sm.jpg)',
                backgroundSize: 'cover',
                borderRadius: 28,
                zIndex: 0
              }}
            />
            <Button
              onClick={() => {
                onUpgrade();
                window.open('/pricing', '_blank');
              }}
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontSize: 16,
                fontWeight: 700,
                py: 1,
                borderRadius: 25,
                textTransform: 'none',
                width: '100%',
                position: 'relative',
                zIndex: 1,
                '&:hover': {
                  backgroundColor: '#F5F5F5'
                }
              }}
            >
              Unlock Premium
            </Button>
          </Box>

          {/* Pricing */}
          <Typography sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 12,
            textAlign: 'center'
          }}>
            $4.99/mo subscription. Cancel anytime.
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );

  const DesktopContent = (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={desktopModalVariants}
      transition={{ 
        duration: 0.3, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <Box
        onClick={e => e.stopPropagation()}
        sx={{
          position: 'relative',
          borderRadius: 3.5,
          overflow: 'hidden',
          outline: 'none',
          display: 'flex',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        }}
      >
        {/* Image Section - Left Side */}
        <Box sx={{ 
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <Image
            src="/assets/images/marketing/premium-subscription-tier/Premium-bookmark-promo-desktop.webp"
            alt="Premium bookmark promotion"
            width={400}
            height={600}
            style={{
              display: 'block',
              height: 'auto',
              maxWidth: 'none'
            }}
          />
        </Box>

        {/* Close Button */}
        <Button
          onClick={event => {
            event.stopPropagation();
            onClose();
          }}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            minWidth: 45,
            width: 45,
            height: 45,
            color: '#FFFFFF',
            zIndex: 10,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }
          }}
          >
            ✕
        </Button>

        {/* Content Section - Right Side */}
        <Box sx={{
          width: 400,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: '#FFFFFF'
        }}>
          {/* Premium Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
            <Image
              src="/assets/images/marketing/premium-subscription-tier/Premium-icon.webp"
              alt="Premium icon"
              width={22}
              height={22}
              style={{ filter: 'drop-shadow(0 0 12px #D4AF37)' }}
            />
            <Typography sx={{ 
              background: 'linear-gradient(135deg, #FFFFFF 0%,rgb(226, 198, 105) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: 14, 
              fontWeight: 700, 
              letterSpacing: .75, 
              textTransform: 'uppercase' 
            }}>
              PREMIUM
            </Typography>
          </Box>

          {/* Title */}
          <Typography sx={{
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: 300,
            lineHeight: 1.2,
            mb: 2.5
          }}>
            Upgrade Your <Box component="span" sx={{ color: '#FFFFFF', fontWeight: 700 }}>Scripture Spot</Box> Experience
          </Typography>

          {/* Features */}
          <Box sx={{ mb: 3 }}>
            {[
              'Read Ad-Free',
              'Bookmark Anything',
              'Get Exclusive Updates',
              'Support Biblical Literacy'
            ].map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75 }}>
                <Typography sx={{ color: '#D4AF37', fontSize: 16 }}>•</Typography>
                <Typography sx={{ color: '#FFFFFF', fontSize: 16 }}>
                  {feature.split(' ').map((word, i) =>
                    i === 1 && (feature.includes('Ad-Free') || feature.includes('Anything') || feature.includes('Exclusive')) ? (
                      <Box key={i} component="span" sx={{ fontWeight: 700 }}>{word} </Box>
                    ) : word + ' '
                  )}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* CTA Button */}
          <Box sx={{ position: 'relative', mb: 2 }}>
      <Box
        onClick={e => e.stopPropagation()}
        sx={{
                position: 'absolute',
                top: -3,
                left: -3,
                right: -3,
                bottom: -3,
                backgroundImage: 'url(/assets/images/marketing/premium-subscription-tier/Premium-bg-sm.jpg)',
                backgroundSize: 'cover',
                borderRadius: 28,
                zIndex: 0
              }}
            />
            <Button
              onClick={() => {
                onUpgrade();
                window.open('/pricing', '_blank');
              }}
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontSize: 18,
                fontWeight: 700,
                py: 1,
                borderRadius: 25,
                textTransform: 'none',
                width: '100%',
                position: 'relative',
                zIndex: 1,
                '&:hover': {
                  backgroundColor: '#F5F5F5'
                }
              }}
            >
              Unlock Premium
            </Button>
          </Box>

          {/* Pricing */}
          <Typography sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 12,
            textAlign: 'center'
          }}>
            $4.99/mo subscription. Cancel anytime.
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );

  return (
    <Dialog.Root open={open} onOpenChange={state => { if (!state) onClose(); }}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(25, 25, 25, 0.9)',
                  zIndex: 2000,
                }}
                onMouseDown={event => event.stopPropagation()}
                onTouchStart={event => event.stopPropagation()}
                onClick={event => {
                  event.stopPropagation();
                  onClose();
                }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  display: 'flex',
                  alignItems: isMobile ? 'flex-end' : 'center',
                  justifyContent: 'center',
                  zIndex: 2001,
                  outline: 'none',
                }}
              >
                <Dialog.Title asChild>
                  <VisuallyHidden>Premium Bookmark Upgrade</VisuallyHidden>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <VisuallyHidden>
                    Learn about the benefits of Scripture Spot Premium and unlock advanced bookmarking.
                  </VisuallyHidden>
                </Dialog.Description>
                {isMobile ? MobileContent : DesktopContent}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
