import {SetPageDimensionsAction} from "../../actions/PageActions";
import {SET_PAGE_DIMENSIONS} from "../../constants/PageConstants";
import {PageStoreState} from "../../types/PageTypes";

export const pageInitialState = {
    dimensions: undefined
};

export function pageReducer(state: PageStoreState = pageInitialState, action: SetPageDimensionsAction): PageStoreState {
    switch (action.type) {
        case SET_PAGE_DIMENSIONS:
            return {...state, dimensions: action.value}
        default:
            return state;
    }
}