// Since the Firebase DB is not an RDBS, and free tier - it is better to preload the contents of the DB and draw
// associations between IDs on the clientside rather than on the serverside.

// Can do an initial fetch and cache the data in Redux - or fetch on every page change for a more responsive
// experience.
import React, {useEffect} from "react";
import {makeErrorToast, makeRefreshToast} from "../Toast/Toast";
import {QuickHitAPI} from "../../api/QuickHitAPI";
import {Loader, Transition} from "semantic-ui-react";
import {DB_Match, DB_Player} from "../../types/database/models";
import {WinLoss} from "../../types/types";
import {TTDataPropsType} from "../../containers/shared";

interface QHDataLoaderProps extends TTDataPropsType {
    // Redux actions
    setMatches: (newMatches: DB_Match[]) => void,
    setPlayers: (newPlayers: DB_Player[]) => void,
    setLoading: (newLoading: boolean) => void,
}

// How frequently to poll the Firebase DB for new data.
const POLL_TIME_MS = 30000;

function QHDataLoader(props: QHDataLoaderProps) {
    // On component mount.
    useEffect(()=> {
        const getMatches = () => {
            const onSuccess = (receivedMatches: DB_Match[]): void => {
                // Check for match data changes
                if (receivedMatches.length !== props.matches.length && props.matches.length > 0) {
                    // Match data has changed, prompt user for a refresh.
                    makeRefreshToast();
                    // Stop checking for new data.
                    clearInterval(dataPoller);
                    // FIXME sets loading indefinitely to prevent actions and force a refresh.
                    props.setLoading(true);
                }
                else {
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
            const onSuccess = (players: DB_Player[]): void => {
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

        getData();

        const dataPoller = setInterval(() => {
            getData();
        }, POLL_TIME_MS);

        // Runs on component unmount
        return function cleanup() {
           clearInterval(dataPoller);
        };
    }, [])

    return (
        <Transition visible={props.loading}>
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

export const getPlayersMap = (players: DB_Player[]) : Map<string, DB_Player> => {
    const playersMap : Map<string, DB_Player> = new Map();

    if (players) {
        players.forEach((player) => {
            playersMap.set(player.id, player);
        });
    }

    return playersMap;
}

export default QHDataLoader;