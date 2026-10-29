'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Select from 'react-select';
import { ArrowRight, Download, Map as MapIcon } from 'lucide-react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Link, LinkText } from '@/components/ui/link';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipText } from '@/components/ui/tooltip';
import { Icon } from '@/components/ui/icon';
import { Divider } from '@/components/ui/divider';
import { Image } from '@/components/ui/image';
import PageLayout from './PageLayout';
import Breadcrumbs from './Breacrumbs';
import CardTerm from './CardTermPage';
import { ClientButton } from './ClientButton_UIv2';
import type { Vocabulary } from '../data/vocabularies';
import type { VocabularyConcept, VocabularyConcepts, VocabularyConceptLabels } from '../models/vocabularyConcepts';
import { getEnglishLabel, mapVocabularyConcepts, getNarrowerConcepts, groupConcepts } from '../utils/vocabularyConcepts';
import { resolveVocabularyVersion } from '../utils/resolveVocabularyVersion';
import { createVocabularyCsv, createVocabularyCsvFilename } from '../utils/vocabularyCsv';
import { downloadCsv, waitForCsvPaint } from '../utils/downloadCsv';
import { useMainWidth, calculateFromMainWidth } from '../utils/heightUtils';

const TERM_LINK_CLASS = 'text-[#337083] no-underline transition-colors duration-[120ms] hover:text-[#2F4356]';
const TERM_LINK_TEXT_CLASS = 'transition-colors duration-[120ms] decoration-current';
const TERM_LINK_ICON_BOX_CLASS = 'text-inherit transition-colors duration-[120ms]';

const EMPTY: VocabularyConcepts = { concepts: [] };
const ALPHABET = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const CONCEPT_VIEWS = [
  { value: 'all', label: 'All concepts' },
  { value: 'narrowers', label: 'Narrowers of a term' },
  { value: 'collection', label: 'Concepts in a collection — Coming soon', isDisabled: true },
];
const translations = [
  { code: 'DE', name: 'German', flag: '/flag-de.jpg' },
  { code: 'FR', name: 'French', flag: '/flag-fr.png' },
  { code: 'IT', name: 'Italian', flag: '/flag-it.png' },
];

export default function VocabularyPage({ vocabulary, uri }: { vocabulary: Vocabulary; uri: string }) {
  const mainWidth = useMainWidth();
  const size = (pixels: number) => calculateFromMainWidth(pixels, mainWidth);
  const [version, setVersion] = useState('');
  const [data, setData] = useState<VocabularyConcepts>(EMPTY);
  const [conceptLabels, setConceptLabels] = useState<VocabularyConceptLabels>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [view, setView] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState<VocabularyConcept | null>(null);
  const [narrowerData, setNarrowerData] = useState<VocabularyConcepts | null>(null);
  const [narrowersLoading, setNarrowersLoading] = useState(false);
  const [narrowersError, setNarrowersError] = useState('');
  const [narrowersAttempt, setNarrowersAttempt] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [exportError, setExportError] = useState('');
  const exportController = useRef<AbortController | null>(null);

  const cancelExport = () => {
    exportController.current?.abort();
    exportController.current = null;
    setDownloading(false);
    setExportError('');
  };

  useEffect(() => {
    cancelExport();
    setSelectedTerm(null);
    setNarrowerData(null);
    setNarrowersLoading(false);
    setNarrowersError('');
    return () => {
      exportController.current?.abort();
      exportController.current = null;
    };
  }, [vocabulary.id]);

  useEffect(() => {
    let active = true;
    resolveVocabularyVersion(vocabulary.id).then(value => { if (active) setVersion(value); });
    return () => { active = false; };
  }, [vocabulary.id]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetch(`/api/getAllConceptMap?vocabulary=${encodeURIComponent(vocabulary.id)}&includeTranslations=true`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Could not load concepts. Please try again.');
        const value: { allConceptMap: Record<string, string>; conceptLabels: VocabularyConceptLabels } = await response.json();
        if (!controller.signal.aborted) {
          setData(mapVocabularyConcepts(value.allConceptMap, vocabulary.id));
          setConceptLabels(value.conceptLabels);
        }
      })
      .catch(() => { if (!controller.signal.aborted) setError('Could not load concepts. Please try again.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [vocabulary.id, attempt]);

  useEffect(() => {
    if (!selectedTerm) return;
    const controller = new AbortController();
    setNarrowersLoading(true);
    setNarrowersError('');
    getNarrowerConcepts(vocabulary.id, selectedTerm, controller.signal)
      .then(value => { if (!controller.signal.aborted) setNarrowerData(value); })
      .catch(() => { if (!controller.signal.aborted) setNarrowersError('Could not load narrowers. Please try again.'); })
      .finally(() => { if (!controller.signal.aborted) setNarrowersLoading(false); });
    return () => controller.abort();
  }, [vocabulary.id, selectedTerm, narrowersAttempt]);

  const narrowed = view === 'narrowers' && selectedTerm !== null;
  const listLoading = loading || (narrowed && narrowersLoading);
  const listError = error || (narrowed ? narrowersError : '');
  const displayed = narrowed ? (narrowerData?.concepts ?? EMPTY.concepts) : data.concepts;
  const groups = useMemo(() => groupConcepts(displayed), [displayed]);
  const letters = new Set(groups.map(([letter]) => letter));
  const labels = vocabulary.translations;
  const exportDisabled = listLoading || Boolean(listError) || view === 'collection'
    || (view === 'narrowers' && (!selectedTerm || !narrowerData));

  const handleExport = async () => {
    if (exportDisabled || exportController.current) return;
    const controller = new AbortController();
    exportController.current = controller;
    setDownloading(true);
    setExportError('');
    try {
      if (!await waitForCsvPaint(controller.signal) || controller.signal.aborted) return;
      const csv = createVocabularyCsv(displayed, conceptLabels);
      const filename = createVocabularyCsvFilename(vocabulary.name,
        view === 'narrowers' && selectedTerm
          ? { view: 'narrowers', conceptName: selectedTerm.label }
          : { view: 'all' });
      downloadCsv(csv, filename);
    } catch (cause) {
      if (!controller.signal.aborted) {
        console.error('Could not export vocabulary CSV.', cause);
        setExportError('Could not export CSV. Please try again.');
      }
    } finally {
      if (exportController.current === controller) {
        exportController.current = null;
        setDownloading(false);
      }
    }
  };

  return (
    <PageLayout title={`${vocabulary.name} - Controlled Vocabularies Interface`}>
      <Box className="mx-auto mb-[100px] text-[#1C2834]" style={{ width: size(1236), marginTop: size(120) } as any}>
        <Breadcrumbs data={{ startPage: 'Home', vocabulary: vocabulary.id, broader: [], term: '' }} />
        <Box style={{ gap: size(36) } as any}>
          <Box className="flex-row justify-between gap-[1px]">
            <Text className="text-[16px] font-[700] leading-[16px] tracking-[0.1px] text-[#828E9A]">{vocabulary.name}</Text>
            <Text className="text-[12px] font-[500] leading-[16px] tracking-[0.1px] text-[#B0B0B0]">{version ? `[${version}]` : ''}</Text>
          </Box>
          <Box className="items-center">
            <Box className="flex-row justify-between items-center w-full">
              <Text accessibilityRole="header" className="font-[600] leading-[100%] tracking-[-0.5px] align-middle text-[3em] text-[#1C2834] mb-0 m-0">
                {labels.EN}
              </Text>
              <Tooltip
                placement="top"
                trigger={(props) => (
                  <Button className="rounded-[4px] bg-[#C1D3D9]" {...props} variant="solid" size="md" isDisabled={false} isFocusVisible={false}>
                    <ButtonText className="font-[500] text-[0.875em] leading-[20px]">Go To Map View </ButtonText>
                    <ButtonIcon as={MapIcon} />
                  </Button>
                )}
              >
                <TooltipContent className="rounded-[4px] bg-[#1C2834] pt-[5px] pr-[8px] pl-[8px] pb-[5px] gap-[8px]">
                  <TooltipText>Coming soon...</TooltipText>
                </TooltipContent>
              </Tooltip>
            </Box>
          </Box>
          <Box style={{ minHeight: size(98), paddingLeft: size(36), paddingRight: size(36) } as any}
            className="items-center flex-row flex-wrap border-[1px] rounded-[10px] border-[#DFE4E9] bg-white">
            {translations.map(({ code, flag, name }) => labels[code] && (
              <Box key={code} style={{ marginRight: size(40), paddingBottom: size(36), paddingTop: size(36) } as any} className="flex-row">
                <Box className="overflow-hidden rounded-full w-[20px] h-[20px] bg-[#ffedd5]">
                  <Image source={{ uri: flag }} alt={name} size="full" resizeMode="cover" />
                </Box>
                <Text className="ml-[8px]">{labels[code]}</Text>
              </Box>
            ))}
          </Box>
          <Box className="flex-row items-center gap-[10px]">
            <Box className="flex-row items-center gap-[10px]">
              <Text className="font-[500] text-[0.75em] leading-[16px] align-middle text-[#828E9A]">Status:</Text>
              <Text accessibilityLabel="Vocabulary status is not specified" className="font-[500] text-[0.75em] leading-[16px] text-[#828E9A] mr-[5px]">—</Text>
            </Box>
            <Divider style={{ height: size(17) } as any} orientation="vertical" />
            <Link className="flex-row items-center mb-[1px] gap-[10px]" href={uri}>
              <Text className="font-[500] text-[0.75em] leading-[16px] align-middle text-[#828E9A]">URI:</Text>
              <Badge style={{ height: size(27) } as any} className="rounded-full bg-[#46596B] mr-[5px]" variant="solid">
                <BadgeText className="text-center text-[0.625em] font-[600] text-white" style={{ textTransform: 'none' } as any}>{uri}</BadgeText>
              </Badge>
            </Link>
          </Box>
        </Box>

        <Divider style={{ marginTop: size(64), marginBottom: size(64) } as any} />
        <CardTerm title="Description" description={vocabulary.description} isDefinedBy="" />
        <section aria-labelledby="top-concepts-title" className="border-[1px] border-[#ACB4BD] rounded-[4px] bg-white"
          style={{ width: size(976), padding: size(24), marginTop: size(32) }}>
          <h2 id="top-concepts-title" className="font-[600] text-[1em] mb-[16px]">Top Concepts</h2>
          <Box className="flex-row flex-wrap gap-[16px]">
            {vocabulary.topConcept.map(concept => (
              <ClientButton key={concept.url} href={concept.url} label={getEnglishLabel(concept.label)}
                style={{ flex: '0 0 calc(50% - 8px)', minHeight: size(52), padding: size(16), borderWidth: 1, borderColor: '#DFE4E9', backgroundColor: '#fff' } as any} />
            ))}
          </Box>
        </section>

        <Divider style={{ marginTop: size(64), marginBottom: size(64) } as any} />
        <section id="explore-concepts" aria-labelledby="concepts-title" className="border-[1px] border-[#ACB4BD] rounded-[4px] bg-white scroll-mt-[150px]" style={{ width: size(976) }}>
          <Box className="bg-[#F8F9FA] border-b-[1px] border-[#DFE4E9]" style={{ padding: size(24) } as any}>
            <Box className="flex-row items-center justify-between flex-wrap gap-[12px]">
              <Box className="flex-row items-center flex-wrap gap-[12px]">
                <h2 id="concepts-title" className="text-[1.25em] font-[700]">Explore Concepts</h2>
                <span className="text-[0.75em] text-[#828E9A]" aria-live="polite">{!listLoading && !listError && `${displayed.length} concepts`}</span>
              </Box>
              <Button variant="outline" action="default" size="sm" onPress={handleExport}
                isDisabled={exportDisabled || downloading} accessibilityState={{ busy: downloading }}
                style={{ height: size(40), paddingLeft: size(16), paddingRight: size(16), gap: size(8) } as any}
                className={`ml-auto rounded-[4px] border-[#ACB4BD] border-[1px] ${downloading ? 'bg-[#D6E2E6] data-[disabled=true]:opacity-100' : 'bg-white data-[hover=true]:bg-[#F8F9FA] data-[active=true]:bg-[#D6E2E6]'}`}>
                <ButtonIcon as={Download} className="text-[#1C2834]" style={{ width: size(20), height: size(20) } as any} />
                <ButtonText className="text-[#1C2834] text-[0.75em] font-[500]">{downloading ? 'downloading' : 'Export CSV'}</ButtonText>
              </Button>
            </Box>
            {exportError && <p role="alert" className="mt-[12px] text-[0.875em] text-[#B42318]">{exportError}</p>}
            <Box className="flex-row flex-wrap items-end gap-[24px] mt-[24px]">
              <Box className="w-[34%] min-w-[180px] max-w-full">
                <Select
                  inputId="concept-view"
                  instanceId="concept-view"
                  aria-label="Concept filter"
                  options={CONCEPT_VIEWS}
                  value={CONCEPT_VIEWS.find(option => option.value === view)}
                  onChange={option => { if (option) {
                    cancelExport();
                    setView(option.value);
                    setSelectedTerm(null);
                    setNarrowerData(null);
                    setNarrowersLoading(false);
                    setNarrowersError('');
                  } }}
                  isSearchable={false}
                  isOptionDisabled={option => Boolean(option.isDisabled)}
                  components={{ IndicatorSeparator: null }}
                  styles={{
                    control: (provided, state) => ({
                      ...provided, minHeight: 40, borderRadius: 4, backgroundColor: 'white',
                      borderColor: state.isFocused ? '#337083' : '#ACB4BD',
                      boxShadow: state.isFocused ? '0 0 0 1px #337083' : 'none',
                      '&:hover': { borderColor: '#337083' },
                    }),
                    singleValue: provided => ({ ...provided, color: '#1C2834' }),
                    option: (provided, state) => ({
                      ...provided, minHeight: 36, padding: '8px 12px', borderRadius: 4,
                      color: state.isDisabled ? '#828E9A' : state.isFocused || state.isSelected ? '#2F4356' : '#337083',
                      backgroundColor: !state.isDisabled && (state.isFocused || state.isSelected) ? '#D6E2E6' : 'white',
                      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
                      ':active': { backgroundColor: state.isDisabled ? 'white' : '#D6E2E6' },
                    }),
                    menu: provided => ({
                      ...provided, borderRadius: 8, border: '1px solid #ACB4BD', backgroundColor: '#FFFFFF',
                      boxShadow: '4px 4px 2px 0px rgba(0, 0, 0, 0.12)', marginTop: 10,
                      width: 'max-content', minWidth: '100%', maxWidth: 'calc(100vw - 32px)',
                      zIndex: 10, overflow: 'hidden',
                    }),
                    menuList: provided => ({ ...provided, borderRadius: 8, padding: 12 }),
                  }}
                />
              </Box>
              {view === 'narrowers' && (
                <Box className="flex-1 min-w-[180px] max-w-full">
                  <Select<VocabularyConcept>
                    inputId="concept-term"
                    instanceId="concept-term"
                    aria-label="Term"
                    options={data.concepts}
                    value={selectedTerm}
                    onChange={value => {
                      cancelExport();
                      setSelectedTerm(value);
                      setNarrowerData(null);
                      setNarrowersLoading(value !== null);
                      setNarrowersError('');
                    }}
                    getOptionLabel={concept => concept.label}
                    getOptionValue={concept => concept.uri}
                    placeholder="Search and select a term..."
                    isSearchable
                    isClearable
                    isLoading={loading}
                    isDisabled={loading || Boolean(error)}
                    noOptionsMessage={() => 'No concepts found.'}
                    components={{ IndicatorSeparator: null }}
                    styles={{
                      control: (provided, state) => ({
                        ...provided, minHeight: 40, borderRadius: 4, backgroundColor: 'white',
                        borderColor: state.isFocused ? '#337083' : '#ACB4BD',
                        boxShadow: state.isFocused ? '0 0 0 1px #337083' : 'none',
                        '&:hover': { borderColor: '#337083' },
                      }),
                      singleValue: provided => ({ ...provided, color: '#1C2834' }),
                      placeholder: provided => ({ ...provided, color: '#828E9A' }),
                      option: (provided, state) => ({
                        ...provided, minHeight: 36, padding: '8px 12px', borderRadius: 4,
                        color: state.isFocused || state.isSelected ? '#2F4356' : '#337083',
                        backgroundColor: state.isFocused || state.isSelected ? '#D6E2E6' : 'white',
                        ':active': { backgroundColor: '#D6E2E6' },
                      }),
                      menu: provided => ({
                        ...provided, borderRadius: 8, border: '1px solid #ACB4BD', backgroundColor: '#FFFFFF',
                        boxShadow: '4px 4px 2px 0px rgba(0, 0, 0, 0.12)', marginTop: 10, zIndex: 10, overflow: 'hidden',
                      }),
                      menuList: provided => ({ ...provided, maxHeight: 240, borderRadius: 8, padding: 12 }),
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
          <div style={{ padding: size(24) }} aria-busy={listLoading}>
            {listLoading ? <p role="status">Loading concepts…</p> : listError ? (
              <div role="alert">
                <p>{listError}</p>
                <Button className="mt-[16px] rounded-[4px] border-[#ACB4BD] bg-white self-start" variant="outline" onPress={() => {
                  if (error) setAttempt(value => value + 1);
                  else setNarrowersAttempt(value => value + 1);
                }}>
                  <ButtonText className="text-[0.875em] text-[#1C2834]">Retry</ButtonText>
                </Button>
              </div>
            ) : (
              <>
                <nav aria-label="Jump to letter" className="flex flex-wrap justify-between gap-[6px] pb-[24px] border-b-[1px] border-[#DFE4E9] text-[0.75em]">
                  {ALPHABET.map(letter => letters.has(letter) ? (
                    <a key={letter} className="text-[#337083] p-[2px] hover:text-[#2F4356] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#337083] focus-visible:outline-offset-[3px]" href={`#concept-letter-${letter === '#' ? 'other' : letter}`}>{letter}</a>
                  ) : <span key={letter} className="text-[#C4C9CE] p-[2px]" aria-disabled="true">{letter}</span>)}
                </nav>
                {displayed.length === 0 && <p role="status" className="py-[32px] text-[#828E9A]">
                  No concepts found.
                </p>}
                {groups.map(([letter, concepts]) => (
                  <section key={letter} id={`concept-letter-${letter === '#' ? 'other' : letter}`} className="scroll-mt-[160px] pt-[48px]">
                    <h3 className="text-[1.25em] font-[600] mb-[24px]">{letter}</h3>
                    <ul className="list-none flex flex-col gap-[12px]">{concepts.map(concept => <li key={concept.uri}>
                      <Box className="flex-row">
                        <Link className={`flex-row items-center mb-[1px] ${TERM_LINK_CLASS}`} href={concept.href}>
                          <LinkText className={`text-[1em] font-[500] underline text-inherit ${TERM_LINK_TEXT_CLASS}`}>{concept.label}</LinkText>
                          <Box className={TERM_LINK_ICON_BOX_CLASS}>
                            <Icon style={{ height: size(24), width: size(24) } as any} className="text-current p-[2px]" as={ArrowRight} />
                          </Box>
                        </Link>
                      </Box>
                    </li>)}</ul>
                  </section>
                ))}
              </>
            )}
          </div>
        </section>
      </Box>
    </PageLayout>
  );
}
