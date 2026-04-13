'use client';

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, HStack, Pressable, Text } from '@gluestack-ui/themed';
import { calculateFromMainWidth, useMainWidth } from '../utils/heightUtils';

/**
 * Item rendered by the floating anchor navigation.
 * `id` must match the `id` attribute of the target page section.
 * When `children` are provided, they are flattened and rendered with increasing indentation.
 */
export type AnchorItem = {
  /** DOM id of the target section. */
  id: string;
  /** Label displayed in the navigation. */
  label: string;
  /** Optional child entries rendered as nested levels. */
  children?: AnchorItem[];
};

/** Props for the side floating anchor navigation. */
export type AnchorNavProps = {
  /** Ordered list of navigable sections. */
  items: AnchorItem[];
  /** Offset in px for a sticky header, subtracted from the scroll target. */
  offset?: number;
  /** When provided, fixes the nav to the viewport at `stickyTop` px from the top after activation. */
  stickyTop?: number;
  /** Width of the vertical track in px. */
  trackWidth?: number;
  /** Width of the active indicator in px. */
  indicatorWidth?: number;
  /** Base color used in the default state. */
  baseColor?: string;
  /** Color used on hover. */
  hoverColor?: string;
  /** Color used for the active/selected state. */
  activeColor?: string;
  /** Color of the active indicator. */
  indicatorColor?: string;
  /** Color of the vertical track. */
  trackColor?: string;
};

const DEFAULT_COLORS = {
  base: '#337083',
  hover: '#1C2834',
  active: '#1C2834',
  indicator: '#2F4356',
  track: '#ACB4BD',
};

/**
 * Flattens a hierarchical anchor structure while preserving the depth level
 * used to compute visual indentation.
 */
function flatten(items: AnchorItem[], depth = 0): (AnchorItem & { depth: number })[] {
  return items.flatMap((item) => {
    const current = { ...item, depth };
    const next = item.children ? flatten(item.children, depth + 1) : [];
    return [current, ...next];
  });
}

/**
 * Vertical floating navigation for pages composed of anchorable sections.
 * It highlights the active section based on the viewport, updates the URL hash,
 * and can remain fixed during scroll when `stickyTop` is set.
 */
export function AnchorNav({
  items,
  offset = 0,
  stickyTop,
  trackWidth = 2,
  indicatorWidth = 3,
  baseColor,
  hoverColor,
  activeColor,
  indicatorColor,
  trackColor,
}: AnchorNavProps) {
  const mainWidth = useMainWidth();
  const flat = useMemo(() => flatten(items), [items]);
  const [activeId, setActiveId] = useState<string | null>(flat[0]?.id ?? null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [fixedWidth, setFixedWidth] = useState<number | null>(null);
  const [shellHeight, setShellHeight] = useState<number | null>(null);
  const [stickyState, setStickyState] = useState<{ mode: 'static' | 'fixed'; top: number }>({
    mode: 'static',
    top: 0,
  });

  const shellRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const programmaticTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (!flat.length) {
      setActiveId(null);
      return;
    }
    if (!flat.some((item) => item.id === activeId)) {
      setActiveId(flat[0].id);
    }
  }, [flat, activeId]);

  const palette = {
    base: baseColor ?? DEFAULT_COLORS.base,
    hover: hoverColor ?? DEFAULT_COLORS.hover,
    active: activeColor ?? DEFAULT_COLORS.active,
    indicator: indicatorColor ?? DEFAULT_COLORS.indicator,
    track: trackColor ?? DEFAULT_COLORS.track,
  };
  const rowHeight = calculateFromMainWidth(40, mainWidth);
  const rowHeightPx = Number.parseInt(rowHeight, 10);
  const totalHeight = `${rowHeightPx * flat.length}px`;
  const rowPaddingRight = calculateFromMainWidth(10, mainWidth);
  const textInset = calculateFromMainWidth(26, mainWidth);
  const fontSize = calculateFromMainWidth(16, mainWidth);
  const lineHeight = calculateFromMainWidth(24, mainWidth);
  const activeIndex = activeId ? flat.findIndex((item) => item.id === activeId) : -1;
  const indicatorOffset = activeIndex >= 0 ? `${activeIndex * rowHeightPx}px` : '0px';

  const stopProgrammaticScroll = useCallback(() => {
    programmaticTargetRef.current = null;
  }, []);

  const scrollToId = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;

      programmaticTargetRef.current = id;
      setActiveId(id);

      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
    },
    [offset],
  );

  useEffect(() => {
    const handleScroll = () => {
      const targetId = programmaticTargetRef.current;
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) {
        stopProgrammaticScroll();
        return;
      }

      const distance = Math.abs(target.getBoundingClientRect().top - offset);
      if (distance <= 12) {
        setActiveId(targetId);
        stopProgrammaticScroll();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset, stopProgrammaticScroll]);

  useEffect(() => {
    if (!flat.length) return;
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (!hash || !flat.some((item) => item.id === hash)) return;

    const rafId = window.requestAnimationFrame(() => {
      scrollToId(hash);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [flat, scrollToId]);

  useEffect(() => {
    const targets = flat
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (programmaticTargetRef.current) {
          return;
        }

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

        if (visible[0]) {
          const id = (visible[0].target as HTMLElement).id;
          setActiveId(id);
          return;
        }

        const distances = targets
          .map((target) => ({
            id: target.id,
            distance: Math.abs(target.getBoundingClientRect().top - offset - 1),
          }))
          .sort((a, b) => a.distance - b.distance);

        if (distances[0]) setActiveId(distances[0].id);
      },
      { root: null, threshold: [0.1, 0.3, 0.6], rootMargin: `${-offset}px 0px -60% 0px` },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [flat, offset]);

  useLayoutEffect(() => {
    if (typeof stickyTop !== 'number') {
      setStickyState({ mode: 'static', top: 0 });
      setFixedWidth(null);
      return;
    }

    const updateStickyPosition = () => {
      if (!shellRef.current || !containerRef.current) return;

      const shellRect = shellRef.current.getBoundingClientRect();
      const shellTop = shellRect.top + window.scrollY;
      const navHeight = containerRef.current.offsetHeight;

      setShellHeight(navHeight);
      setFixedWidth(shellRect.width);

      if (window.scrollY < shellTop - stickyTop) {
        setStickyState({ mode: 'static', top: 0 });
        return;
      }

      setStickyState({ mode: 'fixed', top: stickyTop });
    };

    updateStickyPosition();
    window.addEventListener('scroll', updateStickyPosition, { passive: true });
    window.addEventListener('resize', updateStickyPosition);

    return () => {
      window.removeEventListener('scroll', updateStickyPosition);
      window.removeEventListener('resize', updateStickyPosition);
    };
  }, [stickyTop, flat]);

  const stickyStyles =
    typeof stickyTop !== 'number'
      ? null
      : stickyState.mode === 'fixed'
        ? ({
            _web: {
              position: 'fixed',
              top: `${stickyState.top}px`,
              width: fixedWidth ? `${fixedWidth}px` : '100%',
              zIndex: 2,
            },
          } as any)
        : ({
            _web: {
              position: 'relative',
              width: '100%',
            },
          } as any);

  return (
    <Box
      ref={shellRef as any}
      position="relative"
      style={shellHeight ? ({ minHeight: shellHeight } as any) : undefined}
      sx={{
        width: '100%',
      }}
    >
      <Box
      ref={containerRef as any}
      sx={{
        paddingRight: rowPaddingRight,
        ...(stickyStyles ?? null),
      }}
    >
      <Box
        position="relative"
        sx={{
          _web: {
            height: totalHeight,
          },
        }}
      >
        <Box
          position="absolute"
          left={0}
          w={trackWidth}
          bg={palette.track}
          sx={{ top: 0, height: totalHeight } as any}
        />
        <Box
          position="absolute"
          left={0}
          w={indicatorWidth}
          bg={palette.indicator}
          sx={{
            _web: {
              top: indicatorOffset,
              height: rowHeight,
              transition: 'top 240ms ease',
            },
          } as any}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: totalHeight,
          } as any}
        >
          {flat.map(({ id, label, depth }) => {
            const isActive = id === activeId;
            const isHovered = id === hoveredId;
            const color = isActive ? palette.active : isHovered ? palette.hover : palette.base;

            return (
              <Box
                key={id}
                sx={{
                  paddingRight: rowPaddingRight,
                  _web: { height: rowHeight },
                } as any}
              >
                <Pressable
                  role="link"
                  accessibilityRole="link"
                  aria-current={isActive ? 'true' : 'false'}
                  onPress={() => scrollToId(id)}
                  onHoverIn={() => setHoveredId(id)}
                  onHoverOut={() => setHoveredId((prev) => (prev === id ? null : prev))}
                  onFocus={() => setHoveredId(id)}
                  onBlur={() => setHoveredId((prev) => (prev === id ? null : prev))}
                  sx={{
                    cursor: 'pointer',
                    paddingRight: rowPaddingRight,
                    _web: {
                      height: rowHeight,
                      display: 'flex',
                      alignItems: 'center',
                    },
                  } as any}
                >
                  <HStack
                    alignItems="center"
                    sx={{
                      width: '100%',
                      _web: { height: rowHeight },
                    } as any}
                  >
                    <Text
                      fontWeight={isActive ? '$bold' : '$medium'}
                      color={color as any}
                      sx={{
                        _web: {
                          marginLeft: `calc(${textInset} + ${depth * 12}px)`,
                          fontSize,
                          lineHeight: lineHeight,
                        },
                      }}
                    >
                      {label}
                    </Text>
                  </HStack>
                </Pressable>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
    </Box>
  );
}
