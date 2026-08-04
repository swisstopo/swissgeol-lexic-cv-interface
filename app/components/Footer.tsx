'use client';
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import React from 'react';

const Footer: React.FC = () => {
    return (
        <Box className="bg-[#201C34] h-[156px] w-[100%] p-[48px] overflow-hidden">
            <Box className="flex-row items-center justify-between h-[100%]">
                <Box className="flex-row items-center gap-[6px]">
                    <Link href="/About">
                        <Box className="h-[46px] pl-[24px] pr-[24px] justify-center">
                            <Text
                                style={{ color: '#FFFFFF', fontSize: '0.875em', lineHeight: '20px', letterSpacing: 0.25, fontWeight: 500, textAlign: 'center' } as any}>
                                About
                            </Text>
                        </Box>
                    </Link>
                    <Divider orientation="vertical" className="h-[18px] bg-[#FFFFFF33]" />
                    <Link href="mailto:swissgeol@swisstopo.ch">
                        <Box className="h-[46px] pl-[24px] pr-[24px] justify-center">
                            <Text
                                style={{ color: '#FFFFFF', fontSize: '0.875em', lineHeight: '20px', letterSpacing: 0.25, fontWeight: 500, textAlign: 'center' } as any}>
                                Contact
                            </Text>
                        </Box>
                    </Link>
                    <Divider orientation="vertical" className="h-[18px] bg-[#FFFFFF33]" />
                    <Link href="https://www.swissgeol.ch/en/wiki#ControlledVocabularies">
                        <Box className="h-[46px] pl-[24px] pr-[24px] justify-center">
                            <Text
                                style={{ color: '#FFFFFF', fontSize: '0.875em', lineHeight: '20px', letterSpacing: 0.25, fontWeight: 500, textAlign: 'center' } as any}>
                                Wiki
                            </Text>
                        </Box>
                    </Link>
                </Box>
                {/* Right (CH logo) */}
                <Box
                    className="items-center justify-center p-[0px] m-[0px] pr-[16px] w-[256px] h-[60px]">
                    <Image
                        alt="Logo Confederazione Svizzera"
                        source={{
                            uri: '/logo_svizzera.svg',
                        }}
                        resizeMode="center"
                        style={{ width: 256, height: 60, opacity: 1 } as any} />
                </Box>
            </Box>
        </Box>
    );
}

export default Footer;
