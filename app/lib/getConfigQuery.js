const fs = require('fs');
const path = require('path');
/**
 * Retrieves SPARQL query configurations for a specific vocabulary from a JSON file.
 * 
 * This function reads the `queryConfig.json` file, which contains query templates for various vocabularies.
 * It extracts the queries for the specified vocabulary and returns them.
 */
function getQueryConfig(vocabulary) {
    const configPath = path.join(process.cwd(), 'dbConfig.json');
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configFile);

    const queryKey = `${vocabulary}Query`;
    if (!config.queries || !config.queries[queryKey]) {
        throw new Error(`Query configuration not found for vocabulary: ${vocabulary}`);
    }

    const labelLanguageOrder = config.queries.labelLanguageOrder;

    // Get prefix base URL from environment variable
    const prefixBaseUrl = process.env.VOCABULARY_PREFIX_URL;
    if (!prefixBaseUrl) {
        throw new Error('VOCABULARY_PREFIX_URL environment variable is required');
    }
    
    // Replace placeholder in queries with the configured base URL
    const placeholderPattern = /\{\{PREFIX_BASE_URL\}\}/g;
    
    const queryBreadcrumbs = config.queries[queryKey].queryBreadcrumbs?.replace(placeholderPattern, prefixBaseUrl);
    const queryVocabolo = config.queries[queryKey].queryVocabolo?.replace(placeholderPattern, prefixBaseUrl);
    const queryLabelOfAllConcept = config.queries[queryKey].prefLabelOfAllConcept?.replace(placeholderPattern, prefixBaseUrl);

    return {
        queryBreadcrumbs,
        queryVocabolo,
        queryLabelOfAllConcept,
        labelLanguageOrder
    };
}

module.exports = { getQueryConfig };
