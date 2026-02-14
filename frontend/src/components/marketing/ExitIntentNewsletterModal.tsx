'use client';

import { useEffect, useMemo, useRef, useState, useCallback, useLayoutEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { CloseIcon } from '@/components/ui/phosphor-icons';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import Image from 'next/image';
import agent from '@/app/api/agent';
import { toast } from 'react-toastify';
import { safeGetItem, safeSetItem } from '@/utils/localStorageUtils';
import * as Dialog from '@radix-ui/react-dialog';
import { SelfImprovementIcon } from '@/components/ui/phosphor-icons';
import { WbSunnyIcon } from '@/components/ui/phosphor-icons';
import { RecordVoiceOverIcon } from '@/components/ui/phosphor-icons';
import { BookmarkIcon } from '@/components/ui/phosphor-icons';
import { LibraryBooksIcon } from '@/components/ui/phosphor-icons';
import { AutoAwesomeIcon } from '@/components/ui/phosphor-icons';

const DISMISS_KEY = 'exitIntentNewsletterDismissedAt';
const SUBSCRIBED_KEY = 'exitIntentNewsletterSubscribedAt';
const SESSION_KEY = 'exitIntentNewsletterShown';
const REOPEN_COOLDOWN_HOURS = 72; // 3 days before we prompt again after dismiss
const SUBSCRIBED_COOLDOWN_DAYS = 30; // Don't show again for a month after subscribing
const DEBUG_EVENT = 'scripturespot:openExitIntentModal';
type IconComponent = typeof SelfImprovementIcon;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hasValidTimestamp(key: string, maxAgeHours: number) {
  const raw = safeGetItem(key);
  if (!raw) return false;
  const timestamp = Number(raw);
  if (Number.isNaN(timestamp)) return false;
  const age = Date.now() - timestamp;
  return age < maxAgeHours * 60 * 60 * 1000;
}

export default function ExitIntentNewsletterModal() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [showMobileToast, setShowMobileToast] = useState(false);
  const hasTriggeredRef = useRef(false);
  const forcedSessionRef = useRef(false);
  const mobileToastDismissedRef = useRef(false);
  // Track the DOM timeout handle so we can clear delayed toasts on unmount
  const toastTimeoutRef = useRef<number | null>(null);

  const isValidEmail = useMemo(() => emailRegex.test(email), [email]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setUrl(window.location.href);

    const dismissedRecently = hasValidTimestamp(DISMISS_KEY, REOPEN_COOLDOWN_HOURS);
    const subscribedRecently = hasValidTimestamp(SUBSCRIBED_KEY, SUBSCRIBED_COOLDOWN_DAYS * 24);

    if (!dismissedRecently && !subscribedRecently) {
      setIsEligible(true);
    }
  }, []);

  const openModal = useCallback((options?: { force?: boolean }) => {
    const isForced = Boolean(options?.force);
    if (hasTriggeredRef.current && !isForced) return;
    if (!hasTriggeredRef.current && !isForced) {
      hasTriggeredRef.current = true;
    }
    forcedSessionRef.current = isForced;
    setIsOpen(true);
    if (!isForced && typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(SESSION_KEY, 'true');
      } catch {
        // Ignore storage failures
      }
    }
  }, []);

  useEffect(() => {
    if (!isDesktop || !isEligible || hasTriggeredRef.current) return;
    if (typeof window === 'undefined') return;

    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === 'true') {
        hasTriggeredRef.current = true;
        return;
      }
    } catch {
      // If sessionStorage fails, we still attempt one-time trigger
    }

    const handleMouseOut = (event: MouseEvent) => {
      if (!isDesktop || hasTriggeredRef.current) return;
      if (event.relatedTarget) return;
      if (event.clientY > 20) return;
      openModal();
    };

    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isDesktop, isEligible, openModal]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isDesktop || !isEligible || mobileToastDismissedRef.current) return;

    toastTimeoutRef.current = window.setTimeout(() => {
      setShowMobileToast(true);
    }, 3500);

    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = null;
      }
    };
  }, [isDesktop, isEligible]);

  useEffect(() => {
    if (isDesktop) {
      setShowMobileToast(false);
    }
  }, [isDesktop]);

  const markDismissed = useCallback(() => {
    safeSetItem(DISMISS_KEY, Date.now().toString());
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (forcedSessionRef.current) {
      forcedSessionRef.current = false;
      return;
    }
    markDismissed();
  }, [markDismissed]);

  const handleMobileToastAction = useCallback(() => {
    mobileToastDismissedRef.current = true;
    setShowMobileToast(false);
    openModal();
  }, [openModal]);

  const handleMobileToastDismiss = useCallback(() => {
    mobileToastDismissedRef.current = true;
    setShowMobileToast(false);
    markDismissed();
  }, [markDismissed]);

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValidEmail || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await agent.Forms.subscribe({ email, form: 'exit intent modal', url });
      toast.success('Your email has been added to our list!');
      safeSetItem(SUBSCRIBED_KEY, Date.now().toString());
      handleClose();
    } catch {
      toast.error('Subscription failed');
    } finally {
      setIsSubmitting(false);
      setEmail('');
    }
  };

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleDebugOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ force?: boolean }>;
      if (!customEvent.detail?.force) return;
      setIsEligible(true);
      openModal({ force: true });
    };

    window.addEventListener(DEBUG_EVENT, handleDebugOpen);
    return () => {
      window.removeEventListener(DEBUG_EVENT, handleDebugOpen);
    };
  }, [openModal]);

  if (!isEligible) {
    return null;
  }

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(6px)',
              zIndex: 4000,
            }}
          />
          <Dialog.Content asChild>
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: 'calc(100vw - 40px)', md: 560, lg: 600 },
              maxWidth: '92vw',
              borderRadius: 5,
              p: { xs: 4, md: 5 },
                background: 'linear-gradient(180deg, rgba(27, 27, 27, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.65)',
                color: '#fff',
                zIndex: 4001,
              }}
            >
              <Dialog.Close asChild>
                <IconButton
                  aria-label="Dismiss newsletter modal"
                  sx={{ position: 'absolute', top: 20, right: 20, color: 'rgba(255,255,255,0.7)' }}
                  type="button"
                >
                  <CloseIcon />
                </IconButton>
              </Dialog.Close>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 3 }}>
                <Box sx={{ width: 38, height: 38 }}>
                  <Image
                    src="/assets/images/logos/scripture-spot-icon-only.svg"
                    alt="Scripture Spot"
                    width={38}
                    height={38}
                  />
                </Box>

                <Box>
                  <Dialog.Title asChild>
                    <Typography
                      sx={{
                        fontSize: { xs: 26, md: 30 },
                        fontWeight: 700,
                        mb: 1.5,
                        lineHeight: 1.3,
                        color: '#FFFFFF',
                        textAlign: 'center',
                      }}
                    >
                      <Box component="span" sx={{ display: { xs: 'inline', md: 'block' } }}>
                        Our{' '}
                        <Box
                          component="span"
                          sx={{
                            background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(200, 204, 212, 0.9) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          Free Newsletter
                        </Box>{' '}
                        is
                      </Box>
                      <Box component="span" sx={{ display: { xs: 'inline', md: 'block' } }}>
                        {' '}Launching Soon!
                      </Box>
                    </Typography>
                  </Dialog.Title>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: 16,
                      lineHeight: 1.6,
                      textAlign: 'center',
                    }}
                  >
                    Deepen your faith and knowledge of God’s{' '}
                    <Box component="span" sx={{ display: { xs: 'inline', md: 'block' } }}>
                      word – one email at a time.
                    </Box>
                  </Typography>
                </Box>

                <Box sx={{ width: '100%' }}>
                  <NewsletterBenefitsMarquee />
                </Box>

                <Box
                  component="form"
                  onSubmit={handleSubscribe}
                  sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 4,
                      backgroundColor: '#1b1b1b',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <TextField
                      fullWidth
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email Address"
                      autoFocus
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          color: '#fff',
                          fontSize: 16,
                          px: 1,
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!isValidEmail || isSubmitting}
                      endIcon={isDesktop && !isSubmitting ? <ArrowForwardIcon fontSize="small" /> : undefined}
                      sx={{
                        flexShrink: 0,
                        px: 3,
                        py: 1.2,
                        borderRadius: 3,
                        fontWeight: 600,
                        textTransform: 'none',
                        background: !isValidEmail || isSubmitting
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(255, 215, 0, 0.30)',
                        '&:disabled': {
                          background: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.4)',
                        },
                        '@media (hover: hover)': {
                          '&:hover': {
                            background: !isValidEmail || isSubmitting
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(255, 215, 0, 0.45)',
                          },
                        },
                      }}
                    >
                      {isSubmitting
                        ? 'Sending…'
                        : isDesktop
                          ? 'Join'
                          : <ArrowForwardIcon fontSize="medium" />}
                    </Button>
                  </Box>
                  <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                    We respect your inbox. Unsubscribe anytime.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {!isDesktop && showMobileToast && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100vw - 32px)',
            maxWidth: 420,
            borderRadius: 4,
            p: 2,
            background: 'linear-gradient(135deg, rgba(30,30,30,0.98) 0%, rgba(15,15,15,0.98) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 70px rgba(0,0,0,0.55)',
            color: '#fff',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 30, height: 30 }}>
              <Image
                src="/assets/images/logos/Scripture-Spot-icon-only.svg"
                alt="Scripture Spot"
                width={30}
                height={30}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                Scripture Spot Newsletter
              </Typography>
              <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                Launching soon! Reserve your spot.
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleMobileToastDismiss}
              sx={{ color: 'rgba(255,255,255,0.6)' }}
              aria-label="Dismiss"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            onClick={handleMobileToastAction}
            sx={{
              width: '100%',
              textTransform: 'none',
              fontWeight: 600,
              background: 'rgba(255, 215, 0, 0.30)',
              '@media (hover: hover)': {
                '&:hover': {
                  background: 'rgba(255, 215, 0, 0.45)',
                },
              },
            }}
          >
            Reserve My Spot
          </Button>
        </Box>
      )}
    </>
  );
}

const BENEFIT_ITEMS: Array<{
  id: string;
  label: string;
  emphasis: string;
  icon: IconComponent;
  iconColor: string;
  iconBackground: string;
  iconSize?: number;
}> = [
  {
    id: 'devotionals',
    label: 'Timeless',
    emphasis: 'Devotionals',
    icon: SelfImprovementIcon,
    iconColor: '#278EFF',
    iconBackground: '#1F3A5A',
  },
  {
    id: 'prayers',
    label: 'Historic',
    emphasis: 'Prayers',
    icon: WbSunnyIcon,
    iconColor: '#FFD700',
    iconBackground: '#3D3719',
  },
  {
    id: 'sermons',
    label: 'Curated',
    emphasis: 'Sermons',
    icon: RecordVoiceOverIcon,
    iconColor: '#00D18F',
    iconBackground: '#1B3A30',
    iconSize: 22,
  },
  {
    id: 'verse',
    label: 'Daily',
    emphasis: 'Verse',
    icon: BookmarkIcon,
    iconColor: '#E9249A',
    iconBackground: '#3A1F30',
  },
  {
    id: 'teaching',
    label: 'Daily',
    emphasis: 'Teaching',
    icon: LibraryBooksIcon,
    iconColor: '#BD88FF',
    iconBackground: '#45355A',
    iconSize: 22,
  },
  {
    id: 'updates',
    label: 'Exclusive',
    emphasis: 'Updates',
    icon: AutoAwesomeIcon,
    iconColor: '#FF4C4F',
    iconBackground: '#532629',
    iconSize: 22,
  },
];

const VISIBLE_CARD_COUNT = 5;
const SLIDE_INTERVAL_MS = 2750;
const SLIDE_EASING = 'cubic-bezier(0.9, 0.05, 0.1, 0.95)';

function NewsletterBenefitsMarquee() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = BENEFIT_ITEMS.length;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [widthMap, setWidthMap] = useState<Record<string, number>>({});

  const measureWidths = useCallback(() => {
    if (!containerRef.current) return;
    const nodes = containerRef.current.querySelectorAll('[data-benefit-id]');
    const nextMap: Record<string, number> = {};
    nodes.forEach((node) => {
      const id = node.getAttribute('data-benefit-id');
      if (!id) return;
      nextMap[id] = (node as HTMLElement).offsetWidth;
    });
    setWidthMap(nextMap);
  }, []);

  useLayoutEffect(() => {
    measureWidths();
  }, [measureWidths]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      measureWidths();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [measureWidths]);

  useEffect(() => {
    if (total === 0 || typeof window === 'undefined') return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [total]);

  const positionedCards = useMemo(() => {
    return BENEFIT_ITEMS.map((item, index) => {
      let offset = index - activeIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const getWidth = (i: number) => widthMap[BENEFIT_ITEMS[i].id] || 150;
      let translate = 0;
      if (offset > 0) {
        for (let step = 0; step < offset; step++) {
          const currentIndex = (activeIndex + step + total) % total;
          const nextIndex = (currentIndex + 1) % total;
          translate += (getWidth(currentIndex) + getWidth(nextIndex)) / 2 + 12;
        }
      } else if (offset < 0) {
        for (let step = 0; step < Math.abs(offset); step++) {
          const currentIndex = (activeIndex - step + total) % total;
          const prevIndex = (currentIndex - 1 + total) % total;
          translate -= (getWidth(currentIndex) + getWidth(prevIndex)) / 2 + 12;
        }
      }

      return { item, offset, translate };
    });
  }, [activeIndex, total, widthMap]);

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        py: 1,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: { xs: 60, md: 90 },
          pointerEvents: 'none',
          zIndex: 2,
        },
        '&::before': {
          left: -2,
          width: { xs: 62, md: 92 },
          background: 'linear-gradient(90deg, rgba(17,17,17,1) 0%, rgba(17,17,17,0) 100%)',
        },
        '&::after': {
          right: 0,
          background: 'linear-gradient(-90deg, rgba(17,17,17,1) 0%, rgba(17,17,17,0) 100%)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: { xs: 60, md: 72 },
          width: '100%',
        }}
        ref={containerRef}
      >
        {positionedCards.map(({ item, offset, translate }) => {
          const distance = Math.abs(offset);
          const isVisible = distance <= Math.floor(VISIBLE_CARD_COUNT / 2);
          const isActive = offset === 0;
          return (
            <Box
              key={item.id}
              sx={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: `translateX(${translate}px) translateX(-50%)`,
                transition: `transform 0.95s ${SLIDE_EASING}, opacity 0.8s ease`,
                opacity: !isVisible ? 0 : isActive ? 1 : distance === 1 ? 0.68 : 0.32,
                pointerEvents: isVisible ? 'auto' : 'none',
                zIndex: isActive ? 2 : 1,
              }}
            >
              <BenefitCard
                id={item.id}
                icon={item.icon}
                label={item.label}
                emphasis={item.emphasis}
                iconColor={item.iconColor}
                iconBackground={item.iconBackground}
                iconSize={item.iconSize}
                sx={{
                  transform: `scale(${isActive ? 1 : 0.95})`,
                  transition: `transform 0.95s ${SLIDE_EASING}`,
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function BenefitCard({
  id,
  icon: Icon,
  label,
  emphasis,
  iconColor,
  iconBackground,
  iconSize,
  sx,
}: {
  id: string;
  icon: IconComponent;
  label: string;
  emphasis: string;
  iconColor: string;
  iconBackground: string;
  iconSize?: number;
  sx?: any;
}) {
  return (
    <Box
      data-benefit-id={id}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderRadius: 2.5,
        background: '#252525',
        width: 'fit-content',
        transition: 'transform 0.45s ease, opacity 0.45s ease',
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 1.5,
          background: iconBackground,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'none',
        }}
      >
        <Icon sx={{ color: iconColor, fontSize: iconSize || 24 }} />
      </Box>
      <Box sx={{ textAlign: 'left' }}>
        <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
          {emphasis}
        </Typography>
      </Box>
    </Box>
  );
}
