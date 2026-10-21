'use client';

import React, { useMemo, useRef } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

import PageLayout from './PageLayout';
import { useMainWidth, calculateFromMainWidth } from '../utils/heightUtils';

import CardHome from './CardHome';
import { vocabularies } from '../data/vocabularies';
import HeroSection from './HeroSection';
import { AnchorNav, AnchorItem } from './AnchorNav';

type FlagCode = 'EN' | 'DE' | 'IT' | 'FR';

const slugify = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const ANCHOR_OFFSET = 120;

const Homepage: React.FC = () => {
    const mainWidth = useMainWidth();
    const vocabulariesRef = useRef<HTMLDivElement>(null);
    const anchorOffset = useMemo(
        () => Number.parseInt(calculateFromMainWidth(ANCHOR_OFFSET, mainWidth), 10),
        [mainWidth]
    );

    const handleScrollToVocabularies = () => {
        vocabulariesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const title = 'Homepage - Controlled Vocabularies Interface';

    const flagImages = {
        'EN': 'flag-en.jpg',
        'DE': 'flag-de.jpg',
        'IT': 'flag-it.png',
        'FR': 'flag-fr.png'
    } as Record<FlagCode, string>;

    const sections = useMemo(
        () =>
            vocabularies.map((vocab) => ({
                ...vocab,
                sectionId: slugify(vocab.name),
            })),
        [vocabularies]
    );

    const navItems: AnchorItem[] = useMemo(
        () => sections.map(({ sectionId, name }) => ({ id: sectionId, label: name })),
        [sections]
    );

    return (
        <PageLayout title={title}>
            <HeroSection onExploreClick={handleScrollToVocabularies} />
            <Box style={{ marginBottom: calculateFromMainWidth(130, mainWidth) as any } as any} className="w-full m-auto"   >
                <Box style={{ paddingLeft: calculateFromMainWidth(130, mainWidth) as any } as any} className="flex-row items-start w-full"

                    ref={vocabulariesRef as any}



                >
                    <Box style={{ marginRight: calculateFromMainWidth(64, mainWidth) as any, gap: calculateFromMainWidth(64, mainWidth) as any, width: calculateFromMainWidth(976, mainWidth), flexShrink: 0 } as any}



                    >
                        <Text className="text-[2em] font-[600] leading-[40px] tracking-[-0.5px] align-middle text-[#1C2834]"      >Vocabularies</Text>
                        <VStack style={{ gap: calculateFromMainWidth(40, mainWidth) as any } as any} >
                            {sections.map((vocab, index) => (
                                <Box style={{ scrollMarginTop: `${anchorOffset}px` } as any}
                                    key={`vocab-${index}`}
                                    id={vocab.sectionId}

                                >
                                    <CardHome
                                        title={vocab.name}
                                        overviewHref={`/${vocab.id}`}
                                        description={vocab.description}
                                        englishFlagSrc={flagImages['EN']}
                                        translations={{
                                            DE: vocab.translations['DE'],
                                            FR: vocab.translations['FR'],
                                            IT: vocab.translations['IT'],
                                        }}
                                        topConcepts={vocab.topConcept}
                                    />
                                </Box>
                            ))}
                        </VStack>
                    </Box>
                    <Box style={{ marginTop: calculateFromMainWidth(104, mainWidth) as any, width: calculateFromMainWidth(326, mainWidth), minWidth: calculateFromMainWidth(326, mainWidth), flexShrink: 0 } as any} className="self-start"



                    >
                        <AnchorNav
                            items={navItems}
                            offset={anchorOffset}
                            stickyTop={anchorOffset}
                        />
                    </Box>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default Homepage;
