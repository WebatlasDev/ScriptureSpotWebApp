export const toRgbaOrFallback = (hex: string, alpha: number, fallback: string) => {
  if (typeof hex !== 'string') {
    return fallback;
  }

  const trimmed = hex.trim().replace(/^#/, '');
  if (![3, 6].includes(trimmed.length) || !/^[0-9a-fA-F]+$/.test(trimmed)) {
    return fallback;
  }

  const normalized = trimmed.length === 3
    ? trimmed.split('').map((char) => char + char).join('')
    : trimmed;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  if ([r, g, b].some((value) => Number.isNaN(value))) {
    return fallback;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const hexToRgba = (hex: string, alpha = 1, fallback?: string) => {
  const resolvedFallback = fallback ?? `rgba(255, 255, 255, ${alpha})`;
  return toRgbaOrFallback(hex, alpha, resolvedFallback);
};

export const toHoverColor = (hex: string, alpha = 0.32) => (
  toRgbaOrFallback(hex, alpha, 'rgba(255, 255, 255, 0.25)')
);

export const toIconColor = (hex: string, alpha = 0.9) => (
  toRgbaOrFallback(hex, alpha, 'rgba(255, 255, 255, 0.90)')
);

export const toGlowColor = (hex: string, alpha = 0.15) => (
  toRgbaOrFallback(hex, alpha, 'rgba(255, 255, 255, 0.15)')
);
