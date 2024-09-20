const fs = require('fs');
const path = require('path');
/**
 * Retrieves SPARQL query configurations for a specific vocabulary from a JSON file.
 * 
 * This function reads the `queryConfig.json` file, which contains query templates for various vocabularies.
 * It extracts the queries for the specified vocabulary and returns them.
 */
function getQueryConfig(vocabulary) {
    const configPath = path.join(process.cwd(), 'queryConfig.json');
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configFile);

    const queryBreadcrumbs = config[vocabulary].queryBreadcrumbs;
    const queryVocabolo = config[vocabulary].queryVocabolo;

    return {
        queryBreadcrumbs,
        queryVocabolo
    };
}

module.exports = { getQueryConfig };
