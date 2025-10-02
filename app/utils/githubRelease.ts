export interface GitHubRepo {
  owner: string;
  repo: string;
}

export const GITHUB_API_BASE = 'https://api.github.com';

async function getJson<T = any>(url: string): Promise<T | null> {
  try {
    const resp = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!resp.ok) return null;
    return (await resp.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchLatestReleaseLine({ owner, repo }: GitHubRepo): Promise<string | null> {
  // Use releases endpoint and pick the first (most recent) release
  const releases = await getJson<any[]>(`${GITHUB_API_BASE}/repos/${owner}/${repo}/releases?per_page=1`);
  if (!releases || !Array.isArray(releases) || releases.length === 0) return null;
  const name: string | undefined = releases[0]?.name;
  return name?.trim() || null;
}
