'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useAuthorByName } from '@/contexts/AuthorContext';

interface AuthorAvatarProps {
  authorName: string | null | undefined;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  showTitle?: boolean;
}

const sizeConfig = {
  small: {
    avatar: 28.5,
    fontSize: '0.75rem',
    nameSize: '0.875rem',
    titleSize: '0.75rem'
  },
  medium: {
    avatar: 45,
    fontSize: '1rem',
    nameSize: '1rem',
    titleSize: '0.875rem'
  },
  large: {
    avatar: 60,
    fontSize: '1.25rem',
    nameSize: '1.125rem',
    titleSize: '1rem'
  }
};

export default function AuthorAvatar({ 
  authorName, 
  size = 'medium', 
  showName = false,
  showTitle = false 
}: AuthorAvatarProps) {
  const author = useAuthorByName(authorName);
  const config = sizeConfig[size];
  
  if (!authorName) return null;

  // Generate initials from author name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Default gradient if no author color scheme
  const defaultGradient = 'linear-gradient(216deg, #278EFF 0%, black 100%)';
  const gradient = author?.colorScheme?.gradient || 
                  (author?.colorScheme?.primary ? 
                   `linear-gradient(216deg, ${author.colorScheme.primary} 0%, black 100%)` : 
                   defaultGradient);

  const renderAvatar = () => (
    <Box sx={{ position: 'relative', width: config.avatar, height: config.avatar }}>
      {/* Background circle */}
      <Box
        sx={{
          width: size === 'small' ? config.avatar - 15 : config.avatar - 15,
          height: size === 'small' ? config.avatar - 15 : config.avatar - 15,
          borderRadius: '50%',
          background: '#1A1A1A',
          position: 'absolute',
          left: 0,
          zIndex: 0,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      />
      
      {/* Gradient circle with image or initials */}
      <Box
        sx={{
          width: config.avatar,
          height: config.avatar,
          borderRadius: '50%',
          background: gradient,
          position: 'absolute',
          zIndex: 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {author?.image ? (
          <Image
            src={author.image}
            alt={author.name}
            width={config.avatar}
            height={config.avatar}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center bottom', 
              display: 'block' 
            }}
          />
        ) : (
          <Typography
            sx={{
              color: 'white',
              fontSize: config.fontSize,
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {getInitials(authorName)}
          </Typography>
        )}
      </Box>
    </Box>
  );

  if (!showName && !showTitle) {
    return renderAvatar();
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {renderAvatar()}
      
      {(showName || showTitle) && (
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {showName && (
            <Typography
              sx={{
                color: '#FFFAFA',
                fontSize: config.nameSize,
                fontWeight: 700,
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {author?.name || authorName}
            </Typography>
          )}
          
          {showTitle && author?.nicknameOrTitle && (
            <Typography
              sx={{
                color: 'rgba(255, 249.70, 249.70, 0.60)',
                fontSize: config.titleSize,
                fontWeight: 400,
                lineHeight: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {author.nicknameOrTitle}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

// Compact version for inline use (just avatar + name)
interface CompactAuthorAvatarProps {
  authorName: string | null | undefined;
  size?: 'small' | 'medium';
}

export function CompactAuthorAvatar({ authorName, size = 'small' }: CompactAuthorAvatarProps) {
  const author = useAuthorByName(authorName);
  const config = sizeConfig[size];
  
  if (!authorName) return null;

  // Get initials for fallback
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ position: 'relative', width: config.avatar, height: config.avatar }}>
        {/* This creates the same avatar style as Commentary.tsx */}
        <Box
          sx={{
            width: config.avatar,
            height: config.avatar,
            borderRadius: '50%',
            background: author?.colorScheme?.primary
              ? `linear-gradient(216deg, ${author.colorScheme.primary} 0%, black 100%)`
              : 'linear-gradient(216deg, #278EFF 0%, black 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {author?.image ? (
            <Image
              src={author.image}
              alt={author.name}
              width={config.avatar}
              height={config.avatar}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center bottom'
              }}
            />
          ) : (
            <Typography
              sx={{
                color: 'white',
                fontSize: config.fontSize,
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {getInitials(authorName)}
            </Typography>
          )}
        </Box>
      </Box>
      <Typography
        sx={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: config.nameSize,
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {author?.name || authorName}
      </Typography>
    </Box>
  );
}