import {DbBadge, DbDoublesPair, DbHappyHour, DbMatch, DbPlayer, DbTournament} from "../../../types/database/models";

export interface TTStoreState {
    matches: DbMatch[];
    players: DbPlayer[];
    happyHour: DbHappyHour;
    badges: DbBadge[];
    tournaments: DbTournament[];
    doublesPairs: DbDoublesPair[];
    refresh: boolean;
    loading: boolean;
}
