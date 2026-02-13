# Design Tokens Generation

This folder contains generated design tokens and the CSS variables that power the UI.
Do not edit the generated files directly.

## Source of truth

Tokens are generated from the Figma variables export JSON.
Current input file: `ss_ds_export_1_12_26.json` (project root).

If you move or rename the export, pass a custom input path.

## Generate tokens

```bash
npm run tokens:build
```

Optional flags:

```bash
node scripts/generate-design-tokens.js \
  --input ss_ds_export_1_12_26.json \
  --out-dir src/design-tokens \
  --mode "Mode 1" \
  --css-prefix ss
```

## Outputs

- `src/design-tokens/tokens.json`: canonical, W3C-style token tree.
- `src/design-tokens/tokens.ts`: typed export of `tokens.json`.
- `src/design-tokens/tokens.css`: CSS variables (`--ss-*`).

The CSS variables are imported in `src/styles/globals.css`.

## Naming + mappings

Figma collections are mapped into a normalized token tree:

- `Author Colors` → `color.author.*`
- `Color Scheme / Base` → `color.base.*`
- `Color Scheme / Semantic` → `color.semantic.*`
- `Radius / Base` → `radius.base.*`
- `Radius / Semantic` → `radius.semantic.*`
- `Spacing / Base` → `spacing.base.*`
- `Spacing / Semantic` → `spacing.semantic.*`
- `Typography / Base` → `typography.base.*`
- `Typography / Semantic` → `typography.semantic.*`

Aliases (e.g. `{Primary.400}`) are rewritten to the normalized form
and emitted as CSS variable references.

## Units + types

- Figma `color` → token type `color`
- Figma `float` → token type `dimension`
- CSS output converts `dimension` values to `px`
- JSON/TS keep raw numeric values for dimensions

## Updating tokens

1. Export variables from Figma.
2. Replace the JSON file (or update the input path).
3. Run `npm run tokens:build`.
4. Use tokens in code via CSS variables or `tokens.ts`.

## Manual text styles

Text styles are intentionally kept manual for now.
See `src/styles/textStyles.ts` for the current style map and
`src/theme.ts` for how those styles are mapped to MUI variants.

If you update text styles in Figma:

1. Update `src/styles/textStyles.ts` manually.
2. Adjust `src/theme.ts` variant mapping if needed.
