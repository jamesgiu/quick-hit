import { TTStoreState } from "../../types/TTTypes";
import {
    SET_BADGES,
    SET_DOUBLES_PAIRS,
    SET_FORCE_REFRESH,
    SET_HAPPY_HOUR,
    SET_LOADING,
    SET_MATCHES,
    SET_PLAYERS,
    SET_TOURNAMENTS,
} from "../../constants/TTConstants";
import {
    SetBadgesAction,
    SetDoublesPairsAction,
    SetForceRefreshAction,
    SetHappyHourAction,
    SetLoadingAction,
    SetMatchesAction,
    SetPlayersAction,
    SetTournamentsAction,
} from "../../actions/TTActions";

export const dataInitialState: TTStoreState = {
    players: [],
    matches: [],
    loading: true,
    happyHour: {
        date: "",
        hourStart: 0,
        multiplier: 0,
    },
    badges: [],
    tournaments: [],
    doublesPairs: [],
    refresh: false,
};

export function ttReducer(
    state: TTStoreState = dataInitialState,
    action:
        | SetMatchesAction
        | SetPlayersAction
        | SetLoadingAction
        | SetForceRefreshAction
        | SetHappyHourAction
        | SetBadgesAction
        | SetTournamentsAction
        | SetDoublesPairsAction
): TTStoreState {
    switch (action.type) {
        case SET_MATCHES:
            return { ...state, matches: action.value };
        case SET_PLAYERS:
            return { ...state, players: action.value };
        case SET_LOADING:
            return { ...state, loading: action.value };
        case SET_FORCE_REFRESH:
            return { ...state, refresh: action.value };
        case SET_HAPPY_HOUR:
            return { ...state, happyHour: action.value };
        case SET_BADGES:
            return { ...state, badges: action.value };
        case SET_TOURNAMENTS:
            return { ...state, tournaments: action.value };
        case SET_DOUBLES_PAIRS:
            return { ...state, doublesPairs: action.value };
        default:
            return state;
    }
}
