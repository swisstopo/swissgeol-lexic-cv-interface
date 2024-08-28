'use client';

import React from 'react';
import { Box, VStack, Text, Link, LinkText } from '@gluestack-ui/themed';
import RootLayout from '../layout';

const AboutUs: React.FC = () => {
    const title = 'About lexic.swissgeol.ch - Controlled Vocabularies Interface';

    return (
        <RootLayout title={title} showReleaseGitHub={false} termData={null}>
            <Box
                ml={8}
                mt={8}
                flexDirection='row'
                marginLeft={24}
            >
                <Link href='/'>
                    <LinkText fontSize={14} textDecorationLine='none' color='$secondary400'>Home &gt; </LinkText>
                </Link>
                <Link href='/About'>
                    <LinkText fontSize={14} textDecorationLine='none' color='$secondary400'>About</LinkText>
                </Link>
            </Box>
            <Box m={'auto'} mb={50}>
                <Box w='77%' mt={40} m={'auto'}>
                    {/* <Text fontSize="$3xl" fontWeight="$bold">lexic.swissgeol.ch</Text> */}
                    <Text fontSize="$xl" /* textAlign="center" */><Text fontSize="$3xl" bold mb={0}>About lexic.swissgeol.ch</Text>,{"\n\n"}
                        Our platform aims to provide geological classifications and nomenclatures in four languages.{"\n"}By integrating different semantic models used in our data and map products, we offer a unified approach.{"\n"}The platform is based on knowledge graphs and supports various formats, including machine-readable knowledge representations such as SKOS.{"\n"}Each concept is assigned a unique URI for easy reference.</Text>
                </Box>
                < VStack space="xl" p="$6" alignItems="center" >
                    <Box bg="$backgroundLight100" p="$4" borderRadius="$md" width="80%">
                        <Text /* textAlign="center" */>
                            <Text bold fontSize={20}>Current Focus Areas:</Text>{"\n"} During the pilot phase, we are concentrating on three main components:{"\n\n"}
                            {"  • "}<Text bold>User-Friendly Interface:</Text> Explore vocabularies and their terminology through our intuitive landing page and main user interface.{"\n"}
                            {"  • "}<Text bold>Web Map Query Tool:</Text> Use our data and build queries using the integrated vocabularies.{"\n"}
                            {"  • "}<Text bold>Vocabulary Engineering Environment:</Text> Build, manage, and publish vocabularies or ontologies with our advanced tools.{"\n\n"}
                        </Text>
                    </Box>
                </VStack >
            </Box>
        </RootLayout>
    );
}
export default AboutUs;
