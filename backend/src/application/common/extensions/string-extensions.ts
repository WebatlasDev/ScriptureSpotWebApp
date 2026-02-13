/**
 * String utility functions
 * Converted from C# StringExtensions.cs
 */

/**
 * Adds backticks around the column name for SQL queries
 */
export function addBackTicks(column: string): string {
  const index = column.lastIndexOf('.');
  return index !== -1
    ? column.substring(0, index) + `.\`${column.substring(index + 1)}\``
    : `\`${column}\``;
}

/**
 * Normalizes Unicode replacement characters (U+FFFD) to appropriate characters
 * Converts replacement characters to em-dashes or apostrophes based on context
 */
export function normalizeUnicodeReplacementCharacters(value: string | null | undefined): string | null {
  if (!value) {
    return value ?? null;
  }

  if (value.indexOf('\uFFFD') === -1) {
    return value;
  }

  const builder: string[] = [];
  let index = 0;

  while (index < value.length) {
    const current = value[index];
    if (current !== '\uFFFD') {
      builder.push(current);
      index++;
      continue;
    }

    // Skip consecutive replacement characters
    while (index < value.length && value[index] === '\uFFFD') {
      index++;
    }

    const replacement = determineReplacementCharacter(builder, value, index);
    builder.push(replacement);
  }

  return builder.join('');
}

/**
 * Common apostrophe suffixes used in contractions
 */
const APOSTROPHE_SUFFIXES = [
  's',
  'd',
  'm',
  't',
  'll',
  're',
  've',
  'em',
  'til',
  'cause',
  'clock',
];

/**
 * Determines whether to use an em-dash or apostrophe based on context
 */
function determineReplacementCharacter(
  builder: string[],
  original: string,
  nextIndex: number
): string {
  const previousChar = builder.length > 0 ? builder[builder.length - 1] : '\0';
  const previousPreviousChar = builder.length > 1 ? builder[builder.length - 2] : '\0';
  const nextChar = nextIndex < original.length ? original[nextIndex] : '\0';
  const nextNextChar = nextIndex + 1 < original.length ? original[nextIndex + 1] : '\0';

  const previousIsLetterOrDigit = isLetterOrDigit(previousChar);
  const nextIsLetterOrDigit = isLetterOrDigit(nextChar);

  // Em-dash cases
  if (isSpacingCharacter(previousChar) && isSpacingCharacter(nextChar)) {
    return '—';
  }

  if (isSpacingCharacter(previousChar)) {
    return '—';
  }

  if (!previousIsLetterOrDigit && !nextIsLetterOrDigit) {
    return '—';
  }

  if (!previousIsLetterOrDigit) {
    return '—';
  }

  // Apostrophe at end of word
  if (!nextIsLetterOrDigit) {
    if (previousChar.toLowerCase() === 's') {
      return "'";
    }
    return "'";
  }

  // Check if it's likely an apostrophe (contractions, possessives)
  if (
    isLikelyApostropheUsage(
      builder,
      original,
      nextIndex,
      previousChar,
      previousPreviousChar,
      nextChar,
      nextNextChar
    )
  ) {
    return "'";
  }

  return '—';
}

/**
 * Checks if character is whitespace or punctuation that acts as spacing
 */
function isSpacingCharacter(value: string): boolean {
  if (value === '\0' || !value) return true;
  if (/\s/.test(value)) return true;
  return ['-', '–', '—', ',', ';', ':', '.', '!', '?', '(', ')', '"', "'"].includes(value);
}

/**
 * Determines if the replacement character is likely an apostrophe based on context
 */
function isLikelyApostropheUsage(
  builder: string[],
  original: string,
  nextIndex: number,
  previousChar: string,
  previousPreviousChar: string,
  nextChar: string,
  nextNextChar: string
): boolean {
  // Single letter before uppercase (e.g., "I'M")
  if (isLetter(previousChar) && isLetter(nextChar)) {
    const previousIsStandalonePrefix =
      builder.length === 1 || !isLetter(previousPreviousChar);
    if (previousIsStandalonePrefix && isUpperCase(nextChar)) {
      return true;
    }
  }

  // Check for common contractions
  const followingToken = extractFollowingAlphaNumeric(original, nextIndex, 6);
  if (followingToken.length > 0) {
    const lowerFollowing = followingToken.toLowerCase();
    for (const suffix of APOSTROPHE_SUFFIXES) {
      if (
        lowerFollowing.startsWith(suffix) &&
        !hasLetterOrDigit(original, nextIndex + suffix.length)
      ) {
        return true;
      }
    }

    // Single 't' (e.g., "don't")
    if (lowerFollowing.length === 1 && lowerFollowing[0] === 't') {
      if (!hasLetterOrDigit(original, nextIndex + 1)) {
        return true;
      }
    }
  }

  // Possessive 's' or plural possessive (e.g., "James'", "students'")
  if (previousChar.toLowerCase() === 's') {
    if (!hasLetterOrDigit(original, nextIndex)) {
      return true;
    }

    if (
      followingToken.toLowerCase().startsWith('s') &&
      !hasLetterOrDigit(original, nextIndex + 1)
    ) {
      return true;
    }
  }

  // "n't" contraction (e.g., "don't", "can't")
  if (
    previousChar.toLowerCase() === 'n' &&
    nextChar.toLowerCase() === 't' &&
    !isLetterOrDigit(nextNextChar)
  ) {
    return true;
  }

  // "o'clock"
  if (
    previousChar.toLowerCase() === 'o' &&
    followingToken.toLowerCase().startsWith('clock')
  ) {
    return true;
  }

  return false;
}

/**
 * Extracts alphanumeric characters starting from index up to maxLength
 */
function extractFollowingAlphaNumeric(
  value: string,
  startIndex: number,
  maxLength: number
): string {
  const chars: string[] = [];
  let index = startIndex;

  while (index < value.length && chars.length < maxLength) {
    const current = value[index];
    if (!isLetterOrDigit(current)) {
      break;
    }
    chars.push(current);
    index++;
  }

  return chars.join('');
}

/**
 * Checks if the character at index is a letter or digit
 */
function hasLetterOrDigit(value: string, index: number): boolean {
  return index < value.length && isLetterOrDigit(value[index]);
}

/**
 * Checks if character is a letter or digit
 */
function isLetterOrDigit(char: string): boolean {
  if (!char || char === '\0') return false;
  return /[a-zA-Z0-9]/.test(char);
}

/**
 * Checks if character is a letter
 */
function isLetter(char: string): boolean {
  if (!char || char === '\0') return false;
  return /[a-zA-Z]/.test(char);
}

/**
 * Checks if character is uppercase
 */
function isUpperCase(char: string): boolean {
  if (!char || char === '\0') return false;
  return /[A-Z]/.test(char);
}
