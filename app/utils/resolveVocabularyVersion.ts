import { fetchLatestReleaseLine } from '@/app/utils/githubRelease';

export async function resolveVocabularyVersion(vocabulary: 'Chronostratigraphy' | 'TectonicUnits' | 'Lithostratigraphy' | 'Lithology'): Promise<string> {
  try {
    const cfgRes = await fetch(`/api/githubRepo?vocabulary=${encodeURIComponent(vocabulary)}`);
    if (!cfgRes.ok) {
      return `Release: data non presente - ${vocabulary}`;
    }
    const cfg = await cfgRes.json();
    const line = await fetchLatestReleaseLine({ owner: cfg.owner, repo: cfg.repoSlug });
    return line ?? cfg.releasesHtmlUrl;
  } catch {
    return `Release: data non presente - ${vocabulary}`;
  }
}

