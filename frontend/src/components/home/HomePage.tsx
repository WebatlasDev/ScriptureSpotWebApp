"use client";

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Link from 'next/link';
import { useBibleVersions } from '@/hooks/useBibleVersions';
import FeatureCard from "./FeatureCard";
import { env } from '@/types/env';
import { getLastVersion } from '@/utils/localStorageUtils';

interface LastVerse {
  path: string;
  reference: string;
}

interface LastPage {
  path: string;
  reference?: string;
}

export default function HomePage({
  initialPath,
  initialVerse,
}: {
  initialPath: string | null;
  initialVerse?: { text: string; reference: string } | null;
}) {
  const [lastVerse, setLastVerse] = useState<LastVerse | null>(null);
  const [lastPage, setLastPage] = useState<LastPage | null>(null);
  const [lastVersion, setLastVersion] = useState<string | null>(null);
  const [verseOfTheDay, setVerseOfTheDay] = useState<{ text: string; reference: string } | null>(initialVerse || null);
  const theme = useTheme();
  const { data: versions } = useBibleVersions();

  const defaultVersion =
    lastVersion ||
    versions?.[0]?.abbreviation?.toLowerCase() ||
    env.defaultVersion;

  const getVersePath = (reference: string) => {
    const parts = reference.split(' ');
    const versePart = parts.pop() || '';
    const book = parts.join(' ');
    const [chapter, verseRange] = versePart.split(':');
    const verse = verseRange?.split(/[-–]/)[0] || '1';
    let bookSlug = book.toLowerCase().replace(/\s+/g, '-');

    if (bookSlug === "psalm"){
      bookSlug = "psalms"
    }
    
    return `/${defaultVersion.toLowerCase()}/${bookSlug.toLowerCase()}/${chapter}/${verse}`;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const version = getLastVersion();
      if (version) {
        setLastVersion(version);
      }
      const storedVerse = localStorage.getItem("lastVerse");
      if (storedVerse) {
        try {
          const parsed = JSON.parse(storedVerse);
          setLastVerse(parsed);
        } catch {
          setLastVerse(null);
        }
      }

      const storedPage = localStorage.getItem("lastPage");
      if (storedPage) {
        try {
          const parsed = JSON.parse(storedPage);
          setLastPage(parsed);
        } catch {
          setLastPage(null);
        }
      } else if (initialPath) {
        setLastPage({ path: initialPath });
      }
    }
  }, [initialPath]);

  useEffect(() => {
    if (verseOfTheDay) return;
    const fetchVerse = async () => {
      try {
        const res = await fetch('/api/verseOfTheDay');
        if (!res.ok) return;
        const details = await res.json();
        if (details?.text && details?.reference) {
          setVerseOfTheDay({ text: details.text, reference: details.reference });
        }
      } catch {
        // ignore errors
      }
    };
    fetchVerse();
  }, [verseOfTheDay]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        py: 4,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          borderRadius: 4.5,
          outline: `2px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
          outlineOffset: "-2px",
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h1" sx={{ color: "white" }}>
          Welcome to Scripture Spot
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
          Explore Biblical commentaries, devotionals, and more to deepen your
          understanding of God's Word.
        </Typography>
        {verseOfTheDay && (
          <Box sx={{ mt: 2 }}>
            <Link href={getVersePath(verseOfTheDay.reference)} style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'text.primary', fontStyle: 'italic', cursor: 'pointer' }}>
                "{verseOfTheDay.text}"
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {verseOfTheDay.reference}
              </Typography>
            </Link>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {lastVerse?.path && (
          <FeatureCard
            title="Continue Reading"
            description={`Resume from ${lastVerse.reference}`}
            href={lastVerse.path}
            gradient="linear-gradient(75deg, #278EFF 0%, #099232 100%)"
            cta="Continue"
          />
        )}
        {lastPage?.path && (
          <FeatureCard
            title="Resume Activity"
            description="Return to your last visited page"
            href={lastPage.path}
            gradient="linear-gradient(70deg, #ED27FF 0%, #164880 100%)"
            cta="Open"
          />
        )}
        {!lastVerse?.path && (
          <FeatureCard
            title="Explore the Bible"
            description="Begin reading in Genesis"
            href={`/${defaultVersion}/genesis/1/1`}
            gradient="linear-gradient(90deg, rgba(34,143,220,0.2) 0%, #009A38 100%)"
            cta="Start"
          />
        )}
        <FeatureCard
          title="Study Plans"
          description="Track your progress with curated plans"
          href="/study-plans"
          gradient="linear-gradient(222deg, rgba(38,142,244,0.7) 0%, rgba(1,152,58,0.07) 100%)"
          cta="Explore"
        />
        <FeatureCard
          title="Browse Commentaries"
          description="Dive into trusted commentary resources"
          href="/commentators"
          gradient="linear-gradient(46deg, #ED27FF 0%, #164880 100%)"
          cta="Browse"
        />
      </Box>
    </Box>
  );
}
