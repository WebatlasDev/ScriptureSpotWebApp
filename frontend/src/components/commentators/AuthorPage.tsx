'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  useTheme,
  Divider
} from '@mui/material';
import { useAuthorsAuthors } from '@/hooks/useAuthorsAuthors';
import { AuthorFromAPI } from '@/types/author';
import Link from 'next/link';
import CrossLoader from '@/components/ui/CrossLoader';
import Image from 'next/image';

interface AuthorPageProps {
  initialAuthor?: AuthorFromAPI;
}

export default function AuthorPage({ initialAuthor }: AuthorPageProps) {
  const params = useParams();
  const theme = useTheme();
  const { data: authors, isLoading, error } = useAuthorsAuthors(
    initialAuthor ? { enabled: false, initialData: [initialAuthor] } : undefined
  );

  // Find the author by slug from the authors list or use initialAuthor
  const author = initialAuthor || authors?.find(a => a.slug === params.id);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CrossLoader size={60} />
      </Box>
    );
  }
  
  if (error || !author) {
    return (
      <Box sx={{ padding: 4, color: 'error.main' }}>
        Author not found
      </Box>
    );
  }

  // Default color if not set in author data
  const authorColor = author.colorScheme?.primary || '#5B41DE';
  
  // Format dates display
  const datesDisplay = (() => {
    if (author.birthYear && author.deathYear) {
      return `${author.birthYear}–${author.deathYear}`;
    } else if (author.birthYear) {
      return `${author.birthYear}–`;
    }
    return '1834–1892'; // fallback
  })();
  
  return (
    <Box sx={{ 
      width: '100%',
      overflow: 'hidden',
      background: '#111111',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Hero section with gradient background - full width */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 300, md: 400 },
          background: `linear-gradient(221deg, ${authorColor} 0%, black 100%)`,
          position: 'relative',
        }}
      />

      {/* Author Info and Stats */}
      <Box sx={{ 
        width: '100%',
        maxWidth: '1300px',
        px: { xs: 2, md: 4 },
        mt: { xs: -5, md: -8 }, 
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Author Name */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Image
            src={author.image || 'https://placehold.co/501x386'}
            alt={author.name}
            width={300}
            height={230}
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: 300,
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '16px'
            }}
          />
          
          <Typography
            sx={{
              color: 'white',
              fontSize: { xs: 28, md: 56 },
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 700,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mt: 3,
            }}
          >
            {author.name}
          </Typography>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            marginBottom: 6,
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              flex: '1 1 0',
              padding: 3,
              background: 'rgba(255, 255, 255, 0.10)',
              borderRadius: 4,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontSize: { xs: 24, md: 32 },
                fontWeight: 700,
                lineHeight: 1.5,
              }}
            >
              {author.sermonsPreached || '3,618'}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.60)',
                fontSize: { xs: 16, md: 20 },
                fontWeight: 500,
              }}
            >
              Sermons Preached
            </Typography>
          </Box>
          
          <Box
            sx={{
              flex: '1 1 0',
              padding: 3,
              background: 'rgba(255, 255, 255, 0.10)',
              borderRadius: 4,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontSize: { xs: 24, md: 32 },
                fontWeight: 700,
                lineHeight: 1.5,
              }}
            >
              157
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.60)',
                fontSize: { xs: 16, md: 20 },
                fontWeight: 500,
              }}
            >
              Published Works
            </Typography>
          </Box>
          
          <Box
            sx={{
              flex: '1 1 0',
              padding: 3,
              background: 'rgba(255, 255, 255, 0.10)',
              borderRadius: 4,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontSize: { xs: 24, md: 32 },
                fontWeight: 700,
                lineHeight: 1.5,
              }}
            >
              638
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.60)',
                fontSize: { xs: 16, md: 20 },
                fontWeight: 500,
              }}
            >
              Verses Exposited
            </Typography>
          </Box>
        </Box>

        {/* Content Section */}
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: '1300px',
            backgroundColor: '#1A1A1A', 
            borderRadius: 4, 
            p: { xs: 2, md: 4 },
            mb: 6,
          }}
        >
          <Grid container spacing={6}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              {/* Author Bio Section */}
              <Box sx={{ mb: 8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      backgroundColor: authorColor,
                      borderRadius: 1,
                    }} 
                  />
                  <Typography 
                    sx={{ 
                      color: 'white', 
                      fontSize: 24, 
                      fontWeight: 700,
                    }}
                  >
                    Author Bio
                  </Typography>
                </Box>
                
                <Divider 
                  sx={{ 
                    mb: 3,
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0) 100%)',
                  }} 
                />
                
                <Typography 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.60)',
                    fontSize: 16,
                    lineHeight: 1.5,
                  }}
                >
                  <Box component="span" sx={{ color: 'white', fontWeight: 400 }}>
                    {author.name} ({datesDisplay})
                  </Box> was a renowned 
                  <Box component="span" sx={{ color: 'white', fontWeight: 400 }}>
                    {' '}{author.occupation || 'English Baptist minister'}
                  </Box> whose powerful 
                  sermons and writings touched millions worldwide. Leading the 
                  <Box component="span" sx={{ color: 'white', fontWeight: 400 }}>
                    {' '}Metropolitan Tabernacle in London
                  </Box>, he authored influential works and established hundreds of 
                  ministries, cementing his legacy as 
                  <Box component="span" sx={{ color: 'white', fontWeight: 400 }}>
                    {' '}one of the most impactful Christian leaders in all of church history
                  </Box>.
                </Typography>
              </Box>

              {/* Major Works Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      backgroundColor: authorColor,
                      borderRadius: 1,
                    }} 
                  />
                  <Typography 
                    sx={{ 
                      color: 'white', 
                      fontSize: 24, 
                      fontWeight: 700,
                    }}
                  >
                    Major Works
                  </Typography>
                </Box>
                
                {/* Commentaries Card */}
                <Box sx={{ mb: 3 }}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: 4,
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        sx={{ 
                          color: 'white', 
                          fontSize: 18, 
                          fontWeight: 500,
                          mb: 2,
                        }}
                      >
                        Bible Commentaries
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.60)', 
                          fontSize: 16,
                          mb: 2,
                        }}
                      >
                        Explore {author.name}'s insights on Scripture across different books of the Bible. 
                        Gain theological understanding and practical applications from this renowned scholar.
                      </Typography>
                      <Button 
                        component={Link}
                        href={`/commentators/${params.id}/commentaries`}
                        sx={{ 
                          color: '#5B41DE', 
                          fontSize: 16,
                          fontWeight: 500,
                          textTransform: 'none',
                          p: 0,
                          '&:hover': { 
                            background: 'transparent',
                            opacity: 0.8,
                          } 
                        }}
                      >
                        View Commentaries →
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
                
                {/* Work Card 1 */}
                <Box sx={{ mb: 3 }}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: 4,
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        sx={{ 
                          color: 'white', 
                          fontSize: 18, 
                          fontWeight: 500,
                          mb: 2,
                        }}
                      >
                        Morning & Evening
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.60)', 
                          fontSize: 16,
                          mb: 2,
                        }}
                      >
                        This is a timeless devotional that provides daily reflections and scriptural insights.
                      </Typography>
                      <Button 
                        sx={{ 
                          color: '#FF9E27', 
                          fontSize: 16,
                          fontWeight: 500,
                          textTransform: 'none',
                          p: 0,
                          '&:hover': { 
                            background: 'transparent',
                            opacity: 0.8,
                          } 
                        }}
                      >
                        View on Amazon →
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
                
                {/* Work Card 2 */}
                <Box>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: 4,
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        sx={{ 
                          color: 'white', 
                          fontSize: 18, 
                          fontWeight: 500,
                          mb: 2,
                        }}
                      >
                        The Treasury of David
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.60)', 
                          fontSize: 16,
                          mb: 2,
                        }}
                      >
                        An extensive commentary on Psalms, with rich spiritual insights, theological reflections, and practical daily applications.
                      </Typography>
                      <Button 
                        sx={{ 
                          color: '#FF9E27', 
                          fontSize: 16,
                          fontWeight: 500,
                          textTransform: 'none',
                          p: 0,
                          '&:hover': { 
                            background: 'transparent',
                            opacity: 0.8,
                          } 
                        }}
                      >
                        View on Amazon →
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              {/* Hymn Library Section */}
              <Box sx={{ mb: 8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      backgroundColor: authorColor,
                      borderRadius: 1,
                    }} 
                  />
                  <Typography 
                    sx={{ 
                      color: 'white', 
                      fontSize: 24, 
                      fontWeight: 700,
                    }}
                  >
                    Hymn Library
                  </Typography>
                </Box>
                
                <Divider 
                  sx={{ 
                    mb: 3,
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0) 100%)',
                  }} 
                />
                
                {/* Hymn Item 1 */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3,
                    mb: 3,
                    '&:hover': {
                      cursor: 'pointer',
                      opacity: 0.8,
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      background: `linear-gradient(224deg, ${authorColor} 0%, black 100%)`,
                      borderRadius: 2,
                      flexShrink: 0,
                    }} 
                  />
                  <Box>
                    <Typography 
                      sx={{ 
                        color: 'white', 
                        fontSize: 18, 
                        fontWeight: 500,
                      }}
                    >
                      The Power of The Holy Spirit
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.60)', 
                        fontSize: 16,
                      }}
                    >
                      June 17, 1855
                    </Typography>
                  </Box>
                </Box>

                {/* Hymn Item 2 */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3,
                    mb: 3,
                    '&:hover': {
                      cursor: 'pointer',
                      opacity: 0.8,
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      background: `linear-gradient(224deg, ${authorColor} 0%, black 100%)`,
                      borderRadius: 2,
                      flexShrink: 0,
                    }} 
                  />
                  <Box>
                    <Typography 
                      sx={{ 
                        color: 'white', 
                        fontSize: 18, 
                        fontWeight: 500,
                      }}
                    >
                      The Sin of Unbelief
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.60)', 
                        fontSize: 16,
                      }}
                    >
                      January 14, 1855
                    </Typography>
                  </Box>
                </Box>

                {/* Hymn Item 3 */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3,
                    mb: 3,
                    '&:hover': {
                      cursor: 'pointer',
                      opacity: 0.8,
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      background: `linear-gradient(224deg, ${authorColor} 0%, black 100%)`,
                      borderRadius: 2,
                      flexShrink: 0,
                    }} 
                  />
                  <Box>
                    <Typography 
                      sx={{ 
                        color: 'white', 
                        fontSize: 18, 
                        fontWeight: 500,
                      }}
                    >
                      A Solemn Warning For All Churches
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.60)', 
                        fontSize: 16,
                      }}
                    >
                      February 24, 1856
                    </Typography>
                  </Box>
                </Box>

                {/* Hymn Item 4 */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3,
                    mb: 3,
                    '&:hover': {
                      cursor: 'pointer',
                      opacity: 0.8,
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      background: `linear-gradient(224deg, ${authorColor} 0%, black 100%)`,
                      borderRadius: 2,
                      flexShrink: 0,
                    }} 
                  />
                  <Box>
                    <Typography 
                      sx={{ 
                        color: 'white', 
                        fontSize: 18, 
                        fontWeight: 500,
                      }}
                    >
                      Israel At The Red Sea
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.60)', 
                        fontSize: 16,
                      }}
                    >
                      March 30, 1856
                    </Typography>
                  </Box>
                </Box>

                {/* Hymn Item 5 */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3,
                    '&:hover': {
                      cursor: 'pointer',
                      opacity: 0.8,
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      background: `linear-gradient(224deg, ${authorColor} 0%, black 100%)`,
                      borderRadius: 2,
                      flexShrink: 0,
                    }} 
                  />
                  <Box>
                    <Typography 
                      sx={{ 
                        color: 'white', 
                        fontSize: 18, 
                        fontWeight: 500,
                      }}
                    >
                      The Gospel in Power
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.60)', 
                        fontSize: 16,
                      }}
                    >
                      May 2, 1882
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Interesting Facts Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      backgroundColor: authorColor,
                      borderRadius: 1,
                    }} 
                  />
                  <Typography 
                    sx={{ 
                      color: 'white', 
                      fontSize: 24, 
                      fontWeight: 700,
                    }}
                  >
                    Interesting Facts
                  </Typography>
                </Box>
                
                <Divider 
                  sx={{ 
                    mb: 3,
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0) 100%)',
                  }} 
                />
                
                <Typography 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.60)',
                    fontSize: 16,
                    lineHeight: 1.5,
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    • Known as the "Prince of Preachers," {author.name} delivered sermons to crowds of over 10,000 people regularly, without modern amplification.
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    • His collected sermons fill 63 volumes, one of the largest sets by a single author in Christian history.
                  </Box>
                  <Box>
                    • Founded Spurgeon's College in London, which continues to train ministers today.
                  </Box>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
