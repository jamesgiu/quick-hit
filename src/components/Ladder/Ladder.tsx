import React, {useState} from 'react';
import './Ladder.css';
import {DB_Player} from "../../types/database/models";
import {WinLoss} from "../../types/types";
import {Button, Header, Icon, Transition} from "semantic-ui-react";
import PlayerCard from "./PlayerCard/PlayerCard";
import NewPlayer from './NewPlayer/NewPlayer';
import NewGame from "./NewGame/NewGame";
import QHDataLoader, {LoaderData} from "../QHDataLoader/QHDataLoader";

type LadderStyle = 'vertical' | 'horizontal';

/**
 * QuickHit Ladder page.
 */
function Ladder() {
    const [loaderData, setLoaderData] = useState<LoaderData>({playersMap: new Map<string, DB_Player>(), matches: [], loading: true});
    const [ladderStyle, toggleLadderStyle] = useState<LadderStyle>('horizontal');

    const getWinLossForPlayer = (playerId: string): WinLoss => {
        const winLoss: WinLoss = {
            wins: 0,
            losses: 0
        };

        loaderData.matches.forEach((match) => {
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
        Array.from(loaderData.playersMap.values()).forEach((player) => {
            const playerCard = (
                <PlayerCard player={player} winLoss={getWinLossForPlayer(player.id)}/>
            );

            playerItems.push(playerCard);
        });

        // Sorting the player items by wins.
        playerItems.sort((player1, player2) => {return player1.props.winLoss.wins > player2.props.winLoss.wins ? -1 : 1});
        return playerItems;
    }

    const receiveDataFromLoader = (data: LoaderData) => {
        setLoaderData(data);
    }

    return (
        <div className="players">
            <Header as={"h2"} icon>
                <Icon name='trophy' circular/>
                <Header.Content>Ladder</Header.Content>
            </Header>
            <QHDataLoader dataReceivedCallback={receiveDataFromLoader}/>
            <Transition visible={!loaderData.loading}>
                <span>
                    <span className={`players-area ${ladderStyle}`}>
                           {renderPlayers()}
                    </span>
                    <div className={"new-buttons"}>
                        <Button basic circular icon={ladderStyle === 'vertical' ? 'arrow right' : 'arrow down'} onClick={() => {toggleLadderStyle(ladderStyle === 'vertical' ? 'horizontal' : 'vertical')}}/>
                        <NewPlayer/>
                        <NewGame players={Array.from(loaderData.playersMap.values())}/>
                    </div>
            </span>
            </Transition>
        </div>
    );
}

export default Ladder;
