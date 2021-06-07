import * as constants from "../../constants/ViewConstants";

export interface SetZeroGamesFilterAction {
    type: constants.SET_HIDE_ZERO_GAME_PLAYERS_TYPE,
    value: boolean,
}

export function setZeroGamesFilter(hideZeroGamesPlayers: boolean): SetZeroGamesFilterAction {
    return {
        type: constants.SET_HIDE_ZERO_GAME_PLAYERS,
        value: hideZeroGamesPlayers
    };
}