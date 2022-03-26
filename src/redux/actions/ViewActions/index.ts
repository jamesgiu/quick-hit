import * as constants from "../../constants/ViewConstants";
import { DbPlayer } from "../../../types/database/models";

export interface SetUnplacedFilterAction {
    type: constants.SET_HIDE_UNPLACED_PLAYERS_TYPE;
    value: boolean;
}

export interface SetShowCardsAction {
    type: constants.SET_SHOW_CARDS_TYPE;
    value: boolean;
}

export interface SetDisableMusicAction {
    type: constants.SET_DISABLE_MUSIC_TYPE;
    value: boolean;
}

export interface SetCurrentUserAction {
    type: constants.SET_CURRENT_USER_TYPE;
    value: DbPlayer;
}

export interface SetDarkModeAction {
    type: constants.SET_DARK_MODE_TYPE;
    value: boolean;
}

export function setZeroGamesFilter(hideUnplacedPlayers: boolean): SetUnplacedFilterAction {
    return {
        type: constants.SET_HIDE_UNPLACED_PLAYERS,
        value: hideUnplacedPlayers,
    };
}

export function setShowCards(showCards: boolean): SetShowCardsAction {
    return {
        type: constants.SET_SHOW_CARDS,
        value: showCards,
    };
}

export function setDisableMusic(disableMusic: boolean): SetDisableMusicAction {
    return {
        type: constants.SET_DISABLE_MUSIC,
        value: disableMusic,
    };
}

export function setCurrentUser(newUser: DbPlayer): SetCurrentUserAction {
    return {
        type: constants.SET_CURRENT_USER,
        value: newUser,
    };
}

export function setDarkMode(isDarkMode: boolean): SetDarkModeAction {
    return {
        type: constants.SET_DARK_MODE,
        value: isDarkMode,
    };
}
