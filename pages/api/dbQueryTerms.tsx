import { GraphDBClient, QueryExecutor, getConfigDB, getQueryConfig } from '@/app/lib';
import { BreadCrumbsData } from '@/app/models/breadCrumbsInterface';
import { TermData } from '@/app/models/termDataInterface';
import { NextApiRequest, NextApiResponse } from 'next';
const fs = require('fs');
const path = require('path');
/**
 * Defines the structure of a result object returned from a SPARQL query.
 */
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
interface LabelQueryResult {
    subject: {
        value: string;
    };
    label: {
        value: string;
    };
}
/**
 * API route handler for fetching term and breadcrumb data from a GraphDB repository.
 * 
 * This handler processes GET requests containing a `term` and a `vocabulary` parameter. It uses these parameters 
 * to query a GraphDB repository and retrieve information about the specified term and its related breadcrumbs 
 * within the context of the given vocabulary. The data fetched includes term definitions, related terms 
 * (broader, narrower, and other relations), and breadcrumb navigation data.
 * 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { term, vocabulary } = req.query;
    /**
     * Checks the `term` and `vocabulary` query parameters to ensure they are strings.
     */
    if (typeof term !== 'string') {
        return res.status(400).json({ error: 'Invalid term parameter' });
    }
    if (typeof vocabulary !== 'string') {
        return res.status(400).json({ error: 'Invalid vocabulary parameter' });
    }
    console.log('api: term: ', term)
    console.log('api: vocabulary: ', vocabulary)
    /**
     * Reads the `connectionDbConfig.json` configuration file to retrieve the connection details for the specified vocabulary.
     * Parses the JSON content of the file to extract the configuration for the specified vocabulary.
     * If any error occurs during the file read or JSON parsing operations, it logs the error and 
     * responds with a 500 Internal Server Error status. If the configuration for the specified vocabulary
     * is not found in the file, it responds with a 404 Not Found status.
     */
    const configPath = path.join(process.cwd(), 'dbConfig.json');
    let configJsonDB;
    try {
        const configFile = fs.readFileSync(configPath, 'utf8');
        configJsonDB = JSON.parse(configFile);
    } catch (error) {
        console.error('Error reading configuration file:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!configJsonDB.vocabularies[vocabulary]) {
        return res.status(404).json({ message: `Configuration not found for vocabulary: ${vocabulary}` });
    }

    // Get configuration from environment variables (required)
    const url = process.env.GRAPHDB_BASE_URL;
    const username = process.env.GRAPHDB_USERNAME || '';
    const password = process.env.GRAPHDB_PASSWORD || '';
    
    if (!url) {
        return res.status(500).json({ error: 'GRAPHDB_BASE_URL environment variable is required' });
    }
    
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

    console.log(`Attempting to connect to GraphDB at ${url} with user: ${username}`);
    try {
        /** 
         * Establishes a connection to the GraphDB instance using the extracted configuration details.
         * This section includes:
         * Create a GraphDB Client: 
         * Initializes a `GraphDBClient` instance with the connection URL, username, and password.
         * Test the Connection: Attempts to test the connection by calling `getRepositoryIds()` on `graphDBClient` 
         * to ensure it can interact with the GraphDB instance.
         * Logs a success message if the connection test is successful.
         * Logs an error and returns a 500 Internal Server Error response if the connection test fails.
         */
        const graphDBClient = new GraphDBClient(url, username, password);

        const otherVocabulary = Object.keys(configJsonDB.vocabularies).find(vocab => vocab !== vocabulary);
        if (!otherVocabulary) {
            return res.status(404).json({ message: 'No other vocabulary found' });
        }

        // Use same environment variables for other vocabulary
        const otherUrl = url; // Same GraphDB instance
        const otherUsername = username;
        const otherPassword = password;
        const graphDBClientOtherVocabulary = new GraphDBClient(otherUrl, otherUsername, otherPassword);

        try {
            await graphDBClient.getRepositoryIds();
            console.log('GraphDB connection successful for:', vocabulary);

            await graphDBClientOtherVocabulary.getRepositoryIds();
            console.log('GraphDB connection successful for:', otherVocabulary);
        } catch (error) {
            console.error('GraphDB connection failed:', error);
            return res.status(500).json({ error: 'Failed to connect to GraphDB' });
        }
        /**
         * Sets up the query executor to run SPARQL queries against the GraphDB repository.
         * This section involves:
         * 
         * - Creates the URL for the GraphDB repository using the base URL and the repository ID extracted from the configuration.
         * - Initializes a `QueryExecutor` instance with the GraphDB client. This instance will be used to execute SPARQL queries.
         */
        // Use the repositoryId already determined above with env override
        const repositoryUrl = `${url}/repositories/${repositoryId}`;
        
        // Get repository ID for other vocabulary from environment variables
        let repositoryIdOtherVocabulary;
        switch (otherVocabulary) {
            case 'Chronostratigraphy':
                repositoryIdOtherVocabulary = process.env.CHRONOSTRATIGRAPHY_REPO_ID;
                break;
            case 'TectonicUnits':
                repositoryIdOtherVocabulary = process.env.TECTONICUNITS_REPO_ID;
                break;
            case 'Lithostratigraphy':
                repositoryIdOtherVocabulary = process.env.LITHOSTRATIGRAPHY_REPO_ID;
                break;
            case 'Lithology':
                repositoryIdOtherVocabulary = process.env.LITHOLOGY_REPO_ID;
                break;
        }
        
        if (!repositoryIdOtherVocabulary) {
            return res.status(500).json({ error: `${otherVocabulary.toUpperCase()}_REPO_ID environment variable is required` });
        }
        
        const repositoryUrlOtherVocabulary = `${otherUrl}/repositories/${repositoryIdOtherVocabulary}`;
        const queryExecutor = new QueryExecutor(graphDBClient, repositoryId, url, username, password, repositoryUrl);
        const queryExecutorOtherVocabulary = new QueryExecutor(graphDBClientOtherVocabulary, repositoryIdOtherVocabulary, otherUrl, otherUsername, otherPassword, repositoryUrlOtherVocabulary);
        /**
         * Retrieves the query configuration for the specified vocabulary using `getQueryConfig`.
         * Prepares the SPARQL queries for term data and breadcrumb path data by replacing placeholders in the query templates with the actual term.
         */
        const queryConfig = getQueryConfig(vocabulary);
        const queryVocabolo = queryConfig.queryVocabolo.replace('${term}', term);
        const breadcrumbsConfig = getQueryConfig(vocabulary);
        const queryBreadcrumbs = breadcrumbsConfig.queryBreadcrumbs.replace('${term}', term);

        const queryConfigCronos = getQueryConfig('Chronostratigraphy');
        const queryConfigTecto = getQueryConfig('TectonicUnits');

        const queryLabelOfAllConceptCronos = queryConfigCronos.queryLabelOfAllConcept;
        const queryLabelOfAllConceptTecto = queryConfigTecto.queryLabelOfAllConcept;
        /**
         * Set the string representing the github version based on the vocabulary
         */
        const getVersion = (vocabulary: string): string => {
            if (vocabulary === 'Chronostratigraphy') {
                return 'Release: 11/09/2024 - chronostratigrafie v6';
            } else if (vocabulary === 'TectonicUnits') {
                return 'Release: 01/04/2025 - Tectonic Units - v2.1';
            } else if (vocabulary === 'Lithostratigraphy') {
                return 'Release: 10/12/2024 - Lithostratigraphy - V1';
            } else if (vocabulary === 'Lithology') {
                return 'Release: 10/12/2024 - Lithology - V1';
            }
            return 'No data for version.';
        };

        try {
            /**
             * Executes the term data query and logs the result.
             * Executes the breadcrumb path query and logs the result.
             */
            console.log('Executing term query:', queryVocabolo);
            const termResult: SparqlResult[] = await queryExecutor.executeSparqlQuery(queryVocabolo);
            console.log('Term query result:', termResult);
            console.log('Executing breadcrumbs query:', queryBreadcrumbs);
            const breadcrumbResult: SparqlResult[] = await queryExecutor.executeSparqlQuery(queryBreadcrumbs);
            console.log('Breadcrumbs query result:', breadcrumbResult);
            const broaderTerms: string[] = [];
            const prefLabelOfAllConcept: LabelQueryResult[] = await queryExecutor.executeSparqlQuery(queryLabelOfAllConceptCronos); //for per iterare su tutti i vocabolari, segnalazione da inserire in pratiche, 
            const prefLabelOfAllConceptOtherVocabulary: LabelQueryResult[] = await queryExecutorOtherVocabulary.executeSparqlQuery(queryLabelOfAllConceptTecto);

            const allConceptMap = new Map<string, string>();

            const processResults = (results: LabelQueryResult[]) => {
                console.log('Processing results:', results.length);
                let addedCount = 0;
                let skippedCount = 0;
                let duplicateCount = 0;

                const initialSize = allConceptMap.size;

                results.forEach(result => {
                    const subject = result.subject.value;
                    const label = result.label.value;

                    if (subject && label) {
                        if (allConceptMap.has(subject)) {
                            duplicateCount++;
                        } else {
                            allConceptMap.set(subject, label);
                            addedCount++;
                        }
                    } else {
                        skippedCount++;
                    }
                });

                console.log('Processing complete:');
                console.log(`- Added: ${addedCount}`);
                console.log(`- Skipped: ${skippedCount}`);
                console.log(`- Duplicates: ${duplicateCount}`);
                console.log(`- Initial map size: ${initialSize}`);
                console.log(`- Final map size: ${allConceptMap.size}`);
                console.log(`- Difference: ${allConceptMap.size - initialSize}`);
            };


            processResults(prefLabelOfAllConcept);
            processResults(prefLabelOfAllConceptOtherVocabulary);

            /**
             * Initializes a `TermData` object to store the term details.
             * Iterates through the term data results and populates the `TermData` object based on the predicates and objects retrieved.
             * Logs details about each predicate and object processed.
             */
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
            /**
             * Takes from configuration the order to follow when saving prefLabels by giving them a precise order of display 
             */
            const orderedLanguages = configJsonDB.queries.labelLanguageOrder;
            const sortedLanguages: { [key: string]: string } = {};
            orderedLanguages.forEach((lang: string) => {
                if (termData.languages[lang]) {
                    sortedLanguages[lang] = termData.languages[lang];
                }
            });
            termData.languages = sortedLanguages;

            breadcrumbResult.forEach(result => {
                const { narrowerConcept } = result;

                if (narrowerConcept && narrowerConcept.value) {
                    broaderTerms.push(narrowerConcept.value);
                }
            });
            /**
             * Constructs the breadcrumb navigation data to reflect the user's navigation path.
             * 
             * Initializes the `breadCrumbsData` object with:
             *  - `startPage`: Always set to 'Home', indicating the starting point of the breadcrumb trail.
             *  - `vocabulary`: The name of the vocabulary.
             *  - `broader`: The array of broader terms collected from the breadcrumb results.
             *  - `term`: The specific term.
             */
            const breadCrumbsData: BreadCrumbsData = {
                startPage: 'Home',
                vocabulary: vocabulary,
                broader: broaderTerms,
                term: term,
            };
            // Converts `OtherRelation` from a Map to a plain object where each key-value pair is an array.
            const otherRelationObject = Object.fromEntries(
                Array.from(termData.relatedTerms.OtherRelation.entries()).map(([key, value]) => [key, Array.from(value)])
            );
            const allConceptObject = Object.fromEntries(
                Array.from(allConceptMap.entries()).map(([key, value]) => [key, value])
            );
            // Constructs the response data object with query results and term data.
            const responseData = {
                predicates: termResult, // Results of the SPARQL query for the term.
                termData: {
                    ...termData,
                    relatedTerms: {
                        ...termData.relatedTerms,
                        OtherRelation: otherRelationObject
                    }
                },
                breadCrumbsData: breadCrumbsData,
                allConceptMap: allConceptObject,
            };

            console.log('All Concept Map:', responseData.allConceptMap);
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
