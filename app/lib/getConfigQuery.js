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

    const queryBreadcrumbs = config.queries[queryKey].queryBreadcrumbs;
    const queryVocabolo = config.queries[queryKey].queryVocabolo;
    const queryLabelOfAllConcept = config.queries[queryKey].prefLabelOfAllConcept;
    const labelLanguageOrder = config.queries.labelLanguageOrder;

    return {
        queryBreadcrumbs,
        queryVocabolo,
        queryLabelOfAllConcept,
        labelLanguageOrder
    };
}

module.exports = { getQueryConfig };

