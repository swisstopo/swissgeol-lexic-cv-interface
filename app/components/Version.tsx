'use client';

import { Box, Text } from '@gluestack-ui/themed';
import React from 'react';

const VersionBox = () => {
    return (
        <Box
            style={{ height: 36, width: 166 } as any}
            pt={10}
            pb={10}
            borderRadius={22}
            flexDirection='row'
            alignItems='center'
            justifyContent='flex-end'
            gap={8}
        >
            <Text
                fontSize={12}
                fontWeight={500}
                lineHeight={16}
                letterSpacing={1.25}
                color='#828E9A'
                verticalAlign='middle'
            >
                v0.5.2-beta
            </Text>
        </Box>
    );
}

export default VersionBox;
