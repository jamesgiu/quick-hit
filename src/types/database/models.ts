import {SemanticICONS} from "semantic-ui-react";

export interface DB_House {
    id: string,
    name: string
}

export interface DB_Match {
    id: string,
    date: string,
    team1_score: 11,
    team2_score: 9
}

export interface DB_MatchPlayer {
    match_id: string,
    player_id: string,
    won: boolean,
}

export interface DB_Player {
    house_fk: string,
    icon: SemanticICONS,
    id: string,
    name: string
}

export interface WinLoss {
    wins: number,
    losses: number
}