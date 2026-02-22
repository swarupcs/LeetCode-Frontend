import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { HighlightStyle } from '@codemirror/language';

// ─── Theme definitions ───────────────────────────────────────────

export type EditorThemeId =
  | 'algodrill'
  | 'midnight'
  | 'aurora'
  | 'solarized'
  | 'github-light';

export interface EditorThemeMeta {
  id: EditorThemeId;
  label: string;
  dark: boolean;
}

export const editorThemes: EditorThemeMeta[] = [
  { id: 'algodrill', label: 'AlgoDrill', dark: true },
  { id: 'midnight', label: 'Midnight', dark: true },
  { id: 'aurora', label: 'Aurora', dark: true },
  { id: 'solarized', label: 'Solarized', dark: true },
  { id: 'github-light', label: 'GitHub Light', dark: false },
];

// ─── Base theme builder ──────────────────────────────────────────

function makeBaseTheme(
  bg: string,
  fg: string,
  caret: string,
  selection: string,
  gutter: string,
  activeLine: string,
  dark: boolean,
) {
  return EditorView.theme(
    {
      '&': { backgroundColor: bg, color: fg, fontSize: '13px' },
      '.cm-content': {
        caretColor: caret,
        fontFamily: "'JetBrains Mono', monospace",
        padding: '16px 0',
      },
      '.cm-cursor, .cm-dropCursor': { borderLeftColor: caret },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
        { backgroundColor: selection },
      '.cm-panels': { backgroundColor: bg, color: fg },
      '.cm-activeLine': { backgroundColor: activeLine },
      '.cm-gutters': {
        backgroundColor: 'transparent',
        color: gutter,
        border: 'none',
        paddingLeft: '8px',
      },
      '.cm-activeLineGutter': { backgroundColor: 'transparent', color: fg },
      '.cm-foldPlaceholder': {
        backgroundColor: activeLine,
        border: 'none',
        color: gutter,
      },
      '.cm-tooltip': { backgroundColor: bg, border: `1px solid ${gutter}` },
      '.cm-tooltip-autocomplete': {
        '& > ul > li[aria-selected]': { backgroundColor: activeLine },
      },
      '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
        backgroundColor: selection,
      },
      '.cm-searchMatch': {
        backgroundColor: selection,
        outline: `1px solid ${caret}40`,
      },
      '.cm-selectionMatch': { backgroundColor: selection },
    },
    { dark },
  );
}

// ─── AlgoDrill (default) ─────────────────────────────────────────

const algoDrillHighlighting = HighlightStyle.define([
  { tag: t.keyword, color: 'hsl(280, 70%, 70%)' },
  {
    tag: [t.name, t.deleted, t.character, t.macroName],
    color: 'hsl(210, 20%, 90%)',
  },
  { tag: [t.propertyName], color: 'hsl(190, 90%, 60%)' },
  {
    tag: [t.function(t.variableName), t.labelName],
    color: 'hsl(50, 90%, 70%)',
  },
  {
    tag: [t.color, t.constant(t.name), t.standard(t.name)],
    color: 'hsl(190, 90%, 60%)',
  },
  { tag: [t.definition(t.name), t.separator], color: 'hsl(210, 20%, 90%)' },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: 'hsl(30, 90%, 65%)',
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: 'hsl(190, 90%, 60%)',
  },
  {
    tag: [t.meta, t.comment],
    color: 'hsl(215, 12%, 45%)',
    fontStyle: 'italic',
  },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: 'hsl(190, 90%, 60%)', textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: 'hsl(50, 90%, 70%)' },
  {
    tag: [t.atom, t.bool, t.special(t.variableName)],
    color: 'hsl(280, 70%, 70%)',
  },
  {
    tag: [t.processingInstruction, t.string, t.inserted],
    color: 'hsl(160, 70%, 55%)',
  },
  { tag: t.invalid, color: 'hsl(0, 72%, 60%)' },
]);

const algoDrillTheme = makeBaseTheme(
  'transparent',
  'hsl(210,20%,90%)',
  'hsl(160,84%,39%)',
  'hsl(160,84%,39%,0.15)',
  'hsl(215,12%,30%)',
  'hsl(240,10%,11%,0.5)',
  true,
);

// ─── Midnight ────────────────────────────────────────────────────

const midnightHighlighting = HighlightStyle.define([
  { tag: t.keyword, color: '#ff7b72' },
  { tag: [t.name, t.deleted, t.character, t.macroName], color: '#c9d1d9' },
  { tag: [t.propertyName], color: '#79c0ff' },
  { tag: [t.function(t.variableName), t.labelName], color: '#d2a8ff' },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#79c0ff' },
  { tag: [t.definition(t.name), t.separator], color: '#c9d1d9' },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: '#ffa657',
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: '#79c0ff',
  },
  { tag: [t.meta, t.comment], color: '#8b949e', fontStyle: 'italic' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.link, color: '#79c0ff', textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: '#d2a8ff' },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#ff7b72' },
  { tag: [t.processingInstruction, t.string, t.inserted], color: '#a5d6ff' },
  { tag: t.invalid, color: '#f85149' },
]);

const midnightTheme = makeBaseTheme(
  'transparent',
  '#c9d1d9',
  '#58a6ff',
  'rgba(56,139,253,0.15)',
  '#484f58',
  'rgba(110,118,129,0.1)',
  true,
);

// ─── Aurora ──────────────────────────────────────────────────────

const auroraHighlighting = HighlightStyle.define([
  { tag: t.keyword, color: '#c792ea' },
  { tag: [t.name, t.deleted, t.character, t.macroName], color: '#d6deeb' },
  { tag: [t.propertyName], color: '#80cbc4' },
  { tag: [t.function(t.variableName), t.labelName], color: '#82aaff' },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#80cbc4' },
  { tag: [t.definition(t.name), t.separator], color: '#d6deeb' },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: '#f78c6c',
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: '#89ddff',
  },
  { tag: [t.meta, t.comment], color: '#637777', fontStyle: 'italic' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.link, color: '#80cbc4', textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: '#82aaff' },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#ff5874' },
  { tag: [t.processingInstruction, t.string, t.inserted], color: '#ecc48d' },
  { tag: t.invalid, color: '#ef5350' },
]);

const auroraTheme = makeBaseTheme(
  'transparent',
  '#d6deeb',
  '#ffcc00',
  'rgba(29,159,177,0.15)',
  '#4b6479',
  'rgba(1,22,39,0.5)',
  true,
);

// ─── Solarized Dark ─────────────────────────────────────────────

const solarizedHighlighting = HighlightStyle.define([
  { tag: t.keyword, color: '#859900' },
  { tag: [t.name, t.deleted, t.character, t.macroName], color: '#93a1a1' },
  { tag: [t.propertyName], color: '#268bd2' },
  { tag: [t.function(t.variableName), t.labelName], color: '#b58900' },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#2aa198' },
  { tag: [t.definition(t.name), t.separator], color: '#93a1a1' },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: '#cb4b16',
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: '#2aa198',
  },
  { tag: [t.meta, t.comment], color: '#586e75', fontStyle: 'italic' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.link, color: '#268bd2', textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: '#b58900' },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#d33682' },
  { tag: [t.processingInstruction, t.string, t.inserted], color: '#2aa198' },
  { tag: t.invalid, color: '#dc322f' },
]);

const solarizedTheme = makeBaseTheme(
  'transparent',
  '#93a1a1',
  '#268bd2',
  'rgba(38,139,210,0.15)',
  '#586e75',
  'rgba(0,43,54,0.5)',
  true,
);

// ─── GitHub Light ────────────────────────────────────────────────

const githubLightHighlighting = HighlightStyle.define([
  { tag: t.keyword, color: '#cf222e' },
  { tag: [t.name, t.deleted, t.character, t.macroName], color: '#24292f' },
  { tag: [t.propertyName], color: '#0550ae' },
  { tag: [t.function(t.variableName), t.labelName], color: '#8250df' },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#0550ae' },
  { tag: [t.definition(t.name), t.separator], color: '#24292f' },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: '#0550ae',
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: '#0550ae',
  },
  { tag: [t.meta, t.comment], color: '#6e7781', fontStyle: 'italic' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.link, color: '#0550ae', textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: '#0550ae' },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#0550ae' },
  { tag: [t.processingInstruction, t.string, t.inserted], color: '#0a3069' },
  { tag: t.invalid, color: '#82071e' },
]);

const githubLightTheme = makeBaseTheme(
  'transparent',
  '#24292f',
  '#0969da',
  'rgba(9,105,218,0.12)',
  '#8c959f',
  'rgba(234,238,242,0.5)',
  false,
);

// ─── Theme resolver ──────────────────────────────────────────────

export function resolveTheme(id: EditorThemeId) {
  switch (id) {
    case 'midnight':
      return { theme: midnightTheme, highlighting: midnightHighlighting };
    case 'aurora':
      return { theme: auroraTheme, highlighting: auroraHighlighting };
    case 'solarized':
      return { theme: solarizedTheme, highlighting: solarizedHighlighting };
    case 'github-light':
      return { theme: githubLightTheme, highlighting: githubLightHighlighting };
    case 'algodrill':
    default:
      return { theme: algoDrillTheme, highlighting: algoDrillHighlighting };
  }
}
