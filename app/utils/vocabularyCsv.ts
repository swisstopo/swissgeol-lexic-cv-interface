import type { VocabularyConcept, VocabularyConceptLabels } from '../models/vocabularyConcepts';

type CsvExportScope =
  | { view: 'all' }
  | { view: 'narrowers'; conceptName: string }
  | { view: 'collection'; collectionName: string };

function filenamePart(name: string): string {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

export function createVocabularyCsvFilename(vocabularyName: string, scope: CsvExportScope = { view: 'all' }): string {
  const vocabulary = filenamePart(vocabularyName);
  switch (scope.view) {
    case 'narrowers':
      return `${vocabulary}_${filenamePart(scope.conceptName)}_narrowers.csv`;
    case 'collection':
      return `${vocabulary}_${filenamePart(scope.collectionName)}.csv`;
    case 'all':
      return `${vocabulary}.csv`;
  }
}

function csvCell(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Both filters export the displayed concepts with the same columns; missing labels stay empty. */
export function createVocabularyCsv(concepts: readonly VocabularyConcept[], conceptLabels: VocabularyConceptLabels): string {
  const rows = [
    ['concept URI', 'concept DE', 'concept FR', 'concept IT', 'concept EN'],
    ...concepts.map(({ uri }) => {
      const labels = conceptLabels[uri];
      return [uri, labels?.de ?? '', labels?.fr ?? '', labels?.it ?? '', labels?.en ?? ''];
    }),
  ];
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
