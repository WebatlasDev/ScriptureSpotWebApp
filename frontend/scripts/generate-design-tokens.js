#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

const getArgValue = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};

const inputPath = getArgValue('--input') ?? args[0] ?? 'ss_ds_export_1_12_26.json';
const outputDir = getArgValue('--out-dir') ?? 'src/design-tokens';
const modeOverride = getArgValue('--mode');
const cssPrefix = getArgValue('--css-prefix') ?? 'ss';

const GROUP_MAP = {
  'Author Colors': { path: ['color', 'author'], type: 'color' },
  'Color Scheme / Base': { path: ['color', 'base'], type: 'color' },
  'Color Scheme / Semantic': { path: ['color', 'semantic'], type: 'color' },
  'Radius / Base': { path: ['radius', 'base'], type: 'dimension' },
  'Radius / Semantic': { path: ['radius', 'semantic'], type: 'dimension' },
  'Spacing / Base': { path: ['spacing', 'base'], type: 'dimension' },
  'Spacing / Semantic': { path: ['spacing', 'semantic'], type: 'dimension' },
  'Typography / Base': { path: ['typography', 'base'], type: 'dimension' },
  'Typography / Semantic': { path: ['typography', 'semantic'], type: 'dimension' },
};

const TYPE_MAP = {
  color: 'color',
  float: 'dimension',
  string: 'string',
  integer: 'number',
  number: 'number',
};

const isTokenNode = (value) => (
  value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, '$value')
);

const isNumeric = (value) => /^[0-9]+$/.test(value);

const toWords = (raw) => {
  const withSpaces = raw.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return withSpaces.split(/[^a-zA-Z0-9]+/).filter(Boolean);
};

const normalizeKey = (raw) => {
  const trimmed = String(raw).trim();
  if (isNumeric(trimmed)) {
    return trimmed;
  }

  const words = toWords(trimmed);
  if (words.length === 0) {
    return trimmed.toLowerCase();
  }

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
};

const toKebab = (segment) => {
  if (isNumeric(segment)) {
    return segment;
  }

  return String(segment)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
};

const resolveMode = (modes) => {
  if (modeOverride) {
    if (!modes[modeOverride]) {
      throw new Error(`Mode "${modeOverride}" not found. Available modes: ${Object.keys(modes).join(', ')}`);
    }
    return modeOverride;
  }

  const [firstMode] = Object.keys(modes);
  if (!firstMode) {
    throw new Error('No modes found in the Figma export.');
  }
  return firstMode;
};

const resolveAliasValue = (rawValue, collectionName) => {
  if (typeof rawValue !== 'string' || !rawValue.startsWith('{') || !rawValue.endsWith('}')) {
    return rawValue;
  }

  const aliasPath = rawValue.slice(1, -1).split('.').map(normalizeKey);
  const collection = GROUP_MAP[collectionName];

  if (!collection) {
    console.warn(`Unknown collection "${collectionName}" for alias "${rawValue}". Leaving as-is.`);
    return rawValue;
  }

  return `{${collection.path.concat(aliasPath).join('.')}}`;
};

const setDeep = (target, segments, value) => {
  let cursor = target;
  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      cursor[segment] = value;
      return;
    }

    if (!cursor[segment]) {
      cursor[segment] = {};
    }

    cursor = cursor[segment];
  });
};

const compareKeys = (a, b) => {
  const aNumeric = isNumeric(a);
  const bNumeric = isNumeric(b);
  if (aNumeric && bNumeric) {
    return Number(a) - Number(b);
  }
  if (aNumeric) {
    return -1;
  }
  if (bNumeric) {
    return 1;
  }
  return a.localeCompare(b);
};

const sortObject = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (!value || typeof value !== 'object') {
    return value;
  }

  const sorted = {};
  Object.keys(value)
    .sort(compareKeys)
    .forEach((key) => {
      sorted[key] = sortObject(value[key]);
    });
  return sorted;
};

const flattenTokens = (value, pathSegments = [], entries = []) => {
  if (isTokenNode(value)) {
    entries.push({ pathSegments, token: value });
    return entries;
  }

  if (!value || typeof value !== 'object') {
    return entries;
  }

  Object.keys(value)
    .sort(compareKeys)
    .forEach((key) => {
      if (key.startsWith('$')) {
        return;
      }
      flattenTokens(value[key], pathSegments.concat([key]), entries);
    });

  return entries;
};

const buildCssValue = (token) => {
  const { $value: value, $type: type } = token;

  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const aliasSegments = value.slice(1, -1).split('.');
    const cssVar = `--${[cssPrefix].concat(aliasSegments.map(toKebab)).join('-')}`;
    return `var(${cssVar})`;
  }

  if (type === 'dimension' && typeof value === 'number') {
    return `${value}px`;
  }

  return String(value);
};

const buildCss = (tokens) => {
  const lines = ['/* Generated by scripts/generate-design-tokens.js. Do not edit directly. */', ':root {'];
  const entries = flattenTokens(tokens);
  entries
    .map(({ pathSegments, token }) => ({
      name: `--${[cssPrefix].concat(pathSegments.map(toKebab)).join('-')}`,
      value: buildCssValue(token),
    }))
    .forEach(({ name, value }) => {
      lines.push(`  ${name}: ${value};`);
    });
  lines.push('}');
  return `${lines.join('\n')}\n`;
};

const buildTokens = (input) => {
  const tokens = {};

  Object.values(input).forEach((groupNode) => {
    const groupName = Object.keys(groupNode)[0];
    const mapping = GROUP_MAP[groupName];
    if (!mapping) {
      console.warn(`Skipping unknown group "${groupName}".`);
      return;
    }

    const groupData = groupNode[groupName];
    const modeName = resolveMode(groupData.modes);
    const modeData = groupData.modes[modeName];

    const walk = (node, segments) => {
      if (isTokenNode(node)) {
        const type = TYPE_MAP[node.$type] ?? mapping.type ?? node.$type ?? 'unknown';
        const value = resolveAliasValue(node.$value, node.$collectionName);
        setDeep(tokens, segments, { $type: type, $value: value });
        return;
      }

      if (!node || typeof node !== 'object') {
        return;
      }

      Object.keys(node).forEach((key) => {
        if (key.startsWith('$')) {
          return;
        }
        walk(node[key], segments.concat([normalizeKey(key)]));
      });
    };

    walk(modeData, mapping.path);
  });

  return tokens;
};

const readInput = () => {
  const resolvedPath = path.resolve(inputPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Input file not found: ${resolvedPath}`);
  }
  const raw = fs.readFileSync(resolvedPath, 'utf8');
  return JSON.parse(raw);
};

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const writeOutputs = (tokens) => {
  const sortedTokens = sortObject(tokens);
  const resolvedOutDir = path.resolve(outputDir);
  ensureDir(resolvedOutDir);

  const jsonOutput = `${JSON.stringify(sortedTokens, null, 2)}\n`;
  fs.writeFileSync(path.join(resolvedOutDir, 'tokens.json'), jsonOutput);

  const tsOutput = [
    '// Generated by scripts/generate-design-tokens.js. Do not edit directly.',
    'export const tokens = ' + JSON.stringify(sortedTokens, null, 2) + ' as const;',
    'export type Tokens = typeof tokens;',
    'export default tokens;',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(resolvedOutDir, 'tokens.ts'), tsOutput);

  const cssOutput = buildCss(sortedTokens);
  fs.writeFileSync(path.join(resolvedOutDir, 'tokens.css'), cssOutput);

  console.log(`Tokens generated in ${resolvedOutDir}`);
};

try {
  const input = readInput();
  const tokens = buildTokens(input);
  writeOutputs(tokens);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
