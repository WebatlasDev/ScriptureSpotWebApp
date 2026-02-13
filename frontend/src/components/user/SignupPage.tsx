"use client";

import { Box, Button } from "@mui/material";
import { SignUp } from "@clerk/nextjs";
import LogoImage from "../common/LogoImage";
import Link from "next/link";
import { clerkAppearance } from "@/styles/clerkAppearance";
import { ArrowBackIosNewIcon } from '@/components/ui/phosphor-icons';

export default function SignupPage() {
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
        {/* Signup Card */}
        <Box
          sx={{
            width: '100%',
            bgcolor: '#1A1A1A',
            borderRadius: '28px',
            border: '2px solid rgba(255, 255, 255, 0.10)',
            px: { xs: 4, md: 5 },
            pt: { xs: 2, md: 2.5 },
            pb: { xs: 2.5, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& .cl-card, & .cl-signin-start, & .cl-signup-start, & *': {
              boxShadow: 'none !important',
              WebkitBoxShadow: 'none !important',
              MozBoxShadow: 'none !important',
            },
            '& .cl-internal-8d3o8p, & .cl-internal-1iqunqb, & .cl-formFieldInput__password': {
              border: '2px solid rgba(255, 255, 255, 0.4) !important',
              paddingTop: '24px !important',
              paddingBottom: '24px !important',
              paddingLeft: '20px !important',
              paddingRight: '20px !important',
              outline: 'none !important',
            },
            '& .cl-formFieldCheckboxInput, & .cl-internal-7vvtr4': {
              border: '2px solid rgba(255, 255, 255, 0.4) !important',
              backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
              accentColor: '#FFD700 !important',
              width: '18px !important',
              height: '18px !important',
            },
            '& .cl-formFieldCheckboxInput:checked': {
              backgroundColor: 'rgba(255, 255, 255, 0.4) !important',
              borderColor: 'rgba(255, 255, 255, 0.4) !important',
            },
            '& .cl-formFieldCheckboxLabel, & .cl-formFieldCheckboxLabelText, & label': {
              fontSize: '14px !important',
            },
            '& .cl-formFieldAction, & .cl-formFieldHintText': {
              fontSize: '12px !important',
            },
            '& .cl-internal-dv4knk, & .cl-internal-dfuac5, & .cl-internal-1aqjns': {
              fontSize: '13px !important',
            },
            '& .cl-formFieldErrorText, & .cl-formFieldError, & .cl-internal-1tc10s3, & .cl-internal-16zadrt, & .cl-formFieldInfoText, & .cl-formFieldSuccessText, & .cl-internal-1b98cs7': {
              fontSize: '13px !important',
            },
            '& .cl-footerActionText, & .cl-footerActionLink, & .cl-internal-1f60a30, & .cl-internal-pccw1v': {
              fontSize: '14px !important',
            },
            '& .cl-footerAction, & .cl-footer': {
              padding: '0 !important',
              margin: '0 !important',
            },
            '& .cl-otpCodeFieldInput, & .cl-internal-vj6bzn': {
              border: '2px solid rgba(255, 255, 255, 0.4) !important',
              backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
              color: 'white !important',
              textAlign: 'center !important',
              fontWeight: 'bold !important',
              fontSize: '20px !important',
              borderRadius: '8px !important',
              padding: '20px 8px !important',
            },
          }}
        >
          {/* Signup Form */}
          <SignUp 
            path="/signup" 
            routing="path" 
            signInUrl="/login"
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
