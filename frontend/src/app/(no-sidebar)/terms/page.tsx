import { Metadata } from 'next';
import { Container, Typography, Box, Card, Divider } from '@mui/material';
import { Gavel, AccountBox, Security, Policy, Business, ContactMail } from '@/components/ui/phosphor-icons.server';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['terms']);

export const metadata: Metadata = {
  title: 'Terms of Service | Scripture Spot',
  description: 'Terms and conditions for using Scripture Spot, your trusted companion for deep Scripture study.',
  keywords: ['Terms of Service', 'Scripture Spot', 'Terms and Conditions', 'Bible Study'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Terms of Service | Scripture Spot',
    description: 'Terms and conditions for using Scripture Spot, your trusted companion for deep Scripture study.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Terms%20of%20Service`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | Scripture Spot',
    description: 'Terms and conditions for using Scripture Spot, your trusted companion for deep Scripture study.',
    images: [`${env.site}/api/og?title=Terms%20of%20Service`],
  },
};

interface SectionContent {
  text: string;
  list?: string[];
  italic?: boolean;
}

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: SectionContent[];
}

const sections: Section[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: Gavel,
    content: [
      {
        text: 'By accessing or using Scripture Spot, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.'
      },
      {
        text: 'These terms apply to all users of Scripture Spot, including visitors, registered users, and contributors.'
      }
    ]
  },
  {
    id: 'service-description',
    title: 'Description of Service',
    icon: Business,
    content: [
      {
        text: 'Scripture Spot is a Christian Bible study platform that provides:',
        list: [
          'Access to Bible texts and commentaries',
          'Study tools and resources',
          'Bookmarking and personal note-taking features',
          'Search functionality across biblical content',
          'Educational materials and study plans',
          'Community features for Christian growth'
        ]
      },
      {
        text: 'Our goal is to provide a modern, accessible platform for deep Scripture study and Christian edification.'
      }
    ]
  },
  {
    id: 'user-accounts',
    title: 'User Accounts',
    icon: AccountBox,
    content: [
      {
        text: 'To access certain features, you may need to create an account. When creating an account, you agree to:',
        list: [
          'Provide accurate and complete information',
          'Keep your account information up to date',
          'Maintain the security of your account credentials',
          'Notify us immediately of any unauthorized access',
          'Take responsibility for all activity under your account'
        ]
      },
      {
        text: 'You are responsible for maintaining the confidentiality of your account and password.'
      }
    ]
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    icon: Security,
    content: [
      {
        text: 'You agree to use Scripture Spot in a manner consistent with Christian values and principles. You may not use our service to:',
        list: [
          'Violate any applicable laws or regulations',
          'Infringe on the rights of others',
          'Upload or distribute harmful, offensive, or inappropriate content',
          'Attempt to gain unauthorized access to our systems',
          'Interfere with the proper functioning of our service',
          'Use our service for commercial purposes without permission',
          'Engage in conduct that contradicts biblical teachings on love, respect, and kindness'
        ]
      },
      {
        text: 'We reserve the right to suspend or terminate accounts that violate these terms.'
      }
    ]
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    icon: Policy,
    content: [
      {
        text: 'Scripture Spot respects intellectual property rights. The content on our platform includes:',
        list: [
          'Public domain biblical texts and commentaries',
          'Licensed content from publishers and authors',
          'Original content created by our team',
          'User-generated content (notes, bookmarks, etc.)'
        ]
      },
      {
        text: 'You retain ownership of your personal notes and bookmarks, but grant us a license to provide our services. You may not redistribute or commercially use content from our platform without proper authorization.'
      }
    ]
  },
  {
    id: 'contact',
    title: 'Contact Information',
    icon: ContactMail,
    content: [
      {
        text: 'If you have any questions about these Terms of Service, please contact us at hello@scripturespot.com.'
      },
      {
        text: '"Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom..." - Colossians 3:16',
        italic: true
      }
    ]
  }
];

export default function TermsOfServicePage() {
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
            Terms of{' '}
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
              Service
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
            These terms govern your use of Scripture Spot and our commitment to providing excellent Bible study resources.
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
                <Box key={itemIndex} sx={{ mb: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: item.italic ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.7,
                      fontSize: '1rem',
                      mb: item.list ? 2 : 0,
                      fontStyle: item.italic ? 'italic' : 'normal',
                      textAlign: item.italic ? 'center' : 'left',
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

        {/* Additional Legal Information */}
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
              Service Availability
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
              We strive to provide reliable access to Scripture Spot, but we cannot guarantee:
            </Typography>
            <Box component="ul" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, pl: 3, m: 0, fontSize: '0.9rem' }}>
              <li>Uninterrupted service at all times</li>
              <li>Error-free operation</li>
              <li>Availability during maintenance periods</li>
              <li>Compatibility with all devices and browsers</li>
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
              Disclaimers
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
              Scripture Spot is provided "as is" without warranties. We recommend:
            </Typography>
            <Box component="ul" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, pl: 3, m: 0, fontSize: '0.9rem' }}>
              <li>Consulting multiple sources for theological questions</li>
              <li>Seeking guidance from qualified spiritual leaders</li>
              <li>Praying for wisdom and discernment in your studies</li>
              <li>Remembering that Scripture is the ultimate authority</li>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
