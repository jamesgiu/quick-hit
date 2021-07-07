import * as constants from "../../constants/TTConstants";
import { DbBadge, DbHappyHour, DbMatch, DbPlayer, DbTournament } from "../../../types/database/models";

export interface SetMatchesAction {
    type: constants.SET_MATCHES_TYPE;
    value: DbMatch[];
}

export interface SetPlayersAction {
    type: constants.SET_PLAYERS_TYPE;
    value: DbPlayer[];
}

export interface SetLoadingAction {
    type: constants.SET_LOADING_TYPE;
    value: boolean;
}

export interface SetForceRefreshAction {
    type: constants.SET_FORCE_REFRESH_TYPE;
    value: boolean;
}

export interface SetHappyHourAction {
    type: constants.SET_HAPPY_HOUR_TYPE;
    value: DbHappyHour;
}

export interface SetBadgesAction {
    type: constants.SET_BADGES_TYPE;
    value: DbBadge[];
}

export interface SetTournamentsAction {
    type: constants.SET_TOURNAMENTS_TYPE;
    value: DbTournament[];
}

export function setMatches(newMatches: DbMatch[]): SetMatchesAction {
    return {
        type: constants.SET_MATCHES,
        value: newMatches,
    };
}

export function setPlayers(newPlayers: DbPlayer[]): SetPlayersAction {
    return {
        type: constants.SET_PLAYERS,
        value: newPlayers,
    };
}

export function setLoading(newLoading: boolean): SetLoadingAction {
    return {
        type: constants.SET_LOADING,
        value: newLoading,
    };
}

export function setRefresh(newRefresh: boolean): SetForceRefreshAction {
    return {
        type: constants.SET_FORCE_REFRESH,
        value: newRefresh,
    };
}

export function setHappyHour(newHappyHour: DbHappyHour): SetHappyHourAction {
    return {
        type: constants.SET_HAPPY_HOUR,
        value: newHappyHour,
    };
}

export function setBadges(newBadges: DbBadge[]): SetBadgesAction {
    return {
        type: constants.SET_BADGES,
        value: newBadges,
    };
}

export function setTournaments(newTournaments: DbTournament[]): SetTournamentsAction {
    return {
        type: constants.SET_TOURNAMENTS,
        value: newTournaments,
    };
}
