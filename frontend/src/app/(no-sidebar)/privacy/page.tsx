import { Metadata } from 'next';
import { Container, Typography, Box, Card, Divider } from '@mui/material';
import { Security, Analytics, Storage, Share, Policy, ContactMail } from '@/components/ui/phosphor-icons.server';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['privacy']);

export const metadata: Metadata = {
  title: 'Privacy Policy | Scripture Spot',
  description: 'Learn how Scripture Spot collects, uses, and protects your personal information.',
  keywords: ['Privacy Policy', 'Scripture Spot', 'Data Protection', 'Privacy'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Privacy Policy | Scripture Spot',
    description: 'Learn how Scripture Spot collects, uses, and protects your personal information.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Privacy%20Policy`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Scripture Spot',
    description: 'Learn how Scripture Spot collects, uses, and protects your personal information.',
    images: [`${env.site}/api/og?title=Privacy%20Policy`],
  },
};

const sections = [
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    icon: Storage,
    content: [
      {
        subtitle: 'Account Information',
        text: 'When you create an account, we collect your email address, name, and basic profile information including your user type (Everyday Christian, Student, Teacher, Pastor, Scholar) and how you heard about us.'
      },
      {
        subtitle: 'Usage Information',
        text: 'We collect information about how you use our service, including the verses you read, commentaries you view, and bookmarks you save. This helps us provide personalized recommendations and improve our service.'
      },
      {
        subtitle: 'Communication Information',
        text: 'When you contact us or subscribe to our newsletter, we collect your email address and any information you provide in your communications with us.'
      }
    ]
  },
  {
    id: 'how-we-use-information',
    title: 'How We Use Your Information',
    icon: Analytics,
    content: [
      {
        subtitle: '',
        text: 'We use the information we collect to:',
        list: [
          'Provide and maintain our Scripture study services',
          'Personalize your experience with relevant content and recommendations',
          'Send you updates about new features, content, and Scripture Spot news (only if you\'ve subscribed)',
          'Respond to your questions and provide customer support',
          'Improve our service and develop new features',
          'Ensure the security and proper functioning of our platform'
        ]
      }
    ]
  },
  {
    id: 'data-security',
    title: 'Data Storage and Security',
    icon: Security,
    content: [
      {
        subtitle: '',
        text: 'We store your information securely using industry-standard practices. Your account information is protected with authentication tokens, and we use secure connections for all data transmission.'
      },
      {
        subtitle: '',
        text: 'Some of your preferences and recent activity are stored locally on your device to improve performance and provide a better user experience. This includes your recently viewed verses and navigation history.'
      }
    ]
  },
  {
    id: 'third-party-services',
    title: 'Third-Party Services',
    icon: Share,
    content: [
      {
        subtitle: 'Analytics',
        text: 'We use PostHog for analytics on our production website to understand how users interact with our service. This helps us improve Scripture Spot and identify areas for enhancement. No analytics are collected during development or testing.'
      },
      {
        subtitle: 'Search Services',
        text: 'We use Azure Cognitive Search to provide fast and relevant search results across our Scripture and commentary content.'
      },
      {
        subtitle: 'Advertising',
        text: 'We use Google AdSense to display relevant advertisements. Google may collect information about your visits to our site to provide personalized ads. You can opt out of personalized advertising by visiting Google\'s Ad Settings.'
      }
    ]
  },
  {
    id: 'your-rights',
    title: 'Your Rights and Choices',
    icon: Policy,
    content: [
      {
        subtitle: '',
        text: 'You have the right to:',
        list: [
          'Access and review your personal information',
          'Update or correct your account information',
          'Delete your account and associated data',
          'Unsubscribe from our newsletter at any time',
          'Request a copy of your data',
          'Opt out of certain data collection practices'
        ]
      }
    ]
  },
  {
    id: 'contact',
    title: 'Contact Us',
    icon: ContactMail,
    content: [
      {
        subtitle: '',
        text: 'If you have any questions about this privacy policy or how we handle your information, please contact us at hello@scripturespot.com.'
      }
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 6, md: 8 },
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
              textAlign: 'left',
            }}
          >
            Privacy{' '}
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
              Policy
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
              textAlign: 'left',
            }}
          >
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontStyle: 'italic',
              fontSize: '0.9rem',
              textAlign: 'left',
              mt: 2,
            }}
          >
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 12 }}>
        {/* Table of Contents */}
        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            p: 4,
            mb: 6,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'text.primary',
              mb: 3,
              letterSpacing: '-0.01em',
            }}
          >
            Table of Contents
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Box
                  key={section.id}
                  component="a"
                  href={`#${section.id}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'text.primary',
                    },
                  }}
                >
                  <IconComponent sx={{ fontSize: 20 }} />
                  <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                    {section.title}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Card>

        {/* Content Sections */}
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card
              key={section.id}
              id={section.id}
              sx={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                p: { xs: 4, md: 6 },
                mb: 4,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <IconComponent sx={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.7)' }} />
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: 'text.primary',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {section.title}
                </Typography>
              </Box>
              
              {section.content.map((item, itemIndex) => (
                <Box key={itemIndex} sx={{ mb: item.subtitle ? 4 : 3 }}>
                  {item.subtitle && (
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 2,
                      }}
                    >
                      {item.subtitle}
                    </Typography>
                  )}
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.7,
                      fontSize: '1rem',
                      mb: item.list ? 2 : 0,
                    }}
                  >
                    {item.text}
                  </Typography>
                  {item.list && (
                    <Box component="ul" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.7, pl: 3, m: 0 }}>
                      {item.list.map((listItem, listIndex) => (
                        <li key={listIndex} style={{ marginBottom: '0.5rem' }}>
                          {listItem}
                        </li>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
              
              {index < sections.length - 1 && (
                <Divider sx={{ mt: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              )}
            </Card>
          );
        })}

        {/* Additional Information Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              p: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
              }}
            >
              Cookies & Local Storage
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                fontSize: '0.95rem',
                mb: 2,
              }}
            >
              We use cookies and local storage to enhance your experience:
            </Typography>
            <Box component="ul" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, pl: 3, m: 0, fontSize: '0.9rem' }}>
              <li>Keep you logged in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Track recently viewed verses for easy navigation</li>
              <li>Provide analytics to help improve our service</li>
            </Box>
          </Card>

          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              p: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
              }}
            >
              Data Sharing
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                fontSize: '0.95rem',
                mb: 2,
              }}
            >
              We do not sell or trade your personal information. We only share data:
            </Typography>
            <Box component="ul" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, pl: 3, m: 0, fontSize: '0.9rem' }}>
              <li>To provide our services</li>
              <li>When required by law</li>
              <li>With your explicit consent</li>
              <li>To trusted service providers</li>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
