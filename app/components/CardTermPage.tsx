"use client";

import React from "react";
import { Badge, BadgeText, Box, Icon, Link, Text } from "@gluestack-ui/themed";
import { ArrowUpRight } from "lucide-react";
import { CLIENT_BUTTON_STATE_COLORS } from "./ClientButton_UIv2";
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
  const linkPalette = {
    base: CLIENT_BUTTON_STATE_COLORS.base.textColor,
    hover: CLIENT_BUTTON_STATE_COLORS.hover.textColor,
  } as const;
  const linkHoverSx = {
    _web: {
      color: linkPalette.base,
      textDecoration: "none",
      transition: "color 120ms ease",
      ":hover": {
        color: linkPalette.hover,
      },
    },
  } as const;

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
            {/* TITOLO */}
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
            <Box w={'100%'} flexDirection="row" alignItems="center" overflow="hidden">
              <Link
                href={isDefinedBy}
                mb={1}
                flexDirection='row'
                alignItems='center'
                sx={linkHoverSx as any}
              >
                <Badge h={calculateFromMainWidth(27, mainWidth) as any} variant="solid" borderRadius="$full" bgColor='#46596B'>
                  <BadgeText color='white' textAlign='center' fontSize={'0.625em' as any} fontWeight='$semibold'>Source</BadgeText>
                </Badge>
                <Text
                  ml={calculateFromMainWidth(8, mainWidth) as any}
                  fontSize={'1em' as any}
                  fontWeight={500}
                  lineHeight={24}
                  textDecorationLine="underline"
                  color="inherit"
                  numberOfLines={1}
                  sx={{ 
                    _web: { 
                      transition: "color 120ms ease", 
                      textDecorationColor: "currentColor",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: '75%'
                    } 
                  } as any}
                >
                  {isDefinedBy}
                </Text>
                <Box sx={{ _web: { color: "inherit", transition: "color 120ms ease" } } as any}>
                  <Icon as={ArrowUpRight} h={calculateFromMainWidth(24, mainWidth) as any} w={calculateFromMainWidth(24, mainWidth) as any} color="currentColor" />
                </Box>
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CardTerm;
