'use client';

import { Box, Button, ButtonIcon, SearchIcon, Input, InputField, Icon, Text, Divider, Link } from '@gluestack-ui/themed';
import { Github } from 'lucide-react';
import React from 'react';
import { TermData } from '../models/termDataInterface';

export interface FooterProps {
    showReleaseGitHub: boolean;
    termData: TermData | null;
}

const Footer: React.FC<FooterProps> = ({ showReleaseGitHub, termData }) => {
    return (
        <Box bg='#9988BA' mt={80} position='fixed' bottom={0} w={'100%'}>
            <Box p={10} flexDirection='row' justifyContent='center' w={'75%'} m={'auto'}>
                {showReleaseGitHub && (
                    <Box w={'33%'} alignItems='center'>
                        <Box flexDirection='row' gap={10}>
                            <Icon as={Github} width={20} height={20} fill='white' />
                            <Text fontSize={16} color='white' /* ref="https://lexic.swissgeol.ch/" */>{termData?.version}</Text>
                        </Box>
                    </Box>
                )}
                <Box w={'33%'} alignItems='center'>
                    <Link href='/About'>
                        <Text color='white' ml={10}>About lexic.swissgeol.ch</Text>
                    </Link>
                </Box>
                <Box w={'33%'} alignItems='center'>
                    <Link href="mailto:swissgeol@swisstopo.ch"><Text color='$white' ml={10}>Contact</Text></Link>
                </Box>
            </Box>
        </Box>
    );
}

export default Footer;
