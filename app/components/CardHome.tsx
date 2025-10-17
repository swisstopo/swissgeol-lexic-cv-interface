"use client";

import React from "react";
import { Box, HStack, VStack, Text } from "@gluestack-ui/themed";
import { useMainWidth, calculateFromMainWidth } from "../utils/heightUtils";
import { ClientButton } from "./ClientButton_UIv2";

type TopConcept = { label: string; url: string };

type Translations = {
  DE: string;
  FR: string;
  IT: string;
};

export type CardHomeProps = {
  title: string; // English title
  description: string;
  translations: Translations; // DE, FR, IT in the aside
  topConcepts: TopConcept[];
  englishFlagSrc?: string;
};

const flagImg = {
  EN: "Bandiera-inglese.jpg",
  DE: "GERMANIA.jpg",
  FR: "Flag_of_France_(1794–1815,_1830–1974).svg.png",
  IT: "italia.png",
};

const getEnglishLabel = (rawLabel: string) => {
  if (!rawLabel) return rawLabel;
  const segments = rawLabel.split(",").map((segment) => segment.trim());
  const english = segments.find((segment) => /(\(en\))/i.test(segment));
  if (!english) return rawLabel;
  return english.replace(/\(en\)/i, "").trim();
};

const FlagCircle = ({ src, alt }: { src: string; alt: string }) => (
  <Box rounded="$full" width={22} height={22} overflow="hidden">
    <img src={src} alt={alt} height="100%" style={{ display: "block" }} />
  </Box>
);

const CardHome: React.FC<CardHomeProps> = ({
  title,
  description,
  translations,
  topConcepts,
  englishFlagSrc,
}) => {
  const mainWidth = useMainWidth();
  const borderColor = "#ACB4BD";
  const headerBg = "#F8F9FA";
  const strong = "#1C2834";

  return (
    <Box
      bg="#fff"
      borderWidth={1}
      borderColor={borderColor}
      borderRadius={8}
      flexDirection="row"
      overflow="hidden"
    >
      {/* LEFT CARD */}
      <Box flexDirection="column" sx={{ gap: calculateFromMainWidth(36, mainWidth) } as any}>
        {/* LEFT HEADER */}
        <Box bg={headerBg} justifyContent="center" alignContent="center" sx={{ h: calculateFromMainWidth(96, mainWidth), pl: calculateFromMainWidth(36, mainWidth), pt: calculateFromMainWidth(36, mainWidth), pr: calculateFromMainWidth(36, mainWidth), pb: calculateFromMainWidth(36, mainWidth) } as any}>
          <Box gap={12} flexDirection="row" alignItems="center">
            {/* IMAGE FLAG */}
            <Box rounded="$full" overflow="hidden" mr={8} h={24} w={24}>
              <img
                src={englishFlagSrc ?? flagImg.EN}
                alt="English"
                height="100%"
                style={{ display: "block" }}
              />
            </Box>
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
        <Box sx={{w: calculateFromMainWidth(649, mainWidth), gap: calculateFromMainWidth(36, mainWidth), pl: calculateFromMainWidth(36, mainWidth), pr: calculateFromMainWidth(36, mainWidth), pb: calculateFromMainWidth(36, mainWidth) } as any}>
          {/* DESCRIPTION */}
          <Text
            fontWeight={400}
            fontSize={'1em' as any}
            lineHeight={24}
            letterSpacing={0.1}
            color={strong}
          >
            {description}
          </Text>
          {/* TOP CONCEPTS */}
          <Box sx={{ gap: calculateFromMainWidth(16, mainWidth) } as any}>
            {/* TITLE TOP CONCEPTS */}
            <Text
              fontWeight={700}
              fontSize={'1em' as any}
              lineHeight={24}
              letterSpacing={0.1}
              verticalAlign="middle"
              color={strong}
            >
              Top Concepts
            </Text>
            {/* Buttons of the Concepts */}
            <Box
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="space-between"
              sx={{ gap: calculateFromMainWidth(16, mainWidth) } as any}
            >
              {topConcepts.map((concept, index) => (
                <ClientButton
                  key={`tc-${index}`}
                  label={getEnglishLabel(concept.label)}
                  href={concept.url}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right card (Translations) */}
      <Box borderLeftWidth={1} borderColor={borderColor} sx={{ width: calculateFromMainWidth(326, mainWidth) } as any}>
        {/* Right header */}
        <Box
            bg={headerBg} justifyContent="center" alignContent="center"
            sx={{ h: calculateFromMainWidth(96, mainWidth), pl: calculateFromMainWidth(36, mainWidth), pt: calculateFromMainWidth(36, mainWidth), pr: calculateFromMainWidth(36, mainWidth), pb: calculateFromMainWidth(36, mainWidth) } as any}
        >
          <Text
            fontWeight={700}
            fontSize={'1em' as any}
            lineHeight={24}
            letterSpacing={0.1}
            verticalAlign="middle"
            color={strong}
          >
            Translations
          </Text>
        </Box>

        {/* Right content: translation list */}
        <Box gap={calculateFromMainWidth(36, mainWidth) as any} mt={calculateFromMainWidth(36, mainWidth) as any} pr={calculateFromMainWidth(36, mainWidth) as any} pl={calculateFromMainWidth(36, mainWidth) as any}>
          <Box alignItems="center" flexDirection="row" gap={calculateFromMainWidth(12, mainWidth) as any}>
            <FlagCircle src={flagImg.DE} alt="German" />
            <Text fontSize={'1em' as any}>{translations.DE}</Text>
          </Box>
          <Box alignItems="center" flexDirection="row" gap={calculateFromMainWidth(12, mainWidth) as any}>
            <FlagCircle src={flagImg.FR} alt="French" />
            <Text fontSize={'1em' as any}>{translations.FR}</Text>
          </Box>
          <Box alignItems="center" flexDirection="row" gap={calculateFromMainWidth(12, mainWidth) as any}>
            <FlagCircle src={flagImg.IT} alt="Italian" />
            <Text fontSize={'1em' as any}>{translations.IT}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CardHome;
