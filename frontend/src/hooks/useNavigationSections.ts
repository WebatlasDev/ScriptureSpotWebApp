import { useEffect, useMemo, useState } from 'react';
import { env } from '@/types/env';
import { useBibleVersions } from '@/hooks/useBibleVersions';
import { getLastVersion } from '@/utils/localStorageUtils';

export interface NavigationLinkItem {
  label: string;
  route: string;
  description?: string;
  comingSoon?: boolean;
}

export interface NavigationSection {
  label: string;
  items: NavigationLinkItem[];
}

const createSections = (version: string): NavigationSection[] => [
  {
    label: 'Scripture',
    items: [
      {
        label: 'Explore Scripture',
        route: `/${version}/genesis/1/1`,
        description: 'Dive deep into a single verse',
      },
      {
        label: 'Read Bible',
        route: `/${version}/`,
        description: 'Read and study the Bible',
      },
      // {
      //   label: 'Bible Characters',
      //   route: '#',
      //   description: 'Biblical figures and their stories',
      //   comingSoon: true,
      // },
      // {
      //   label: 'Bible Locations',
      //   route: '#',
      //   description: 'Places mentioned in Scripture',
      //   comingSoon: true,
      // },
      // {
      //   label: 'Interlinear',
      //   route: '#',
      //   description: 'Original language study tools',
      //   comingSoon: true,
      // },
    ],
  },
  {
    label: 'Study',
    items: [
      {
        label: 'Commentaries',
        route: '/commentators',
        description: 'Biblical scholars and insights',
      },
      // {
      //   label: 'Bible Book Overviews',
      //   route: '#',
      //   description: 'Summaries of each Bible book',
      //   comingSoon: true,
      // },
      // {
      //   label: 'Church Authors',
      //   route: '#',
      //   description: 'Historical Christian writers',
      //   comingSoon: true,
      // },
      // {
      //   label: 'Devotionals',
      //   route: '#',
      //   description: 'Daily spiritual readings',
      //   comingSoon: true,
      // },
    ],
  },
  {
    label: 'Library',
    items: [
      {
        label: 'My Bookmarks',
        route: '/bookmarks',
        description: 'Saved content and passages',
      },
      // {
      //   label: 'Hymns',
      //   route: '#',
      //   description: 'Sacred music and lyrics',
      //   comingSoon: true,
      // },
      // {
      //   label: 'Creeds & Confessions',
      //   route: '#',
      //   description: 'Historical statements of faith',
      //   comingSoon: true,
      // },
      // {
      //   label: 'Catechisms',
      //   route: '#',
      //   description: 'Teaching documents',
      //   comingSoon: true,
      // },
    ],
  },
];

export const useNavigationSections = () => {
  const { data: versions } = useBibleVersions();
  const [lastVersion, setLastVersion] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const version = getLastVersion();
    if (version) setLastVersion(version);
  }, []);

  const defaultVersion =
    lastVersion ||
    versions?.[0]?.abbreviation?.toLowerCase() ||
    env.defaultVersion;

  return useMemo(() => createSections(defaultVersion), [defaultVersion]);
};
