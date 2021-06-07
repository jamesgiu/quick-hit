import {TTStoreState} from "../../redux/types/TTTypes";
import {Dispatch} from "redux";
import * as actions from "../../redux/actions/TTActions";

export interface TTDataPropsType extends  TTStoreState {
    setForceRefresh: (newRefresh: boolean) => void;
}

export function mapTTDataToProps(store: TTStoreState) {
    return {
        loading: store.loading,
        players: store.players,
        matches: store.matches,
        refresh: store.refresh,
    }
}

export function mapTTDispatchToProps(dispatch: Dispatch<actions.SetForceRefreshAction>) {
    return {
        setForceRefresh: (newRefresh: boolean) => dispatch(actions.setRefresh(newRefresh)),
    }
}
