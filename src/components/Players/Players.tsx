import React, {useEffect, useState} from 'react';
import './Players.css';
import {DB_MatchPlayer, DB_Player, WinLoss} from "../../types/database/models";
import {QuickHitAPI} from "../../api/QuickHitAPI";
import {makeErrorToast} from "../Toast/Toast";
import {Card, Header, Icon, Loader, Transition} from "semantic-ui-react";

/**
 * QuickHit Players page.
 */
function Players() {
    const [players, setPlayers] = useState<DB_Player[]>([]);
    const [matches, setMatches] = useState<DB_MatchPlayer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Runs on mount.
    useEffect(()=> {
        getPlayers();
    }, [])

    const getMatches = () => {
        const onSuccess = (matches: DB_MatchPlayer[]): void => {
            setMatches(matches);
            setIsLoading(false);
        }

        const onFailure = (error: string) : void => {
            makeErrorToast("Could not get matches", error);
            setIsLoading(false);
        }

        QuickHitAPI.getMatchPlayers(onSuccess, onFailure);
    }

    const getWinLossForPlayer = (playerId: string) : JSX.Element => {
        const winLoss : WinLoss = {
            wins: 0,
            losses: 0
        };

        matches.forEach((match) => {
            if(match.player_id === playerId)
            {
                if(match.won) {
                    winLoss.wins++;
                } else {
                    winLoss.losses++;
                }
            }
        });

        return (
            <span>
                Wins: {winLoss.wins} Losses: {winLoss.losses}
            </span>
        );
    }

    const getPlayers = () => {
        const onSuccess = (players: DB_Player[]): void => {
            setPlayers(players);
            getMatches();
        }

        const onFailure = (error: string) : void => {
            makeErrorToast("Could not get players", error);
            setIsLoading(false);
        }

        QuickHitAPI.getPlayers(onSuccess, onFailure);
    }

    const renderPlayers = () : JSX.Element[]  => {
        const playerItems : JSX.Element[] = [];
        players.forEach((player) => {
            const playerCard = (
                    <Card>
                        <Card.Content>
                            <Card.Header>
                                <div>
                                    <Icon name={player.icon} size={"big"}/>
                                </div>
                                {player.name}
                            </Card.Header>
                        </Card.Content>
                        <Card.Content extra>
                            {getWinLossForPlayer(player.id)}
                        </Card.Content>
                    </Card>
            );

            playerItems.push(playerCard);
        });

        return playerItems;
    }

    return (
        <div className="players">
            <Header as={"h2"} icon>
                <Icon name='users' circular />
                <Header.Content>Players</Header.Content>
            </Header>
            <Transition visible={isLoading}>
                <Loader content={"Loading players..."}/>
            </Transition>
            <Transition visible={!isLoading}>
                <div>
                  {renderPlayers()}
                </div>
            </Transition>
        </div>
    );
}

export default Players;
