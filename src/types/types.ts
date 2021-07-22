export interface WinLoss {
    wins: number;
    losses: number;
}

export interface ExtraPlayerStats {
    wins: number;
    losses: number;
    minELO: number;
    maxELO: number;
    victim?: string;
    nemesis?: string;
}

export enum TournamentParticipantsType {
    STANDARD = "Standard",
    REVERSE = "Reverse",
}

export enum TournamentType {
    SINGLE = "Single Elimination",
    DOUBLE = "Double Elimination",
    AFL = "AFL-style",
}
