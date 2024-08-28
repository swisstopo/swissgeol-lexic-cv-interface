import { GraphDBClient, QueryExecutor, getConfigDB, getQueryConfig } from '@/app/lib';
import { BreadCrumbsData } from '@/app/models/breadCrumbsInterface';
import { TermData } from '@/app/models/termDataInterface';
import { NextApiRequest, NextApiResponse } from 'next';
const fs = require('fs');
const path = require('path');

interface SparqlResult {
    predicate: {
        termType: string;
        value: string;
    };
    object: {
        termType: string;
        value: string;
        language?: string;
        datatype?: {
            termType: string;
            value: string;
        };
    };
    narrowerConcept: {
        termType: string;
        value: string;
    };
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { term, vocabulary } = req.query;

    if (typeof term !== 'string') {
        return res.status(400).json({ error: 'Invalid term parameter' });
    }

    if (typeof vocabulary !== 'string') {
        return res.status(400).json({ error: 'Invalid vocabulary parameter' });
    }

    console.log('api: term: ', term)
    console.log('api: vocabulary: ', vocabulary)


    const configPath = path.join(process.cwd(), 'connectionDbConfig.json');
    let configJsonDB;
    try {
        const configFile = fs.readFileSync(configPath, 'utf8');
        configJsonDB = JSON.parse(configFile)[vocabulary];
    } catch (error) {
        console.error('Error reading configuration file:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!configJsonDB) {
        return res.status(404).json({ message: `Configuration not found for vocabulary: ${vocabulary}` });
    }

    const url = configJsonDB.url;
    const username = configJsonDB.username;
    const password = configJsonDB.password;

    console.log(`Attempting to connect to GraphDB at ${url} with user: ${username}`);
    try {
        const graphDBClient = new GraphDBClient(url, username, password);
        try {
            console.log('Testing GraphDB connection...');
            await graphDBClient.getRepositoryIds();
            console.log('GraphDB connection successful in queryterm api');
        } catch (error) {
            console.error('GraphDB connection failed:', error);
            return res.status(500).json({ error: 'Failed to connect to GraphDB' });
        }

        const repositoryId = configJsonDB.repositoryId;
        const repositoryUrl = `${url}/repositories/${repositoryId}`;
        const queryExecutor = new QueryExecutor(graphDBClient, repositoryId, url, username, password, repositoryUrl);

        const queryConfig = getQueryConfig(vocabulary);
        const queryVocabolo = queryConfig.queryVocabolo.replace('${term}', term);
        const breadcrumbsConfig = getQueryConfig(vocabulary);
        const queryBreadcrumbs = breadcrumbsConfig.queryBreadcrumbs.replace('${term}', term);

        const getVersion = (vocabulary: string): string => {
            if (vocabulary === 'Chronostratigraphy') {
                return 'Release: 14/08/2024 - Chronostratigrafie v5-demo';
            } else if (vocabulary === 'TectonicUnits') {
                return 'Release: 14/08/2024 - Tectonic Units - v1.1-demo';
            }
            return 'No data for version.';
        };


        try {
            console.log('Executing term query:', queryVocabolo);
            const termResult: SparqlResult[] = await queryExecutor.executeSparqlQuery(queryVocabolo);
            console.log('Term query result:', termResult);

            console.log('Executing breadcrumbs query:', queryBreadcrumbs);
            const breadcrumbResult: SparqlResult[] = await queryExecutor.executeSparqlQuery(queryBreadcrumbs);
            console.log('Breadcrumbs query result:', breadcrumbResult);

            const broaderTerms: string[] = [];

            const termData: TermData = {
                term: term,
                uri: '',
                vocabulary: vocabulary,
                version: getVersion(vocabulary),
                languages: {},
                definition: '',
                relatedTerms: {
                    Narrower: [],
                    Broader: [],
                    OtherRelation: new Map<string, string[]>(),
                },
                isDefinedBy: '',
                termStatus: '',
            };

            termResult.forEach(result => {
                const { predicate, object } = result;

                console.log(`Processing predicate: ${predicate.value}`);
                console.log(`Processing object: ${object.value}`);

                switch (predicate.value) {
                    case 'http://www.w3.org/2004/02/skos/core#inScheme':
                        termData.uri = object.value + '/' + term;
                        break;
                    case 'http://www.w3.org/2004/02/skos/core#prefLabel':
                        if (object.language) {
                            termData.languages[object.language] = object.value;
                        }
                        break;
                    case 'http://www.w3.org/2004/02/skos/core#definition':
                        termData.definition = object.value;
                        break;
                    case 'http://www.w3.org/2004/02/skos/core#broader':
                        termData.relatedTerms.Broader.push(object.value);
                        break;
                    case 'http://www.w3.org/2004/02/skos/core#narrower':
                        termData.relatedTerms.Narrower.push(object.value);
                        break;
                    case 'http://www.w3.org/2000/01/rdf-schema#isDefinedBy':
                        termData.isDefinedBy = object.value;
                        break;
                    case 'http://www.w3.org/ns/adms#status':
                        termData.termStatus = object.value;
                        break;
                    case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type':
                        break;
                    case 'http://www.w3.org/2004/02/skos/core#topConceptOf':
                        break;
                    case 'http://resource.geosciml.org/ontology/timescale/gts#rank':
                        break;
                    default:
                        console.log(`Adding to OtherRelation with predicate ${predicate.value}: ${object.value}`);
                        const relatedArray = termData.relatedTerms.OtherRelation.get(predicate.value) ?? [];
                        relatedArray.push(object.value);
                        termData.relatedTerms.OtherRelation.set(predicate.value, relatedArray);
                        break;
                }
            });


            breadcrumbResult.forEach(result => {
                const { narrowerConcept } = result;

                if (narrowerConcept && narrowerConcept.value) {
                    broaderTerms.push(narrowerConcept.value);
                }
            });


            const breadCrumbsData: BreadCrumbsData = {
                startPage: 'Home',
                vocabulary: vocabulary,
                broader: broaderTerms,
                term: term,
            };

            const otherRelationObject = Object.fromEntries(
                Array.from(termData.relatedTerms.OtherRelation.entries()).map(([key, value]) => [key, Array.from(value)])
            );

            const responseData = {
                predicates: termResult,
                termData: {
                    ...termData,
                    relatedTerms: {
                        ...termData.relatedTerms,
                        OtherRelation: otherRelationObject
                    }
                },
                breadCrumbsData: breadCrumbsData,
            };

            console.log('Query executed successfully, sending response');
            res.status(200).json(responseData);
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }


    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


