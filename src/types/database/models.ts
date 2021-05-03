export enum Team {
    Team_1 = "team_1",
    Team_2 = "team_2"
}

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
    team: Team,
}

export interface DB_Player {
    house_fk: string,
    id: string,
    name: string
}