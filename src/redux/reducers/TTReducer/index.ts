import {TTStoreState} from "../../types/TTTypes";
import {SET_LOADING, SET_MATCHES, SET_PLAYERS} from "../../constants/TTConstants";
import {SetLoadingAction, SetMatchesAction, SetPlayersAction} from "../../actions/TTActions";

export const dataInitialState : TTStoreState = {
    players: [],
    matches: [],
    loading: true
};

export function ttReducer(state: TTStoreState = dataInitialState, action: SetMatchesAction | SetPlayersAction | SetLoadingAction): TTStoreState {
    console.log("Reducer  called!");
    console.log(state, action);
    switch (action.type) {
        case SET_MATCHES:
            return {...state, matches: action.value}
        case SET_PLAYERS:
            return {...state, players: action.value}
        case SET_LOADING:
            return {...state, loading: action.value}
        default:
            return state;
    }
}