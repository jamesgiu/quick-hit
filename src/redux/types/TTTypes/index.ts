import {DbMatch, DbPlayer} from "../../../types/database/models";

export interface TTStoreState {
    matches: DbMatch[],
    players: DbPlayer[],
    loading: boolean,
    refresh: boolean,
}