import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card,
  CardContent,
  Avatar,
  Divider
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@/components/ui/phosphor-icons.server';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['about']);

export const metadata: Metadata = {
  title: 'About Scripture Spot | Our Mission',
  description: 
    'We\'re just a couple of guys who love our Lord and God Jesus Christ, pursue deep bible study, enjoy church history, and build modern web apps.',
  keywords: ['About', 'Scripture Spot', 'Christian', 'Bible Study', 'Church History'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'About Scripture Spot | Our Mission',
    description: 
      'We\'re just a couple of guys who love our Lord and God Jesus Christ, pursue deep bible study, enjoy church history, and build modern web apps.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=About%20Scripture%20Spot`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Scripture Spot | Our Mission',
    description: 
      'We\'re just a couple of guys who love our Lord and God Jesus Christ, pursue deep bible study, enjoy church history, and build modern web apps.',
    images: [`${env.site}/api/og?title=About%20Scripture%20Spot`],
  },
};

const teamMembers = [
  {
    name: 'Addison Riddleberger',
    title: 'Founder & CEO',
    signature: 'A.R.',
    image: '/assets/images/about-us/addison-riddleberger-scripture-spot.webp',
    gradient: 'linear-gradient(216deg, #8C8C8C 0%, black 100%)',
    email: 'addison@scripturespot.com'
  },
  {
    name: 'Matt Taves',
    title: 'Founder & COO',
    signature: 'M.T.',
    image: '/assets/images/about-us/matt-taves-scripture-spot.webp',
    gradient: 'linear-gradient(216deg, #8C8C8C 0%, black 100%)',
    email: 'marcus@scripturespot.com'
  }
];

export default function AboutPage() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 6, md: 8 },
          pb: { xs: 3, md: 4 },
          textAlign: 'left',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
              fontWeight: 300,
              color: 'text.primary',
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            About{' '}
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #CCCCCC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Scripture Spot
            </Box>
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '13px', md: '16px' },
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            Building modern tools for deep Scripture study and Christian growth
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ alignItems: 'stretch' }}>
          {/* Mission Statement - 2/3 */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                p: { xs: 3, md: 4 },
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >            
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  color: 'text.primary',
                  mb: 3,
                }}
              >
                Our goal with Scripture Spot is to offer a <strong>next-generation alternative</strong> to older, clunkier, scattered Bible apps and resources. We want to provide a <em>fresh, modern reading experience</em> that brings <strong>reverberating clarity</strong> to the Word of God and stokes curiosity of the remarkable truths of the Christian faith.
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  color: 'text.primary',
                  mb: 4,
                }}
              >
                We hope you love what we've created thus far and will <strong>support us</strong> as we work to <em>rapidly bring you</em> more helpful features and study materials.
                <br />
                <br />
                <Box
                  component="span"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontStyle: 'italic',
                  }}
                >
                  To God be the glory.
                </Box>
              </Typography>
              
              <Link href="/support" style={{ textDecoration: 'none', width: '100%' }}>
                <Box
                  sx={{
                    width: '100%',
                    px: 4,
                    py: 2,
                    background: 'rgba(255, 215, 0, 0.20)',
                    borderRadius: 3,
                    outline: '2px rgba(255, 215, 0, 0.20) solid',
                    outlineOffset: '-2px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      background: 'rgba(255, 215, 0, 0.30)',
                      outline: '2px rgba(255, 215, 0, 0.40) solid',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: '#FFFAFA',
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    Support Our Mission
                  </Typography>
                  
                  <ArrowForwardIcon
                    sx={{
                      color: '#FFFAFA',
                      fontSize: 16,
                      ml: 0.25,
                    }}
                  />
                </Box>
              </Link>
            </Card>
          </Grid>

          {/* Team Section - 1/3 */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                p: { xs: 3, md: 4 },
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                {teamMembers.map((member, index) => (
                  <Box
                    key={index}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.01)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      textAlign: 'center',
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderColor: 'rgba(255, 255, 255, 0.08)',
                      },
                    }}
                  >
                    {/* Profile Picture */}
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: member.gradient,
                          position: 'relative',
                          mx: 'auto',
                          overflow: 'hidden',
                          boxShadow: '10px 19px 28px 0px rgba(0, 0, 0, 0.25)',
                        }}
                      >
                        <Avatar
                          alt={member.name}
                          src={member.image}
                          sx={{
                            width: '100%',
                            height: '100%',
                            fontSize: '2rem',
                            fontWeight: 600,
                            bgcolor: 'transparent',
                            color: 'white',
                          }}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                      </Box>
                    </Box>
                    
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {member.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.875rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 0,
                      }}
                    >
                      {member.title}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
