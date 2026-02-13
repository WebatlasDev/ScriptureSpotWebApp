export function hexToRgb(hex: string): string {
  if (!hex) {
    return '0, 0, 0';
  }

  let sanitized = hex.trim();
  if (sanitized.startsWith('#')) {
    sanitized = sanitized.slice(1);
  }

  if (sanitized.length !== 6 || /[^0-9a-fA-F]/.test(sanitized)) {
    return '0, 0, 0';
  }

  const r = parseInt(sanitized.slice(0, 2), 16);
  const g = parseInt(sanitized.slice(2, 4), 16);
  const b = parseInt(sanitized.slice(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}
