'use client';

import React from 'react';
import { Box, Text, Link, Button, ButtonText, Image, VStack, HStack, Heading, Icon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@gluestack-ui/themed';
import { useMainWidth, calculateFromMainWidth, DEFAULT_BASE_MAIN_WIDTH } from '../utils/heightUtils';

type HeroSectionProps = {
    onExploreClick: () => void;
};

const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
    const mainWidth = useMainWidth();

    return (
        <Box sx={{ w: '100%', mb: calculateFromMainWidth(260, mainWidth) } as any}>
            <Box bg="#201C34" borderRadius={8} position='relative' sx={{ w: '100%', h: calculateFromMainWidth(773, mainWidth), mt: '88px', m: 'auto' } as any}>
                {/* Description/button card */}
                <Box position='absolute' gap={calculateFromMainWidth(40, mainWidth) as any} sx={{ ml: calculateFromMainWidth(130, mainWidth), w: calculateFromMainWidth(716, mainWidth), h: calculateFromMainWidth(130, mainWidth), top: calculateFromMainWidth(260, mainWidth), pb: calculateFromMainWidth(260, mainWidth) } as any}>
                    {/* Text */}
                    <Box gap={calculateFromMainWidth(36, mainWidth) as any} >
                        <Box gap={calculateFromMainWidth(16, mainWidth) as any}>
                            <Text color="#FFFFFF" fontWeight={600} verticalAlign='middle' letterSpacing={-0.05} fontSize={'3em' as any} lineHeight={'100%' as any}>
                                Welcome to {'\n'}
                                lexic.swissgeol.ch
                            </Text>
                            <Text color="#FFFFFF" fontWeight={400} fontSize={'1.25em' as any} lineHeight={calculateFromMainWidth(29, mainWidth) as any} letterSpacing={-0.05} verticalAlign='middle'>
                                The controlled vocabulary platform for geology developed by swisstopo.
                            </Text>
                        </Box>
                        <Text color="#FFFFFF" fontWeight={400} fontSize={'1em' as any} lineHeight={calculateFromMainWidth(24, mainWidth) as any} letterSpacing={0.1} verticalAlign='middle'>
                            Currently, lexic.swissgeol.ch is in its pilot phase. We are actively developing and refining features, and more vocabularies are planned for publication.
                            Your feedback, suggestions, and {mainWidth > 1200 ? <br /> : ''}ideas are most welcome.<br />
                            Please do not hesitate to contact us at <Link href="mailto:swissgeol@swisstopo.ch">
                                <Text color="#FFFFFF" textDecorationLine="underline">swissgeol@swisstopo.ch</Text>
                            </Link>.
                        </Text>
                    </Box>
                    {/* Explore button */}
                    <Button variant="solid" bgColor='#337083' onPress={onExploreClick} w={193} h={36} >
                        <ButtonText m={0} p={0} fontSize={'0.875em' as any} lineHeight={20} letterSpacing={0.5} fontWeight={'$medium'} textAlign='center' verticalAlign='middle' color='#FFFFFF'>Explore vocabularies </ButtonText>
                        <Icon color='#FFFFFF' as={ArrowDownIcon} size='md' />
                    </Button>
                </Box>

                {/* IMAGE */}
                <Box bgColor='white' borderRadius={8} position='absolute' justifyContent='center' alignItems='center' overflow='hidden' sx={{ w: calculateFromMainWidth(456, mainWidth), h: calculateFromMainWidth(773, mainWidth), top: calculateFromMainWidth(130, mainWidth), right: calculateFromMainWidth(130, mainWidth) } as any}>
                    <Image
                        source={{
                            uri: '/hero-image.png',
                        }}
                        alt="Sfondo"
                        w="100%"
                        h="100%"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default HeroSection;
