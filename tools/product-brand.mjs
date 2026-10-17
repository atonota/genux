import { posix } from 'node:path';

/** Permanent product identity. Changes require a new direct human decision. */
export const PRODUCT_BRAND = Object.freeze({
  slug: 'genux',
  code: 'GenUX',
  wordmark: 'Gen UX',
  immutable: true,
});

// Detect retired namespace tokens and camel-case identifiers, not substrings of ordinary words.
const oldWord = String.fromCharCode(97, 116, 108, 97, 115);
const oldCode = String.fromCharCode(103, 101, 110, 117, 105);
const casePattern = text => [...text].map(letter => `[${letter}${letter.toUpperCase()}]`).join('');
const tokenEnd = '(?=$|[^\\p{L}\\p{N}$]|[A-Z])';
const retiredProduct = new RegExp(
  `(?:(?:^|[^\\p{L}\\p{N}$])(?:${casePattern(oldWord)}|${casePattern(oldCode)})|${oldWord[0].toUpperCase() + oldWord.slice(1)}|${oldCode.slice(0, 1).toUpperCase() + oldCode.slice(1, 3) + oldCode.slice(3).toUpperCase()})${tokenEnd}|(?:^|[^\\p{L}\\p{N}$])${casePattern('gen')}[\\s_-]+${casePattern('ui')}(?![\\p{L}\\p{N}$])`,
  'mu',
);
// These complete phrases describe a third-party service or graphics concept, never product aliases.
const ordinaryProvenance = new RegExp(
  `(?:MongoDB\\s+${oldWord}|(?:texture|sprite)[\\s_-]+${oldWord})(?![\\p{ID_Continue}$])`,
  'giu',
);
const ordinaryWord = /(?<![\p{L}\p{N}])(?:genuine(?:ly)?|ingenuity)(?![\p{L}\p{N}])/giu;
const hasRetiredProduct = text =>
  retiredProduct.test(text.replace(ordinaryWord, '').replace(ordinaryProvenance, ''));
const protectedPaths = new Set([
  'docs/decisions/current.json',
  'tools/docs-decisions.mjs',
  'tools/product-brand.mjs',
]);

export function isProtectedProductPath(path) {
  return protectedPaths.has(posix.normalize(path.normalize('NFKC')).toLowerCase());
}

// Exact native output layouts classify data records, never arbitrary workflow/configuration templates.
// Native author outputs contain quoted source preimages; their proposed source is checked at admission.
const nativeJob = 'genux-feature-[0-9]{8}-[a-z0-9-]+-(?:0[1-9]|[1-9][0-9])';
const nativeRecord = new RegExp(
  `^(?:evidence/proposals/${nativeJob}\\.json|state/(?:${nativeJob}|codex-genux-[a-z0-9-]+)/(?:proposal\\.json|answer\\.json|stdout\\.json|stderr\\.txt|prompt\\.md))$`,
);
export function isHistoricalProductArtifact(path) {
  return (
    !path.split('/').some(part => !part || part === '.' || part === '..') && nativeRecord.test(path)
  );
}

export function productBrandViolations(path, content) {
  const violations = [];
  if (hasRetiredProduct(path)) violations.push(`${path}: retired product name in source path.`);
  if (hasRetiredProduct(content))
    violations.push(`${path}: retired product name in source content.`);
  return violations;
}

export function assertProductBrandSource(path, content) {
  const violations = productBrandViolations(path, content);
  if (violations.length) {
    const error = new Error(violations.join('\n'));
    error.code = 'PRODUCT_BRAND';
    throw error;
  }
}
