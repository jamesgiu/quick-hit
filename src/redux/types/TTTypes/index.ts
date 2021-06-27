import { DbBadge, DbHappyHour, DbMatch, DbPlayer } from "../../../types/database/models";

export interface TTStoreState {
    matches: DbMatch[];
    players: DbPlayer[];
    happyHour: DbHappyHour;
    badges: DbBadge[];
    refresh: boolean;
    loading: boolean;
}
