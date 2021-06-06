import {TTStoreState} from "../../types/TTTypes";
import {SET_LOADING, SET_MATCHES, SET_PLAYERS} from "../../constants/TTConstants";
import {DB_Player} from "../../../types/database/models";
import {SetLoadingAction, SetMatchesAction, SetPlayersAction} from "../../actions/TTActions";

export const dataInitialState : TTStoreState = {
    playersMap: new Map<string, DB_Player>(),
    matches: [],
    loading: true
};

export function ttReducer(state: TTStoreState = dataInitialState, action: SetMatchesAction | SetPlayersAction | SetLoadingAction): TTStoreState {
    switch (action.type) {
        case SET_MATCHES:
            return {...state, matches: action.value}
        case SET_PLAYERS:
            return {...state, playersMap: action.value}
        case SET_LOADING:
            return {...state, loading: action.value}
        default:
            return state;
    }
}