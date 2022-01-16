import {
    SetDarkModeAction,
    SetDisableMusicAction,
    SetShowCardsAction,
    SetUsernameAction,
    SetZeroGamesFilterAction,
} from "../../actions/ViewActions";
import { ViewStoreState } from "../../types/ViewTypes";
import {
    SET_DARK_MODE,
    SET_DISABLE_MUSIC,
    SET_HIDE_ZERO_GAME_PLAYERS,
    SET_SHOW_CARDS,
    SET_USERNAME,
} from "../../constants/ViewConstants";

export const viewInitialState: ViewStoreState = {
    hideZeroGamePlayers: true,
    showCards: false,
    disableMusic: false,
    username: "Anonymous",
    darkMode: false,
};

export function viewReducer(
    state: ViewStoreState = viewInitialState,
    action:
        | SetZeroGamesFilterAction
        | SetShowCardsAction
        | SetDisableMusicAction
        | SetUsernameAction
        | SetDarkModeAction
): ViewStoreState {
    switch (action.type) {
        case SET_HIDE_ZERO_GAME_PLAYERS:
            return { ...state, hideZeroGamePlayers: action.value };
        case SET_SHOW_CARDS:
            return { ...state, showCards: action.value };
        case SET_DISABLE_MUSIC:
            return { ...state, disableMusic: action.value };
        case SET_USERNAME:
            return { ...state, username: action.value };
        case SET_DARK_MODE:
            return { ...state, darkMode: action.value };
        default:
            return state;
    }
}
