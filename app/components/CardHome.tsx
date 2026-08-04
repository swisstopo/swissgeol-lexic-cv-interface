"use client";

import React from "react";
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';

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
  EN: "flag-en.jpg",
  DE: "flag-de.jpg",
  FR: "flag-fr.png",
  IT: "flag-it.png",
};

const getEnglishLabel = (rawLabel: string) => {
  if (!rawLabel) return rawLabel;
  const segments = rawLabel.split(",").map((segment) => segment.trim());
  const english = segments.find((segment) => /(\(en\))/i.test(segment));
  if (!english) return rawLabel;
  return english.replace(/\(en\)/i, "").trim();
};

const getFlagSource = (src: string) => (src.startsWith("/") ? src : `/${src}`);

const FlagCircle = ({ src, alt }: { src: string; alt: string }) => (
  <Box className="overflow-hidden rounded-full w-[22px] h-[22px]"    >
    <Image source={{ uri: getFlagSource(src) }} alt={alt} size="full" resizeMode="cover" />
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
    <Box style={{ borderColor: borderColor } as any} className="flex-row overflow-hidden border-[1px] rounded-[8px] bg-[#fff]"






    >
      {/* LEFT CARD */}
      <Box style={{ gap: calculateFromMainWidth(36, mainWidth) } as any} className="flex-col"  >
        {/* LEFT HEADER */}
        <Box style={{ backgroundColor: headerBg, height: calculateFromMainWidth(96, mainWidth), paddingLeft: calculateFromMainWidth(36, mainWidth), paddingTop: calculateFromMainWidth(36, mainWidth), paddingRight: calculateFromMainWidth(36, mainWidth), paddingBottom: calculateFromMainWidth(36, mainWidth) } as any} className="justify-center content-center"    >
          <Box className="flex-row items-center gap-[12px]"   >
            {/* IMAGE FLAG */}
            <Box className="overflow-hidden rounded-full h-[24px] w-[24px] mr-[8px]"     >
              <Image
                source={{ uri: getFlagSource(englishFlagSrc ?? flagImg.EN) }}
                alt="English"
                size="full"
                resizeMode="cover"
              />
            </Box>
            {/* TITLE */}
            <Text style={{ color: strong } as any} className="font-[700] text-[1.25em] leading-[24px] tracking-[0.1px]"





            >
              {title}
            </Text>
          </Box>
        </Box>
        {/* LEFT CONTENT */}
        <Box style={{ width: calculateFromMainWidth(649, mainWidth), gap: calculateFromMainWidth(36, mainWidth), paddingLeft: calculateFromMainWidth(36, mainWidth), paddingRight: calculateFromMainWidth(36, mainWidth), paddingBottom: calculateFromMainWidth(36, mainWidth) } as any} >
          {/* DESCRIPTION */}
          <Text style={{ color: strong } as any} className="font-[400] text-[1em] leading-[24px] tracking-[0.1px]"





          >
            {description}
          </Text>
          {/* TOP CONCEPTS */}
          <Box style={{ gap: calculateFromMainWidth(16, mainWidth) } as any} >
            {/* TITLE TOP CONCEPTS */}
            <Text style={{ color: strong } as any} className="font-[700] text-[1em] leading-[24px] tracking-[0.1px] align-middle"






            >
              Top Concepts
            </Text>
            {/* Buttons of the Concepts */}
            <Box style={{ gap: calculateFromMainWidth(16, mainWidth) } as any} className="flex-row flex-wrap justify-between"




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
      <Box style={{ borderColor: borderColor, width: calculateFromMainWidth(326, mainWidth) } as any} className="border-l-[1px]"   >
        {/* Right header */}
        <Box style={{ backgroundColor: headerBg, height: calculateFromMainWidth(96, mainWidth), paddingLeft: calculateFromMainWidth(36, mainWidth), paddingTop: calculateFromMainWidth(36, mainWidth), paddingRight: calculateFromMainWidth(36, mainWidth), paddingBottom: calculateFromMainWidth(36, mainWidth) } as any} className="justify-center content-center"


        >
          <Text style={{ color: strong } as any} className="font-[700] text-[1em] leading-[24px] tracking-[0.1px] align-middle"






          >
            Translations
          </Text>
        </Box>

        {/* Right content: translation list */}
        <Box style={{ gap: calculateFromMainWidth(36, mainWidth) as any, marginTop: calculateFromMainWidth(36, mainWidth) as any, paddingRight: calculateFromMainWidth(36, mainWidth) as any, paddingLeft: calculateFromMainWidth(36, mainWidth) as any } as any}    >
          <Box style={{ gap: calculateFromMainWidth(12, mainWidth) as any } as any} className="items-center flex-row"   >
            <FlagCircle src={flagImg.DE} alt="German" />
            <Text className="text-[1em]" >{translations.DE}</Text>
          </Box>
          <Box style={{ gap: calculateFromMainWidth(12, mainWidth) as any } as any} className="items-center flex-row"   >
            <FlagCircle src={flagImg.FR} alt="French" />
            <Text className="text-[1em]" >{translations.FR}</Text>
          </Box>
          <Box style={{ gap: calculateFromMainWidth(12, mainWidth) as any } as any} className="items-center flex-row"   >
            <FlagCircle src={flagImg.IT} alt="Italian" />
            <Text className="text-[1em]" >{translations.IT}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CardHome;
