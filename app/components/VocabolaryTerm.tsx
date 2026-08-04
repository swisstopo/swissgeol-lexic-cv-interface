import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Link, LinkText } from '@/components/ui/link';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Menu, MenuItemLabel, MenuItem } from '@/components/ui/menu';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { ChevronDownIcon, Icon } from '@/components/ui/icon';
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent, AccordionIcon } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipText } from '@/components/ui/tooltip';
import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import { Image } from '@/components/ui/image';

import { DownloadIcon, Map as MapIcon, Search, ChevronUpIcon, ArrowRight, ArrowUpRight } from 'lucide-react';
import Breadcrumbs from './Breacrumbs';
import PageLayout from './PageLayout';
import { TermData } from '../models/termDataInterface';
import { BreadCrumbsData } from '../models/breadCrumbsInterface';
import CardTerm from './CardTermPage';
import { useMainWidth, calculateFromMainWidth } from '../utils/heightUtils';

const TERM_LINK_CLASS = 'text-[#337083] no-underline transition-colors duration-[120ms] hover:text-[#2F4356]';
const TERM_LINK_TEXT_CLASS = 'transition-colors duration-[120ms] decoration-current';
const TERM_LINK_ICON_BOX_CLASS = 'text-inherit transition-colors duration-[120ms]';

const getVocabularyLabel = (vocabulary: string) => {
    if (vocabulary === 'ls_correlations') {
        return 'Lithostratigraphic Correlations';
    }
    if (vocabulary === 'TectonicStructures') {
        return 'Tectonic Structures';
    }
    if (vocabulary === 'materialDescription') {
        return 'Material Description';
    }
    return vocabulary;
};

interface VocabolaryTermProps {
    termData: TermData | null;
    breadCrumbsData: BreadCrumbsData;
    allConceptMap: Map<string, string>;
}

const VocabolaryTerm: React.FC<VocabolaryTermProps> = ({ termData, breadCrumbsData, allConceptMap }) => {
    const mainWidth = useMainWidth();

    /**
     * Helper function to render a related term with appropriate styling and behavior
     * Handles both HTTP links and plain text terms
     */
    const renderRelatedTerm = (term: string, predicate: string, index: number) => {
        if (term.startsWith('http')) {
            const isPdf = /^https?:\/\/.+\.pdf(\?.*)?$/i.test(term);
            const LinkIcon = isPdf ? ArrowUpRight : ArrowRight;

            return (
                <Box className="flex-row items-center"  >
                    <Link className={`flex-row items-center mb-[1px] font-[500] ${TERM_LINK_CLASS}`}
                        href={term}



                        isExternal
                    >
                        <Tooltip
                            placement="top"
                            trigger={(triggerProps) => (
                                <Badge style={{ height: calculateFromMainWidth(27, mainWidth) } as any} className="rounded-full bg-[#46596B]"
                                    {...triggerProps}

                                    variant="solid"


                                >
                                    <BadgeText className="text-center text-[0.625em] font-[600] text-white"    >
                                        {getTermLabel(predicate, true)}
                                    </BadgeText>
                                </Badge>
                            )}
                        >
                            <TooltipContent className="rounded-[4px] bg-[#1C2834] pt-[5px] pr-[8px] pl-[8px] pb-[5px] gap-[8px]"







                            >
                                <TooltipText>{predicate}</TooltipText>
                            </TooltipContent>
                        </Tooltip>

                        <Text style={{ marginLeft: calculateFromMainWidth(23, mainWidth) as any } as any} className={`text-[1em] font-[500] leading-[24px] underline text-inherit ${TERM_LINK_TEXT_CLASS}`}
                        >
                            {getTermLabel(term, false)}
                        </Text>

                        <Box className={TERM_LINK_ICON_BOX_CLASS}>
                            <Icon style={{ height: calculateFromMainWidth(24, mainWidth) as any, width: calculateFromMainWidth(24, mainWidth) as any } as any} className="text-current p-[2px]" as={LinkIcon}     />
                        </Box>
                    </Link>
                </Box>
            );
        } else {
            return (
                <Box className="flex-row items-center"  >
                    <Tooltip
                        placement="top"
                        trigger={(triggerProps) => (
                            <Badge style={{ height: calculateFromMainWidth(27, mainWidth) } as any} className="rounded-full bg-[#46596B]"
                                {...triggerProps}

                                variant="solid"


                            >
                                <BadgeText className="text-center text-[0.625em] font-[600] text-white"    >
                                    {getTermLabel(predicate, true)}
                                </BadgeText>
                            </Badge>
                        )}
                    >
                        <TooltipContent className="rounded-[4px] bg-[#1C2834] pt-[5px] pr-[8px] pl-[8px] pb-[5px] gap-[8px]"







                        >
                            <TooltipText>{predicate}</TooltipText>
                        </TooltipContent>
                    </Tooltip>
                    <Text style={{ marginLeft: calculateFromMainWidth(23, mainWidth) as any } as any} className="text-[1em] font-[500] leading-[24px] text-inherit"





                    >
                        {term}
                    </Text>
                </Box>
            );
        }
    };

    /**
     * Extracts the label or identifier from a URL by manipulating the URL string.
     *
     * This function processes the URL by replacing the '#' character with '/' and then splits
     * the URL into parts using '/' as the delimiter. The function then returns the last part
     * of the split URL, which is typically the label or identifier.
     */
    const extractLabel = (url: string) => {
        const parts = url.replace('#', '/').split('/');
        return parts.pop();
    };
    const getTermLabel = (term: string, isBadge: boolean) => {
        if (!allConceptMap || allConceptMap.size === 0) {
            return "Map is not available";
        }
        if (isBadge) {
            return allConceptMap.get(term) || `[${extractLabel(term)}]`;
        } else {
            return allConceptMap.get(term) || term;
        }
    };
    /**
     * Retrieves the flag image path based on the language code
     */
    const getFlagImageUrl = (lang: string) => {
        switch (lang) {
            case 'en':
                return '/flag-en.jpg';
            case 'de':
                return '/flag-de.jpg';
            case 'it':
                return '/flag-it.png';
            case 'fr':
                return '/flag-fr.png';
            default:
                return '';
        }
    };

    const statusColors = {
        'Active': '#348352',
        'Deprecated': '#B45309',
        'Historic': '#B45309',
        'Standard': '#46596B',
    };

    if (termData) {
        const vocabularyLabel = getVocabularyLabel(termData.vocabulary);
        const title = termData.term + ' - ' + vocabularyLabel + ' - Controlled Vocabularies Interface';

        return (
            <PageLayout title={title}>
                <Box style={{ width: calculateFromMainWidth(1236, mainWidth) as any, marginTop: calculateFromMainWidth(120, mainWidth) as any } as any} className="mx-auto mb-[100px]" id={termData.term}    >
                    <Breadcrumbs data={breadCrumbsData} />
                        <Box style={{ gap: calculateFromMainWidth(36, mainWidth) as any } as any} >
                            <Box className="flex-row justify-between gap-[1px]"   /* mb={5} */ >
                            <Text className="text-[16px] font-[700] leading-[16px] tracking-[0.1px] text-[#828E9A]"     >{vocabularyLabel}</Text>
                            <Text className="text-[12px] font-[500] leading-[16px] tracking-[0.1px] text-[#B0B0B0]"     >[{termData.version}]</Text>
                        </Box>
                        <Box className="items-center" >
                            {Object.entries(termData.languages).map(([lang, translation]) => (
                                lang === 'en' && (
                                    <Box className="flex-row justify-between items-center w-full"    >
                                        <Text className="font-[600] leading-[100%] tracking-[-0.5px] align-middle text-[3em] text-[#1C2834] mb-0 m-0"        >
                                            {translation}
                                        </Text>
                                        {/* Language dropdown with tooltip */}
                                        <Tooltip
                                            placement="top"
                                            trigger={(props) => {
                                                return (
                                                    <Button className="rounded-[4px] bg-[#C1D3D9]" {...props} variant="solid" size='md' isDisabled={false} isFocusVisible={false}  >
                                                        <ButtonText className="font-[500] text-[0.875em] leading-[20px]"   >Go To Map View </ButtonText>
                                                        <ButtonIcon as={MapIcon} />
                                                    </Button>
                                                );
                                            }}
                                        >
                                            <TooltipContent className="rounded-[4px] bg-[#1C2834] pt-[5px] pr-[8px] pl-[8px] pb-[5px] gap-[8px]"







                                            >
                                                <TooltipText>Coming soon...</TooltipText>
                                            </TooltipContent>
                                        </Tooltip>

                                    </Box>
                                )
                            ))}
                        </Box>

                        <Box style={{ minHeight: calculateFromMainWidth(98, mainWidth) as any, paddingLeft: calculateFromMainWidth(36, mainWidth) as any, paddingRight: calculateFromMainWidth(36, mainWidth) as any } as any} className="items-center flex-row flex-wrap border-[1px] rounded-[10px] border-[#DFE4E9] bg-white"          >
                            {Object.entries(termData.languages)
                                .filter(([lang]) => lang?.toLowerCase() !== 'en')
                                .map(([lang, translation]) => (
                                    <Box style={{ marginRight: calculateFromMainWidth(40, mainWidth) as any, paddingBottom: calculateFromMainWidth(36, mainWidth) as any, paddingTop: calculateFromMainWidth(36, mainWidth) as any } as any} className="flex-row"     key={lang}>
                                        <Box className="overflow-hidden rounded-full w-[20px] h-[20px] bg-[#ffedd5]"     >
                                            <Image
                                                id="imgLogo"
                                                source={{ uri: getFlagImageUrl(lang) }}
                                                alt={`${lang} flag`}
                                                size="full"
                                                resizeMode="cover"
                                            />
                                        </Box>
                                        <Text className="ml-[8px]" >{translation}</Text>
                                    </Box>
                                ))}
                        </Box>

                        <Box className="flex-row items-center gap-[10px]"   >
                            <Box className="flex-row items-center gap-[10px]"   >
                                <Text className="font-[500] text-[0.75em] leading-[16px] align-middle text-[#828E9A]"     >Status:</Text>
                                <Badge style={{ height: calculateFromMainWidth(27, mainWidth) as any, backgroundColor: statusColors[extractLabel(termData.termStatus) as keyof typeof statusColors] || "#348352" } as any} className="rounded-full mr-[5px]" variant="solid"    >
                                    <BadgeText className="text-center text-[0.625em] font-[600] text-white"    >{extractLabel(termData.termStatus)}</BadgeText>
                                </Badge>
                            </Box>
                            <Divider style={{ height: calculateFromMainWidth(17, mainWidth) as any } as any} orientation='vertical'  />
                            <Link className="flex-row items-center mb-[1px] gap-[10px]" href={termData.uri}    >
                                <Text className="font-[500] text-[0.75em] leading-[16px] align-middle text-[#828E9A]"     >URI:</Text>
                                <Badge style={{ height: calculateFromMainWidth(27, mainWidth) as any } as any} className="rounded-full bg-[#46596B] mr-[5px]"  variant="solid"   >
                                    <BadgeText className="text-center text-[0.625em] font-[600] text-white" style={{ textTransform: 'none' } as any}    >{termData.uri}</BadgeText>
                                </Badge>
                            </Link>
                        </Box>

                        <Divider style={{ marginTop: calculateFromMainWidth(64, mainWidth) as any, marginBottom: calculateFromMainWidth(64, mainWidth) as any } as any} orientation='horizontal'   />
                        {/* TERM DESCRIPTION CARD */}
                        <CardTerm title="Details" description={termData.definition || 'Coming soon...'} isDefinedBy={termData.isDefinedBy} />

                        <Divider style={{ marginTop: calculateFromMainWidth(64, mainWidth) as any, marginBottom: calculateFromMainWidth(64, mainWidth) as any } as any} orientation='horizontal'   />

                        <Text className="text-[2em] font-[600] text-[#1C2834] mb-[10px]"    >Related Terms</Text>

                        <Box style={{ gap: calculateFromMainWidth(64, mainWidth) as any } as any} className="flex-col"  id="relatedTermsAccordion" >
                            <Accordion style={{ width: calculateFromMainWidth(976, mainWidth) as any } as any} className="overflow-hidden border-[1px] border-[#ACB4BD] rounded-[6px] bg-white shadow-none"  size="lg" defaultValue={['b']} type="multiple" isCollapsible={true} isDisabled={false}  >
                                <AccordionItem value="b">
                                    <AccordionHeader style={{ height: calculateFromMainWidth(96, mainWidth), paddingLeft: calculateFromMainWidth(30, mainWidth), paddingRight: calculateFromMainWidth(36, mainWidth) } as any} className="justify-center content-center bg-[#F8F9FA]"    >
                                        <AccordionTrigger>
                                            {({ isExpanded }: { isExpanded?: boolean }) => (
                                                <>
                                                    <Text className="text-[1.25em] font-[700]"  >Broader</Text>
                                                    {isExpanded ? (
                                                        <AccordionIcon className="ml-[12px]" as={ChevronUpIcon}  />
                                                    ) : (
                                                        <AccordionIcon className="ml-[12px]" as={ChevronDownIcon}  />
                                                    )}
                                                </>
                                            )}
                                        </AccordionTrigger>
                                    </AccordionHeader>
                                    <AccordionContent style={{ gap: calculateFromMainWidth(12, mainWidth) as any, marginLeft: calculateFromMainWidth(30, mainWidth), marginTop: calculateFromMainWidth(36, mainWidth), minHeight: calculateFromMainWidth(96, mainWidth) } as any} className="justify-center content-center"    >
                                        {termData.relatedTerms.Broader.length > 0 ? (
                                            termData.relatedTerms.Broader.map(term => (
                                                <Box className="flex-row" >
                                                    <Link className={`flex-row items-center mb-[1px] ${TERM_LINK_CLASS}`}
                                                        href={`/${termData.vocabulary}/${extractLabel(term)}`}

                                                        key={term}

                                                    >
                                                        <LinkText className={`text-[1em] font-[500] underline text-inherit ${TERM_LINK_TEXT_CLASS}`}
                                                        >
                                                            {getTermLabel(term, false)}
                                                        </LinkText>
                                                        <Box className={TERM_LINK_ICON_BOX_CLASS}>
                                                            <Icon style={{ height: calculateFromMainWidth(24, mainWidth) as any, width: calculateFromMainWidth(24, mainWidth) as any } as any} className="text-current p-[2px]" as={ArrowRight}     />
                                                        </Box>
                                                    </Link>
                                                </Box>
                                            ))
                                        ) : (
                                            <Text className="text-[#B0B0B0]" >No Broader concepts...</Text>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion style={{ width: calculateFromMainWidth(976, mainWidth) as any } as any} className="overflow-hidden border-[1px] border-[#ACB4BD] rounded-[6px] bg-white shadow-none"  size="lg" defaultValue={['a']} type="multiple" isCollapsible={true} isDisabled={false}  >
                                <AccordionItem value="a">
                                    <AccordionHeader style={{ height: calculateFromMainWidth(96, mainWidth), paddingLeft: calculateFromMainWidth(30, mainWidth), paddingRight: calculateFromMainWidth(36, mainWidth) } as any} className="justify-center content-center bg-[#F8F9FA]"    >
                                        <AccordionTrigger>
                                            {({ isExpanded }: { isExpanded?: boolean }) => (
                                                <>
                                                    <Text className="text-[1.25em] font-[700]"  >Narrowers</Text>
                                                    {isExpanded ? (
                                                        <AccordionIcon className="ml-[12px]" as={ChevronUpIcon}  />
                                                    ) : (
                                                        <AccordionIcon className="ml-[12px]" as={ChevronDownIcon}  />
                                                    )}
                                                </>
                                            )}
                                        </AccordionTrigger>
                                    </AccordionHeader>
                                    <AccordionContent style={{ gap: calculateFromMainWidth(36, mainWidth) as any, marginLeft: calculateFromMainWidth(30, mainWidth), marginTop: calculateFromMainWidth(36, mainWidth), minHeight: calculateFromMainWidth(96, mainWidth) } as any} className="justify-center content-center"    >
                                        {termData.relatedTerms.Narrower.length > 0 ? (
                                            termData.relatedTerms.Narrower.length >= 50 ? (
                                                (() => {
                                                    const normalizeLetter = (label: string) => {
                                                        const trimmed = (label || "").trim();
                                                        if (!trimmed) return "#";
                                                        const first = trimmed[0]?.toUpperCase();
                                                        return first && /[A-Z]/.test(first) ? first : "#";
                                                    };

                                                    const orderedEntries = termData.relatedTerms.Narrower
                                                        .map((term) => {
                                                            const label = getTermLabel(term, false) || term;
                                                            return {
                                                                term,
                                                                label,
                                                                letter: normalizeLetter(label),
                                                            };
                                                        })
                                                        .sort((a, b) => a.label.localeCompare(b.label));

                                                    const sectionsMap = new Map<string, { term: string; label: string; }[]>();
                                                    orderedEntries.forEach((entry) => {
                                                        if (!sectionsMap.has(entry.letter)) {
                                                            sectionsMap.set(entry.letter, []);
                                                        }
                                                        sectionsMap.get(entry.letter)?.push(entry);
                                                    });

                                                    const sections = Array.from(sectionsMap.entries()).map(([letter, entries]: [string, { term: string; label: string; }[]]) => ({
                                                        letter,
                                                        entries,
                                                    }));

                                                    return sections.map((section: { letter: string; entries: { term: string; label: string }[] }, sectionIndex: number) => (
                                                        <Box style={{ gap: calculateFromMainWidth(16, mainWidth) as any } as any} key={`narrower-section-${section.letter}`} >
                                                            <Text style={{ marginTop: calculateFromMainWidth(24, mainWidth) as any } as any} className="text-[1.25em] font-[700] text-[#1C2834]"    >
                                                                {section.letter}
                                                            </Text>
                                                            <Box style={{ gap: calculateFromMainWidth(12, mainWidth) as any } as any} >
                                                                {section.entries.map(({ term, label }) => {
                                                                    const slug = extractLabel(term) ?? term;
                                                                    return (
                                                                        <Box className="flex-row"  key={term}>
                                                                            <Link className={`flex-row items-center mb-[1px] ${TERM_LINK_CLASS}`}
                                                                                href={`/${termData.vocabulary}/${slug}`}
                                                                            >
                                                                                <LinkText className={`text-[1em] font-[500] underline text-inherit ${TERM_LINK_TEXT_CLASS}`}
                                                                                >
                                                                                    {label}
                                                                                </LinkText>
                                                                                <Box className={TERM_LINK_ICON_BOX_CLASS}>
                                                                                    <Icon style={{ height: calculateFromMainWidth(24, mainWidth) as any, width: calculateFromMainWidth(24, mainWidth) as any } as any} className="text-current p-[2px]"
                                                                                        as={ArrowRight}




                                                                                    />
                                                                                </Box>
                                                                            </Link>
                                                                        </Box>
                                                                    );
                                                                })}
                                                            </Box>
                                                            {sectionIndex !== sections.length - 1 ? (
                                                                <Divider style={{ marginTop: calculateFromMainWidth(64, mainWidth) as any } as any} orientation='horizontal'  />
                                                            ) : null}
                                                        </Box>
                                                    ));
                                                })()
                                            ) : (
                                                termData.relatedTerms.Narrower.map(term => (
                                                    <Box className="flex-row" >
                                                        <Link className={`flex-row items-center mb-[1px] ${TERM_LINK_CLASS}`}
                                                            href={`/${termData.vocabulary}/${extractLabel(term)}`}
                                                            key={term}
                                                        >
                                                            <LinkText className={`text-[1em] font-[500] underline text-inherit ${TERM_LINK_TEXT_CLASS}`}
                                                            >
                                                                {getTermLabel(term, false)}
                                                            </LinkText>
                                                            <Box className={TERM_LINK_ICON_BOX_CLASS}>
                                                                <Icon style={{ height: calculateFromMainWidth(24, mainWidth) as any, width: calculateFromMainWidth(24, mainWidth) as any } as any} className="text-current p-[2px]" as={ArrowRight}     />
                                                            </Box>
                                                        </Link>
                                                    </Box>
                                                ))
                                            )
                                        ) : (
                                            <Text className="text-[#B0B0B0]" >No Narrowers concepts...</Text>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion style={{ width: calculateFromMainWidth(976, mainWidth) as any } as any} className="overflow-hidden border-[1px] border-[#ACB4BD] rounded-[6px] bg-white shadow-none"  size="lg" defaultValue={['or']} type="multiple" isCollapsible={true} isDisabled={false}  >
                                <AccordionItem value="or">
                                    <AccordionHeader style={{ height: calculateFromMainWidth(96, mainWidth), paddingLeft: calculateFromMainWidth(30, mainWidth), paddingRight: calculateFromMainWidth(36, mainWidth) } as any} className="justify-center content-center bg-[#F8F9FA]"    >
                                        <AccordionTrigger>
                                            {({ isExpanded }: { isExpanded?: boolean }) => (
                                                <>
                                                    <Text className="text-[1.25em] font-[700]"  >Other Relations</Text>
                                                    {isExpanded ? (
                                                        <AccordionIcon className="ml-[12px]" as={ChevronUpIcon}  />
                                                    ) : (
                                                        <AccordionIcon className="ml-[12px]" as={ChevronDownIcon}  />
                                                    )}
                                                </>
                                            )}
                                        </AccordionTrigger>
                                    </AccordionHeader>
                                    <AccordionContent style={{ gap: calculateFromMainWidth(12, mainWidth) as any, marginLeft: calculateFromMainWidth(30, mainWidth), marginTop: calculateFromMainWidth(36, mainWidth), minHeight: calculateFromMainWidth(96, mainWidth) } as any} className="justify-center content-center"    >
                                        {Object.keys(termData.relatedTerms.OtherRelation).length > 0 ? (
                                            Object.entries(termData.relatedTerms.OtherRelation).map(([predicate, terms]) => (
                                                terms.map((term: string, index: number) => (
                                                    <Box className="flex-row items-center mb-[10px]" key={`${predicate}-${index}`}   >
                                                        {renderRelatedTerm(term, predicate, index)}
                                                    </Box>
                                                ))
                                            ))
                                        ) : (
                                            <Text className="text-[#B0B0B0]" >No related concepts...</Text>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </Box>
                    </Box>
                </Box>
            </PageLayout >
        );
    }
};

export default VocabolaryTerm;
