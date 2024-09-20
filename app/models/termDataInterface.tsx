/**
 * Represents detailed information about a specific term within a vocabulary or taxonomy.
 * 
 * @interface TermData
 * 
 * @property {string} term - Contains the name of the term.
 * @property {string} uri - Provides a direct link to the term's page.
 * @property {string} vocabulary - Specifies the vocabulary to which the term belongs.
 * @property {string} version - The version of the vocabulary.
 * @property {{ [key: string]: string }} languages ​​​​​​​​​​- An object that maps language codes to translations of the term.
 * @property {string} definition - Description of the term.
 * @property {Object} relatedTerms - Relationships to other terms.
 * @property {string[]} relatedTerms.Narrower - Child terms of the current term.
 * @property {string[]} relatedTerms.Broader - Parent term of the current term.
 * @property {Map<string, string[]>} relatedTerms.OtherRelation - Other types of relationships to the term, mapped by relationship type.
 * @property {string} isDefinedBy - The source that provides the description of the term.
 * @property {string} termStatus - The current status of the term, such as whether it is deprecated or active.
 */
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
