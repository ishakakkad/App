import { buildSearchQueryJSON } from '@libs/SearchQueryUtils';
import { deleteSavedSearch } from '@libs/actions/Search';
import { SaveSearch } from "@src/types/onyx";

const cleanupSavedSearches = (policyIDToDelete: string | undefined, savedSearches: SaveSearch | undefined) => {
    if (!policyIDToDelete || !savedSearches) {
        return;
    }
    Object.keys(savedSearches).forEach((key: any) => {
        const query = buildSearchQueryJSON(savedSearches?.[key]?.query);
        if (!query?.policyID || policyIDToDelete !== query.policyID) {
            return;
        }
        const hashToDelete = Number(key);
        deleteSavedSearch(hashToDelete);
    });
};

export {cleanupSavedSearches}