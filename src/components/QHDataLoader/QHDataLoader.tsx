// Since the Firebase DB is not an RDBS, and free tier - it is better to preload the contents of the DB and draw
// associations between IDs on the clientside rather than on the serverside.

// Can do an initial fetch and cache the data in Redux - or fetch on every page change for a more responsive
// experience.
import React, {useEffect, useRef, useState} from "react";
import {makeErrorToast, makeRefreshToast} from "../Toast/Toast";
import {QuickHitAPI} from "../../api/QuickHitAPI";
import {Loader, Transition} from "semantic-ui-react";
import {DbHappyHour, DbMatch, DbPlayer, getTodaysDate} from "../../types/database/models";
import {MinMaxELO, WinLoss} from "../../types/types";
import {TTDataPropsTypeCombined} from "../../containers/shared";
import {DataLoaderDispatchType} from "../../containers/QHDataLoader/QHDataLoader";

type QHDataLoaderProps = TTDataPropsTypeCombined & DataLoaderDispatchType;

// How frequently to poll the Firebase DB for new data.
const POLL_TIME_MS = 30000;

function QHDataLoader(props: QHDataLoaderProps) : JSX.Element {
    const intervalRef = useRef<NodeJS.Timeout>();
    const [polling, setPolling] = useState<boolean>(true);

    const getHappyHourOrSetIfNotPresent = () => {
        const onFailure = (error: string): void => {
            makeErrorToast("Could not determine today's happy hour", error);
            props.setLoading(false);
        }

        const onSuccess = (happyHour?: DbHappyHour): void => {
            if (happyHour?.date) {
                props.setHappyHour(happyHour);
            }
            else {
                // No happy hour generated for today, generate one
                const newHappyHour : DbHappyHour = {
                    date: getTodaysDate(),
                    hourStart: randomIntFromInterval(9, 16),
                    multiplier: randomIntFromInterval(2,6)
                }

                QuickHitAPI.setHappyHourToday(newHappyHour, ()=>{return}, onFailure);
            }
        }
        QuickHitAPI.getTodaysHappyHour(onSuccess, onFailure);
    }

    const getMatches = () => {
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
        }

        const onFailure = (error: string): void => {
            makeErrorToast("Could not get matches", error);
            props.setLoading(false);
        }

        QuickHitAPI.getMatches(onSuccess, onFailure);
    }

    const getPlayers = () => {
        const onSuccess = (players: DbPlayer[]): void => {
            props.setPlayers(players);
            props.setLoading(false);
        }

        const onFailure = (error: string): void => {
            makeErrorToast("Could not get players", error);
            props.setLoading(false);
        }

        QuickHitAPI.getPlayers(onSuccess, onFailure);
    }

    const getData = () => {
        getHappyHourOrSetIfNotPresent();
        getMatches();
        getPlayers();
    };

    // On component mount.
    useEffect(() => {
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    }, [props, polling]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={"data-loader"}>
            <Transition visible={props.loading}>
                <Loader content={"Loading data..."}/>
            </Transition>
        </div>
    );
}

export const getWinLossForPlayer = (playerId: string, matches: DbMatch[]): WinLoss => {
    const winLoss: WinLoss = {
        wins: 0,
        losses: 0
    };

    matches.forEach((match) => {
        if (match.winning_player_id === playerId) {
            winLoss.wins++;
        } else if (match.losing_player_id === playerId) {
            winLoss.losses++;
        }
    });

    return winLoss;
}

export const getMinMaxELOsForPlayer = (playerId: string, matches: DbMatch[]): MinMaxELO => {
    let minELO = 1200;
    let maxELO = 1200;

    matches.forEach((match) => {
        if (match.winning_player_id === playerId) {
            if (match.winning_player_original_elo < minELO) {
                minELO = match.winning_player_original_elo;
            }
            if (match.winner_new_elo > maxELO) {
                maxELO = match.winner_new_elo;
            }
        } else if (match.losing_player_id === playerId) {
            if (match.loser_new_elo < minELO) {
                minELO = match.loser_new_elo;
            }
            if (match.losing_player_original_elo > maxELO) {
                maxELO = match.losing_player_original_elo;
            }
        }
    });
    return {minELO, maxELO};
}

export const getPlayersMap = (players: DbPlayer[]): Map<string, DbPlayer> => {
    const playersMap: Map<string, DbPlayer> = new Map();

    if (players) {
        players.forEach((player) => {
            playersMap.set(player.id, player);
        });
    }

    return playersMap;
}

const randomIntFromInterval = (min: number, max: number) : number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export default QHDataLoader;