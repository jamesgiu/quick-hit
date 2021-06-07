import {SetZeroGamesFilterAction} from "../../actions/ViewActions";
import {ViewStoreState} from "../../types/ViewTypes";
import {SET_HIDE_ZERO_GAME_PLAYERS} from "../../constants/ViewConstants";

export const viewInitialState : ViewStoreState = {
    hideZeroGamePlayers: true
};

export function viewReducer(state: ViewStoreState = viewInitialState, action: SetZeroGamesFilterAction): ViewStoreState {
    switch (action.type) {
        case SET_HIDE_ZERO_GAME_PLAYERS:
            return {...state, hideZeroGamePlayers: action.value}
        default:
            return state;
    }
}