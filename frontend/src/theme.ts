import { createTheme } from '@mui/material/styles';
import { textStyles, fontFamilies, type TextStyle } from '@/styles/textStyles';

const toMuiTypography = ({ paragraphSpacing, ...style }: TextStyle) => style;

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#278EFF',
    },
    secondary: {
      main: '#FFD700',
    },
    background: {
      default: '#111111',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.60)',
    },
  },
  typography: {
    fontFamily: fontFamilies.body,
    h1: toMuiTypography(textStyles.display.medium.l),
    h2: toMuiTypography(textStyles.display.regular.m),
    h3: toMuiTypography(textStyles.heading.medium.l),
    h4: toMuiTypography(textStyles.heading.medium.m),
    h5: toMuiTypography(textStyles.heading.medium.s),
    h6: toMuiTypography(textStyles.heading.medium.xs),
    subtitle1: toMuiTypography(textStyles.body.regular.xl),
    subtitle2: toMuiTypography(textStyles.body.regular.l),
    body1: toMuiTypography(textStyles.body.regular.l),
    body2: toMuiTypography(textStyles.body.regular.m),
    button: {
      ...toMuiTypography(textStyles.body.regular.m),
      fontWeight: 600,
      textTransform: 'none',
    },
    caption: toMuiTypography(textStyles.body.regular.s),
    overline: toMuiTypography(textStyles.label.eyebrow.s),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '.scripture-link': {
          color: 'rgba(255, 255, 255, 0.60)',
          textDecoration: 'none',
          '&:hover': {
            color: '#eee',
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '& .MuiTouchRipple-root': {
            color: '#FFD700',
          },
          '&.Mui-focusVisible': {
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.4)',
          },
        },
      },
    },
    
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 35,
          textTransform: 'none',
          fontWeight: 700,
        },
        outlined: {
          '&:hover': {
            borderColor: '#FFD700',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
          },
          '&.Mui-focused': {
            borderColor: '#FFD700',
          },
        },
      },
    },
    
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
          },
          '& .MuiTouchRipple-root': {
            color: '#FFD700',
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 35,
          backgroundColor: '#1A1A1A',
        },
      },
    },
    
    MuiTypography: {
      styleOverrides: {
        h1: {
          marginBottom: '16px',
        },
        h2: {
          marginTop: '24px',
          marginBottom: '16px',
        },
      },
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          h5: 'h5',
          h6: 'h6',
          subtitle1: 'h6',
          subtitle2: 'h6',
          body1: 'p',
          body2: 'span',
          caption: 'span',
          overline: 'span',
          button: 'span',
        },
      },
    },    
    
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderColor: 'rgba(255, 215, 0, 0.3)',
          borderWidth: 1,
          borderStyle: 'solid',
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFD700', // Your yellow color
          color: '#000', // Set text color for contrast (black on yellow)
          fontWeight: 600,
        },
        icon: {
          color: '#000', // Icon color
        }
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Disables the default Paper overlay
        },
      },
    },
  },
});

export default theme;
