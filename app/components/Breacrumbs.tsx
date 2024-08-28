import { Box, Link, LinkText } from '@gluestack-ui/themed';
import React from 'react';
import { BreadCrumbsData } from '../models/breadCrumbsInterface';

export interface BreadcrumbsProps {
    data: BreadCrumbsData;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ data }) => {
    const extractLabel = (url: string) => {
        const parts = url.replace('#', '/').split('/');
        return parts.pop();
    };
    return (
        <Box
            ml={8}
            mt={8}
            flexDirection='row'
            marginLeft={24}
        >
            <Link href='/'>
                <LinkText fontSize={14} textDecorationLine='none' color='$secondary400'>{data.startPage} &gt; </LinkText>
            </Link>
            <Link href='/'>
                <LinkText fontSize={14} textDecorationLine='none' color='$secondary400'>{data.vocabulary} &gt; </LinkText>
            </Link>
            {/* <Link href='#'>
                <LinkText fontSize={14} textDecorationLine='none' color='$secondary400'>... &gt; </LinkText>
            </Link> */}
            {data.broader.slice().reverse().map((term, index) => (
                <Link href={`/${data.vocabulary}/${extractLabel(term)}`} key={index} ml={3}>
                    <LinkText fontSize={14} textDecorationLine='none' color='$secondary400'>
                        {extractLabel(term)} &gt;
                    </LinkText>
                </Link>
            ))}
            <Link href={`/${data.vocabulary}/${extractLabel(data.term)}`}>
                <LinkText fontSize={14} textDecorationLine='none' bold color='$secondary400'>{data.term}</LinkText>
            </Link>
        </Box>
    );
}

export default Breadcrumbs;
