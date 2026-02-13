export function getOrdinalSuffix(value: number): string {
  const absoluteValue = Math.abs(value);
  const lastTwoDigits = absoluteValue % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th';
  }

  switch (absoluteValue % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatCenturyFromYear(year?: number | null): string {
  if (!year) {
    return '';
  }

  const century = Math.ceil(year / 100);
  return `${century}${getOrdinalSuffix(century)} Century`;
}
