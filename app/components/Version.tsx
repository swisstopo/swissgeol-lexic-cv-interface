'use client';;
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import React from 'react';

const VersionBox = () => {
    return (
        <Box
            style={{ height: 36, width: 166 } as any}
            className="pt-[10px] pb-[10px] rounded-[22px] flex-row items-center justify-end gap-[8px]">
            <Text
                className="text-[12px] font-[500] leading-[16px] tracking-[1.25px] text-[#828E9A] align-middle">
                v0.8.1-beta
            </Text>
        </Box>
    );
}

export default VersionBox;
