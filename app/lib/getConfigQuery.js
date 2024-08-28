const fs = require('fs');
const path = require('path');

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
