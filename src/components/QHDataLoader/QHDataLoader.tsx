// Since the Firebase DB is not an RDBS, and free tier - it is better to preload the contents of the DB and draw
// associations between IDs on the clientside rather than on the serverside.

// Can do an initial fetch and cache the data in Redux - or fetch on every page change for a more responsive
// experience.
import React, { useEffect, useRef, useState } from "react";
import { makeErrorToast, makeRefreshToast } from "../Toast/Toast";
import { QuickHitAPI } from "../../api/QuickHitAPI";
import { Loader, Transition } from "semantic-ui-react";
import { DbBadge, DbHappyHour, DbMatch, DbPlayer, DbTournament, getTodaysDate } from "../../types/database/models";
import { TTDataPropsTypeCombined } from "../../containers/shared";
import { DataLoaderDispatchType } from "../../containers/QHDataLoader/QHDataLoader";
import { ELOGraphStats, ExtraPlayerStats, WinLoss } from "../../types/types";

type QHDataLoaderProps = TTDataPropsTypeCombined & DataLoaderDispatchType;

// How frequently to poll the Firebase DB for new data.
const POLL_TIME_MS = 30000;

function QHDataLoader(props: QHDataLoaderProps): JSX.Element {
    const intervalRef = useRef<NodeJS.Timeout>();
    const [polling, setPolling] = useState<boolean>(true);

    const getHappyHourOrSetIfNotPresent = (): void => {
        const onFailure = (error: string): void => {
            makeErrorToast("Could not determine today's happy hour", error);
            props.setLoading(false);
        };

        const onSuccess = (happyHour?: DbHappyHour): void => {
            if (happyHour?.date) {
                props.setHappyHour(happyHour);
            } else {
                // No happy hour generated for today, generate one
                const newHappyHour: DbHappyHour = {
                    date: getTodaysDate(),
                    // Force set the happy hour to either be 12 or 16 (lunch time or 4pm).
                    hourStart: randomIntFromInterval(0, 1) === 0 ? 12 : 16,
                    multiplier: randomIntFromInterval(2, 6),
                };

                QuickHitAPI.setHappyHour(
                    newHappyHour,
                    () => {
                        props.setHappyHour(newHappyHour);
                        return;
                    },
                    onFailure
                );
            }
        };
        QuickHitAPI.getTodaysHappyHour(onSuccess, onFailure);
    };

    const getMatches = (): void => {
        const onSuccess = (receivedMatches: DbMatch[]): void => {
            // Check for match data changes, and alert the user to manually refresh when they return, unless it was an
            // expected/forced refresh.
            if (!props.refresh && receivedMatches.length !== props.matches.length && props.matches.length > 0) {
                // Match data has changed, prompt user for a refresh.
                makeRefreshToast();
                // Stop checking for new data.
                setPolling(false);
                // FIXME sets loading indefinitely to prevent actions and force a refresh.
                props.setLoading(true);
            } else {
                props.setLoading(false);
                props.setMatches(receivedMatches);
            }
        };

        const onFailure = (error: string): void => {
            makeErrorToast("Could not get matches", error);
            props.setLoading(false);
        };

        QuickHitAPI.getMatches(onSuccess, onFailure);
    };

    const getPlayers = (): void => {
        const onSuccess = (players: DbPlayer[]): void => {
            props.setPlayers(players);
        };

        const onFailure = (error: string): void => {
            makeErrorToast("Could not get players", error);
            props.setLoading(false);
        };

        QuickHitAPI.getPlayers(onSuccess, onFailure);
    };

    const getBadges = (): void => {
        const onSuccess = (badges: DbBadge[]): void => {
            props.setBadges(badges);
        };

        const onFailure = (error: string): void => {
            makeErrorToast("Could not get badges", error);
            props.setLoading(false);
        };

        QuickHitAPI.getBadges(onSuccess, onFailure);
    };

    const getTournaments = (): void => {
        const onSuccess = (tournaments: DbTournament[]): void => {
            props.setTournaments(tournaments);
        };

        const onFailure = (error: string): void => {
            makeErrorToast("Could not get tournaments", error);
            props.setLoading(false);
        };

        QuickHitAPI.getTournaments(onSuccess, onFailure);
    };

    const getData = (): void => {
        getHappyHourOrSetIfNotPresent();
        getBadges();
        getMatches();
        getTournaments();
        getPlayers();
    };

    useEffect(() => {
        if (intervalRef.current) {
            props.setLoading(false);
        }
    }, [props.players, props.matches, props.badges, props.happyHour]);

    // On component mount.
    useEffect(() => {
        getData();
    }, []);

    // Set the data loop, and on prop change, reset the loop as the Interval function will retain the props
    // present at the time of invocation.
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (polling) {
            intervalRef.current = setInterval(getData, POLL_TIME_MS);
        }

        // If we were forced to refresh
        if (props.refresh) {
            getData();
            props.setForceRefresh(false);
        }
    }, [props, polling]);

    return (
        <div className={"data-loader"}>
            <Transition visible={props.loading}>
                <Loader content={"Loading data..."} />
            </Transition>
        </div>
    );
}

export const getWinLossForPlayer = (playerId: string, matches: DbMatch[]): WinLoss => {
    const winLoss: WinLoss = {
        wins: 0,
        losses: 0,
    };

    matches.forEach((match) => {
        if (match.winning_player_id === playerId) {
            winLoss.wins++;
        } else if (match.losing_player_id === playerId) {
            winLoss.losses++;
        }
    });

    return winLoss;
};

export const getRecordAgainstPlayer = (playerId: string, opponentId: string, matches: DbMatch[]): WinLoss => {
    let wins = 0;
    let losses = 0;

    matches.forEach((match) => {
        if (match.winning_player_id === playerId && match.losing_player_id === opponentId) {
            ++wins;
        } else if (match.losing_player_id === playerId && match.winning_player_id === opponentId) {
            ++losses;
        }
    });

    return { wins, losses };
};

export const getGraphStatsForPlayer = (playerId: string, matches: DbMatch[]): ELOGraphStats[] => {
    const eloGraphStats: ELOGraphStats[] = [];

    // Build up array of all matches, plus their resulting ELO for the player id given.
    for (let i = 0; i < matches.length; i++) {
        const match: DbMatch = matches[i];

        // Ensure the player was in this match
        if (match.winning_player_id == playerId || match.losing_player_id == playerId) {
            const won = playerId == match.winning_player_id;
            const ELO = won ? match.winner_new_elo : match.loser_new_elo;
            const date = new Date(match.date);

            const eloGraphStatsEntry: ELOGraphStats = {
                ELO,
                date,
            };

            eloGraphStats.push(eloGraphStatsEntry);
        }
    }

    // Sort the results by date.
    eloGraphStats.sort(function (a, b) {
        return a.date.getTime() - b.date.getTime();
    });

    return eloGraphStats;
};

export const getExtraPlayerStats = (playerId: string, matches: DbMatch[]): ExtraPlayerStats => {
    let minELO = 1200;
    let maxELO = 1200;
    let wins = 0;
    let losses = 0;
    const winsMap = new Map<string, number>();
    const lossesMap = new Map<string, number>();
    let victim: string | undefined = undefined;
    let nemesis: string | undefined = undefined;

    matches.forEach((match) => {
        if (match.winning_player_id === playerId) {
            ++wins;
            if (match.winning_player_original_elo < minELO) {
                minELO = match.winning_player_original_elo;
            }
            if (match.winner_new_elo > maxELO) {
                maxELO = match.winner_new_elo;
            }
            if (winsMap.has(match.losing_player_id)) {
                // Have to use a non-null assertion here because the compiler apparently isn't smart enough to realise that
                // if the map has the key, a get call for the key won't be undefined.
                // eslint-disable-next-line
                winsMap.set(match.losing_player_id, winsMap.get(match.losing_player_id)! + 1);
            } else {
                winsMap.set(match.losing_player_id, 1);
            }
        } else if (match.losing_player_id === playerId) {
            ++losses;
            if (match.loser_new_elo < minELO) {
                minELO = match.loser_new_elo;
            }
            if (match.losing_player_original_elo > maxELO) {
                maxELO = match.losing_player_original_elo;
            }
            if (lossesMap.has(match.winning_player_id)) {
                // Same here with the non-null assertion.
                // eslint-disable-next-line
                lossesMap.set(match.winning_player_id, lossesMap.get(match.winning_player_id)! + 1);
            } else {
                lossesMap.set(match.winning_player_id, 1);
            }
        }
    });

    if (wins > 0) {
        let maxWins = 0;
        for (const [player, wins] of winsMap) {
            if (wins > maxWins) {
                victim = player;
                maxWins = wins;
            } else if (wins === maxWins) {
                if (victim) {
                    // Get the first player alphabetically, because we can't guarantee map iteration order.
                    const alphabeticalResult = victim.localeCompare(player);
                    if (alphabeticalResult === 1) {
                        victim = player;
                    }
                } else {
                    victim = player;
                }
            }
        }
    }
    if (losses > 0) {
        let maxLosses = 0;
        for (const [player, losses] of lossesMap) {
            if (losses > maxLosses) {
                nemesis = player;
                maxLosses = losses;
            } else if (losses === maxLosses) {
                if (nemesis) {
                    // Get the first player alphabetically, because we can't guarantee map iteration order.
                    const alphabeticalResult = nemesis.localeCompare(player);
                    if (alphabeticalResult === 1) {
                        nemesis = player;
                    }
                } else {
                    nemesis = player;
                }
            }
        }
    }

    return { wins, losses, minELO, maxELO, victim, nemesis };
};

export const getPlayersMap = (players: DbPlayer[]): Map<string, DbPlayer> => {
    const playersMap: Map<string, DbPlayer> = new Map();

    if (players) {
        players.forEach((player) => {
            playersMap.set(player.id, player);
        });
    }

    return playersMap;
};

const randomIntFromInterval = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export default QHDataLoader;
