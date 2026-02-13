'use client';

import { Drawer, Box, Typography, IconButton, Button } from '@mui/material';
import { Close as CloseIcon } from '@/components/ui/phosphor-icons';
import SupportUsButton from '../common/SupportUsButton';
import GoPremiumButton from '../common/GoPremiumButton';
import { usePremium } from '@/hooks/usePremium';
import { useRouter } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import useResponsive from '@/hooks/useResponsive';
import { useNavigationSections } from '@/hooks/useNavigationSections';


export default function MobileMenuDrawer({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const router = useRouter();
    const { user } = useUser();
    const { isMdDown } = useResponsive();
    const isPremium = usePremium();
    const menuItems = useNavigationSections();

    const handleLogin = () => {
        router.push('/login');
        onClose();
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ 
                width: 280, 
                p: 3, 
                pb: 'calc(32px + env(safe-area-inset-bottom, 0px))', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between', 
                backgroundColor: '#1a1a1a' 
            }}>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6">Menu</Typography>
                        <IconButton 
                            onClick={onClose}
                            sx={{
                                color: 'white',
                                minWidth: 40,
                                minHeight: 40,
                                borderRadius: 2,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    
                    {/* User Actions Section */}
                    {isMdDown && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                            {isPremium && user ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <SupportUsButton size="small" fullWidth />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <UserButton />
                                    </Box>
                                </Box>
                            ) : (
                                <>
                                    {!isPremium ? (
                                        <GoPremiumButton size="small" fullWidth />
                                    ) : (
                                        <SupportUsButton size="small" fullWidth />
                                    )}
                                    {user ? (
                                        <UserButton />
                                    ) : (
                                        <Button
                                            variant="text"
                                            fullWidth
                                            onClick={handleLogin}
                                            sx={{
                                                position: 'relative',
                                                height: 35,
                                                borderRadius: 4.5,
                                                px: 3.5,
                                                py: 0,
                                                textTransform: 'none',
                                                fontSize: 13,
                                                fontWeight: 700,
                                                letterSpacing: '1px',
                                                color: 'white',
                                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                                },
                                            }}
                                        >
                                            LOGIN
                                        </Button>
                                    )}
                                </>
                            )}
                        </Box>
                    )}
                    {menuItems.map((section) => (
                        <Box key={section.label} sx={{ mb: 2 }}>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    color: 'rgba(255, 255, 255, 0.8)', 
                                    fontWeight: 600,
                                    mb: 1,
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {section.label}
                            </Typography>
                            {section.items.map((item, index) => (
                                <Box
                                    key={item.route === '#' ? `${item.label}-${index}` : item.route}
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        cursor: item.comingSoon ? 'default' : 'pointer',
                                        borderRadius: 2,
                                        opacity: item.comingSoon ? 0.6 : 1,
                                        transition: 'all 0.2s ease-in-out',
                                        border: '1px solid transparent',
                                        '@media (hover: hover)': {
                                            '&:hover': item.comingSoon ? {} : { 
                                                color: '#f3d129',
                                                backgroundColor: 'rgba(243, 209, 41, 0.08)',
                                                borderColor: 'rgba(243, 209, 41, 0.2)',
                                                transform: 'translateX(4px)',
                                            },
                                        },
                                        '&:active': item.comingSoon ? {} : {
                                            transform: 'translateX(2px)',
                                        },
                                    }}
                                    data-progress-intent={item.comingSoon ? undefined : 'true'}
                                    onClick={() => {
                                        if (!item.comingSoon) {
                                            router.push(item.route);
                                            onClose();
                                        }
                                    }}
                                >
                                    <Typography sx={{ 
                                        fontSize: '15px',
                                        fontWeight: item.comingSoon ? 400 : 500,
                                        fontStyle: item.comingSoon ? 'italic' : 'normal',
                                        color: item.comingSoon ? 'rgba(255, 255, 255, 0.5)' : 'inherit'
                                    }}>
                                        {item.comingSoon ? `${item.label} (Coming Soon)` : item.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Drawer>
    );
}
