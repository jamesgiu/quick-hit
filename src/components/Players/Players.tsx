import React, {useEffect, useState} from 'react';
import './Players.css';
import {DB_MatchPlayer, DB_Player} from "../../types/database/models";
import {WinLoss} from "../../types/types";
import {QuickHitAPI} from "../../api/QuickHitAPI";
import {makeErrorToast} from "../Toast/Toast";
import {Card, Grid, Header, Icon, Loader, Transition} from "semantic-ui-react";
import PlayerCard from "./PlayerCard/PlayerCard";
import NewPlayer from './NewPlayer/NewPlayer';

/**
 * QuickHit Players page.
 */
function Players() {
    const [players, setPlayers] = useState<DB_Player[]>([]);
    const [matches, setMatches] = useState<DB_MatchPlayer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getMatches = () => {
        const onSuccess = (matches: DB_MatchPlayer[]): void => {
            setMatches(matches);
            setIsLoading(false);
        }

        const onFailure = (error: string): void => {
            makeErrorToast("Could not get matches", error);
            setIsLoading(false);
        }

        QuickHitAPI.getMatchPlayers(onSuccess, onFailure);
    }

    const getWinLossForPlayer = (playerId: string): WinLoss => {
        const winLoss: WinLoss = {
            wins: 0,
            losses: 0
        };

        matches.forEach((match) => {
            if (match.player_id === playerId) {
                if (match.won) {
                    winLoss.wins++;
                } else {
                    winLoss.losses++;
                }
            }
        });

        return winLoss;
    }

    const renderPlayers = (): JSX.Element[] => {
        const playerItems: JSX.Element[] = [];
        players.forEach((player) => {
            const playerCard = (
                <PlayerCard player={player} winLoss={getWinLossForPlayer(player.id)}/>
            );

            playerItems.push(playerCard);
        });

        return playerItems;
    }

    // Runs on mount.
    useEffect(() => {
        const getPlayers = () => {
            const onSuccess = (players: DB_Player[]): void => {
                setPlayers(players);
                getMatches();
            }

            const onFailure = (error: string): void => {
                makeErrorToast("Could not get players", error);
                setIsLoading(false);
            }

            QuickHitAPI.getPlayers(onSuccess, onFailure);
        }

        getPlayers();
    }, [])

    return (
        <div className="players">
            <Header as={"h2"} icon>
                <Icon name='users' circular/>
                <Header.Content>Players</Header.Content>
            </Header>
            <Transition visible={isLoading}>
                <Loader content={"Loading players..."}/>
            </Transition>
            <Transition visible={!isLoading}>
                <span className={"players-area"}>
                       {renderPlayers()}
                </span>
            </Transition>
            <span className={"new-player-button"}>
                <NewPlayer/>
            </span>
        </div>
    );
}

export default Players;
