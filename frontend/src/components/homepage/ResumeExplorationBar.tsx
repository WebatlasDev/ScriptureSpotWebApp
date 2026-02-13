import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import { Replay as ReplayIcon } from '@/components/ui/phosphor-icons';
import { Primitive } from '@radix-ui/react-primitive';

interface ResumeExplorationBarProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
}

const shimmer = keyframes`
  0% {
    background-position: -150% 0;
  }
  100% {
    background-position: 150% 0;
  }
`;

export default function ResumeExplorationBar({ label, onClick, loading = false }: ResumeExplorationBarProps) {
  return (
    <Box
      component={Primitive.button}
      type="button"
      onClick={loading ? undefined : onClick}
      disabled={loading}
      aria-busy={loading}
      aria-live="polite"
      sx={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: loading ? 0 : 1,
        width: '100%',
        maxWidth: '100%',
        px: { xs: 3, sm: 4 },
        py: { xs: 1.25, sm: 1.6 },
        borderRadius: 2.5,
        background:
          'radial-gradient(ellipse 70% 200% at 50% 50%, rgba(255, 215, 0, 0.22) 0%, rgba(255, 215, 0, 0) 65%), rgba(20,20,20,0.92)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0px 18px 60px rgba(0, 0, 0, 0.35)',
        color: '#FFFAFA',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'transform 0.2s ease, border 0.2s ease, background 0.2s ease',
        '&:focus-visible': {
          outline: '2px solid rgba(255, 215, 0, 0.6)',
          outlineOffset: 4,
        },
        '&:disabled': {
          opacity: 0.85,
          transform: 'translate(-50%, -50%)',
        },
        ...(loading
          ? {}
          : {
              '@media (hover: hover)': {
                '&:hover': {
                  border: '1px solid rgba(255, 215, 0, 0.55)',
                  transform: 'translate(-50%, -52%)',
                },
              },
            }),
      }}
    >
      {!loading && (
        <ReplayIcon sx={{ fontSize: 21, color: '#F3D129' }} />
      )}
      <Typography
        sx={{
          fontSize: { xs: 14, sm: 16 },
          fontWeight: 400,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'rgba(255, 255, 255, 0.92)',
          textAlign: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: loading ? 0 : 0.75,
        }}
      >
        {loading ? (
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              color: '#FFFAFA',
              background: 'linear-gradient(90deg, rgba(255, 250, 250, 0.175) 0%, rgba(255, 250, 250, 0.475) 50%, rgba(255, 250, 250, 0.175) 100%)',
              backgroundSize: '200% 100%',
              animation: `${shimmer} 1.8s ease-in-out infinite`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            Loading...
          </Box>
        ) : (
          <>
            <Box component="span" sx={{ opacity: 0.8 }}>
              Keep exploring
            </Box>
            <Box component="span" sx={{ fontWeight: 700, color: '#FFFAFA', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {label}
            </Box>
          </>
        )}
      </Typography>
    </Box>
  );
}
