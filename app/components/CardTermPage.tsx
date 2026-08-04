"use client";

import React from "react";
import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

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
    <Box style={{ width: calculateFromMainWidth(976, mainWidth) as any, borderColor: borderColor } as any} className="flex-row overflow-hidden border-[1px] rounded-[8px] bg-[#fff]"







    >
      {/* LEFT CARD */}
      <Box className="flex-col w-full"  >
        {/* LEFT HEADER */}
        <Box style={{ backgroundColor: headerBg, height: calculateFromMainWidth(96, mainWidth), paddingLeft: calculateFromMainWidth(23, mainWidth), paddingTop: calculateFromMainWidth(41, mainWidth), paddingRight: calculateFromMainWidth(23, mainWidth), paddingBottom: calculateFromMainWidth(41, mainWidth) } as any} className="justify-center content-center"    >
          <Box className="flex-row items-center gap-[12px]"   >
            {/* TITLE */}
            <Text style={{ color: strong } as any} className="font-[700] text-[1.25em] leading-[24px] tracking-[0.1px]"





            >
              {title}
            </Text>
          </Box>
        </Box>
        {/* LEFT CONTENT */}
        <Box style={{ gap: calculateFromMainWidth(40, mainWidth), paddingTop: calculateFromMainWidth(40, mainWidth), paddingLeft: calculateFromMainWidth(23, mainWidth), paddingRight: calculateFromMainWidth(23, mainWidth), paddingBottom: calculateFromMainWidth(40, mainWidth) } as any} >
          {/* DESCRIPTION */}
          <Text style={{ color: strong } as any} className="font-[400] text-[1em] leading-[24px] tracking-[0.1px]"





          >
            {description || "Coming soon"}
          </Text>
          {isDefinedBy && (
            <Box className="flex-row items-start flex-wrap w-full"    >
              <Badge style={{ height: calculateFromMainWidth(27, mainWidth) as any } as any} className="rounded-full bg-[#46596B]"  variant="solid"  >
                <BadgeText className="text-center text-[0.625em] font-[600] text-white"    >Source</BadgeText>
              </Badge>
              <Text style={{ marginLeft: calculateFromMainWidth(8, mainWidth) as any, color: strong, whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere' } as any} className="flex-1 min-w-0 text-[1em] font-[500] leading-[24px]"








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
