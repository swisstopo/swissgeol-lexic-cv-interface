const { GraphDBServerClient, ServerClientConfig } = require('graphdb').server;
const { RDFMimeType } = require('graphdb').http;

class GraphDBClient {
    private serverClient: typeof GraphDBServerClient;

    constructor(serverUrl: string, username: string, password: string) {
        const serverConfig = new ServerClientConfig(serverUrl)
            .setTimeout(5000000)
            .setHeaders({
                'Accept': RDFMimeType.SPARQL_RESULTS_XML
            })
            .useBasicAuthentication(username, password)
            .setKeepAlive(true);


        this.serverClient = new GraphDBServerClient(serverConfig);

        console.log(`Attempting to connect to GraphDB at ${serverUrl} with user: ${username}`);
    }

    public async getRepositoryIds(): Promise<string[]> {
        try {
            return await this.serverClient.getRepositoryIDs();
        } catch (error) {
            console.error('Error fetching repository IDs:', error);
            throw error;
        }
    }

    public getClient(): typeof GraphDBServerClient {
        return this.serverClient;
    }
}

export default GraphDBClient;
