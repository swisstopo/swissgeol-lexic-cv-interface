'use client';

import { Box, Link, LinkText, Text } from '@gluestack-ui/themed';
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
            <Box h={`${breadcrumbHeight}px` as any} />
            <Box
                position={'fixed' as any}
                top={`${navHeight}px` as any}
                left={0}
                right={0}
                zIndex={900}
                w={'100%'}
                flexDirection='row'
                alignItems='center'
                justifyContent='center'
                borderBottomWidth={1}
                borderBottomColor='#DFE4E9'
                h={`${breadcrumbHeight}px` as any}
                bg='$white'
                paddingLeft={calculateFromMainWidth(40, mainWidth) as any}
                paddingRight={calculateFromMainWidth(40, mainWidth) as any}
                paddingTop={paddingY}
                paddingBottom={paddingY}
                style={{
                    transition: 'height 0.25s ease, padding 0.25s ease'
                } as any}
            >
                <Box
                    w={calculateFromMainWidth(1236, mainWidth) as any}
                    h={28}
                    margin='auto'
                    flexDirection='row'
                    alignItems='center'
                    gap={calculateFromMainWidth(10, mainWidth) as any}
                    flexWrap='wrap'
                >
                    <Link href='/'>
                        <LinkText fontSize={14} fontWeight={500} lineHeight={20} letterSpacing={0.25} textDecorationLine='underline' >{data.startPage}</LinkText>
                    </Link>
                    <Text>&gt;</Text>
                    <Link href='/'>
                        <LinkText fontSize={14} fontWeight={500} lineHeight={20} letterSpacing={0.25} textDecorationLine='underline'>{data.vocabulary}</LinkText>
                    </Link>
                    <Text>&gt;</Text>
                    {data.broader.length <= 2 ? (
                        data.broader.slice().reverse().map((term, index) => (
                            <React.Fragment key={`${term}-${index}`}>
                                <Link href={`/${data.vocabulary}/${extractLabel(term)}`} ml={3}>
                                    <LinkText fontSize={14} fontWeight={500} lineHeight={20} letterSpacing={0.25} textDecorationLine='underline'>
                                        {extractLabel(term)}
                                    </LinkText>
                                </Link>
                                <Text>&gt;</Text>
                            </React.Fragment>
                        ))
                    ) : (
                        <>
                            <Link href={`/${data.vocabulary}/${extractLabel(data.broader[data.broader.length - 1])}`} ml={3}>
                                <LinkText fontSize={14} fontWeight={500} lineHeight={20} letterSpacing={0.25} textDecorationLine='underline'>
                                    {extractLabel(data.broader[data.broader.length - 1])}
                                </LinkText>
                            </Link>
                            <Text>&gt;</Text>

                            {data.broader.slice(1, -1).reverse().map((term, index) => (
                                <React.Fragment key={`${term}-${index}`}>
                                    <Link href={`/${data.vocabulary}/${extractLabel(term)}`}>
                                        <LinkText fontSize={14} fontWeight={500} lineHeight={20} letterSpacing={0.25} textDecorationLine='underline'>...</LinkText>
                                    </Link>
                                    <Text>&gt;</Text>
                                </React.Fragment>
                            ))}

                            <Link href={`/${data.vocabulary}/${extractLabel(data.broader[0])}`}>
                                <LinkText fontSize={14} fontWeight={500} lineHeight={20} letterSpacing={0.25} textDecorationLine='underline'>
                                    {extractLabel(data.broader[0])}
                                </LinkText>
                            </Link>
                            <Text>&gt;</Text>
                        </>
                    )}
                    <Link href={`/${data.vocabulary}/${extractLabel(data.term)}`}>
                        <LinkText fontSize={14} textDecorationLine='none' bold color='$secondary400'>{data?.term}</LinkText>
                    </Link>
                </Box>
            </Box>
        </>
    );
}

export default Breadcrumbs;
