const fs = require('fs');
const path = require('path');
/**
 * Retrieves the database configuration for a specific vocabulary from a JSON file.
 * 
 * This function reads the `connectionDbConfig.json` file, which contains connection details for various vocabularies.
 * It extracts and returns the configuration for the specified vocabulary.
 */
function getConfigDB(vocabulary) {
    try {
        const configPath = path.join(process.cwd(), 'connectionDbConfig.json');
        const configFile = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configFile);

        return config[vocabulary];
    } catch (error) {
        console.error('Error reading configuration:', error);
        return null;
    }
}

module.exports = { getConfigDB };
