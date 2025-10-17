import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import VocabolaryTerm from '@/app/components/VocabolaryTerm';
import { BreadCrumbsData, TermData } from '../../app/models';
import { resolveVocabularyVersion } from '@/app/utils/resolveVocabularyVersion';

interface ErrorType {
    message: string;
}


const TermPage: React.FC = () => {
    // Get the router object to access route parameters
    const router = useRouter();
    const { term } = router.query;
    // State for storing term data, breadcrumb data, loading status, and errors
    const [termData, setTermData] = useState<TermData>();
    const [breadCrumbsData, setBreadCrumbsData] = useState<BreadCrumbsData>();
    const [allConceptMap, setAllConceptMap] = useState(new Map<string, string>());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ErrorType | null>();

    useEffect(() => {
        const fetchTermData = async () => {
            // Exit if term is not available yet
            if (!term) {
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Fetch term data from the API
                const response = await fetch(`/api/dbQueryTerms?vocabulary=Lithology&term=${term}`);

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                // Update state with the fetched data
                const data = await response.json();
                
                setTermData(data.termData);
                setBreadCrumbsData(data.breadCrumbsData || null);
                setAllConceptMap(new Map(Object.entries(data.allConceptMap)));

                const ver = await resolveVocabularyVersion('Lithology');
                setTermData((prev) => prev ? { ...prev, version: ver } : prev);
            } catch (error) {
                console.error('Error fetching term data:', error);
                setError({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
            } finally {
                setLoading(false);
            }
        };
        fetchTermData();
    }, [term]);

    if (!term) {
        return <div>Waiting for term...</div>;
    }

    if (loading) {
        return <div>Loading data for {term}...</div>;
    }

    if (error) {
        return <div>Error fetching data for {term}: {error.message}</div>;
    }

    if (!termData || !breadCrumbsData) {
        return <div>Loading data...</div>;
    }

    return (
        <div key={Array.isArray(term) ? term[0] : term}>
            <VocabolaryTerm termData={termData} breadCrumbsData={breadCrumbsData} allConceptMap={allConceptMap} />
        </div>
    );
};

export default TermPage;
