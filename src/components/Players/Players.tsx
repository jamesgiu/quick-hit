import React, {useEffect, useState} from 'react';
import './Players.css';
import {DB_Match, DB_Player} from "../../types/database/models";
import {WinLoss} from "../../types/types";
import {QuickHitAPI} from "../../api/QuickHitAPI";
import {makeErrorToast} from "../Toast/Toast";
import {Header, Icon, Loader, Transition} from "semantic-ui-react";
import PlayerCard from "./PlayerCard/PlayerCard";
import NewPlayer from './NewPlayer/NewPlayer';
import NewGame from "./NewGame/NewGame";

/**
 * QuickHit Players page.
 */
function Players() {
    const [players, setPlayers] = useState<DB_Player[]>([]);
    const [matches, setMatches] = useState<DB_Match[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getMatches = () => {
        const onSuccess = (matches: DB_Match[]): void => {
            setMatches(matches);
            setIsLoading(false);
        }

        const onFailure = (error: string): void => {
            makeErrorToast("Could not get matches", error);
            setIsLoading(false);
        }

        QuickHitAPI.getMatches(onSuccess, onFailure);
    }

    const getWinLossForPlayer = (playerId: string): WinLoss => {
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

    const renderPlayers = (): JSX.Element[] => {
        const playerItems: JSX.Element[] = [];
        players.forEach((player) => {
            const playerCard = (
                <PlayerCard player={player} winLoss={getWinLossForPlayer(player.id)}/>
            );

            playerItems.push(playerCard);
        });

        // Sorting the player items by wins.
        playerItems.sort((player1, player2) => {return player1.props.winLoss.wins > player2.props.winLoss.wins ? 1 : 0})

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
                <Icon name='trophy' circular/>
                <Header.Content>Ladder</Header.Content>
            </Header>
            <Transition visible={isLoading}>
                <Loader content={"Loading players..."}/>
            </Transition>
            <Transition visible={!isLoading}>
                <span className={"players-area"}>
                       {renderPlayers()}
                </span>
            </Transition>
            <span className={"new-buttons"}>
                <NewPlayer/>
                <NewGame players={players}/>
            </span>
        </div>
    );
}

export default Players;
