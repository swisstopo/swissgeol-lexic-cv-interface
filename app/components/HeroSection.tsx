'use client';

import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Link, LinkText } from '@/components/ui/link';
import { Button, ButtonText } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Icon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icon';

import { useMainWidth, calculateFromMainWidth, DEFAULT_BASE_MAIN_WIDTH } from '../utils/heightUtils';

type HeroSectionProps = {
    onExploreClick: () => void;
};

const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
    const mainWidth = useMainWidth();

    return (
        <Box style={{ marginBottom: calculateFromMainWidth(260, mainWidth) } as any} className="w-full">
            <Box
                style={{
                    height: calculateFromMainWidth(773, mainWidth),
                } as any}
                className="relative mx-auto mt-[88px] w-full rounded-[8px] bg-[#201C34]"    >
                {/* Description/button card */}
                <Box style={{ gap: calculateFromMainWidth(40, mainWidth) as any, marginLeft: calculateFromMainWidth(130, mainWidth), width: calculateFromMainWidth(716, mainWidth), top: calculateFromMainWidth(260, mainWidth) } as any} className="absolute flex-col overflow-visible"   >
                    {/* Text */}
                    <Box style={{ gap: calculateFromMainWidth(36, mainWidth) as any } as any} className="flex-col"  >
                        <Box style={{ gap: calculateFromMainWidth(16, mainWidth) as any } as any} className="flex-col">
                            <Text
                                className="align-middle text-[3em] font-[600] leading-[100%] tracking-[-0.05px] text-white"
                            >
                                Welcome to {'\n'}
                                lexic.swissgeol.ch
                            </Text>
                            <Text
                                className="align-middle text-[1.25em] font-[400] tracking-[-0.05px] text-white"
                                style={{
                                    lineHeight: calculateFromMainWidth(29, mainWidth) as any,
                                } as any}
                            >
                                The controlled vocabulary platform for geology developed by swisstopo.
                            </Text>
                        </Box>
                        <Text
                            className="align-middle text-[1em] font-[400] tracking-[0.1px] text-white"
                            style={{
                                lineHeight: calculateFromMainWidth(24, mainWidth) as any,
                            } as any}
                        >
                            Currently, lexic.swissgeol.ch is in its pilot phase. We are actively developing and refining features, and more vocabularies are planned for publication.
                            Your feedback, suggestions, and {mainWidth > 1200 ? <br /> : ''}ideas are most welcome.<br />
                            Please do not hesitate to contact us at <br />
                            <Link className="inline" href="mailto:swissgeol@swisstopo.ch">
                                <LinkText className="text-white underline data-[hover=true]:text-white data-[hover=true]:underline">swissgeol@swisstopo.ch.</LinkText>
                            </Link>
                        </Text>
                    </Box>
                    {/* Explore button */}
                    <Button
                        className="h-[36px] w-[193px] bg-[#337083] px-[16px] data-[hover=true]:bg-[#005DB4] data-[active=true]:bg-[#004282]"
                        variant="solid"
                        onPress={onExploreClick}
                    >
                        <ButtonText
                            className="m-0 p-0 text-center align-middle text-[0.875em] font-[500] leading-[20px] tracking-[0.5px] text-white whitespace-nowrap data-[hover=true]:text-white data-[active=true]:text-white"
                        >
                            Explore vocabularies
                        </ButtonText>
                        <Icon className="text-white" as={ArrowDownIcon} size='md' />
                    </Button>
                </Box>

                {/* IMAGE */}
                <Box style={{ width: calculateFromMainWidth(456, mainWidth), height: calculateFromMainWidth(773, mainWidth), top: calculateFromMainWidth(130, mainWidth), right: calculateFromMainWidth(130, mainWidth) } as any} className="absolute justify-center items-center overflow-hidden rounded-[8px] bg-white"       >
                    <Image
                        source={{
                            uri: '/hero-image.png',
                        }}
                        alt="Sfondo"
                        size="full"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default HeroSection;
