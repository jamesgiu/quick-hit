import { SemanticICONS } from "semantic-ui-react";
import { MINIMUM_PLACEMENT_GAMES, TournamentParticipantsType, TournamentType } from "../types";

export interface DbInstance {
    fb_api_key: string;
    fb_srv_acc_name: string;
    fb_url: string;
    fb_project_id: string;
    name: string;
    restricted_happy_hour: boolean;
    tournaments: boolean;
    google_auth: boolean;
}

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
    tournamentWins?: number;
    tournamentRunnerUps?: number;
}

export interface DbHappyHour {
    /* yyyy-mm-dd */
    date: string;
    /* In 24 hour time */
    hourStart: number;
    /* how much the ELO will be worth in this time period */
    multiplier: number;
}

export interface DbChatRoom {
    /* yyyy-mm-dd */
    date: string;
    messages: { [s: string]: DbChatRoomMessage };
}

export interface DbChatRoomMessage {
    id: string;
    date: string;
    author: string;
    text: string;
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
    participants?: TournamentParticipantsType;
    type?: TournamentType;
}

export interface DbTournamentMatch {
    match_number: number;
    home_player_id: string;
    away_player_id: string;
    // Games that haven't been played yet won't have scores.
    home_score?: number;
    away_score?: number;
}

export function getTodaysDate(): string {
    // yyyy-mm-dd
    return new Date().toLocaleDateString().replace(/\//g, "-");
}

export function isUnderPlacement(matchesPlayed: number): boolean {
    return matchesPlayed < MINIMUM_PLACEMENT_GAMES;
}

export function getELOString(matchesPlayed: number, elo: number): string {
    const placementGamesRemaining = MINIMUM_PLACEMENT_GAMES - matchesPlayed;
    if (isUnderPlacement(matchesPlayed)) {
        return `${placementGamesRemaining} placement game${placementGamesRemaining > 1 ? "s" : ""} remaining`;
    }

    return `${elo}`;
}
