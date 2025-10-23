'use client';

import { Box, Text, Divider, Link, Image } from '@gluestack-ui/themed';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <Box
            bg="#201C34"
            h={156}
            w="100%"
            p={48}
        >
            <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                h="100%"
            >
                <Box
                    flexDirection="row"
                    alignItems="center"
                    gap={6}
                >
                    <Link href="/About">
                        <Box
                            h={46}
                            pl={24}
                            pr={24}
                            justifyContent="center"
                        >
                            <Text
                                color="#FFFFFF"
                                fontSize={'0.875em' as any}
                                lineHeight={20}
                                letterSpacing={0.25}
                                fontWeight="$medium"
                                textAlign="center"
                            >
                                About
                            </Text>
                        </Box>
                    </Link>
                    <Divider
                        orientation="vertical"
                        h={18}
                        bg="#FFFFFF33"
                    />
                    <Link href="mailto:swissgeol@swisstopo.ch">
                        <Box
                            h={46}
                            pl={24}
                            pr={24}
                            justifyContent="center"
                        >
                            <Text
                                color="#FFFFFF"
                                fontSize={'0.875em' as any}
                                lineHeight={20}
                                letterSpacing={0.25}
                                fontWeight="$medium"
                                textAlign="center"
                            >
                                Contact
                            </Text>
                        </Box>
                    </Link>
                    <Divider
                        orientation="vertical"
                        h={18}
                        bg="#FFFFFF33"
                    />
                    <Link href="https://www.swissgeol.ch/en/wiki#ControlledVocabularies">
                        <Box
                            h={46}
                            pl={24}
                            pr={24}
                            justifyContent="center"
                        >
                            <Text
                                color="#FFFFFF"
                                fontSize={'0.875em' as any}
                                lineHeight={20}
                                letterSpacing={0.25}
                                fontWeight="$medium"
                                textAlign="center"
                            >
                                Wiki
                            </Text>
                        </Box>
                    </Link>
                </Box>
                {/* Right (CH logo) */}
                <Box alignItems="center" justifyContent="center" p={0} m={0} pr={16} w={256} h={60}>
                    <Image
                        alt="Logo Confederazione Svizzera"
                        source={{
                            uri: '/logo_svizzera.svg',
                        }}
                        w={256}
                        resizeMode="center"
                        opacity={1}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default Footer;
