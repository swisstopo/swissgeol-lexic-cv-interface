import React from 'react';
import { Box, Text, Link, Badge, Menu, MenuItemLabel, MenuItem, Button, ButtonIcon, ButtonText, ChevronDownIcon, Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent, AccordionIcon, BadgeText, LinkText, Tooltip, TooltipContent, TooltipText, Divider, VStack, Icon } from '@gluestack-ui/themed';
import { DownloadIcon, Map as MapIcon, Search, ChevronUpIcon, ArrowRight, ArrowUpRight } from 'lucide-react';
import Breadcrumbs from './Breacrumbs';
import RootLayout from '../layout';
import { TermData } from '../models/termDataInterface';
import { BreadCrumbsData } from '../models/breadCrumbsInterface';
import CardTerm from './CardTermPage';
import { CLIENT_BUTTON_STATE_COLORS } from './ClientButton_UIv2';
import { useMainWidth, calculateFromMainWidth } from '../utils/heightUtils';

const TERM_LINK_COLORS = {
    base: CLIENT_BUTTON_STATE_COLORS.base.textColor,
    hover: CLIENT_BUTTON_STATE_COLORS.hover.textColor,
} as const;

const TERM_LINK_SX = {
    _web: {
        color: TERM_LINK_COLORS.base,
        textDecoration: 'none',
        transition: 'color 120ms ease',
        ':hover': {
            color: TERM_LINK_COLORS.hover,
        },
    },
} as const;

const TERM_LINK_TEXT_SX = {
    _web: {
        transition: 'color 120ms ease',
        textDecorationColor: 'currentColor',
    },
} as const;

const TERM_LINK_ICON_BOX_SX = {
    _web: {
        color: 'inherit',
        transition: 'color 120ms ease',
    },
} as const;

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
                <Box flexDirection="row" alignItems="center">
                    <Link
                        href={term}
                        mb={1}
                        flexDirection="row"
                        alignItems="center"
                        isExternal
                        sx={{ ...TERM_LINK_SX, fontWeight: 500 } as any}
                    >
                        <Tooltip
                            placement="top"
                            trigger={(triggerProps) => (
                                <Badge
                                    {...triggerProps}
                                    h={calculateFromMainWidth(27, mainWidth)}
                                    variant="solid"
                                    borderRadius="$full"
                                    bgColor="#46596B"
                                >
                                    <BadgeText color="white" textAlign="center" fontSize={'0.625em' as any} fontWeight="$semibold">
                                        {getTermLabel(predicate, true)}
                                    </BadgeText>
                                </Badge>
                            )}
                        >
                            <TooltipContent
                                bg='#1C2834'
                                pt={5}
                                pr={8}
                                pl={8}
                                pb={5}
                                borderRadius={4}
                                gap={8}
                            >
                                <TooltipText>{predicate}</TooltipText>
                            </TooltipContent>
                        </Tooltip>

                        <Text
                            ml={calculateFromMainWidth(23, mainWidth) as any}
                            fontSize={'1em' as any}
                            fontWeight={500}
                            lineHeight={24}
                            textDecorationLine="underline"
                            color="inherit"
                            sx={TERM_LINK_TEXT_SX as any}
                        >
                            {getTermLabel(term, false)}
                        </Text>

                        <Box sx={TERM_LINK_ICON_BOX_SX as any}>
                            <Icon as={LinkIcon} p={2} h={calculateFromMainWidth(24, mainWidth) as any} w={calculateFromMainWidth(24, mainWidth) as any} color="currentColor" />
                        </Box>
                    </Link>
                </Box>
            );
        } else {
            return (
                <Box flexDirection="row" alignItems="center">
                    <Tooltip
                        placement="top"
                        trigger={(triggerProps) => (
                            <Badge
                                {...triggerProps}
                                h={calculateFromMainWidth(27, mainWidth)}
                                variant="solid"
                                borderRadius="$full"
                                bgColor="#46596B"
                            >
                                <BadgeText color="white" textAlign="center" fontSize={'0.625em' as any} fontWeight="$semibold">
                                    {getTermLabel(predicate, true)}
                                </BadgeText>
                            </Badge>
                        )}
                    >
                        <TooltipContent
                            bg='#1C2834'
                            pt={5}
                            pr={8}
                            pl={8}
                            pb={5}
                            borderRadius={4}
                            gap={8}
                        >
                            <TooltipText>{predicate}</TooltipText>
                        </TooltipContent>
                    </Tooltip>
                    <Text
                        ml={calculateFromMainWidth(23, mainWidth) as any}
                        fontSize={'1em' as any}
                        fontWeight={500}
                        lineHeight={24}
                        color="inherit"
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
                return '/Bandiera-inglese.jpg';
            case 'de':
                return '/GERMANIA.jpg';
            case 'it':
                return '/italia.png';
            case 'fr':
                return '/Flag_of_France_(1794–1815,_1830–1974).svg.png';
            default:
                return '';
        }
    };

    const statusColors = {
        'Active': '$success500',
        'Deprecated': '#B45309',
        'Historic': '#B45309',
        'Standard': '#46596B',
    };

    if (termData) {
        const title = termData.term + ' - ' + termData.vocabulary + ' - Controlled Vocabularies Interface';

        return (
            <RootLayout title={title}>
                <Box id={termData.term} w={calculateFromMainWidth(1236, mainWidth) as any} mb={100} m={'auto'} mt={calculateFromMainWidth(120, mainWidth) as any}>
                    <Breadcrumbs data={breadCrumbsData} />
                    <Box gap={calculateFromMainWidth(36, mainWidth) as any}>
                        <Box flexDirection='row' gap={1} /* mb={5} */ justifyContent='space-between'>
                            <Text fontSize={16} color='#828E9A' fontWeight={700} lineHeight={16} letterSpacing={0.10}>{termData.vocabulary}</Text>
                            <Text fontSize={12} color='$secondary300' fontWeight={500} lineHeight={16} letterSpacing={0.10}>[{termData.version}]</Text>
                        </Box>
                        <Box alignItems='center'>
                            {Object.entries(termData.languages).map(([lang, translation]) => (
                                lang === 'en' && (
                                    <Box flexDirection='row' justifyContent='space-between' w={'100%'} alignItems='center'>
                                        <Text mb={0} fontWeight={600} lineHeight={'100%' as any} letterSpacing={-0.5} verticalAlign='middle' color='#1C2834' fontSize={'3em' as any} m={0}>
                                            {translation}
                                        </Text>
                                        {/* Language dropdown with tooltip */}
                                        <Tooltip
                                            placement="top"
                                            trigger={(props) => {
                                                return (
                                                    <Button {...props} variant="solid" size='md' isDisabled={false} isFocusVisible={false} bgColor='#C1D3D9' rounded={4}>
                                                        <ButtonText fontWeight={500} fontSize={'0.875em' as any} lineHeight={20}>Go To Map View </ButtonText>
                                                        <ButtonIcon as={MapIcon} />
                                                    </Button>
                                                );
                                            }}
                                        >
                                            <TooltipContent
                                                bg='#1C2834'
                                                pt={5}
                                                pr={8}
                                                pl={8}
                                                pb={5}
                                                borderRadius={4}
                                                gap={8}
                                            >
                                                <TooltipText>Coming soon...</TooltipText>
                                            </TooltipContent>
                                        </Tooltip>

                                    </Box>
                                )
                            ))}
                        </Box>

                        <Box borderWidth={1} rounded={10} minHeight={calculateFromMainWidth(98, mainWidth) as any} alignItems='center' pl={calculateFromMainWidth(36, mainWidth) as any} pr={calculateFromMainWidth(36, mainWidth) as any} flexDirection='row' flexWrap='wrap' borderColor='#DFE4E9' bg='white'>
                            {Object.entries(termData.languages)
                                .filter(([lang]) => lang?.toLowerCase() !== 'en')
                                .map(([lang, translation]) => (
                                    <Box mr={calculateFromMainWidth(40, mainWidth) as any} pb={calculateFromMainWidth(36, mainWidth) as any} pt={calculateFromMainWidth(36, mainWidth) as any} flexDirection='row' key={lang}>
                                        <Box rounded="$full" width={20} height={20} bgColor="$orange100" overflow="hidden">
                                            <img
                                                id="imgLogo"
                                                height="100%"
                                                src={getFlagImageUrl(lang)}
                                                alt={`${lang} flag`}
                                            />
                                        </Box>
                                        <Text ml={8}>{translation}</Text>
                                    </Box>
                                ))}
                        </Box>

                        <Box flexDirection='row' alignItems='center' gap={10}>
                            <Box flexDirection='row' alignItems='center' gap={10}>
                                <Text fontWeight={500} fontSize={'0.75em' as any} lineHeight={16} verticalAlign='middle' color='#828E9A'>Status:</Text>
                                <Badge variant="solid" h={calculateFromMainWidth(27, mainWidth) as any} borderRadius="$full" bgColor={statusColors[extractLabel(termData.termStatus) as keyof typeof statusColors] || '$success500'} mr={5}>
                                    <BadgeText color='white' textAlign='center' fontSize={'0.625em' as any} fontWeight='$semibold'>{extractLabel(termData.termStatus)}</BadgeText>
                                </Badge>
                            </Box>
                            <Divider orientation='vertical' h={calculateFromMainWidth(17, mainWidth) as any} />
                            <Link href={termData.uri} mb={1} flexDirection='row' alignItems='center' gap={10}>
                                <Text fontWeight={500} fontSize={'0.75em' as any} lineHeight={16} verticalAlign='middle' color='#828E9A'>URI:</Text>
                                <Badge h={calculateFromMainWidth(27, mainWidth) as any} variant="solid" borderRadius="$full" bgColor='#46596B' mr={5}>
                                    <BadgeText style={{ textTransform: 'none' } as any} color='white' textAlign='center' fontSize={'0.625em' as any} fontWeight='$semibold'>{termData.uri}</BadgeText>
                                </Badge>
                            </Link>
                        </Box>

                        <Divider orientation='horizontal' mt={calculateFromMainWidth(64, mainWidth) as any} mb={calculateFromMainWidth(64, mainWidth) as any} />
                        {/* TERM DESCRIPTION CARD */}
                        <CardTerm title="Details" description={termData.definition || 'Coming soon...'} isDefinedBy={termData.isDefinedBy} />

                        <Divider orientation='horizontal' mt={calculateFromMainWidth(64, mainWidth) as any} mb={calculateFromMainWidth(64, mainWidth) as any} />

                        <Text fontSize={'2em' as any} color='#1C2834' fontWeight={600} mb={10}>Related Terms</Text>

                        <Box flexDirection='column' id="relatedTermsAccordion" gap={calculateFromMainWidth(64, mainWidth) as any}>
                            <Accordion w={calculateFromMainWidth(976, mainWidth) as any} size="lg" defaultValue={['b']} type="multiple" isCollapsible={true} isDisabled={false} borderColor='#ACB4BD' overflow='hidden'>
                                <AccordionItem value="b">
                                    <AccordionHeader bg='#F8F9FA' justifyContent="center" alignContent="center" sx={{ h: calculateFromMainWidth(96, mainWidth), pl: calculateFromMainWidth(30, mainWidth), pr: calculateFromMainWidth(36, mainWidth) } as any}>
                                        <AccordionTrigger>
                                            {({ isExpanded }) => (
                                                <>
                                                    <Text fontSize={'1.25em' as any} fontWeight={700}>Broader</Text>
                                                    {isExpanded ? (
                                                        <AccordionIcon as={ChevronUpIcon} ml="$3" />
                                                    ) : (
                                                        <AccordionIcon as={ChevronDownIcon} ml="$3" />
                                                    )}
                                                </>
                                            )}
                                        </AccordionTrigger>
                                    </AccordionHeader>
                                    <AccordionContent justifyContent="center" alignContent="center" gap={calculateFromMainWidth(12, mainWidth) as any} sx={{ ml: calculateFromMainWidth(30, mainWidth), mt: calculateFromMainWidth(36, mainWidth), minH: calculateFromMainWidth(96, mainWidth) } as any}>
                                        {termData.relatedTerms.Broader.length > 0 ? (
                                            termData.relatedTerms.Broader.map(term => (
                                                <Box flexDirection='row'>
                                                    <Link
                                                        href={`/${termData.vocabulary}/${extractLabel(term)}`}
                                                        mb={1}
                                                        key={term}
                                                        flexDirection='row'
                                                        alignItems='center'
                                                        sx={TERM_LINK_SX as any}
                                                    >
                                                        <LinkText
                                                            color='inherit'
                                                            fontSize={'1em' as any}
                                                            fontWeight={500}
                                                            textDecorationLine='underline'
                                                            sx={TERM_LINK_TEXT_SX as any}
                                                        >
                                                            {getTermLabel(term, false)}
                                                        </LinkText>
                                                        <Box sx={TERM_LINK_ICON_BOX_SX as any}>
                                                            <Icon as={ArrowRight} p={2} h={calculateFromMainWidth(24, mainWidth) as any} w={calculateFromMainWidth(24, mainWidth) as any} color='currentColor' />
                                                        </Box>
                                                    </Link>
                                                </Box>
                                            ))
                                        ) : (
                                            <Text color='$secondary300'>No Broader concepts...</Text>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion w={calculateFromMainWidth(976, mainWidth) as any} size="lg" defaultValue={['a']} type="multiple" isCollapsible={true} isDisabled={false} borderColor='#ACB4BD' overflow='hidden'>
                                <AccordionItem value="a">
                                    <AccordionHeader bg='#F8F9FA' justifyContent="center" alignContent="center" sx={{ h: calculateFromMainWidth(96, mainWidth), pl: calculateFromMainWidth(30, mainWidth), pr: calculateFromMainWidth(36, mainWidth) } as any}>
                                        <AccordionTrigger>
                                            {({ isExpanded }) => (
                                                <>
                                                    <Text fontSize={'1.25em' as any} fontWeight={700}>Narrowers</Text>
                                                    {isExpanded ? (
                                                        <AccordionIcon as={ChevronUpIcon} ml="$3" />
                                                    ) : (
                                                        <AccordionIcon as={ChevronDownIcon} ml="$3" />
                                                    )}
                                                </>
                                            )}
                                        </AccordionTrigger>
                                    </AccordionHeader>
                                    <AccordionContent justifyContent="center" gap={calculateFromMainWidth(36, mainWidth) as any} alignContent="center" sx={{ ml: calculateFromMainWidth(30, mainWidth), mt: calculateFromMainWidth(36, mainWidth), minH: calculateFromMainWidth(96, mainWidth) } as any}>
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
                                                        <Box key={`narrower-section-${section.letter}`} gap={calculateFromMainWidth(16, mainWidth) as any}>
                                                            <Text fontSize={'1.25em' as any} fontWeight={700} color="#1C2834" mt={calculateFromMainWidth(24, mainWidth) as any}>
                                                                {section.letter}
                                                            </Text>
                                                            <Box gap={calculateFromMainWidth(12, mainWidth) as any}>
                                                                {section.entries.map(({ term, label }) => {
                                                                    const slug = extractLabel(term) ?? term;
                                                                    return (
                                                                        <Box flexDirection="row" key={term}>
                                                                            <Link
                                                                                href={`/${termData.vocabulary}/${slug}`}
                                                                                mb={1}
                                                                                flexDirection="row"
                                                                                alignItems="center"
                                                                                sx={TERM_LINK_SX as any}
                                                                            >
                                                                                <LinkText
                                                                                    color="inherit"
                                                                                    fontSize={'1em' as any}
                                                                                    fontWeight={500}
                                                                                    textDecorationLine="underline"
                                                                                    sx={TERM_LINK_TEXT_SX as any}
                                                                                >
                                                                                    {label}
                                                                                </LinkText>
                                                                                <Box sx={TERM_LINK_ICON_BOX_SX as any}>
                                                                                    <Icon
                                                                                        as={ArrowRight}
                                                                                        p={2}
                                                                                        h={calculateFromMainWidth(24, mainWidth) as any}
                                                                                        w={calculateFromMainWidth(24, mainWidth) as any}
                                                                                        color="currentColor"
                                                                                    />
                                                                                </Box>
                                                                            </Link>
                                                                        </Box>
                                                                    );
                                                                })}
                                                            </Box>
                                                            {sectionIndex !== sections.length - 1 ? (
                                                                <Divider orientation='horizontal' mt={calculateFromMainWidth(64, mainWidth) as any} />
                                                            ) : null}
                                                        </Box>
                                                    ));
                                                })()
                                            ) : (
                                                termData.relatedTerms.Narrower.map(term => (
                                                    <Box flexDirection='row'>
                                                        <Link
                                                            href={`/${termData.vocabulary}/${extractLabel(term)}`}
                                                            mb={1}
                                                            key={term}
                                                            flexDirection='row'
                                                            alignItems='center'
                                                            sx={TERM_LINK_SX as any}
                                                        >
                                                            <LinkText
                                                                color='inherit'
                                                                fontSize={'1em' as any}
                                                                fontWeight={500}
                                                                textDecorationLine='underline'
                                                                sx={TERM_LINK_TEXT_SX as any}
                                                            >
                                                                {getTermLabel(term, false)}
                                                            </LinkText>
                                                            <Box sx={TERM_LINK_ICON_BOX_SX as any}>
                                                                <Icon as={ArrowRight} p={2} h={calculateFromMainWidth(24, mainWidth) as any} w={calculateFromMainWidth(24, mainWidth) as any} color='currentColor' />
                                                            </Box>
                                                        </Link>
                                                    </Box>
                                                ))
                                            )
                                        ) : (
                                            <Text color='$secondary300'>No Narrowers concepts...</Text>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion w={calculateFromMainWidth(976, mainWidth) as any} size="lg" defaultValue={['or']} type="multiple" isCollapsible={true} isDisabled={false} borderColor='#ACB4BD' overflow='hidden'>
                                <AccordionItem value="or">
                                    <AccordionHeader bg='#F8F9FA' justifyContent="center" alignContent="center" sx={{ h: calculateFromMainWidth(96, mainWidth), pl: calculateFromMainWidth(30, mainWidth), pr: calculateFromMainWidth(36, mainWidth) } as any}>
                                        <AccordionTrigger>
                                            {({ isExpanded }) => (
                                                <>
                                                    <Text fontSize={'1.25em' as any} fontWeight={700}>Other Relations</Text>
                                                    {isExpanded ? (
                                                        <AccordionIcon as={ChevronUpIcon} ml="$3" />
                                                    ) : (
                                                        <AccordionIcon as={ChevronDownIcon} ml="$3" />
                                                    )}
                                                </>
                                            )}
                                        </AccordionTrigger>
                                    </AccordionHeader>
                                    <AccordionContent justifyContent="center" gap={calculateFromMainWidth(12, mainWidth) as any} alignContent="center" sx={{ ml: calculateFromMainWidth(30, mainWidth), mt: calculateFromMainWidth(36, mainWidth), minH: calculateFromMainWidth(96, mainWidth) } as any}>
                                        {Object.keys(termData.relatedTerms.OtherRelation).length > 0 ? (
                                            Object.entries(termData.relatedTerms.OtherRelation).map(([predicate, terms]) => (
                                                terms.map((term: string, index: number) => (
                                                    <Box key={`${predicate}-${index}`} mb={10} flexDirection='row' alignItems="center">
                                                        {renderRelatedTerm(term, predicate, index)}
                                                    </Box>
                                                ))
                                            ))
                                        ) : (
                                            <Text color='$secondary300'>No related concepts...</Text>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </Box>
                    </Box>
                </Box>
            </RootLayout >
        );
    }
};

export default VocabolaryTerm;
