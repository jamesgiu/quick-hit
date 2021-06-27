import { DbHappyHour, DbMatch, DbPlayer } from "../../../types/database/models";

export interface TTStoreState {
    matches: DbMatch[];
    players: DbPlayer[];
    happyHour: DbHappyHour;
    refresh: boolean;
    loading: boolean;
}
