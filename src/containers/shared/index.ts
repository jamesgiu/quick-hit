import {TTStoreState} from "../../redux/types/TTTypes";
import {Dispatch} from "redux";
import * as actions from "../../redux/actions/TTActions";
import {QuickHitReduxStores} from "../../index";

export type TTDataPropsTypeCombined = TTStoreState & TTRefreshDispatchType;

export interface TTRefreshDispatchType {
    setForceRefresh: (newRefresh: boolean) => void;
}

export function mapTTDataToProps(store: QuickHitReduxStores) : TTStoreState {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        refresh: store.ttData.refresh,
    }
}

export function mapTTDispatchToProps(dispatch: Dispatch<actions.SetForceRefreshAction>) : TTRefreshDispatchType {
    return {
        setForceRefresh: (newRefresh: boolean) => dispatch(actions.setRefresh(newRefresh)),
    }
}
