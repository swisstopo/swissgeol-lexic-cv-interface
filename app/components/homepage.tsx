'use client';

import React, { useMemo, useRef } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

import PageLayout from './PageLayout';
import { useMainWidth, calculateFromMainWidth } from '../utils/heightUtils';

import CardHome from './CardHome';
import HeroSection from './HeroSection';
import { AnchorNav, AnchorItem } from './AnchorNav';

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
    const anchorOffset = useMemo(
        () => Number.parseInt(calculateFromMainWidth(ANCHOR_OFFSET, mainWidth), 10),
        [mainWidth]
    );

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
            description: 'The controlled vocabulary on "Tectonic Units" includes terms used to describe the tectonic units of Switzerland in 3D models, maps, boreholes, and other assets managed by the Swiss Geological Survey. These tectonic elements are 3D bodies bounded by “Tectonic Structures” and classified according to their present-day structural position (resulting predominantly from their Alpine deformation history). This vocabulary is based on the Tectonic Map of Switzerland 1:500’000 (Gouffon et al. 2024), adapted and complemented for more detailed attributions, considering additional internal and external links.',
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
            name: 'Tectonic Structures',
            translations: {
                'EN': 'Tectonic Structures',
                'DE': 'Tektonische Strukturen',
                'IT': 'Strutture tettoniche',
                'FR': 'Structures tectoniques'
            },
            description: 'The controlled vocabulary on "Tectonic Structures" includes terms used to describe faults, folds and further deformation zones of Switzerland in 3D models, maps, boreholes, and other assets managed by the Swiss Geological Survey. These tectonic elements occur as rather narrow bands (often generalised as 3D surfaces or 2D lines) that either serve as boundaries to define “Tectonic Units” or are situated within them, respectively cut through them.',
            topConcept: [
                { label: 'tektonische Störung (de), tectonic accident (en), accident tectonique (fr), faglia (it)', url: '/TectonicStructures/Fault' },
                { label: 'Falte (de), fold (en), pli (fr), piega (it)', url: '/TectonicStructures/Fold' },
                { label: 'Deformationszone (de), deformation zone (en), zone de déformation (fr), zona di deformazione (it)', url: '/TectonicStructures/ZoneDeformation' },
            ],
        },
        {
            name: 'Lithostratigraphic Correlations',
            translations: {
                'EN': 'Lithostratigraphic Correlations',
                'DE': 'Lithostratigraphische Korrelationen',
                'IT': 'Correlazioni litostratigrafiche',
                'FR': 'Corrélations lithostratigraphiques'
            },
            description: 'The controlled vocabulary "Lithostratigraphic Correlations" includes generic terms used to group and parallelize formations and subordinate lithostratigraphic units across a large (paleo)geographical extent based on a common geodynamic evolution. This classification scheme is used in maps, boreholes, and other items maintained by the Swiss Geological Survey.',
            topConcept: [
                { label: 'Alpine Cycle', url: '/ls_correlations/AlpineCycle' },
                { label: 'Ante-Alpine Basement', url: '/ls_correlations/BasementAnteAlpine' },
                { label: 'Post Messinian', url: '/ls_correlations/PostMessinian' },
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
                { label: "Europäische Platte (de), European Plate (en), Plaque européenne (fr), Piatto europeano (it)", url: '/Lithostratigraphy/EuropeanPlate' },
                { label: "Adriatische Platte (de), Adriatic Plate (en), PPlaque adriatique (fr), Piatto adriatico (it)", url: '/Lithostratigraphy/AdriaticPlate' },
                { label: "Molasse-Becken (de), Molasse Basin (en), Bassin molassique (fr), Bacino molassico (it)", url: '/Lithostratigraphy/MolasseBasin' },
                { label: "Alpines Magmatismus (de), Alpine Magmatism (en), Magmatisme alpin (fr), Magmatismo alpino (it)", url: '/Lithostratigraphy/AlpineMagmatism' },
                { label: "Briançonnais-Terrane (de), Briançonnais Terrane (en), Terrane briançonnais (fr), Terrane briançonnese (it)", url: '/Lithostratigraphy/BrianconnaisTerrane' },
                { label: "Cervinia-Terrane (de), Cervinia Terrane (en), Terrane Cervinia (fr), Terrane Cervinia (it)", url: '/Lithostratigraphy/CerviniaTerrane' },
                { label: "Melange (de), Mélange (en), Mélange (fr), Mélange (it)", url: '/Lithostratigraphy/Melange' },
                { label: "Piémont-Ozean (de), Piémont Ocean (en), Océan piémontais (fr), Oceano piemontese (it)", url: '/Lithostratigraphy/PiemontOcean' },
                { label: "Walliser Trog (de), Valaisan Basin (en), Bassin valaisan (fr), Bacino vallese (it)", url: '/Lithostratigraphy/ValaisanBasin' },
                { label: "Pliozäne und Quartäre Lithostratigraphie (de), Pliocene and Quaternary Lithostratigraphy (en), Lithostratigraphie du Pliocène et du Quaternaire (fr), Litostratigrafia del Pliocene e del Quaternario (it)", url: '/Lithostratigraphy/PlioQuaternaryLithostratigraphy' },
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
            name: 'Material Description',
            translations: {
                'EN': 'Material Description',
                'DE': 'Materialbeschreibung',
                'IT': 'Descrizione del materiale',
                'FR': 'Description du matériau'
            },
            description: 'The controlled vocabulary “Material Description” includes descriptive terms to characterise geological materials — i.e. rocks and unconsolidated deposits — covering diverse aspects such as colour, material properties, components, and fabric. The nomenclature was extracted and consolidated from code lists in key swisstopo products, mainly boreholes.swissgeol.ch and swissGeoCover2D, preserving model-specific traits and adding new terms — bridging datasets that describe the same concepts in different ways. This vocabulary is developed by swisstopo as a shared semantic basis across different datasets of the Swiss Geological Survey. It will be progressively complemented (cf. placeholders for further code lists and branches).',
            topConcept: [
                { label: "Farbe (de), Colour (en), Couleur (fr), Colore (it)", url: '/materialDescription/Colour' },
                { label: "Materialeigenschaft (de), Material property (en), Propriété du matériau (fr), Proprietà del materiale (it)", url: '/materialDescription/MaterialProperty' },
                { label: "Materialkomponente (de), Material components (en), Composants matériels (fr), Componenti del materiale (it)", url: '/materialDescription/MaterialComponents' },
                { label: "Mutuale Anordnung der Komponenten (de), Mutual arrangement of components (en), Arrangement mutuel des composants (fr), Disposizione mutuale dei componenti (it)", url: '/materialDescription/MaterialFabric' },
            ],
        },
    ];

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
