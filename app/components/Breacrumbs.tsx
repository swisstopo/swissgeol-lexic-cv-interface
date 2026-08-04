'use client';;
import { Text } from "@/components/ui/text";
import { Link, LinkText } from "@/components/ui/link";
import { Box } from "@/components/ui/box";
import React, { useEffect, useState } from 'react';
import { BreadCrumbsData } from '../models/breadCrumbsInterface';
import { useMainWidth, calculateFromMainWidth } from '../utils/heightUtils';

export interface BreadcrumbsProps {
    data: BreadCrumbsData;
}

const NAV_INITIAL_HEIGHT = 88;
const NAV_MIN_HEIGHT = 78;
const BREADCRUMB_INITIAL_HEIGHT = 88;
const BREADCRUMB_MIN_HEIGHT = 48;
const SCROLL_DISTANCE = 80;

const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};

const getVocabularyLabel = (vocabulary: string) => {
    if (vocabulary === 'ls_correlations') {
        return 'Lithostratigraphic Correlations';
    }
    if (vocabulary === 'TectonicStructures') {
        return 'Tectonic Structures';
    }
    if (vocabulary === 'materialDescription') {
        return 'Material Description';
    }
    return vocabulary;
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ data }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const mainWidth = useMainWidth();

    useEffect(() => {
        let rafId: number | null = null;

        const update = () => {
            rafId = null;
            const next = clamp(window.scrollY / SCROLL_DISTANCE, 0, 1);
            setScrollProgress(next); // Immediate update without throttling
        };

        const handleScroll = () => {
            if (rafId === null) {
                rafId = window.requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
            }
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navHeight = NAV_INITIAL_HEIGHT - (NAV_INITIAL_HEIGHT - NAV_MIN_HEIGHT) * scrollProgress;
    const breadcrumbHeight = BREADCRUMB_INITIAL_HEIGHT - (BREADCRUMB_INITIAL_HEIGHT - BREADCRUMB_MIN_HEIGHT) * scrollProgress;
    const paddingY = 8 + (20 - 8) * (1 - scrollProgress);
    const extractLabel = (url: string) => {
        const parts = url.replace('#', '/').split('/');
        return parts.pop();
    };
    return (
        <>
            <Box style={{ height: `${breadcrumbHeight}px` } as any} />
            <Box
                style={{
                    top: `${navHeight}px`,
                    height: `${breadcrumbHeight}px`,
                    paddingLeft: calculateFromMainWidth(40, mainWidth),
                    paddingRight: calculateFromMainWidth(40, mainWidth),
                    paddingTop: paddingY,
                    paddingBottom: paddingY,
                    transition: 'height 0.25s ease, padding 0.25s ease'
                } as any}
                className="fixed left-0 right-0 z-[900] w-[100%] flex-row items-center justify-center border-b-[1px] border-b-[#DFE4E9] bg-white">
                <Box
                    style={{
                        width: calculateFromMainWidth(1236, mainWidth),
                        gap: calculateFromMainWidth(10, mainWidth),
                    } as any}
                    className="h-[28px] m-auto flex-row items-center flex-wrap">
                    <Link href='/'>
                        <LinkText
                            className="text-[14px] font-[500] leading-[20px] tracking-[0.25px] underline">{data.startPage}</LinkText>
                    </Link>
                    <Text>&gt;</Text>
                    <Link href='/'>
                        <LinkText
                            className="text-[14px] font-[500] leading-[20px] tracking-[0.25px] underline">{getVocabularyLabel(data.vocabulary)}</LinkText>
                    </Link>
                    <Text>&gt;</Text>
                    {data.broader.length <= 2 ? (
                        data.broader.slice().reverse().map((term, index) => (
                            <React.Fragment key={`${term}-${index}`}>
                                <Link href={`/${data.vocabulary}/${extractLabel(term)}`} className="ml-[3px]">
                                    <LinkText
                                        className="text-[14px] font-[500] leading-[20px] tracking-[0.25px] underline">
                                        {extractLabel(term)}
                                    </LinkText>
                                </Link>
                                <Text>&gt;</Text>
                            </React.Fragment>
                        ))
                    ) : (
                        <>
                            <Link href={`/${data.vocabulary}/${extractLabel(data.broader[data.broader.length - 1])}`} className="ml-[3px]">
                                <LinkText
                                    className="text-[14px] font-[500] leading-[20px] tracking-[0.25px] underline">
                                    {extractLabel(data.broader[data.broader.length - 1])}
                                </LinkText>
                            </Link>
                            <Text>&gt;</Text>

                            {data.broader.slice(1, -1).reverse().map((term, index) => (
                                <React.Fragment key={`${term}-${index}`}>
                                    <Link href={`/${data.vocabulary}/${extractLabel(term)}`}>
                                        <LinkText
                                            className="text-[14px] font-[500] leading-[20px] tracking-[0.25px] underline">...</LinkText>
                                    </Link>
                                    <Text>&gt;</Text>
                                </React.Fragment>
                            ))}

                            <Link href={`/${data.vocabulary}/${extractLabel(data.broader[0])}`}>
                                <LinkText
                                    className="text-[14px] font-[500] leading-[20px] tracking-[0.25px] underline">
                                    {extractLabel(data.broader[0])}
                                </LinkText>
                            </Link>
                            <Text>&gt;</Text>
                        </>
                    )}
                    <Link href={`/${data.vocabulary}/${extractLabel(data.term)}`}>
                        <LinkText bold className="text-[14px] no-underline text-secondary-400">{data?.term}</LinkText>
                    </Link>
                </Box>
            </Box>
        </>
    );
}

export default Breadcrumbs;
