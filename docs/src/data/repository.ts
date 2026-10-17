// Shared build-time repository metadata; independent of component-page browser controllers.
function repository(raw: unknown): string | undefined {
  let url: URL;
  try {
    url = new URL(String(raw));
  } catch {
    return undefined;
  }
  const parts = url.pathname.split('/').filter(Boolean);
  return url.protocol === 'https:' && url.hostname === 'github.com' && parts.length === 2
    ? `${url.origin}/${parts.join('/')}`
    : undefined;
}
// Edit links need a well-formed ref: slash-separated segments of letters, digits, `_`, `.` and
// `-`, none starting with `.` or `-`, holding `..` or ending in `.` or `.lock`.
const branchSegment = /^[A-Za-z0-9_][A-Za-z0-9_.-]*$/;
const validSegment = (part: string) =>
  branchSegment.test(part) && !part.includes('..') && !/[.](lock)?$/.test(part);
function branch(raw: unknown): string | undefined {
  const name = typeof raw === 'string' ? raw.trim() : '';
  return name.split('/').every(validSegment) ? name : undefined;
}
/** Public repository for edit, issue, GitHub and clone links: the canonical GenUX repository
 * and its main branch unless a valid PUBLIC_GENUX_REPOSITORY_* override replaces them. */
export const repositoryUrl: string =
  repository(import.meta.env.PUBLIC_GENUX_REPOSITORY_URL) ?? 'https://github.com/atonota/genux';
export const repositoryBranch: string =
  branch(import.meta.env.PUBLIC_GENUX_REPOSITORY_BRANCH) ?? 'main';
