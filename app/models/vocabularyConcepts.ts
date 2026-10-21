export interface VocabularyConcept {
  uri: string;
  label: string;
  href: string;
}

export interface VocabularyConcepts {
  concepts: VocabularyConcept[];
}