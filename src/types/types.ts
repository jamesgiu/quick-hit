export interface WinLoss {
    wins: number,
    losses: number
}

export interface ExtraPlayerStats {
    wins: number,
    losses: number,
    minELO: number,
    maxELO: number,
    victim?: string,
    nemesis?: string
}