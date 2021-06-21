// Since the Firebase DB is not an RDBS, and free tier - it is better to preload the contents of the DB and draw
// associations between IDs on the clientside rather than on the serverside.

// Can do an initial fetch and cache the data in Redux - or fetch on every page change for a more responsive
// experience.
import React, {useEffect, useRef, useState} from "react";
import {makeErrorToast, makeRefreshToast} from "../Toast/Toast";
import {QuickHitAPI} from "../../api/QuickHitAPI";
import {Loader, Transition} from "semantic-ui-react";
import {DbMatch, DbPlayer} from "../../types/database/models";
import {WinLoss} from "../../types/types";
import {TTDataPropsType} from "../../containers/shared";

interface QHDataLoaderProps extends TTDataPropsType {
    // Redux actions
    setMatches: (newMatches: DbMatch[]) => void,
    setPlayers: (newPlayers: DbPlayer[]) => void,
    setLoading: (newLoading: boolean) => void,
}

// How frequently to poll the Firebase DB for new data.
const POLL_TIME_MS = 30000;

function QHDataLoader(props: QHDataLoaderProps) {
    const intervalRef = useRef<NodeJS.Timeout>();
    const [polling, setPolling] = useState<boolean>(true);

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
        getMatches();
        getPlayers();
    };

    // On component mount.
    useEffect(() => {
        getData();
    }, []);

    // Set the data loop, and on prop change, reset the loop as the Interval function will retain the props
    // present at the time of invocation.
    useEffect(() => {
        clearInterval(intervalRef.current!);
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
        <Transition visible={props.loading}>
            <Loader content={"Loading data..."}/>
        </Transition>
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

export const getPlayersMap = (players: DbPlayer[]): Map<string, DbPlayer> => {
    const playersMap: Map<string, DbPlayer> = new Map();

    if (players) {
        players.forEach((player) => {
            playersMap.set(player.id, player);
        });
    }

    return playersMap;
}

export default QHDataLoader;