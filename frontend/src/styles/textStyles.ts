const fontFamilies = {
  body: 'var(--font-inter), var(--font-lexend), sans-serif',
  display: 'var(--font-right-grotesk), var(--font-inter), sans-serif',
  heading: 'var(--font-right-grotesk), var(--font-inter), sans-serif',
  label: 'var(--font-inter), var(--font-lexend), sans-serif',
} as const;

import type { CSSProperties } from 'react';

export type TextStyle = {
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
  letterSpacing?: CSSProperties['letterSpacing'];
  paragraphSpacing: string;
  textTransform?: CSSProperties['textTransform'];
};

export const textStyles = {
  heading: {
    medium: {
      xs: {
        fontFamily: fontFamilies.heading,
        fontWeight: 500,
        fontSize: 'var(--ss-typography-semantic-size-l)',
        lineHeight: 'var(--ss-typography-semantic-line-height-l)',
        letterSpacing: '0px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-l)',
      },
      s: {
        fontFamily: fontFamilies.heading,
        fontWeight: 500,
        fontSize: 'var(--ss-typography-semantic-size-xl)',
        lineHeight: 'var(--ss-typography-semantic-line-height-2-xl)',
        letterSpacing: '0px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-2-xl)',
      },
      m: {
        fontFamily: fontFamilies.heading,
        fontWeight: 500,
        fontSize: 'var(--ss-typography-semantic-size-3-xl)',
        lineHeight: 'var(--ss-typography-semantic-line-height-4-xl)',
        letterSpacing: '-1px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-4-xl)',
      },
      l: {
        fontFamily: fontFamilies.heading,
        fontWeight: 500,
        fontSize: 'var(--ss-typography-semantic-size-4-xl)',
        lineHeight: 'var(--ss-typography-semantic-line-height-7-xl)',
        letterSpacing: '-1px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-7-xl)',
      },
    },
  },
  body: {
    regular: {
      s: {
        fontFamily: fontFamilies.body,
        fontWeight: 400,
        fontSize: 'var(--ss-typography-semantic-size-s)',
        lineHeight: 'var(--ss-typography-semantic-line-height-xs)',
        letterSpacing: '0px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-xs)',
      },
      m: {
        fontFamily: fontFamilies.body,
        fontWeight: 400,
        fontSize: 'var(--ss-typography-semantic-size-m)',
        lineHeight: 'var(--ss-typography-semantic-line-height-m)',
        letterSpacing: '0px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-m)',
      },
      l: {
        fontFamily: fontFamilies.body,
        fontWeight: 400,
        fontSize: 'var(--ss-typography-semantic-size-l)',
        lineHeight: 'var(--ss-typography-semantic-line-height-l)',
        letterSpacing: '0px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-l)',
      },
      xl: {
        fontFamily: fontFamilies.body,
        fontWeight: 400,
        fontSize: 'var(--ss-typography-semantic-size-xl)',
        lineHeight: 'var(--ss-typography-semantic-line-height-xl)',
        letterSpacing: '0px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-xl)',
      },
    },
    semiBold: {
      xl: {
        fontFamily: fontFamilies.body,
        fontWeight: 600,
        fontSize: 'var(--ss-typography-semantic-size-xl)',
        lineHeight: 'var(--ss-typography-semantic-line-height-xl)',
        letterSpacing: '0px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-xl)',
      },
    },
    bold: {
      l: {
        fontFamily: fontFamilies.body,
        fontWeight: 700,
        fontSize: 'var(--ss-typography-semantic-size-l)',
        lineHeight: 'var(--ss-typography-semantic-line-height-l)',
        letterSpacing: '0px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-l)',
      },
      xl: {
        fontFamily: fontFamilies.body,
        fontWeight: 700,
        fontSize: 'var(--ss-typography-semantic-size-xl)',
        lineHeight: 'var(--ss-typography-semantic-line-height-xl)',
        letterSpacing: '0px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-xl)',
      },
    },
  },
  display: {
    regular: {
      m: {
        fontFamily: fontFamilies.display,
        fontWeight: 400,
        fontSize: 'var(--ss-typography-semantic-size-5-xl)',
        lineHeight: 'var(--ss-typography-semantic-line-height-7-xl)',
        letterSpacing: '-1px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-7-xl)',
      },
    },
    medium: {
      m: {
        fontFamily: fontFamilies.display,
        fontWeight: 500,
        fontSize: 'var(--ss-typography-semantic-size-5-xl)',
        lineHeight: 'var(--ss-typography-semantic-line-height-7-xl)',
        letterSpacing: '0px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-7-xl)',
      },
      l: {
        fontFamily: fontFamilies.display,
        fontWeight: 500,
        fontSize: 'var(--ss-typography-semantic-size-6-xl)',
        lineHeight: 'var(--ss-typography-semantic-line-height-8-xl)',
        letterSpacing: '-1px',
        paragraphSpacing: 'var(--ss-typography-semantic-paragraph-spacing-8-xl)',
      },
    },
  },
  label: {
    eyebrow: {
      s: {
        fontFamily: fontFamilies.label,
        fontWeight: 700,
        fontSize: 'var(--ss-typography-semantic-size-s)',
        lineHeight: 'var(--ss-typography-semantic-line-height-2-xs)',
        letterSpacing: '2px',
        paragraphSpacing: '0px',
        textTransform: 'uppercase',
      },
    },
    medium: {
      s: {
        fontFamily: fontFamilies.label,
        fontWeight: 500,
        fontSize: 'var(--ss-typography-semantic-size-s)',
        lineHeight: 'var(--ss-typography-semantic-line-height-2-xs)',
        letterSpacing: '0px',
        paragraphSpacing: '0px',
      },
    },
    regular: {
      s: {
        fontFamily: fontFamilies.label,
        fontWeight: 400,
        fontSize: 'var(--ss-typography-semantic-size-s)',
        lineHeight: 'var(--ss-typography-semantic-line-height-2-xs)',
        letterSpacing: '0px',
        paragraphSpacing: '0px',
      },
      m: {
        fontFamily: fontFamilies.label,
        fontWeight: 400,
        fontSize: 'var(--ss-typography-semantic-size-m)',
        lineHeight: 'var(--ss-typography-semantic-line-height-xs)',
        letterSpacing: '0px',
        paragraphSpacing: '0px',
      },
      l: {
        fontFamily: fontFamilies.label,
        fontWeight: 400,
        fontSize: 'var(--ss-typography-semantic-size-l)',
        lineHeight: 'var(--ss-typography-semantic-line-height-m)',
        letterSpacing: '0px',
        paragraphSpacing: '0px',
      },
    },
    semiBold: {
      xl: {
        fontFamily: fontFamilies.label,
        fontWeight: 600,
        fontSize: 'var(--ss-typography-semantic-size-xl)',
        lineHeight: 'var(--ss-typography-semantic-line-height-m)',
        letterSpacing: '0px',
        paragraphSpacing: '0px',
      },
    },
  },
} as const;

export { fontFamilies };
