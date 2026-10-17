import type { APIRoute, GetStaticPaths } from 'astro';
import process from 'node:process';
import { publishedSources } from '../../published-sources';

// Build-time, read-only text copies of the documentation sources named in each
// component page's resources. The allowlist and sourceHref live in the shared
// published-sources module; this route only serves the published set.

export const prerender = true;

export const getStaticPaths = (() =>
  [...publishedSources.keys()].map(path => ({ params: { path } }))) satisfies GetStaticPaths;

// Pages builds (GENUX_DOCS_PAGES=1) publish these copies: machine home prefixes
// become a portable <workspace> placeholder and credential-shaped text fails the
// build without echoing it. Local builds keep the files verbatim.
const pagesBuild = process.env.GENUX_DOCS_PAGES === '1';
const machineHome = /\/Users\/[^/\s'"`)\]>]*/g;
const credential =
  /-----BEGIN [A-Z ]*PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{20,}|\bAKIA[0-9A-Z]{16}\b|\bsk-[A-Za-z0-9_-]{20,}/;
const publishable = (path: string, text: string) => {
  if (!pagesBuild) return text;
  if (credential.test(text))
    throw new Error(`Refusing to publish ${path}: credential-shaped content`);
  return text.replace(machineHome, '<workspace>');
};

export const GET: APIRoute = async ({ params }) => {
  const path = params.path ?? '';
  const load = publishedSources.get(path);
  if (!load) return new Response('Not found', { status: 404 });
  return new Response(publishable(path, await load()), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
