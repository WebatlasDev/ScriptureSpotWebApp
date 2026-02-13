// theme/interlinearThemes.ts

export const interlinearThemes = {
    HEBREW: {
      drawerBg: '#221F19',
      buttonActiveBg: '#FFD700', // The main highlight color for the toggle button
      card: {
        default: {
          bg: '#3B321F',
          border: '2px solid rgba(255, 255, 255, 0.08)',
        },
        selected: {
          bg: '#6B5A2B',
          border: '2px solid #FFD700',
        },
      },
      strongsColor: '#FFD700',
      navButtonBg: 'rgba(249, 216, 73, 0.25)',
    },
    GREEK: {
      drawerBg: '#131820',
      buttonActiveBg: '#89B7F9',
      card: {
        default: {
          bg: '#1F2836',
          border: '2px solid rgba(91, 125, 164, 0.10)',
        },
        selected: {
          bg: '#3B4E6B',
          border: '2px solid #89B7F9',
        },
      },
      strongsColor: '#89B7F9',
      navButtonBg: '#26303B',
    },
  };
