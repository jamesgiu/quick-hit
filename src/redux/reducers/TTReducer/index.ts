import {TTStoreState} from "../../types/TTTypes";
import {SET_FORCE_REFRESH, SET_LOADING, SET_MATCHES, SET_PLAYERS} from "../../constants/TTConstants";
import {SetForceRefreshAction, SetLoadingAction, SetMatchesAction, SetPlayersAction} from "../../actions/TTActions";

export const dataInitialState: TTStoreState = {
    players: [],
    matches: [],
    loading: true,
    refresh: false
};

export function ttReducer(state: TTStoreState = dataInitialState, action: SetMatchesAction | SetPlayersAction | SetLoadingAction | SetForceRefreshAction): TTStoreState {
    switch (action.type) {
        case SET_MATCHES:
            return {...state, matches: action.value}
        case SET_PLAYERS:
            return {...state, players: action.value}
        case SET_LOADING:
            return {...state, loading: action.value}
        case SET_FORCE_REFRESH:
            return {...state, refresh: action.value}
        default:
            return state;
    }
}