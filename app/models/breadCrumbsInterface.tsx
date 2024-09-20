/**
 * Represents the structure of breadcrumb navigation data used to track and display 
 * the user's navigation path within the vocabulary.
 * 
 * @interface BreadCrumbsData
 * 
 * @property {'Home'} startPage - Always set to 'Home', indicating the starting point of the breadcrumb trail.
 * @property {string} vocabulary - Specifies the name of the current vocabulary.
 * @property {string[]} broader - Contains a list of broader terms that represent the hierarchical path leading to the current `term`.
 * @property {string} term - The most specific term in the hierarchy, representing the current point in the breadcrumb trail.
 */
export interface BreadCrumbsData {
   startPage: 'Home';
   vocabulary: string;
   broader: string[];
   term: string;
}
