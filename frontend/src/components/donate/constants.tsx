import React from 'react';
import {
  alpha
} from '@mui/material';
import { TranslateIcon } from '@/components/ui/phosphor-icons';
import { RateReviewIcon } from '@/components/ui/phosphor-icons';
import { PeopleAltIcon } from '@/components/ui/phosphor-icons';

export const PRIMARY_GOLD = '#FFD700';
export const HOVER_GOLD = '#FFE066';
export const TEXT_ON_GOLD = '#000000';
export const SUBDUED_GOLD_TEXT = alpha(PRIMARY_GOLD, 0.85);
export const SUBDUED_GOLD_BG_ICON = alpha(PRIMARY_GOLD, 0.1);
export const DISABLED_GOLD_BG = alpha(PRIMARY_GOLD, 0.3);
export const DISABLED_GOLD_TEXT = alpha(TEXT_ON_GOLD, 0.5);
export const OUTLINED_GOLD_HOVER_BG = alpha(PRIMARY_GOLD, 0.08);

// Purple gradient colors for Supporter tier
export const SUPPORTER_PRIMARY = '#F801C9';
export const SUPPORTER_SECONDARY = '#CF01B7';
export const SUPPORTER_GRADIENT = 'linear-gradient(135deg, #CF01B7 0%, #F801C9 100%)';

export const CARD_DEFAULT_BG = '#1A1A1A';
export const CARD_HOVER_BG = '#242424';
export const STAT_CARD_DEFAULT_BG = '#1F1F1F';
export const STAT_CARD_HOVER_BG = '#2A2A2A';

export const impactStats = [
  { id: 'words', icon: <TranslateIcon />, label: 'Words Modernized', current: 10000000, goal: 50000000, unit: 'words', formatValue: (val: number) => `${(val / 1000000).toFixed(0)}M` },
  { id: 'commentaries', icon: <RateReviewIcon />, label: 'Unique Commentaries', current: 116000, goal: 250000, unit: 'entries', formatValue: (val: number) => `${(val / 1000).toFixed(0)}k` },
  { id: 'authors', icon: <PeopleAltIcon />, label: 'Theologians Added', current: 19, goal: 50, unit: 'authors', formatValue: (val: number) => `${val}` },
];

export const integratedBooks = [
  { title: 'City of God', author: 'Augustine' },
  { title: 'Summa Theologica', author: 'Thomas Aquinas' },
  { title: 'The Existence and Attributes of God', author: 'Stephen Charnock' },
];
