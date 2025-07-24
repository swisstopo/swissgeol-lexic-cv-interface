'use client';

import React from 'react';
import { Box, VStack, HStack, Text, Image, Link } from '@gluestack-ui/themed';
import RootLayout from '../layout';

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

const Homepage: React.FC = () => {
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
    };

    const flags: FlagCode[] = ['EN', 'DE', 'IT', 'FR'];

    return (
        <RootLayout title={title} showReleaseGitHub={false} termData={null}>
            <Box m={'auto'} mb={50}>
                <Box w='77%' mt={40} m={'auto'}>
                    {/* <Text fontSize="$3xl" fontWeight="$bold">lexic.swissgeol.ch</Text> */}
                    <Text fontSize="$xl" /* textAlign="center" */><Text fontSize="$3xl" bold mb={0}>Welcome to lexic.swissgeol.ch</Text>,{"\n"}the controlled vocabulary platform for geology developed by swisstopo.</Text>
                </Box>
                < VStack space="xl" p="$6" alignItems="center" >
                    <Box bg="$backgroundLight100" p="$4" borderRadius="$md" width="80%">
                        <Text /* textAlign="center" */>
                            <Text bold fontSize={20}>Explore Our Features:</Text>{"\n\n"}
                            {"  • "}<Text bold>User-Friendly Interface:</Text> Discover geological vocabularies and terminology through our intuitive landing page and main user interface.{"\n"}
                            {"  • "}<Text bold>Web Map Query Tool:</Text> Use our data and build queries with the integrated vocabularies for enhanced research.{"\n"}
                            {"  • "}<Text bold>Vocabulary Engineering Environment:</Text> Develop, manage, and publish vocabularies or ontologies using our advanced tools.{"\n\n"}
                            Currently, lexic.swissgeol.ch is in its pilot phase. We are actively developing and refining features, and more vocabularies are planned for publication. Your feedback, suggestions, and ideas are most welcome.{"\n"}
                            Please do not hesitate to contact us at <Link href="mailto:swissgeol@swisstopo.ch"><Text color='$info900'> swissgeol@swisstopo.ch</Text></Link>.
                        </Text>
                    </Box>

                    <Text fontSize="$xl" fontWeight="$semibold">Vocabularies</Text>

                    {vocabularies.map((vocab, index) => (
                        <Box key={`vocab-${index}`} width="80%" bg="$white" p="$4" borderRadius="$md" borderWidth={1} borderColor="$borderLight200">
                            <HStack justifyContent="space-between" alignItems="center" mb={20}>
                                <Text fontSize={25} fontWeight="$semibold">{vocab.name}</Text>
                                <HStack space="xs" alignItems="center">
                                    {flags.map((flag, flagIndex) => (
                                        <HStack key={`flag-${flagIndex}`} space="sm" alignItems="center">
                                            <Box
                                                rounded='$full'
                                                width={20}
                                                height={20}
                                                bgColor='$orange100'
                                                overflow='hidden'
                                                mr={7}
                                            >
                                                <img
                                                    id="imgLogo"
                                                    height='100%'
                                                    src={flagImages[flag]}
                                                    alt={`Flag of ${flag}`}
                                                />
                                            </Box>
                                            <Text fontSize={15} mr={10}>{vocab.translations[flag]}</Text>
                                        </HStack>
                                    ))}
                                </HStack>
                            </HStack>
                            <Text mt={10}>
                                {vocab.description}
                            </Text>
                            <Text mt={20} mb={5} fontWeight="$semibold">Top Concepts</Text>
                            <VStack space="xs" ml="$4">
                                {vocab.topConcept.map((concept, conceptIndex) => (
                                    <Link key={`concept-${conceptIndex}`} href={concept.url}>
                                        <Text fontSize={13} mb={3}>• <span style={{ textDecoration: 'underline' }}>{concept.label}</span></Text>
                                    </Link>
                                ))}
                            </VStack>
                        </Box>
                    ))}
                </VStack >
            </Box>

        </RootLayout>
    );
}
export default Homepage;
