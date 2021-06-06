import * as constants from "../../constants/TTConstants";
import {DB_Match, DB_Player} from "../../../types/database/models";

export interface SetMatchesAction {
    type: constants.SET_MATCHES_TYPE,
    value: DB_Match[],
}

export interface SetPlayersAction {
    type: constants.SET_PLAYERS_TYPE,
    value: Map<string, DB_Player>,
}

export interface SetLoadingAction {
    type: constants.SET_LOADING_TYPE,
    value: boolean,
}

export function setMatches(newMatches: DB_Match[]): SetMatchesAction {
    return {
        type: constants.SET_MATCHES,
        value: newMatches
    };
}

export function setPlayers(newPlayers: Map<string, DB_Player>): SetPlayersAction {
    return {
        type: constants.SET_PLAYERS,
        value: newPlayers
    };
}

export function setLoading(newLoading: boolean): SetLoadingAction {
    return {
        type: constants.SET_LOADING,
        value: newLoading
    };
}