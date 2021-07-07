import * as constants from "../../constants/ViewConstants";

export interface SetZeroGamesFilterAction {
    type: constants.SET_HIDE_ZERO_GAME_PLAYERS_TYPE;
    value: boolean;
}

export interface SetShowCardsAction {
    type: constants.SET_SHOW_CARDS_TYPE;
    value: boolean;
}

export function setZeroGamesFilter(hideZeroGamesPlayers: boolean): SetZeroGamesFilterAction {
    return {
        type: constants.SET_HIDE_ZERO_GAME_PLAYERS,
        value: hideZeroGamesPlayers,
    };
}

export function setShowCards(showCards: boolean): SetShowCardsAction {
    return {
        type: constants.SET_SHOW_CARDS,
        value: showCards,
    };
}
