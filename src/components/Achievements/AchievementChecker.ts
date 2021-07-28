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

export const ALL_BADGE_DESCRIPTIONS: BadgeDesc[] = [
    {
        icon: "tint",
        key: Achievement.FATALITY,
        text: "Win a game to 11 or more without losing a single point",
        title: "FATALITY!",
        check_for_requirements: (matches: DbMatch[], player: DbPlayer): boolean => checkForFatality(matches, player)
    },
    {
        icon: "hand victory",
        key: Achievement.CLUTCH_PERFORMER,
        text: "Win 5 games by 2 points or less",
        title: "Clutch Performer",
        check_for_requirements: (matches: DbMatch[], player: DbPlayer): boolean => checkForClutchPerformer(matches, player)
    },
    {
        icon: "heartbeat",
        key: Achievement.HEART_BREAKER,
        text: "Lose 5 games by 2 points or less",
        title: "Heart Breaker",
        check_for_requirements: (matches: DbMatch[], player: DbPlayer): boolean => checkForHeartBreaker(matches, player)
    },
    {
        icon: "smile",
        key: Achievement.ON_A_ROLL,
        text: "Win 3 games in a row",
        title: "On A Roll",
        check_for_requirements: (matches: DbMatch[], player: DbPlayer): boolean => checkForWinsInARow(matches, player, 3)
    },
    {
        icon: "ship",
        key: Achievement.UNSTOPPABLE,
        text: "Win 5 games in a row",
        title: "Unstoppable",
        check_for_requirements: (matches: DbMatch[], player: DbPlayer): boolean => checkForWinsInARow(matches, player, 5)
    },
    {
        icon: "cloudversify",
        key: Achievement.ASCENDED,
        text: "Win 10 games in a row",
        title: "Ascended",
        check_for_requirements: (matches: DbMatch[], player: DbPlayer): boolean => checkForWinsInARow(matches, player, 10)
    },
    {
        icon: "bed",
        key: Achievement.HELPLESS,
        text: "Lose a game to 11 or more without winning a point",
        title: "Helpless",
        check_for_requirements: (matches: DbMatch[], player: DbPlayer): boolean => checkForHelpless(matches, player)
    },
    {
        icon: "chess king",
        key: Achievement.SUPERIOR,
        text: "Reach 1300 ELO",
        title: "Superior",
        check_for_requirements: (matches: DbMatch[], player: DbPlayer): boolean => checkForSuperior(matches, player)
    },
    {
        icon: "spoon",
        key: Achievement.CELLAR_DWELLAR,
        text: "Fall to 1100 ELO",
        title: "Cellar Dwellar",
        check_for_requirements: (matches: DbMatch[], player: DbPlayer): boolean => checkForCellarDwellar(matches, player)
    },
    {
        icon: "frown",
        key: Achievement.A_LITTLE_EMBARRASSING,
        text: "Lose to a player with an ELO of 200+ less than you",
        title: "A Little Embarrassing",
        check_for_requirements: (matches: DbMatch[], player: DbPlayer): boolean => checkForALittleEmbarrassing(matches, player)
    },
    {
        icon: "money",
        key: Achievement.SHOULD_HAVE_PUT_MONEY_ON_IT,
        text: "Win against a player with an ELO of 200+ more than you",
        title: "Should Have Put Money On It",
        check_for_requirements: (matches: DbMatch[], player: DbPlayer): boolean => checkForShouldHavePutMoneyOnIt(matches, player)
    },
];

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
    const matchesInvolvingPlayer = matches
        .filter((match) => {
            return match.winning_player_id === player.id || match.losing_player_id === player.id;
        })
        .sort((match1, match2) => {
            return match1.date.localeCompare(match2.date);
        });
    console.table(matchesInvolvingPlayer);

    let streak = 0;
    matchesInvolvingPlayer.forEach((match: DbMatch) => {
        streak = (match.winning_player_id === player.id)
            ? streak + 1
            : 0;
    });

    // If the player has won enough games in a row, award this achievement.
    return streak >= count;
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

export const checkForCellarDwellar = (matches: DbMatch[], player: DbPlayer): boolean => {
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
    winningPlayer: DbPlayer,
    losingPlayer: DbPlayer
): DbBadge => {
    return {
        ...badgeDesc,
        id: uuidv4(),
        date: new Date().toISOString(),
        player_id: winningPlayer.id,
        involved_player: losingPlayer.id,
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

    ALL_BADGE_DESCRIPTIONS.forEach((badge: BadgeDesc) => {
        if (badge.check_for_requirements) {
            // Check achievement criteria for the winning player
            if (!winnerBadgeKeys.includes(badge.key) && badge.check_for_requirements(matches, winningPlayer)) {
                QuickHitAPI.addBadge(
                    decorateAchievementForUpload(badge, winningPlayer, losingPlayer),
                    () => { return },
                    onError
                );
            }
            // Check achievement criteria for the losing player
            if (!loserBadgeKeys.includes(badge.key) && badge.check_for_requirements(matches, losingPlayer)) {
                QuickHitAPI.addBadge(
                    decorateAchievementForUpload(badge, losingPlayer, winningPlayer),
                    () => { return },
                    onError
                );
            }
        }
    });
};
