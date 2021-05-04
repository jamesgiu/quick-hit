import {PageDimensions} from "../../../types/types";
import * as constants from "../../constants/PageConstants";

export interface SetPageDimensionsAction {
    type: constants.SET_PAGE_DIMENSIONS_TYPE,
    value: PageDimensions,
}

export function setPageDimensions(newPageDimensions: PageDimensions): SetPageDimensionsAction {
    return {
        type: constants.SET_PAGE_DIMENSIONS,
        value: newPageDimensions
    };
}