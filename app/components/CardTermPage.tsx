"use client";

import React from "react";
import { Badge, BadgeText, Box, Text } from "@gluestack-ui/themed";
import { useMainWidth, calculateFromMainWidth } from "../utils/heightUtils";

export type CardHomeProps = {
  title: string;
  description: string;
  isDefinedBy: string;
};


const CardTerm: React.FC<CardHomeProps> = ({
  title,
  description,
  isDefinedBy
}) => {
  const mainWidth = useMainWidth();

  const borderColor = "#ACB4BD";
  const headerBg = "#F8F9FA";
  const strong = "#1C2834";
  

  return (
    <Box
      w={calculateFromMainWidth(976, mainWidth) as any}
      bg="#fff"
      borderWidth={1}
      borderColor={borderColor}
      borderRadius={8}
      flexDirection="row"
      overflow="hidden"
    >
      {/* LEFT CARD */}
      <Box flexDirection="column" w={'100%'}>
        {/* LEFT HEADER */}
        <Box bg={headerBg} justifyContent="center" alignContent="center" sx={{ h: calculateFromMainWidth(96, mainWidth), pl: calculateFromMainWidth(23, mainWidth), pt: calculateFromMainWidth(41, mainWidth), pr: calculateFromMainWidth(23, mainWidth), pb: calculateFromMainWidth(41, mainWidth) } as any}>
          <Box gap={12} flexDirection="row" alignItems="center">
            {/* TITLE */}
            <Text
              fontWeight="$bold"
              fontSize={'1.25em' as any}
              lineHeight={24}
              letterSpacing={0.1}
              color={strong}
            >
              {title}
            </Text>
          </Box>
        </Box>
        {/* LEFT CONTENT */}
        <Box sx={{ gap: calculateFromMainWidth(40, mainWidth), pt: calculateFromMainWidth(40, mainWidth), pl: calculateFromMainWidth(23, mainWidth), pr: calculateFromMainWidth(23, mainWidth), pb: calculateFromMainWidth(40, mainWidth) } as any}>
          {/* DESCRIPTION */}
          <Text
            fontWeight={400}
            fontSize={'1em' as any}
            lineHeight={24}
            letterSpacing={0.1}
            color={strong}
          >
            {description || "Coming soon"}
          </Text>
          {isDefinedBy && (
            <Box w={'100%'} flexDirection="row" alignItems="flex-start" flexWrap="wrap">
              <Badge h={calculateFromMainWidth(27, mainWidth) as any} variant="solid" borderRadius="$full" bgColor='#46596B'>
                <BadgeText color='white' textAlign='center' fontSize={'0.625em' as any} fontWeight='$semibold'>Source</BadgeText>
              </Badge>
              <Text
                ml={calculateFromMainWidth(8, mainWidth) as any}
                fontSize={'1em' as any}
                fontWeight={500}
                lineHeight={24}
                color={strong}
                flex={1}
                minWidth={0}
                sx={{
                  _web: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }
                } as any}
              >
                {isDefinedBy}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CardTerm;
