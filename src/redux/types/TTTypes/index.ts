import {DB_Match, DB_Player} from "../../../types/database/models";

export interface TTStoreState {
    matches: DB_Match[],
    playersMap: Map<string, DB_Player>,
    loading: boolean,
}