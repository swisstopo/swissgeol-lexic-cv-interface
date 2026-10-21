import type { VocabularyConcept, VocabularyConcepts } from '../models/vocabularyConcepts';

export const getEnglishLabel = (label: string) => {
  if (!label) return label;
  const english = label.split(",").map(part => part.trim()).find(part => /\(en\)/i.test(part));
  return english ? english.replace(/\(en\)/i, "").trim() : label;
};

const compareLabels = (a: { label: string }, b: { label: string }) =>
  a.label.localeCompare(b.label, 'en', { sensitivity: 'base', numeric: true });

/**
 * Converts the API response (URI -> label) into links for Explore Concepts.
 * The API has already selected the vocabulary's repository. Keep its labels
 * and build links to the existing term pages; no client-side filtering is needed.
 */
export function mapVocabularyConcepts(allConceptMap: Record<string, string>, vocabulary: string): VocabularyConcepts {
  const concepts = Object.entries(allConceptMap)
    .map(([uri, label]) => ({
      uri, label, href: `/${vocabulary}/${encodeURIComponent(uri.slice(uri.lastIndexOf('/') + 1))}`,
    }));
  return { concepts: concepts.sort(compareLabels) };
}

/**
 * Uses the term page's API to list its direct Narrowers and the selected concept.
 * Labels come from the same English label map used by the term page.
 */
export async function getNarrowerConcepts(
  vocabulary: string,
  concept: VocabularyConcept,
  signal?: AbortSignal,
): Promise<VocabularyConcepts> {
  const term = concept.uri.slice(concept.uri.lastIndexOf('/') + 1);
  const response = await fetch(`/api/dbQueryTerms?vocabulary=${encodeURIComponent(vocabulary)}&term=${encodeURIComponent(term)}`, { signal });
  if (!response.ok) throw new Error('Could not load narrowers. Please try again.');
  const { termData, allConceptMap }: {
    termData: { relatedTerms: { Narrower: string[] } };
    allConceptMap: Record<string, string>;
  } = await response.json();

  const labels = Object.fromEntries(termData.relatedTerms.Narrower.map(uri => [uri, allConceptMap[uri] || uri]));
  labels[concept.uri] = concept.label;
  return mapVocabularyConcepts(labels, vocabulary);
}

/**
 * Builds the alphabetical sections and available letters for Explore Concepts.
 * Accented initials share the same section (e.g. E and É); other initials use #.
 */
export function groupConcepts(concepts: VocabularyConcept[]): [string, VocabularyConcept[]][] {
  const groups = new Map<string, VocabularyConcept[]>();
  for (const concept of [...concepts].sort(compareLabels)) {
    const initial = concept.label.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').charAt(0).toUpperCase();
    const letter = /^[A-Z]$/.test(initial) ? initial : '#';
    groups.set(letter, [...(groups.get(letter) ?? []), concept]);
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b, 'en'));
}
