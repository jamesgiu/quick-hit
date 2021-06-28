import { SemanticICONS } from "semantic-ui-react";

export interface DbMatch {
    id: string;
    date: string;
    winning_player_id: string;
    losing_player_id: string;
    winning_player_score: number;
    losing_player_score: number;
    winning_player_original_elo: number;
    losing_player_original_elo: number;
    winner_new_elo: number;
    loser_new_elo: number;
    happy_hour: boolean;
}

export interface DbPlayer {
    icon: SemanticICONS;
    id: string;
    name: string;
    elo: number;
}

export interface DbHappyHour {
    /* yyyy-mm-dd */
    date: string;
    /* In 24 hour time */
    hourStart: number;
    /* how much the ELO will be worth in this time period */
    multiplier: number;
}

export interface BadgeDesc {
    icon: string;
    text: string;
    title: string;
    key: string;
}

export interface DbBadge extends BadgeDesc {
    id: string;
    date: string;
    player_id: string;
    /* Any non-earning player that helped trigger this achievement */
    involved_player: string;
}

export interface DbTournament {
    id: string;
    name: string;
    start_date: string;
    end_date?: string;
    matches: DbTournamentMatch[];
}

export interface DbTournamentMatch {
    match_number: number;
    home_player_id: string;
    away_player_id: string;
    home_score?: number;
    away_score?: number;
}

export function getTodaysDate(): string {
    // yyyy-mm-dd
    return new Date().toLocaleDateString().replace(/\//g, "-");
}
