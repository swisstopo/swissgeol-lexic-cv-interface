import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import VocabolaryTerm from '@/app/components/VocabolaryTerm';

const TermPage: React.FC = () => {
    const router = useRouter();
    const { term } = router.query;
    console.log('[term].ts: term:', term);

    const [termData, setTermData] = useState(null);
    const [breadCrumbsData, setBreadCrumbsData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTermData = async () => {
            if (!term) {
                console.log('Term is not available yet');
                return;
            }

            console.log('Fetching data for term:', term);
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/dbQueryTerms?vocabulary=Chronostratigraphy&term=${term}`);
                console.log('Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }

                const data = await response.json();
                console.log('Received data:', data);

                setTermData(data.termData);
                setBreadCrumbsData(data.breadCrumbsData || null);
            } catch (error) {
                console.error('Error fetching term data:', error);
                setError(error);
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

    if (!termData) {
        return <div>No data found for {term}</div>;
    }

    return (
        <div key={term}>
            <VocabolaryTerm termData={termData} breadCrumbsData={breadCrumbsData} />
        </div>
    );
};

export default TermPage;