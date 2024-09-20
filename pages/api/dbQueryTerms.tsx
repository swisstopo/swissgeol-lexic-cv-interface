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
        try {
            console.log('Testing GraphDB connection...');
            await graphDBClient.getRepositoryIds();
            console.log('GraphDB connection successful in queryterm api');
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
        const repositoryId = configJsonDB.repositoryId;
        const repositoryUrl = `${url}/repositories/${repositoryId}`;
        const queryExecutor = new QueryExecutor(graphDBClient, repositoryId, url, username, password, repositoryUrl);
        /**
         * Retrieves the query configuration for the specified vocabulary using `getQueryConfig`.
         * Prepares the SPARQL queries for term data and breadcrumb path data by replacing placeholders in the query templates with the actual term.
         */
        const queryConfig = getQueryConfig(vocabulary);
        const queryVocabolo = queryConfig.queryVocabolo.replace('${term}', term);
        const breadcrumbsConfig = getQueryConfig(vocabulary);
        const queryBreadcrumbs = breadcrumbsConfig.queryBreadcrumbs.replace('${term}', term);
        /**
         * Set the string representing the github version based on the vocabulary
         */
        const getVersion = (vocabulary: string): string => {
            if (vocabulary === 'Chronostratigraphy') {
                return 'Release: 14/08/2024 - Chronostratigrafie v5-demo';
            } else if (vocabulary === 'TectonicUnits') {
                return 'Release: 14/08/2024 - Tectonic Units - v1.1-demo';
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


