'use client';

import React, { useEffect, useState } from 'react';
import { Box, VStack, Text, Link, LinkText } from '@gluestack-ui/themed';
import RootLayout from '../layout';
import { useMainWidth, calculateFromMainWidth } from '../utils/heightUtils';

// Local palette for About page (decoupled from button styles)
const ABOUT_EMPHASIS_COLOR = '#000000'; // slightly darker for emphasis

const AboutUs: React.FC = () => {
    const title = 'About lexic.swissgeol.ch - Controlled Vocabularies Interface';

    // Local colors to avoid coupling with button palette
    const emphasisColor = ABOUT_EMPHASIS_COLOR;

    // Breadcrumbs styling logic (aligned with real Breadcrumbs component)
    const NAV_INITIAL_HEIGHT = 88;
    const NAV_MIN_HEIGHT = 78;
    const BREADCRUMB_INITIAL_HEIGHT = 88;
    const BREADCRUMB_MIN_HEIGHT = 48;
    const SCROLL_DISTANCE = 80;
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    const [scrollProgress, setScrollProgress] = useState(0);
    const mainWidth = useMainWidth();

    useEffect(() => {
        let rafId: number | null = null;
        const update = () => {
            rafId = null;
            const next = clamp(window.scrollY / SCROLL_DISTANCE, 0, 1);
            setScrollProgress(next);
        };
        const handleScroll = () => {
            if (rafId === null) rafId = window.requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            if (rafId !== null) window.cancelAnimationFrame(rafId);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navHeight = NAV_INITIAL_HEIGHT - (NAV_INITIAL_HEIGHT - NAV_MIN_HEIGHT) * scrollProgress;
    const breadcrumbHeight = BREADCRUMB_INITIAL_HEIGHT - (BREADCRUMB_INITIAL_HEIGHT - BREADCRUMB_MIN_HEIGHT) * scrollProgress;
    const paddingY = 8 + (20 - 8) * (1 - scrollProgress);

    return (
        <RootLayout title={title}>
            {/* Real breadcrumbs (sticky), consistent with the rest of the app */}
            <Box
                position={'fixed' as any}
                top={`${navHeight}px` as any}
                left={0}
                right={0}
                zIndex={900}
                w={'100%'}
                flexDirection='row'
                alignItems='center'
                justifyContent='center'
                borderBottomWidth={1}
                borderBottomColor='#DFE4E9'
                h={`${breadcrumbHeight}px` as any}
                bg='$white'
                paddingLeft={calculateFromMainWidth(40, mainWidth) as any}
                paddingRight={calculateFromMainWidth(40, mainWidth) as any}
                paddingTop={paddingY}
                paddingBottom={paddingY}
                style={{ transition: 'height 0.25s ease, padding 0.25s ease' } as any}
            >
                <Box
                    w={calculateFromMainWidth(1236, mainWidth) as any}
                    h={28}
                    margin='auto'
                    flexDirection='row'
                    alignItems='center'
                    gap={calculateFromMainWidth(10, mainWidth) as any}
                    flexWrap='wrap'
                >
                    <Link href='/'>
                        <LinkText fontSize={14} fontWeight={500} lineHeight={20} letterSpacing={0.25} textDecorationLine='underline'>Home</LinkText>
                    </Link>
                    <Text>&gt;</Text>
                    <Link href='/About'>
                        <LinkText fontSize={14} textDecorationLine='none' bold color='$secondary400'>About</LinkText>
                    </Link>
                </Box>
            </Box>
            <Box m={'auto'} mt={`${breadcrumbHeight * 2}px` as any} mb={50}>
                <VStack space="xl" p="$6" alignItems="center" >
                    <Box width="80%">
                        <Text fontSize="$sm" fontStyle='italic'>
                            <Text fontSize="$3xl" bold mb={0} color={emphasisColor}>About lexic</Text>{"\n\n"}
                            Providing authoritative geological vocabularies for Switzerland – ensuring consistency, transparency, and international interoperability.{"\n\n"}
                        </Text>
                        <Text fontSize="$sm" >
                            <Text color={emphasisColor} bold>lexic.swissgeol.ch</Text> is the official platform of the Swiss Geological Survey for providing access to controlled vocabularies in the field of geology. It offers authoritative reference lists for geological classification and nomenclature, ensuring a consistent and standardised use of terms across our data, map products, and services.{"\n\n\n"}
                        </Text>
                        <Text fontSize="$sm" >
                            <Text fontSize="$md" bold color={emphasisColor}>Purpose and scope</Text>{"\n\n"}
                            The platform integrates different semantic models used within the Swiss Geological Survey and presents them as multilingual thematic vocabularies. Each concept is assigned a stable identifier (URI), a standardised description, and explicit relationships to other concepts. This linked data approach facilitates both human understanding and machine-readable integration, following recognised international practices such as <Text bold color={emphasisColor}>SKOS, W3C, INSPIRE data specifications,</Text> and <Text bold color={emphasisColor}>GeoSciML.</Text>{"\n\n\n"}
                        </Text>
                        <Text fontSize="$sm" >
                            <Text fontSize="$md" bold color={emphasisColor}>Governance and updates</Text>{"\n\n"}
                            lexic is curated and maintained by the Swiss Geological Survey as the authoritative custodian of geological terminology in Switzerland. Vocabularies are reviewed on a <Text bold color={emphasisColor}>quarterly cycle</Text>, with the possibility of ad-hoc updates when necessary.{"\n\n"}
                            Versioning is managed through <Text bold color={emphasisColor}>GitHub repositories</Text>, where previous releases remain permanently accessible. This ensures transparency, traceability, and long-term citability of all vocabulary updates.{"\n\n"}
                            The governance approach is designed to ensure continuous improvement and alignment with international stratigraphic and nomenclature standards (e.g. IUGS, ICS).{"\n\n\n"}
                        </Text>
                        <Text fontSize="$sm" >
                            <Text fontSize="$md" bold color={emphasisColor}>Access and use</Text>{"\n\n"}
                            The vocabularies published on <Text bold color={emphasisColor}>lexic.swissgeol.ch</Text> are made available under the <Text bold color={emphasisColor}>Creative Commons Attribution 4.0 International (CC BY 4.0)</Text> licence. This licence allows free use, redistribution, and modification of the data, provided that appropriate credit is given to the Swiss Geological Survey as the source.{"\n\n"}
                            The platform supports multiple formats, enabling both interactive use via the web interface and technical integration into external applications. By applying an internationally recognised open licence, the Swiss Geological Survey ensures transparency, reusability, and interoperability in line with federal open data principles.{"\n\n\n"}
                        </Text>
                        <Text fontSize="$sm" >
                            <Text fontSize="$md" bold color={emphasisColor}>Beta phase and further development</Text>{"\n\n"}
                            lexic is currently in a <Text color={emphasisColor}>beta phase</Text>. Not all descriptions are yet fully developed, and the platform continues to evolve. Additional vocabularies, functionalities, and interface features will be gradually introduced as development progresses.{"\n\n\n"}
                        </Text>
                        <Text fontSize="$sm" >
                            <Text fontSize="$md" bold color={emphasisColor}>Feedback and contact</Text>{"\n\n"}
                            Feedback and suggestions from users are welcome and help guide future improvements.{"\n\n"}
                            For questions or input, please contact us at <Link href="mailto:swissgeol@swisstopo.ch"><Text bold color={emphasisColor}>swissgeol@swisstopo.ch</Text></Link>.{"\n\n\n"}
                        </Text>
                    </Box>
                </VStack >
            </Box>
        </RootLayout>
    );
}
export default AboutUs;
