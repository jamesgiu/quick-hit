import * as constants from "../../constants/ViewConstants";

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

export interface SetUsernameAction {
    type: constants.SET_USERNAME_TYPE;
    value: string;
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

export function setUsername(username: string): SetUsernameAction {
    return {
        type: constants.SET_USERNAME,
        value: username,
    };
}

export function setDarkMode(isDarkMode: boolean): SetDarkModeAction {
    return {
        type: constants.SET_DARK_MODE,
        value: isDarkMode,
    };
}
