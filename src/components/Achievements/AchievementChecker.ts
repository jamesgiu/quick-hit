import { BadgeDesc, DbBadge, DbMatch, DbPlayer } from "../../types/database/models";
import { QuickHitAPI } from "../../api/QuickHitAPI";
import { v4 as uuidv4 } from "uuid";
import {
    A_LITTLE_EMBARRASSING_BADGE,
    ASCENDED_BADGE,
    CELLAR_DWELLAR_BADGE,
    CLUTCH_PERFORMER_BADGE,
    FATALITY_BADGE,
    HEART_BREAKER_BADGE,
    HELPLESS_BADGE,
    ON_A_ROLL_BADGE,
    SHOULD_HAVE_PUT_MONEY_ON_IT_BADGE,
    SUPERIOR_BADGE,
    UNSTOPPABLE_BADGE,
} from "./Achievements";
import { getPlayersMap } from "../QHDataLoader/QHDataLoader";

type badgeCheckFn = (matches: DbMatch[], player: DbPlayer) => string;

export const BADGE_CHECK_MAP: Map<BadgeDesc, badgeCheckFn> = new Map([
    [FATALITY_BADGE, (matches: DbMatch[], player: DbPlayer): string => checkForFatality(matches, player)],
    [
        CLUTCH_PERFORMER_BADGE,
        (matches: DbMatch[], player: DbPlayer): string => checkForClutchPerformer(matches, player),
    ],
    [HEART_BREAKER_BADGE, (matches: DbMatch[], player: DbPlayer): string => checkForHeartBreaker(matches, player)],
    [ON_A_ROLL_BADGE, (matches: DbMatch[], player: DbPlayer): string => checkForWinsInARow(matches, player, 3)],
    [UNSTOPPABLE_BADGE, (matches: DbMatch[], player: DbPlayer): string => checkForWinsInARow(matches, player, 5)],
    [ASCENDED_BADGE, (matches: DbMatch[], player: DbPlayer): string => checkForWinsInARow(matches, player, 10)],
    [HELPLESS_BADGE, (matches: DbMatch[], player: DbPlayer): string => checkForHelpless(matches, player)],
    [SUPERIOR_BADGE, (matches: DbMatch[], player: DbPlayer): string => checkForSuperior(matches, player)],
    [CELLAR_DWELLAR_BADGE, (matches: DbMatch[], player: DbPlayer): string => checkForCellarDwellar(matches, player)],
    [
        A_LITTLE_EMBARRASSING_BADGE,
        (matches: DbMatch[], player: DbPlayer): string => checkForALittleEmbarrassing(matches, player),
    ],
    [
        SHOULD_HAVE_PUT_MONEY_ON_IT_BADGE,
        (matches: DbMatch[], player: DbPlayer): string => checkForShouldHavePutMoneyOnIt(matches, player),
    ],
]);

export const checkForClutchPerformer = (matches: DbMatch[], player: DbPlayer): string => {
    // Filter only to be the matches where the winner is this player
    const matchesInvolvingPlayerAsWinner = matches.filter((match) => {
        return match.winning_player_id === player.id;
    });
    const matchesThatWereWonBy2PointsOrLess = matchesInvolvingPlayerAsWinner.filter((match) => {
        return match.winning_player_score - match.losing_player_score <= 2;
    });

    // If the player has won 5 or more games by 2 points or less, they earn this achievement.
    return matchesThatWereWonBy2PointsOrLess.length >= 5 ? matchesThatWereWonBy2PointsOrLess[0].losing_player_id : "";
};

export const checkForHeartBreaker = (matches: DbMatch[], player: DbPlayer): string => {
    // Filter only to be the matches where the loser is this player
    const matchesInvolvingPlayerAsLoser = matches.filter((match) => {
        return match.losing_player_id === player.id;
    });
    const matchesThatWereLostBy2PointsOrLess = matchesInvolvingPlayerAsLoser.filter((match) => {
        return match.winning_player_score - match.losing_player_score <= 2;
    });

    // If the player has lost 5 or more games by 2 points or less, ya blew it schmuck! They earn this achievement.
    return matchesThatWereLostBy2PointsOrLess.length >= 5 ? matchesThatWereLostBy2PointsOrLess[0].winning_player_id : "";
};

export const checkForWinsInARow = (matches: DbMatch[], player: DbPlayer, count: number): string => {
    const matchesInvolvingPlayer = matches
        .filter((match) => {
            return match.winning_player_id === player.id || match.losing_player_id === player.id;
        })
        .sort((match1, match2) => {
            return match1.date.localeCompare(match2.date);
        });

    let streak = 0;
    let lastMatchPlayer = "";
    matchesInvolvingPlayer.forEach((match: DbMatch) => {
        if (match.winning_player_id === player.id) {
            streak += 1;
        } else {
            streak = 0;
        }

        // If the player has won enough games in a row, award this achievement.
        if (streak >= count) {
            lastMatchPlayer = match.losing_player_id;
            return;
        }
    });

    return lastMatchPlayer;
};

export const checkForFatality = (matches: DbMatch[], player: DbPlayer): string => {
    // Filter only to be the matches where the winner is this player
    const matchesInvolvingPlayerAsWinner = matches.filter((match) => {
        return match.winning_player_id === player.id;
    });
    const matchesWonWithoutLosingAPoint = matchesInvolvingPlayerAsWinner.filter((match) => {
        return match.losing_player_score === 0 && match.winning_player_score >= 11;
    });

    // If they have any matches won without losing a point, award achievement.
    return matchesWonWithoutLosingAPoint.length > 0 ? matchesWonWithoutLosingAPoint[0].losing_player_id : "";
};

export const checkForHelpless = (matches: DbMatch[], player: DbPlayer): string => {
    // Filter only to be the matches where the loser is this player
    const matchesInvolvingPlayerAsLoser = matches.filter((match) => {
        return match.losing_player_id === player.id;
    });

    const matchesLostWithoutEarningAPoint = matchesInvolvingPlayerAsLoser.filter((match) => {
        return match.losing_player_score === 0 && match.winning_player_score >= 11;
    });

    // If they have any matches lost without winning a point, award achievement.
    return matchesLostWithoutEarningAPoint.length > 0 ? matchesLostWithoutEarningAPoint[0].winning_player_id : "";
};

export const checkForSuperior = (matches: DbMatch[], player: DbPlayer): string => {
    // Filter only to be the matches where the winner is this player
    const matchesInvolvingPlayerAsWinner = matches.filter((match) => {
        return match.winning_player_id === player.id;
    });
    const matchesInvolving1300ELORank = matchesInvolvingPlayerAsWinner.filter((match) => {
        return match.winner_new_elo >= 1300;
    });

    return matchesInvolving1300ELORank.length > 0 ? matchesInvolving1300ELORank[0].losing_player_id : "";
};

export const checkForCellarDwellar = (matches: DbMatch[], player: DbPlayer): string => {
    // Filter only to be the matches where the loser is this player
    const matchesInvolvingPlayerAsLoser = matches.filter((match) => {
        return match.losing_player_id === player.id;
    });
    const matchesInvolving1100ELORank = matchesInvolvingPlayerAsLoser.filter((match) => {
        return match.loser_new_elo <= 1100;
    });

    return matchesInvolving1100ELORank.length > 0 ? matchesInvolving1100ELORank[0].winning_player_id : "";
};

export const checkForALittleEmbarrassing = (matches: DbMatch[], player: DbPlayer): string => {
    // Filter only to be the matches where the loser is this player
    const matchesInvolvingPlayerAsLoser = matches.filter((match) => {
        return match.losing_player_id === player.id;
    });
    const matchesInvolvingALossToRelativeScrubOpponent = matchesInvolvingPlayerAsLoser.filter((match) => {
        return match.losing_player_original_elo - match.winning_player_original_elo >= 200;
    });

    return matchesInvolvingALossToRelativeScrubOpponent.length > 0
        ? matchesInvolvingALossToRelativeScrubOpponent[0].winning_player_id
        : "";
};

export const checkForShouldHavePutMoneyOnIt = (matches: DbMatch[], player: DbPlayer): string => {
    // Filter only to be the matches where the winner is this player
    const matchesInvolvingPlayerAsWinner = matches.filter((match) => {
        return match.winning_player_id === player.id;
    });
    const matchesInvolvingLowOddsWin = matchesInvolvingPlayerAsWinner.filter((match) => {
        return match.losing_player_original_elo - match.winning_player_original_elo >= 200;
    });

    return matchesInvolvingLowOddsWin.length > 0 ? matchesInvolvingLowOddsWin[0].losing_player_id : "";
};

export const decorateAchievementForUpload = (
    badgeDesc: BadgeDesc,
    earnedPlayer: DbPlayer,
    involvedPlayer: DbPlayer
): DbBadge => {
    return {
        ...badgeDesc,
        id: uuidv4(),
        date: new Date().toISOString(),
        player_id: earnedPlayer.id,
        involved_player: involvedPlayer.id,
    };
};

export const checkForAchievementTriggers = (
    winningPlayer: DbPlayer,
    losingPlayer: DbPlayer,
    badges: DbBadge[],
    matches: DbMatch[],
    players: DbPlayer[],
    onError: (errorMsg: string) => void
): void => {
    const winnerBadgeKeys = getBadgeKeys(winningPlayer, badges);
    const loserBadgeKeys = getBadgeKeys(losingPlayer, badges);
    const playersMap = getPlayersMap(players);

    BADGE_CHECK_MAP.forEach((checkFn, badge) => {
        let involvedPlayer;
        // Check achievement criteria for the winning player
        if (!winnerBadgeKeys.includes(badge.key) && (involvedPlayer = checkFn(matches, winningPlayer)) !== "") {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(badge, winningPlayer, playersMap.get(involvedPlayer) as DbPlayer),
                () => {
                    return;
                },
                onError
            );
        }
        // Check achievement criteria for the losing player
        if (!loserBadgeKeys.includes(badge.key) && (involvedPlayer = checkFn(matches, losingPlayer)) !== "") {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(badge, losingPlayer, playersMap.get(involvedPlayer) as DbPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    });
};

export const generateTournamentAchievements = (
    tournamentName: string,
    earnedPlayer: DbPlayer,
    involvedPlayer: DbPlayer,
    onError: (errorMsg: string) => void
): void => {
    // Create the badge key based off the tournament name
    // e.g. "Flipped Transparent Muscle" becomes "flipped_transparent_muscle"
    const tournamentBadgeKey = tournamentName.toLowerCase().replace(" ", "_");

    const TOURNAMENT_WINNER_BADGE: BadgeDesc = {
        icon: "trophy",
        key: tournamentBadgeKey,
        text: "Get first place in the tournament",
        title: `Winner of the "${tournamentName}" tournament`,
    };

    const TOURNAMENT_RUNNER_UP_BADGE: BadgeDesc = {
        icon: "certificate",
        key: tournamentBadgeKey,
        text: "Get second place in the tournament",
        title: `Runner-up of the "${tournamentName}" tournament`,
    };

    QuickHitAPI.getBadges((badges: DbBadge[]) => {
        if (!getBadgeKeys(earnedPlayer, badges).includes(tournamentBadgeKey)) {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(TOURNAMENT_WINNER_BADGE, earnedPlayer, involvedPlayer),
                () => {
                    return;
                },
                onError
            );

            QuickHitAPI.addBadge(
                decorateAchievementForUpload(TOURNAMENT_RUNNER_UP_BADGE, involvedPlayer, earnedPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    }, onError);
};

export const getBadgeKeys = (player: DbPlayer, badges: DbBadge[]): string[] =>
    badges
        .filter((badge: DbBadge) => {
            return badge.player_id === player.id;
        })
        .flatMap((badge) => badge.key);
