/**
 * Utility class to cover handling searches and hashtags.
 */
class PenguinModDiscovery {
    /**
     * Converts a search query in string format to a SearchQuery object.
     * @param {string} query The search query to convert to a SearchQuery object.
     * @param {string[]|null} limitTags A list of modifiers to blacklist, or whitelist if `whitelist` is `true`.
     * @param {boolean|null} whitelist Whether to treat `limitTags` as a whitelist (true) or a blacklist (false|null)
     * @returns {PenguinModTypes.SearchQuery}
     */
    static extractQuery(query, limitTags, whitelist) {
        const words = query.split(" ");
        const cleanQuery = []; // this is the text to search for later

        // this is the object we return
        const resultingQuery = {};

        for (const word of words) {
            // Check if word contains a colon and split only on the first occurrence
            if (word.includes(':')) {
                const [modifier, value] = word.split(/:(.*)/s);
                const isAllowed = !limitTags ? true : (whitelist ? limitTags.includes(modifier) : !limitTags.includes(modifier));
                if (isAllowed) {
                    // cast true & false to booleans, and nothing to true so adding "reverse:" means reverse is true
                    const castedValue = value === "true" ? true
                        : (value === "false" ? false
                        : (value.trim() === "" ? true
                        : value))
                    resultingQuery[modifier] = castedValue;
                    continue;
                }
            }

            // If it's not a modifier (or it's disabled), it's part of the query
            // this leaves "hello by:John123 world" if `by` is disabled
            cleanQuery.push(word);
        }

        return {
            ...resultingQuery,
            query: cleanQuery.join(" ")
        };
    }
    /**
     * Converts a SearchQuery object to a string.
     * @param {PenguinModTypes.SearchQuery} searchQuery The SearchQuery to convert to a string.
     * @returns {string}
     */
    static createQuery(searchQuery) {
        const newString = [];

        // convert all the modifiers
        for (const modifier in searchQuery) {
            if (modifier === "query") continue;
            newString.push(`${modifier}:${searchQuery[modifier]}`);
        }

        // add text
        if (searchQuery.query !== "") { // dont add a space if there's only modifiers
            newString.push(...(searchQuery.query.split(" ")));
        }

        return newString.join(" ");
    }
}

module.exports = PenguinModDiscovery;
