import {SemanticICONS} from "semantic-ui-react";

export interface DB_Match {
    id: string,
    date: string,
    winning_player_id: string,
    losing_player_id: string,
    winning_player_score: number,
    losing_player_score: number,
    winning_player_original_elo: number,
    losing_player_original_elo: number,
    winner_new_elo: number,
    loser_new_elo: number,
}

export interface DB_Player {
    icon: SemanticICONS,
    id: string,
    name: string,
    elo: number
}