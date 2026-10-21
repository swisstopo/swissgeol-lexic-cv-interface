import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getVocabulary, type Vocabulary } from '@/app/data/vocabularies';
import VocabularyPage from '@/app/components/VocabularyPage';

export const getServerSideProps: GetServerSideProps<{ vocabulary: Vocabulary; uri: string }> = async ({ params }) => {
  const vocabulary = typeof params?.vocabulary === 'string' ? getVocabulary(params.vocabulary) : undefined;
  if (!vocabulary) return { notFound: true };
  const prefix = (process.env.VOCABULARY_PREFIX_URL || 'https://lexic.swissgeol.ch').replace(/\/+$/, '');
  return { props: { vocabulary, uri: `${prefix}/${vocabulary.id}` } };
};

export default function VocabularyOverview(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <VocabularyPage key={props.vocabulary.id} {...props} />;
}
