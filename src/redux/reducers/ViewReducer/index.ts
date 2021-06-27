import { SetShowCardsAction, SetZeroGamesFilterAction } from "../../actions/ViewActions";
import { ViewStoreState } from "../../types/ViewTypes";
import { SET_HIDE_ZERO_GAME_PLAYERS, SET_SHOW_CARDS } from "../../constants/ViewConstants";

export const viewInitialState: ViewStoreState = {
    hideZeroGamePlayers: true,
    showCards: false,
};

export function viewReducer(
    state: ViewStoreState = viewInitialState,
    action: SetZeroGamesFilterAction | SetShowCardsAction
): ViewStoreState {
    switch (action.type) {
        case SET_HIDE_ZERO_GAME_PLAYERS:
            return { ...state, hideZeroGamePlayers: action.value };
        case SET_SHOW_CARDS:
            return { ...state, showCards: action.value };
        default:
            return state;
    }
}
