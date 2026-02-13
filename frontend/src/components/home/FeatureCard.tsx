import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  gradient: string;
  cta?: string;
}

export default function FeatureCard({
  title,
  description,
  href,
  gradient,
  cta = "Go",
}: FeatureCardProps) {
  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#1A1A1A",
        borderRadius: 4.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        flexGrow: 1,
        minWidth: 240,
      }}
    >
      <Typography variant="h3" sx={{ color: "text.primary" }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {description}
      </Typography>
      <Link
        href={href}
        passHref
        style={{ textDecoration: "none", marginTop: "auto" }}
      >
        <Button
          variant="contained"
          sx={{
            mt: 1,
            backgroundImage: gradient,
            color: "white",
            fontWeight: 700,
            "&:hover": {
              opacity: 0.85,
              backgroundImage: gradient,
            },
          }}
        >
          {cta}
        </Button>
      </Link>
    </Box>
  );
}
