export interface TermData {
    term: string;
    uri: string;
    vocabulary: string;
    version: string;
    languages: { [key: string]: string };
    definition: string;
    relatedTerms: {
        Narrower: string[];
        Broader: string[];
        OtherRelation: Map<string, string[]>,
    },
    isDefinedBy: string;
    termStatus: string;
}
