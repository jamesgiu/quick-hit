import { TTStoreState } from "../../redux/types/TTTypes";
import { Dispatch } from "redux";
import * as actions from "../../redux/actions/TTActions";
import { QuickHitReduxStores } from "../../redux/types/store";
import {DbInstance} from "../../types/database/models";

export type TTDataPropsTypeCombined = TTStoreState & TTRefreshDispatchType;

export interface TTRefreshDispatchType {
    setForceRefresh: (newRefresh: boolean) => void;
}

export function mapTTDataToProps(store: QuickHitReduxStores): TTStoreState & {chosenInstance?: DbInstance} {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        happyHour: store.ttData.happyHour,
        badges: store.ttData.badges,
        tournaments: store.ttData.tournaments,
        refresh: store.ttData.refresh,
        chosenInstance: store.authStore.chosenInstance,
    };
}

export function mapTTDispatchToProps(dispatch: Dispatch<actions.SetForceRefreshAction>): TTRefreshDispatchType {
    return {
        setForceRefresh: (newRefresh: boolean): actions.SetForceRefreshAction =>
            dispatch(actions.setRefresh(newRefresh)),
    };
}
