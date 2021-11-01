import { getRecordAgainstPlayer } from "../components/QHDataLoader/QHDataLoader";
import { DbMatch, DbPlayer } from "../types/database/models";

/**
 * A simple clamp implementation.
 * @param num The number to be clamped.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns The clamped number.
 */
export const clamp = (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
};

/**
 * Returns an approximation of the chance of victory of the first given player over the second given player. Takes
 * into account ELO difference and past encounters.
 * @param p1 The first player.
 * @param p2 The second player.
 * @param matches All QH matches.
 * @returns The chance of victory of the first player over the second player, as a percentage.
 */
export const getChanceOfVictory = (p1: DbPlayer | undefined, p2: DbPlayer | undefined, matches: DbMatch[]): number => {
    if (p1 && p2) {
        // From an ELO point of view, if one player has an ELO 100+ above another player, they have a 100% chance of
        // victory.
        const eloDiff = clamp(p1.elo - p2.elo, -100, 100);
        const standardised = (eloDiff + 100) / 2;

        const record = getRecordAgainstPlayer(p1.id, p2.id, matches);
        // If the two players have played before, use their past matches too.
        if (record.wins + record.losses > 0) {
            const winPerc = 100 * (record.wins / (record.wins + record.losses));
            const prediction = (winPerc * 0.5) + (standardised * 0.5);
            // Clamp the chance between 5% and 95%, because nothing's ever certain.
            return Math.round(clamp(prediction, 5, 95) * 100 + Number.EPSILON) / 100;
        } else {
            return Math.round(clamp(standardised, 5, 95) * 100 + Number.EPSILON) / 100;
        }
    } else {
        return 0;
    }
};