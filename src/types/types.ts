export interface WinLoss {
    wins: number;
    losses: number;
    formGuide: string;
}

export interface ExtraPlayerStats {
    wins: number;
    losses: number;
    formGuide: string;
    minELO: number;
    maxELO: number;
    victim?: string;
    nemesis?: string;
}

export interface ELOGraphStats {
    ELO: number;
    date: Date;
    matchStr: string;
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
