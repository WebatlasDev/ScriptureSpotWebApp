export type DeviceScopedAdSlot = {
  readonly desktop?: string;
  readonly mobile?: string;
  readonly default?: string;
};

const AD_SLOTS = {
  SIDEBAR_VERTICAL: {
    desktop: '5822007276',
    mobile: '5822007276',
  },
  SIDEBAR_COMMENTARY_STICKY: {
    desktop: '4783628821',
  },
  VERSE_PAGE_HORIZONTAL_TOP: {
    desktop: '1786667147',
    mobile: '5244364727',
  },
  VERSE_PAGE_HORIZONTAL_BOTTOM: {
    desktop: '1786667147',
    mobile: '5244364727',
  },
  MODAL_VERTICAL_LEFT: {
    desktop: '1882762263',
  },
  MODAL_VERTICAL_RIGHT: {
    desktop: '6620191423',
  },
  CONTENT_RESPONSIVE: {
    desktop: '6808743744',
    mobile: '9486877978',
  },
  COMMENTARY_RESPONSIVE: {
    desktop: '6808743744',
    mobile: '9486877978',
  },
  STRONGS_LEXICON_MOBILE: {
    mobile: '9486877978',
    default: '9486877978',
  },
} as const satisfies Record<string, DeviceScopedAdSlot>;

// Google AdSense Configuration
export const AD_CONFIG = {
  // Publisher ID used throughout the application (mirrors public/ads.txt)
  PUBLISHER_ID: 'ca-pub-5189192546187755',
  
  // Ad slot IDs - Replace with your actual ad slot IDs
  AD_SLOTS,
  
  // Responsive breakpoints
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
  },
  
  // Ad sizes for different placements
  AD_SIZES: {
    SIDEBAR_VERTICAL: {
      mobile: [160, 600],
      desktop: [160, 600],
    },
    SIDEBAR_COMMENTARY_STICKY: {
      desktop: [300, 600],
    },
    SKINNY_HORIZONTAL: {
      mobile: [320, 50],
      desktop: [728, 90],
    },
    RESPONSIVE_SQUARE: {
      mobile: [300, 250],
      desktop: [336, 280],
    },
    MODAL_VERTICAL: {
      desktop: [160, 600],
    },
  },
  
  // Content ad placement rules
  CONTENT_AD_RULES: {
    MIN_PARAGRAPH_WORDS: 15,
    PARAGRAPH_POSITIONS: [2, 6, 10, 20], // After these paragraph numbers
    MIN_DISTANCE_FROM_END: 1, // Don't place ad if within 1 paragraph of end
  },
  
  // Support page URL for "Remove ads" link
  SUPPORT_URL: '/support',
} as const;

export type AdSlotId = keyof typeof AD_CONFIG.AD_SLOTS;
export type AdSize = keyof typeof AD_CONFIG.AD_SIZES;
