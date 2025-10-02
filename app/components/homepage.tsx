'use client';

import React, { useMemo, useRef } from 'react';
import { Box, VStack, Text } from '@gluestack-ui/themed';
import RootLayout from '../layout';
import { useMainWidth, calculateFromMainWidth } from '../utils/heightUtils';

import CardHome from './CardHome';
import HeroSection from './HeroSection';

interface Translation {
    [key: string]: string;
}

type FlagCode = 'EN' | 'DE' | 'IT' | 'FR';

interface TopConcept {
    label: string;
    url: string;
}

interface Vocabulary {
    name: string;
    translations: Translation;
    description: string;
    topConcept: TopConcept[];
}

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

    const handleScrollToVocabularies = () => {
        vocabulariesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const title = 'Homepage - Controlled Vocabularies Interface';
    const vocabularies: Vocabulary[] = [
        {
            name: 'Chronostratigraphy',
            translations: {
                'EN': 'Chronostratigraphy',
                'DE': 'Chronostratigraphie',
                'IT': 'Cronostratigrafia',
                'FR': 'Chronostratigraphie'
            },
            description: 'The controlled vocabulary on "Chronostratigraphy" includes terms used to describe the age of geological units in Switzerland, as seen in maps, boreholes, and other assets managed by the Swiss Geological Survey. This vocabulary is based on the International Stratigraphic Chart (www.stratigraphy.org), adapted for national specificities and formatted for Swiss multilingual usage. It also includes historical and informal nomenclature, linked to official terms.',
            topConcept: [
                { label: "Phanerozoikum (de), Phanerozoic (en), Phanérozoïque (fr), Fanerozoico (it)", url: '/Chronostratigraphy/Phanerozoic' },
                { label: "Präkambrium (de), Precambrian (en), Précambrien (fr), Precambriano (it)", url: '/Chronostratigraphy/Precambrian' },
            ]
        },
        {
            name: 'Tectonic Units',
            translations: {
                'EN': 'Tectonic Units',
                'DE': 'Tektonische Einheiten',
                'IT': 'Unità tettoniche',
                'FR': 'Unités tectoniques'
            },
            description: 'The controlled vocabulary on "Tectonic Units" includes terms used to describe the tectonic units of Switzerland in maps, boreholes, and other assets managed by the Swiss Geological Survey. This vocabulary is based on the Tectonic Map of Switzerland 1:500,000 (Gouffon et al. 2024), adapted and complemented for more detailed attributions, considering additional internal and external links.',
            topConcept: [
                { label: "Abgescherte Nordalpines Vorland (de), Detached North Alpine Foreland (en), Avant-pays nord-alpin décolle (fr), Avampaese nordalpino distaccato (it)", url: '/TectonicUnits/DetachedNorthAlpineForeland' },
                { label: "Autochthones Nordalpines Vorland (de), Autochthonous North Alpine Foreland (en), Avant-pays nord-alpin autochtone (fr), Avampaese nordalpino autoctono (it)", url: '/TectonicUnits/AutochthonousNorthAlpineForeland' },
                { label: "Helvetikum (de), Helvetic (en), Helvétique (fr), Elvetico (it)", url: '/TectonicUnits/Helvetic' },
                { label: "Lepontikum (de), Lepontic (en), Lépontique (fr), Lepontico (it)", url: '/TectonicUnits/Lepontic' },
                { label: "Ostalpin (de), Austroalpine (en), Austroalpin (fr), Austroalpino (it)", url: '/TectonicUnits/Austroalpine' },
                { label: "Penninikum (de), Penninic (en), Pennique (fr), Pennidico (it)", url: '/TectonicUnits/Penninic' },
                { label: "Salassikum (de), Salassic (en), Salassique (fr), Salassico (it)", url: '/TectonicUnits/Salassic' },
                { label: "Südalpin (de), South Alpine (en), Sudalpin (fr), Sudalpino (it)", url: '/TectonicUnits/SouthAlpine' },
                { label: "Känozoische magmatische Gesteine (de), Cenozoic magmatic rocks (en), Roches magmatiques cénozoïques (fr), Rocce magmatiche cenozoiche (it)", url: '/TectonicUnits/CenozoicMagmaticRocks' },
            ],
        },
        {
            name: 'Lithology',
            translations: {
                'EN': 'Lithology',
                'DE': 'Lithologie',
                'IT': 'Litologia',
                'FR': 'Lithologie'
            },
            description: 'The controlled vocabulary on "Lithology" includes terms used to describe the rock types and lithological characteristics of Switzerland in maps, boreholes, and other assets managed by the Swiss Geological Survey. This vocabulary is based on standardized geological classifications, adapted and complemented for detailed attributions of rock materials and their properties, considering additional internal and external links',
            topConcept: [
                { label: "Gestein (de), Rock (en), Roche (fr), Roccia (it)", url: '/Lithology/Rock' },
            ],
        },
        {
            name: 'Lithostratigraphy',
            translations: {
                'EN': 'Lithostratigraphy',
                'DE': 'Lithostratigraphie',
                'IT': 'Litostratigrafia',
                'FR': 'Lithostratigraphie'
            },
            description: 'The controlled vocabulary “Lithostratigraphy” includes terms used to describe and classify the lithostratigraphic units of Switzerland in maps, boreholes, and other items maintained by the Swiss Geological Survey. This vocabulary is based on the fundamental principles of stratigraphy that allow rock layers to be studied and categorized according to their lithological characteristics, enabling correlation between different geographic areas',
            topConcept: [
                { label: "Europäische Platte (de), European Plate (en), Plaque européenne (fr), Piatto europeano (it)", url: '/Lithostratigraphy/Europeanplate' },
                { label: "Adriatische Platte (de), Adriatic Plate (en), PPlaque adriatique (fr), Piatto adriatico (it)", url: '/Lithostratigraphy/Adriaticplate' },
                { label: "Molasse-Becken (de), Molasse Basin (en), Bassin molassique (fr), Bacino molassico (it)", url: '/Lithostratigraphy/Molassebasin' },
                { label: "Alpines Magmatismus (de), Alpine Magmatism (en), Magmatisme alpin (fr), Magmatismo alpino (it)", url: '/Lithostratigraphy/Alpinemagmatism' },
                { label: "Briançonnais-Terrane (de), Briançonnais Terrane (en), Terrane briançonnais (fr), Terrane briançonnese (it)", url: '/Lithostratigraphy/Brianconnaisterrane' },
                { label: "Cervinia-Terrane (de), Cervinia Terrane (en), Terrane Cervinia (fr), Terrane Cervinia (it)", url: '/Lithostratigraphy/Cerviniaterrane' },
                { label: "Melange (de), Mélange (en), Mélange (fr), Mélange (it)", url: '/Lithostratigraphy/Melange' },
                { label: "Piémont-Ozean (de), Piémont Ocean (en), Océan piémontais (fr), Oceano piemontese (it)", url: '/Lithostratigraphy/Piemontocean' },
                { label: "Walliser Trog (de), Valaisan Basin (en), Bassin valaisan (fr), Bacino vallese (it)", url: '/Lithostratigraphy/Valaisanbasin' },
            ],
        }
    ];

    const flagImages = {
        'EN': 'Bandiera-inglese.jpg',
        'DE': 'GERMANIA.jpg',
        'IT': 'italia.png',
        'FR': 'Flag_of_France_(1794–1815,_1830–1974).svg.png'
    } as Record<FlagCode, string>;

    const sections = useMemo(
        () =>
            vocabularies.map((vocab) => ({
                ...vocab,
                sectionId: slugify(vocab.name),
            })),
        [vocabularies]
    );

    return (
        <RootLayout title={title}>
            <HeroSection onExploreClick={handleScrollToVocabularies} />
            <Box w={'100%'} m={'auto'} mb={calculateFromMainWidth(130, mainWidth) as any}>
                <Box
                    w={'100%'}
                    ref={vocabulariesRef as any}
                    pl={'8.7%'}
                    pr={'8.7%'}
                    justifyContent='space-between'
                    flexDirection='row'
                >
                    <Box gap={calculateFromMainWidth(64, mainWidth) as any}>
                        <Text fontSize={'2em' as any} fontWeight={600} lineHeight={40} color='#1C2834' letterSpacing={-0.5} verticalAlign='middle'>Vocabularies</Text>
                        <VStack gap={calculateFromMainWidth(40, mainWidth) as any}>
                            {sections.map((vocab, index) => (
                                <Box
                                    key={`vocab-${index}`}
                                    id={vocab.sectionId}
                                    sx={{ scrollMarginTop: `${ANCHOR_OFFSET}px` } as any}
                                >
                                    <CardHome
                                        title={vocab.name}
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
                </Box>
            </Box>
        </RootLayout>
    );
};

export default Homepage;
