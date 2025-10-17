import { NextApiRequest, NextApiResponse } from 'next';
import { GraphDBClient, QueryExecutor, getConfigDB, getQueryConfig } from '@/app/lib';
import fs from 'fs';
import path from 'path';

interface LabelQueryResult {
    subject: {
        value: string;
    };
    label: {
        value: string;
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const configPath = path.join(process.cwd(), 'dbConfig.json');
    let configJsonDB;
    try {
        const configFile = fs.readFileSync(configPath, 'utf8');
        configJsonDB = JSON.parse(configFile);
    } catch (error) {
        console.error('Error reading configuration file:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    const vocabularies = Object.keys(configJsonDB.vocabularies);
    const allConceptMap = new Map<string, string>();

    try {
        // Get configuration from environment variables (required)
        const url = process.env.GRAPHDB_BASE_URL;
        const username = process.env.GRAPHDB_USERNAME || '';
        const password = process.env.GRAPHDB_PASSWORD || '';
        
        if (!url) {
            return res.status(500).json({ error: 'GRAPHDB_BASE_URL environment variable is required' });
        }

        for (const vocabulary of vocabularies) {
            // Get repository ID from specific environment variables
            let repositoryId;
            switch (vocabulary) {
                case 'Chronostratigraphy':
                    repositoryId = process.env.CHRONOSTRATIGRAPHY_REPO_ID;
                    break;
                case 'TectonicUnits':
                    repositoryId = process.env.TECTONICUNITS_REPO_ID;
                    break;
                case 'Lithostratigraphy':
                    repositoryId = process.env.LITHOSTRATIGRAPHY_REPO_ID;
                    break;
                case 'Lithology':
                    repositoryId = process.env.LITHOLOGY_REPO_ID;
                    break;
            }
            
            if (!repositoryId) {
                return res.status(500).json({ error: `${vocabulary.toUpperCase()}_REPO_ID environment variable is required` });
            }
            
            const graphDBClient = new GraphDBClient(url, username, password);
            const repositoryUrl = `${url}/repositories/${repositoryId}`;
            const queryExecutor = new QueryExecutor(graphDBClient, repositoryId, url, username, password, repositoryUrl);

            const queryConfig = getQueryConfig(vocabulary);
            const queryLabelOfAllConcept = queryConfig.queryLabelOfAllConcept;

            const prefLabels: LabelQueryResult[] = await queryExecutor.executeSparqlQuery(queryLabelOfAllConcept);

            try {
                await graphDBClient.getRepositoryIds();
            } catch (error) {
                console.error('GraphDB connection failed:', error);
                return res.status(500).json({ error: 'Failed to connect to GraphDB' });
            }

            const allSubjects = new Set();

            prefLabels.forEach(result => {
                const subject = result.subject.value;
                const label = result.label.value;

                let duplicates: boolean = false;
                if (subject && label) {
                    if (allSubjects.has(subject)) {
                        duplicates = true;
                    } else {
                        allSubjects.add(subject);

                        const parts = subject.split('/');
                        if (parts.length >= 5) {
                            const vocabulary = parts[parts.length - 2];
                            const term = parts[parts.length - 1];

                            if (vocabularies.includes(vocabulary) && term) {
                                allConceptMap.set(subject, label);
                            } else {
                                duplicates = true;
                            }
                        } else {
                            console.log('[GetAllConceptMap] WARN: This url not represent a vocabulary term (maybe is the root):', subject);
                        }
                    }
                }
                if (duplicates == true) {
                    //console.log('[GetAllConceptMap] WARN: Some terms into vocabulary '+vocabulary+' are returned duplicated from queryLabelOfAllConcept.')
                }
            });
        }

        const allConceptObject = Object.fromEntries(
            Array.from(allConceptMap.entries()).map(([key, value]) => [key, value])
        );

        res.status(200).json({ allConceptMap: allConceptObject });
    } catch (error) {
        console.error('Error fetching all concepts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
