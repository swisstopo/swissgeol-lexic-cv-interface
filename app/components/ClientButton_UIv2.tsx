"use client";

import React from "react";
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';

import { Linking } from "react-native";
import { ChevronRight } from "lucide-react";
import { useMainWidth, calculateFromMainWidth } from "../utils/heightUtils";

/**
 * ClientButton — simplified and corrected version.
 * - Dimensions and padding are fixed and applied directly as props.
 * - The styling logic is simplified, without intermediate constants like `baseSx`.
 * - The internal structure has been revised to ensure proper text-wrapping functionality.
 * - The only dynamic properties are the colors, based on the button state.
 */

export const CLIENT_BUTTON_STATE_COLORS = {
  base: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DFE4E9",
    textColor: "#337083",
    iconColor: "#337083",
  },
  hover: {
    backgroundColor: "#E8EFF3",
    borderColor: "#2F4356",
    textColor: "#2F4356",
    iconColor: "#2F4356",
  },
  selected: {
    backgroundColor: "#CED8DD",
    borderColor: "#CED8DD",
    textColor: "#2F4356",
    iconColor: "#2F4356",
  },
  disabled: {
    backgroundColor: "#FFFFFF",
    borderColor: "#828E9A",
    textColor: "#828E9A",
    iconColor: "#828E9A",
  },
} as const;

export type ClientButtonState = keyof typeof CLIENT_BUTTON_STATE_COLORS;

export type ClientButtonProps = Omit<React.ComponentProps<typeof Pressable>, "disabled" | "onPress"> & {
  label: string;
  href?: string;
  target?: "_self" | "_blank";
  rightIcon?: React.ComponentType<{ size?: number | string; color?: string }>;
  isDisabled?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
};

export function ClientButton({
  label,
  href,
  target = "_self",
  rightIcon: RightIcon = ChevronRight,
  onPress,
  isDisabled = false,
  isSelected = false,
  ...rest
}: ClientButtonProps) {
  const mainWidth = useMainWidth();
  const [isHovered, setIsHovered] = React.useState(false);

  const state: ClientButtonState = isDisabled
    ? "disabled"
    : isSelected
    ? "selected"
    : isHovered
    ? "hover"
    : "base";

  const palette = CLIENT_BUTTON_STATE_COLORS[state];

  const handlePress = async () => {
    if (isDisabled) return;
    if (onPress) return onPress();
    if (!href) return;

    try {
      if (typeof window !== "undefined") {
        if (target === "_blank") {
          window.open(href, "_blank", "noopener,noreferrer");
        } else {
          window.location.assign(href);
        }
        return;
      }
      await Linking.openURL(href);
    } catch (e) {
      console.error("Cannot open URL:", e);
    }
  };

  return (
    <Pressable style={{ borderColor: palette.borderColor, backgroundColor: palette.backgroundColor, width: calculateFromMainWidth(280, mainWidth), height: "auto", minHeight: calculateFromMainWidth(78, mainWidth), paddingTop: calculateFromMainWidth(16, mainWidth), paddingBottom: calculateFromMainWidth(16, mainWidth), paddingLeft: calculateFromMainWidth(32, mainWidth), paddingRight: calculateFromMainWidth(16, mainWidth), cursor: isDisabled ? "not-allowed" : "pointer", transition: "background-color 120ms ease, border-color 120ms ease" } as any} className="flex-row items-center justify-between rounded-[8px] border-[1px]"
      {...rest}
      disabled={isDisabled}
      onPress={handlePress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      accessibilityRole={href ? "link" : "button"}
      aria-disabled={isDisabled}
      aria-pressed={isSelected}
      // Styles applied directly for clarity and correctness








    >
      {/* Text container that can shrink */}
      <Box className="shrink mr-[12px]"  >
        <Text style={{ color: palette.textColor } as any} className="font-[500] text-[1em] leading-[22px] tracking-[0.25px] underline"






        >
          {label}
        </Text>
      </Box>

      {/* Right-side icon */}
      {RightIcon ? (
        <Box>
          <RightIcon size={'1.5em'} color={palette.iconColor} />
        </Box>
      ) : null}
    </Pressable>
  );
}
