import { BadgeDesc, DbBadge, DbMatch, DbPlayer } from "../../types/database/models";
import { QuickHitAPI } from "../../api/QuickHitAPI";
import { v4 as uuidv4 } from "uuid";

export enum Achievement {
    FATALITY = "fatality",
    CLUTCH_PERFORMER = "clutch_performer",
    HEART_BREAKER = "heart_breaker",
    ON_A_ROLL = "on_a_roll",
    UNSTOPPABLE = "unstoppable",
    ASCENDED = "ascended",
    HELPLESS = "helpless",
    SUPERIOR = "superior",
    CELLAR_DWELLAR = "cellar_dwellar",
    A_LITTLE_EMBARRASSING = "a_little_embarrassing",
    SHOULD_HAVE_PUT_MONEY_ON_IT = "should_have_put_money_on_it",
}

export const FATALITY_BADGE: BadgeDesc = {
    icon: "tint",
    key: Achievement.FATALITY,
    text: "Win a game to 11 or more without losing a single point",
    title: "FATALITY!",
};

export const CLUTCH_PERFORMER_BADGE: BadgeDesc = {
    icon: "hand victory",
    key: Achievement.CLUTCH_PERFORMER,
    text: "Win 5 games by 2 points or less",
    title: "Clutch Performer",
};

export const HEART_BREAKER_BADGE: BadgeDesc = {
    icon: "heartbeat",
    key: Achievement.HEART_BREAKER,
    text: "Lose 5 games by 2 points or less",
    title: "Heart Breaker",
};

export const ON_A_ROLL_BADGE: BadgeDesc = {
    icon: "smile",
    key: Achievement.ON_A_ROLL,
    text: "Win 3 games in a row",
    title: "On A Roll",
};

export const ASCENDED_BADGE: BadgeDesc = {
    icon: "cloudversify",
    key: Achievement.ASCENDED,
    text: "Win 10 games in a row",
    title: "Ascended",
};

export const UNSTOPPABLE_BADGE: BadgeDesc = {
    icon: "ship",
    key: Achievement.UNSTOPPABLE,
    text: "Win 5 games in a row",
    title: "Unstoppable",
};

export const HELPLESS_BADGE: BadgeDesc = {
    icon: "bed",
    key: Achievement.HELPLESS,
    text: "Lose a game to 11 or more without winning a point",
    title: "Helpless",
};

export const SUPERIOR_BADGE: BadgeDesc = {
    icon: "chess king",
    key: Achievement.SUPERIOR,
    text: "Reach 1300 ELO",
    title: "Superior",
};

export const CELLAR_DWELLAR_BADGE: BadgeDesc = {
    icon: "spoon",
    key: Achievement.CELLAR_DWELLAR,
    text: "Fall to 1100 ELO",
    title: "Cellar Dwellar",
};

export const A_LITTLE_EMBARRASSING_BADGE: BadgeDesc = {
    icon: "frown",
    key: Achievement.A_LITTLE_EMBARRASSING,
    text: "Lose to a player with an ELO of 200+ less than you",
    title: "A Little Embarrassing",
};

export const SHOULD_HAVE_PUT_MONEY_ON_IT_BADGE: BadgeDesc = {
    icon: "money",
    key: Achievement.SHOULD_HAVE_PUT_MONEY_ON_IT,
    text: "Win against a player with an ELO of 200+ more than you",
    title: "Should Have Put Money On It",
};

// TODO: Maybe have a function that maps the achievement to its trigger function?

export const checkForClutchPerformer = (matches: DbMatch[], player: DbPlayer): boolean => {
    // Filter only to be the matches where the winner is this player
    const matchesInvolvingPlayerAsWinner = matches.filter((match) => {
        return match.winning_player_id === player.id;
    });
    const matchesThatWereWonBy2PointsOrLess = matchesInvolvingPlayerAsWinner.filter((match) => {
        return match.winning_player_score - match.losing_player_score <= 2;
    });

    // If the player has won 5 or more games by 2 points or less, they earn this achievement.
    return matchesThatWereWonBy2PointsOrLess.length >= 5;
};

export const checkForHeartBreaker = (matches: DbMatch[], player: DbPlayer): boolean => {
    // Filter only to be the matches where the loser is this player
    const matchesInvolvingPlayerAsLoser = matches.filter((match) => {
        return match.losing_player_id === player.id;
    });
    const matchesThatWereLostBy2PointsOrLess = matchesInvolvingPlayerAsLoser.filter((match) => {
        return match.winning_player_score - match.losing_player_score <= 2;
    });

    // If the player has lost 5 or more games by 2 points or less, ya blew it schmuck! They earn this achievement.
    return matchesThatWereLostBy2PointsOrLess.length >= 5;
};

export const checkForWinsInARow = (matches: DbMatch[], player: DbPlayer, count: number): boolean => {
    let winsInARowNeeded = count;
    const matchesInvolvingPlayer = matches.filter((match) => {
        return match.winning_player_id === player.id || match.losing_player_id === player.id;
    });

    matchesInvolvingPlayer.forEach((match: DbMatch) => {
        if (match.winning_player_id === player.id) {
            winsInARowNeeded--;
        } else {
            winsInARowNeeded++;
        }
    });

    // If the player has won 3 games in a row, award this achievement.
    return winsInARowNeeded < 0;
};

export const checkForFatality = (matches: DbMatch[], player: DbPlayer): boolean => {
    // Filter only to be the matches where the winner is this player
    const matchesInvolvingPlayerAsWinner = matches.filter((match) => {
        return match.winning_player_id === player.id;
    });
    const matchesWonWithoutLosingAPoint = matchesInvolvingPlayerAsWinner.filter((match) => {
        return match.losing_player_score === 0 && match.winning_player_score >= 11;
    });

    // If they have any matches won without losing a point, award achievement.
    return matchesWonWithoutLosingAPoint.length > 0;
};

export const checkForHelpless = (matches: DbMatch[], player: DbPlayer): boolean => {
    // Filter only to be the matches where the loser is this player
    const matchesInvolvingPlayerAsLoser = matches.filter((match) => {
        return match.losing_player_id === player.id;
    });

    const matchesLostWithoutEarningAPoint = matchesInvolvingPlayerAsLoser.filter((match) => {
        return match.losing_player_score === 0 && match.winning_player_score >= 11;
    });

    // If they have any matches lost without winning a point, award achievement.
    return matchesLostWithoutEarningAPoint.length > 0;
};

export const checkForSuperior = (matches: DbMatch[], player: DbPlayer): boolean => {
    // Filter only to be the matches where the winner is this player
    const matchesInvolvingPlayerAsWinner = matches.filter((match) => {
        return match.winning_player_id === player.id;
    });
    const matchesInvolving1300ELORank = matchesInvolvingPlayerAsWinner.filter((match) => {
        return match.winner_new_elo >= 1300;
    });

    return matchesInvolving1300ELORank.length > 0;
};

export const checkForCellarDweller = (matches: DbMatch[], player: DbPlayer): boolean => {
    // Filter only to be the matches where the loser is this player
    const matchesInvolvingPlayerAsLoser = matches.filter((match) => {
        return match.losing_player_id === player.id;
    });
    const matchesInvolving1100ELORank = matchesInvolvingPlayerAsLoser.filter((match) => {
        return match.loser_new_elo <= 1100;
    });

    return matchesInvolving1100ELORank.length > 0;
};

export const checkForALittleEmbarrassing = (matches: DbMatch[], player: DbPlayer): boolean => {
    // Filter only to be the matches where the loser is this player
    const matchesInvolvingPlayerAsLoser = matches.filter((match) => {
        return match.losing_player_id === player.id;
    });
    const matchesInvolvingALossToRelativeScrubOpponent = matchesInvolvingPlayerAsLoser.filter((match) => {
        return match.losing_player_original_elo - match.winning_player_original_elo >= 200;
    });

    return matchesInvolvingALossToRelativeScrubOpponent.length > 0;
};

export const checkForShouldHavePutMoneyOnIt = (matches: DbMatch[], player: DbPlayer): boolean => {
    // Filter only to be the matches where the winner is this player
    const matchesInvolvingPlayerAsWinner = matches.filter((match) => {
        return match.winning_player_id === player.id;
    });
    const matchesInvolvingLowOddsWin = matchesInvolvingPlayerAsWinner.filter((match) => {
        return match.losing_player_original_elo - match.winning_player_original_elo >= 200;
    });

    return matchesInvolvingLowOddsWin.length > 0;
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
    onError: (errorMsg: string) => void
): void => {
    const winnerBadgeKeys = badges
        .filter((badge: DbBadge) => {
            return badge.player_id === winningPlayer.id;
        })
        .flatMap((badge) => badge.key);
    const loserBadgeKeys = badges
        .filter((badge: DbBadge) => {
            return badge.player_id === losingPlayer.id;
        })
        .flatMap((badge) => badge.key);

    if (!winnerBadgeKeys.includes(Achievement.FATALITY)) {
        if (checkForFatality(matches, winningPlayer)) {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(FATALITY_BADGE, winningPlayer, losingPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    }

    if (!winnerBadgeKeys.includes(Achievement.CLUTCH_PERFORMER)) {
        if (checkForClutchPerformer(matches, winningPlayer)) {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(CLUTCH_PERFORMER_BADGE, winningPlayer, losingPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    }

    if (!winnerBadgeKeys.includes(Achievement.ON_A_ROLL)) {
        if (checkForWinsInARow(matches, winningPlayer, 3)) {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(ON_A_ROLL_BADGE, winningPlayer, losingPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    }

    if (!winnerBadgeKeys.includes(Achievement.UNSTOPPABLE)) {
        if (checkForWinsInARow(matches, winningPlayer, 5)) {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(UNSTOPPABLE_BADGE, winningPlayer, losingPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    }

    if (!winnerBadgeKeys.includes(Achievement.ASCENDED)) {
        if (checkForWinsInARow(matches, winningPlayer, 10)) {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(ASCENDED_BADGE, winningPlayer, losingPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    }

    if (!winnerBadgeKeys.includes(Achievement.SUPERIOR)) {
        if (checkForSuperior(matches, winningPlayer)) {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(SUPERIOR_BADGE, winningPlayer, losingPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    }

    if (!winnerBadgeKeys.includes(Achievement.SHOULD_HAVE_PUT_MONEY_ON_IT)) {
        if (checkForShouldHavePutMoneyOnIt(matches, winningPlayer)) {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(SHOULD_HAVE_PUT_MONEY_ON_IT_BADGE, winningPlayer, losingPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    }

    if (!loserBadgeKeys.includes(Achievement.A_LITTLE_EMBARRASSING)) {
        if (checkForALittleEmbarrassing(matches, losingPlayer)) {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(A_LITTLE_EMBARRASSING_BADGE, winningPlayer, losingPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    }

    if (!loserBadgeKeys.includes(Achievement.HELPLESS)) {
        if (checkForHelpless(matches, losingPlayer)) {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(HELPLESS_BADGE, losingPlayer, winningPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    }

    if (!loserBadgeKeys.includes(Achievement.HEART_BREAKER)) {
        if (checkForHeartBreaker(matches, losingPlayer)) {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(HEART_BREAKER_BADGE, losingPlayer, winningPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    }

    if (!loserBadgeKeys.includes(Achievement.CELLAR_DWELLAR)) {
        if (checkForCellarDweller(matches, losingPlayer)) {
            QuickHitAPI.addBadge(
                decorateAchievementForUpload(CELLAR_DWELLAR_BADGE, losingPlayer, winningPlayer),
                () => {
                    return;
                },
                onError
            );
        }
    }
};
