import type { NextApiRequest, NextApiResponse } from 'next';

type Vocabulary = 'Chronostratigraphy' | 'TectonicUnits' | 'Lithostratigraphy' | 'Lithology';

interface RepoResponse {
  owner: string;
  repoSlug: string;
  releasesHtmlUrl: string;
}

const VOCAB_TO_ENV: Record<Vocabulary, string> = {
  Chronostratigraphy: 'CHRONOSTRATIGRAPHY_REPO_SLUG',
  TectonicUnits: 'TECTONICUNITS_REPO_SLUG',
  Lithostratigraphy: 'LITHOSTRATIGRAPHY_REPO_SLUG',
  Lithology: 'LITHOLOGY_REPO_SLUG',
};


export default function handler(req: NextApiRequest, res: NextApiResponse<RepoResponse | { error: string }>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const vocabulary = req.query.vocabulary as string | undefined;
  if (!vocabulary || typeof vocabulary !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid vocabulary parameter' });
  }

  const allowed: Vocabulary[] = ['Chronostratigraphy', 'TectonicUnits', 'Lithostratigraphy', 'Lithology'];
  if (!allowed.includes(vocabulary as Vocabulary)) {
    return res.status(400).json({ error: 'Unsupported vocabulary' });
  }

  const owner = process.env.GITHUB_OWNER || 'swisstopo';
  const envKey = VOCAB_TO_ENV[vocabulary as Vocabulary];
  const repoSlug = process.env[envKey] || '';

  if (!repoSlug) {
    return res.status(500).json({ error: `Missing repository slug for ${vocabulary}. Please set ${envKey} in environment.` });
  }

  const releasesHtmlUrl = `https://github.com/${owner}/${repoSlug}/releases`;

  return res.status(200).json({ owner, repoSlug, releasesHtmlUrl });
}
