import { BadgeDesc } from "../../types/database/models";

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
