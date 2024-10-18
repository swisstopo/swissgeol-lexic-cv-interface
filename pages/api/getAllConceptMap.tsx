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

    const configPath = path.join(process.cwd(), 'connectionDbConfig.json');
    let configJsonDB;
    try {
        const configFile = fs.readFileSync(configPath, 'utf8');
        configJsonDB = JSON.parse(configFile);
    } catch (error) {
        console.error('Error reading configuration file:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    const vocabularies = Object.keys(configJsonDB);
    console.log(vocabularies);
    const allConceptMap = new Map<string, string>();

    try {
        for (const vocabulary of vocabularies) {
            const { url, username, password, repositoryId } = configJsonDB[vocabulary];
            const graphDBClient = new GraphDBClient(url, username, password);
            const repositoryUrl = `${url}/repositories/${repositoryId}`;
            const queryExecutor = new QueryExecutor(graphDBClient, repositoryId, url, username, password, repositoryUrl);

            const queryConfig = getQueryConfig(vocabulary);
            const queryLabelOfAllConcept = queryConfig.queryLabelOfAllConcept;

            const prefLabels: LabelQueryResult[] = await queryExecutor.executeSparqlQuery(queryLabelOfAllConcept);

            try {
                await graphDBClient.getRepositoryIds();
                console.log('GraphDB connection successful for:', vocabulary);
            } catch (error) {
                console.error('GraphDB connection failed:', error);
                return res.status(500).json({ error: 'Failed to connect to GraphDB' });
            }

            const allSubjects = new Set();

            prefLabels.forEach(result => {
                const subject = result.subject.value;
                const label = result.label.value;

                if (subject && label) {
                    if (allSubjects.has(subject)) {
                        console.log('Duplicato trovato:', subject, 'con label:', label);
                    } else {
                        allSubjects.add(subject);

                        const parts = subject.split('/');
                        if (parts.length >= 5) {
                            const vocabulary = parts[parts.length - 2];
                            const term = parts[parts.length - 1];

                            if ((vocabulary === 'Chronostratigraphy' || vocabulary === 'TectonicUnits') && term) {
                                allConceptMap.set(subject, label);
                            } else {
                                console.log('Non aggiunto:', subject);
                            }
                        } else {
                            console.log('URL non valido, troppe poche parti:', subject);
                        }
                    }
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