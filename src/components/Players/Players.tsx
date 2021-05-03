import React, {useEffect, useState} from 'react';
import './Players.css';
import {DB_Player} from "../../types/database/models";
import {QuickHitAPI} from "../../api/QuickHitAPI";
import {makeErrorToast} from "../Toast/Toast";
import {Card, Header, Icon, SemanticICONS} from "semantic-ui-react";

/**
 * QuickHit Players page.
 */
function Players() {
    const [players, setPlayers] = useState<DB_Player[]>([]);

    // Runs on mount.
    useEffect(()=> {
        getPlayers();
    }, [])

    const getPlayers = () => {
        const onSuccess = (players: DB_Player[]): void => {
            setPlayers(Object.values(players));
        }

        const onFailure = (error: string) : void => {
            makeErrorToast("Could not get players", error);
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
                           TBA wins
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
            {players.length > 0 ? renderPlayers() : "Loading players..."}
        </div>
    );
}

export default Players;
