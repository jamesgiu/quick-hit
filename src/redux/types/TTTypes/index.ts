import { DbBadge, DbHappyHour, DbMatch, DbPlayer, DbTournament } from "../../../types/database/models";

export interface TTStoreState {
    matches: DbMatch[];
    players: DbPlayer[];
    happyHour: DbHappyHour;
    badges: DbBadge[];
    tournaments: DbTournament[];
    refresh: boolean;
    loading: boolean;
}
