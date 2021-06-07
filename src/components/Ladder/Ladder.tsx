import React, {useState} from 'react';
import './Ladder.css';
import {Button, Checkbox, Header, Icon, Transition} from "semantic-ui-react";
import PlayerCard from "./PlayerCard/PlayerCard";
import NewPlayer from './NewPlayer/NewPlayer';
import NewGame from "./NewGame/NewGame";
import {getWinLossForPlayer} from "../QHDataLoader/QHDataLoader";
import {TTDataPropsType} from "../../containers/shared";

type LadderStyle = 'vertical' | 'horizontal';

interface LadderProps extends TTDataPropsType {
    hideZeroGamePlayers: boolean,
    setHideZeroGamePlayers: (zeroGamePlayers: boolean) => void,
}

/**
 * QuickHit Ladder page.
 */
function Ladder(props: LadderProps) {
    const [ladderStyle, toggleLadderStyle] = useState<LadderStyle>('horizontal');

    const renderPlayers = (): JSX.Element[] => {

        const playerItems: JSX.Element[] = [];
        props.players.forEach((player) => {
            const winLoss = getWinLossForPlayer(player.id, props.matches);

            const playerCard = (
                <PlayerCard player={player} winLoss={winLoss}/>
            );

            // If we are hiding zero game players, then only push if they have played a game
            if (props.hideZeroGamePlayers) {
                if (winLoss.wins + winLoss.losses > 0) {
                    playerItems.push(playerCard);
                }
            }
            else {
                playerItems.push(playerCard);
            }
        });

        // Sorting the player items by wins.
        playerItems.sort((player1, player2) => {return player2.props.player.elo - player1.props.player.elo});
        return playerItems;
    }

    const refreshContent = () => {
       // Set the store force refresh flag, alerting QHDataLoader to do a new fetch.
       props.setForceRefresh(true);
    }

    return (
        <div className="players">
            <Header as={"h2"} icon>
                <Icon name='trophy' circular/>
                <Header.Content>Ladder</Header.Content>
            </Header>
            <div className={"toggle-zero-game-players"}>
                <div>
                    Hide players who haven't played a game:
                </div>
                <Checkbox toggle checked={props.hideZeroGamePlayers} onChange={()=>props.setHideZeroGamePlayers(!props.hideZeroGamePlayers)} />
            </div>
            <Transition visible={!props.loading}>
                <span>
                    <span className={`players-area ${ladderStyle}`}>
                           {renderPlayers()}
                    </span>
                    <div className={"new-buttons"}>
                        <Button basic circular icon={ladderStyle === 'vertical' ? 'arrow right' : 'arrow down'} onClick={() => {toggleLadderStyle(ladderStyle === 'vertical' ? 'horizontal' : 'vertical')}}/>
                        <NewPlayer onNewPlayerAdded={refreshContent}/>
                        <NewGame players={props.players} onNewGameAdded={refreshContent}/>
                    </div>
            </span>
            </Transition>
        </div>
    );
}

export default Ladder;
