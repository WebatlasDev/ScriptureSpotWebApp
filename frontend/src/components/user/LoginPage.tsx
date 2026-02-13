"use client";

import { Box, Button } from "@mui/material";
import { SignIn } from "@clerk/nextjs";
import LogoImage from "../common/LogoImage";
import Link from "next/link";
import { clerkAppearance } from "@/styles/clerkAppearance";
import { ArrowBackIosNewIcon } from '@/components/ui/phosphor-icons';

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#111111',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 }
      }}
    >

      {/* Logo Above Card */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Link href="/">
          <LogoImage height={35} />
        </Link>
      </Box>

      {/* Main Content Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '420px',
          mx: 'auto'
        }}
      >
        {/* Login Card */}
        <Box
          sx={{
            width: '100%',
            bgcolor: '#1A1A1A',
            borderRadius: '28px',
            border: '2px solid rgba(255, 255, 255, 0.10)',
            px: { xs: 4, md: 5 },
            pt: { xs: 2, md: 2.5 },
            pb: { xs: 2.5, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& .cl-card, & .cl-signin-start, & *': {
              boxShadow: 'none !important',
              WebkitBoxShadow: 'none !important',
              MozBoxShadow: 'none !important',
            },
            '& .cl-internal-8d3o8p, & .cl-internal-1iqunqb, & .cl-formFieldInput__password, & .cl-internal-cneuvu, & input': {
              border: '2px solid rgba(255, 255, 255, 0.4) !important',
              paddingTop: '24px !important',
              paddingBottom: '24px !important',
              paddingLeft: '20px !important',
              paddingRight: '20px !important',
              outline: 'none !important',
            },
            '& .cl-footerAction, & .cl-footer': {
              padding: '0 !important',
              margin: '0 !important',
            },
            '& .cl-formFieldErrorText, & .cl-formFieldError, & .cl-internal-1tc10s3, & .cl-internal-16zadrt, & .cl-formFieldInfoText, & .cl-formFieldSuccessText, & .cl-internal-1b98cs7': {
              fontSize: '13px !important',
            },
            '& .cl-footerActionText, & .cl-footerActionLink, & .cl-internal-1f60a30, & .cl-internal-pccw1v': {
              fontSize: '14px !important',
            },
          }}
        >
          {/* Login Form */}
          <SignIn 
            path="/login" 
            routing="path" 
            appearance={clerkAppearance}
          />
        </Box>

        {/* Subtle Back to Homepage Link */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBackIosNewIcon sx={{ fontSize: '14px !important' }} />}
            sx={{
              color: 'rgba(255, 255, 255, 0.50)',
              fontSize: '14px',
              fontWeight: 400,
              textTransform: 'none',
              px: 0,
              py: 0,
              minWidth: 'auto',
              backgroundColor: 'transparent',
              border: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'rgba(255, 255, 255, 0.60)',
              },
              transition: 'color 0.2s ease-in-out',
            }}
          >
            Back to Homepage
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
