export function BASE_PATH(): string {
    return process.env.REACT_APP_QH_BASE_PATH ?? "";
}

/**
 * Enum that represents possible pages in the QuickHit ELO application.
 */
export enum QuickHitPage {
    HOME = "/",
    LADDER = "/ladder",
    DOUBLES_LADDER = "/ladder/doubles",
    RECENT_GAMES = "/recent",
    STATISTICS = "/player/:playerId",
    TOURNAMENT = "/tournament",
    HALL_OF_FALLEN = "/hallOfFallen",
    NOT_FOUND = "/404",
}
