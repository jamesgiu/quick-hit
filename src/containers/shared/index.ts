import {TTStoreState} from "../../redux/types/TTTypes";
import {Dispatch} from "redux";
import * as actions from "../../redux/actions/TTActions";
import {QuickHitReduxStores} from "../../index";

export interface TTDataPropsType extends  TTStoreState {
    setForceRefresh: (newRefresh: boolean) => void;
}

export function mapTTDataToProps(store: QuickHitReduxStores) {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        refresh: store.ttData.refresh,
    }
}

export function mapTTDispatchToProps(dispatch: Dispatch<actions.SetForceRefreshAction>) {
    return {
        setForceRefresh: (newRefresh: boolean) => dispatch(actions.setRefresh(newRefresh)),
    }
}
