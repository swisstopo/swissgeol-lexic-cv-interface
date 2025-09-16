import React from 'react';
import { Box, Text, Link, Badge, Menu, MenuItemLabel, MenuItem, Button, ButtonIcon, ButtonText, ChevronDownIcon, Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent, AccordionIcon, BadgeText, LinkText } from '@gluestack-ui/themed';
import { DownloadIcon, Map, Search, ChevronUpIcon } from 'lucide-react';
import Breadcrumbs from './Breacrumbs';
import RootLayout from '../layout';
import { TermData } from '../models/termDataInterface';
import { BreadCrumbsData } from '../models/breadCrumbsInterface';

interface VocabolaryTermProps {
    termData: TermData | null;
    breadCrumbsData: BreadCrumbsData;
    allConceptMap: Map<string, string>;
}

const VocabolaryTerm: React.FC<VocabolaryTermProps> = ({ termData, breadCrumbsData, allConceptMap }) => {
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
        console.log(allConceptMap);
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
     * Retrieve the path of images based on the label indicating the language
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

    if (termData) {
        const title = termData.term + ' - ' + termData.vocabulary + ' - Controlled Vocabularies Interface';

        return (
            <RootLayout title={title} showReleaseGitHub={true} termData={termData}>
                <Box id={termData.term} width='100%' mb={100}>
                    <Breadcrumbs data={breadCrumbsData} />
                    <Box width='100%' paddingRight={15} paddingLeft={15} marginRight='auto' marginLeft='auto' w='70%' m='auto' mt='2%'>
                        <Box flexDirection='row' gap={1} /* mb={5} */ alignItems='baseline'>
                            <Text fontSize={20} color='$secondary300' fontWeight={'$semibold'}>{termData.vocabulary}</Text>
                            {termData.version && (
                                /^https?:\/\//.test(termData.version) ? (
                                    <Link href={termData.version} ml={40}>
                                        <LinkText fontSize={10} color='$secondary300' fontWeight={'$semibold'}>[{termData.version}]</LinkText>
                                    </Link>
                                ) : (
                                    <Text fontSize={10} color='$secondary300' ml={40} fontWeight={'$semibold'}>[{termData.version}]</Text>
                                )
                            )}
                        </Box>
                        <Box mb={4} flexDirection='row' alignItems='baseline'>
                            {Object.entries(termData.languages).map(([lang, translation]) => (
                                lang === 'en' && (
                                    <Text mb={0} fontWeight='$bold' color='black' fontSize={40} m={0}>
                                        {translation}
                                    </Text>
                                )
                            ))}
                            <Box marginLeft={24} flexDirection='row'>
                                <Badge size="md" variant="solid" borderRadius="$full" bgColor='$success500' mr={5}>
                                    <BadgeText color='white' textAlign='center' fontSize={10} fontWeight='$semibold'>{extractLabel(termData.termStatus)}</BadgeText>
                                </Badge>
                            </Box>
                        </Box>
                        <Box flexDirection='row' marginBottom='1%'>
                            <Badge size="md" variant="solid" borderRadius="$md" bgColor='red' mr={5}>
                                <BadgeText color='white' textAlign='center' fontSize={10} fontWeight='$semibold'>URI</BadgeText>
                            </Badge>
                            <Link href={termData.uri} mb={1} flexWrap='wrap' w={'95%'}>
                                <LinkText textDecorationLine='none'>{termData.uri}</LinkText>
                            </Link>
                        </Box>

                        <Box borderWidth={1} padding={8} rounded={10} alignItems='center' flexDirection='row' flexWrap='wrap' borderColor='#dee2e6' bg='white'>
                            {Object.entries(termData.languages).map(([lang, translation]) => (
                                <Box flexDirection='row' marginRight={24} key={lang} mt={5} mb={5}>
                                    <Box rounded="$full" width={20} height={20} bgColor="$orange100" overflow="hidden" mr={7}>
                                        <img
                                            id="imgLogo"
                                            height="100%"
                                            src={getFlagImageUrl(lang)}
                                            alt={`${lang} flag`}
                                        />
                                    </Box>
                                    <Text mb='$0'>{translation}</Text>
                                </Box>
                            ))}
                        </Box>
                        <Box flexDirection='row' justifyContent='flex-end' marginTop={8} gap={20} marginBottom={20}>
                            <Button size="sm" variant="solid" action="primary" isDisabled={false} isFocusVisible={false} bgColor='red' rounded={5}>
                                <ButtonIcon as={Map} mr={5} />
                                <ButtonText fontWeight='$medium'>Go To Map View </ButtonText>
                            </Button>
                        </Box>
                        <Box w='100%'>
                            <Box borderWidth={1} rounded={8} bgColor='white' padding={20} mb={20} borderColor='#dee2e6'>
                                <Text fontSize={32} color='black' mb={10}>Details</Text>
                                <Text color={termData.definition ? undefined : '$secondary300'}>{termData.definition || 'No description...'}</Text>
                                <Box mt={20} pl={20}>
                                    <Text fontSize={12} fontStyle='italic'>- {termData.isDefinedBy}</Text>
                                    {/* <Text fontSize={12} fontStyle='italic'>- Wikipedia: Quaternary Period. - Wikipedia, the Free Encyclopedia, 2023. Retrieved from https://en.wikipedia.org/wiki/Quaternary_Period</Text>
                                    <Text fontSize={12} fontStyle='italic'>- Wikipedia: Quaternary Period. - Wikipedia, the Free Encyclopedia, 2023. Retrieved from https://en.wikipedia.org/wiki/Quaternary_Period</Text> */}
                                </Box>
                            </Box>
                            <Box borderWidth={1} rounded={8} bgColor='white' padding={20} mb={20} borderColor='#dee2e6'>
                                <Text fontSize={32} color='black' mb={10}>Related Terms</Text>
                                <Box flexDirection='column' id="relatedTermsAccordion">
                                    <Accordion m='auto' width="100%" size="lg" defaultValue={['b', 'n', 'or']} type="multiple" isCollapsible={true} isDisabled={false}>
                                        <AccordionItem value="b">
                                            <AccordionHeader>
                                                <AccordionTrigger>
                                                    {({ isExpanded }) => (
                                                        <>
                                                            <Text fontSize={16} fontWeight='$semibold'>Broader</Text>
                                                            {isExpanded ? (
                                                                <AccordionIcon as={ChevronUpIcon} ml="$3" />
                                                            ) : (
                                                                <AccordionIcon as={ChevronDownIcon} ml="$3" />
                                                            )}
                                                        </>
                                                    )}
                                                </AccordionTrigger>
                                            </AccordionHeader>
                                            <AccordionContent bgColor='$white' ml={15}>
                                                {termData.relatedTerms.Broader.length > 0 ? (
                                                    termData.relatedTerms.Broader.map(term => (
                                                        <Box flexDirection='row'>
                                                            <Text>•</Text>
                                                            <Link href={`/${termData.vocabulary}/${extractLabel(term)}`} mb={1} key={term}>
                                                                <LinkText color='#7c7c7c' textDecorationLine='none'> {getTermLabel(term, false)}</LinkText>
                                                            </Link>
                                                        </Box>
                                                    ))
                                                ) : (
                                                    <Text color='$secondary300'>No Broader concepts...</Text>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="n">
                                            <AccordionHeader>
                                                <AccordionTrigger>
                                                    {({ isExpanded }) => (
                                                        <>
                                                            <Text fontSize={16} fontWeight='$semibold'>Narrowers</Text>
                                                            {isExpanded ? (
                                                                <AccordionIcon as={ChevronUpIcon} ml="$3" />
                                                            ) : (
                                                                <AccordionIcon as={ChevronDownIcon} ml="$3" />
                                                            )}
                                                        </>
                                                    )}
                                                </AccordionTrigger>
                                            </AccordionHeader>
                                            <AccordionContent bgColor='$white' ml={15}>
                                                {termData.relatedTerms.Narrower.length > 0 ? (
                                                    termData.relatedTerms.Narrower.map(term => (
                                                        <Box flexDirection='row'>
                                                            <Text>•</Text>
                                                            <Link href={`/${termData.vocabulary}/${extractLabel(term)}`} mb={1} key={term}>
                                                                <LinkText color='#7c7c7c' textDecorationLine='none'> {getTermLabel(term, false)}</LinkText>
                                                            </Link>
                                                        </Box>
                                                    ))
                                                ) : (
                                                    <Text color='$secondary300'>No Narrowers concepts...</Text>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="or">
                                            <AccordionHeader>
                                                <AccordionTrigger>
                                                    {({ isExpanded }) => (
                                                        <>
                                                            <Text fontSize={16} fontWeight='$semibold'>Other Relations</Text>
                                                            {isExpanded ? (
                                                                <AccordionIcon as={ChevronUpIcon} ml="$3" />
                                                            ) : (
                                                                <AccordionIcon as={ChevronDownIcon} ml="$3" />
                                                            )}
                                                        </>
                                                    )}
                                                </AccordionTrigger>
                                            </AccordionHeader>
                                            <AccordionContent bgColor='$white' ml={15}>
                                                {Object.keys(termData.relatedTerms.OtherRelation).length > 0 ? (
                                                    Object.entries(termData.relatedTerms.OtherRelation).map(([predicate, terms]) => (
                                                        terms.map((term: string, index: number) => (
                                                            <Box key={`${predicate}-${index}`} mb={10} flexDirection='row' alignItems="center">
                                                                <Text>•</Text>
                                                                <Badge bg='#e0e0e0' variant='solid' borderRadius="$full" ml={2} mr={2}>
                                                                    <BadgeText color='#7c7c7c' fontSize={12} fontWeight={'$bold'} mb={1}>
                                                                        {getTermLabel(predicate, true)}
                                                                    </BadgeText>
                                                                </Badge>
                                                                <Box ml={4}>
                                                                    {term.startsWith('http') ? (
                                                                        <Link href={`${term}`} mb={1} key={`${predicate}-${index}`}>
                                                                            <Text fontSize={14} color="#7c7c7c" textDecorationLine="none">
                                                                                {getTermLabel(term, false)}
                                                                            </Text>
                                                                        </Link>
                                                                    ) : (
                                                                        <Text fontSize={14} color="#7c7c7c" textDecorationLine="none" mb={1} key={`${predicate}-${index}`}>
                                                                            {term}
                                                                        </Text>
                                                                    )}
                                                                </Box>
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
                    </Box>
                </Box>
            </RootLayout >
        );
    }
};

export default VocabolaryTerm;
