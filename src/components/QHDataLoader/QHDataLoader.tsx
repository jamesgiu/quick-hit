// Since the Firebase DB is not an RDBS, and free tier - it is better to preload the contents of the DB and draw
// associations between IDs on the clientside rather than on the serverside.

// Can do an initial fetch and cache the data in Redux - or fetch on every page change for a more responsive
// experience.

import React, {useEffect, useState} from "react";
import {makeErrorToast} from "../Toast/Toast";
import {QuickHitAPI} from "../../api/QuickHitAPI";
import {Loader, Transition} from "semantic-ui-react";
import {DB_Match, DB_Player} from "../../types/database/models";
import {WinLoss} from "../../types/types";

export interface LoaderData {
    matches: DB_Match[],
    playersMap: Map<string, DB_Player>,
    loading: boolean,
}

interface QHDataLoaderProps {
    dataReceivedCallback: (snapshot: LoaderData) => void,
}

// How frequently to poll the Firebase DB for new data.
const POLL_TIME_MS = 30000;

function QHDataLoader(props: QHDataLoaderProps) {
    const [matches, setMatches] = useState<DB_Match[]>([]);
    const [players, setPlayers] = useState<DB_Player[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // On component mount.
    useEffect(()=> {
        const getMatches = () => {
            const onSuccess = (matches: DB_Match[]): void => {
                setMatches(matches);
                setLoading(false);
            }

            const onFailure = (error: string): void => {
                makeErrorToast("Could not get matches", error);
                setLoading(false);
            }

            QuickHitAPI.getMatches(onSuccess, onFailure);
        }

        const getPlayers = () => {
            const onSuccess = (players: DB_Player[]): void => {
                setPlayers(players);
                setLoading(false);
            }

            const onFailure = (error: string): void => {
                makeErrorToast("Could not get players", error);
                setLoading(false);
            }

            QuickHitAPI.getPlayers(onSuccess, onFailure);
        }

        const getData = () => {
            getMatches();
            getPlayers();
        };

        getData();

        const dataPoller = setInterval(getData, POLL_TIME_MS);

        // Runs on component unmount
        return function cleanup() {
           clearInterval(dataPoller);
        };
    }, [])

    // Whenever the snapshot updates, notify the parents.
    useEffect(()=> {
        const playersMap : Map<string, DB_Player> = new Map();

        players.forEach((player) => {
            playersMap.set(player.id, player);
        });

        const loaderData : LoaderData = {
            matches,
            playersMap,
            loading
        };

        props.dataReceivedCallback(loaderData);
    }, [players, matches, loading]);

    return (
        <Transition visible={loading}>
            <Loader content={"Loading data..."}/>
        </Transition>
    );
}

export const getWinLossForPlayer = (playerId: string, matches: DB_Match[]): WinLoss => {
    const winLoss: WinLoss = {
        wins: 0,
        losses: 0
    };

    matches.forEach((match) => {
        if (match.winning_player_id === playerId) {
            winLoss.wins++;
        }
        else if (match.losing_player_id === playerId) {
            winLoss.losses++;
        }
    });

    return winLoss;
}

export default QHDataLoader;