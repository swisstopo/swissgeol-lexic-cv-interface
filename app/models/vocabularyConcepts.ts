export interface VocabularyConcept {
  uri: string;
  label: string;
  href: string;
}

export interface VocabularyConcepts {
  concepts: VocabularyConcept[];
}

export type VocabularyConceptLabels = Record<string, Partial<Record<'de' | 'fr' | 'it' | 'en', string>>>;
