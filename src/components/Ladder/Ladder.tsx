import React, {useEffect, useState} from 'react';
import './Ladder.css';
import {Button, Checkbox, Header, Icon, Transition} from "semantic-ui-react";
import PlayerCard from "./PlayerCard/PlayerCard";
import NewPlayer from './NewPlayer/NewPlayer';
import NewGame from "./NewGame/NewGame";
import {getWinLossForPlayer} from "../QHDataLoader/QHDataLoader";
import {TTDataPropsType} from "../../containers/shared";

type LadderStyle = 'vertical' | 'horizontal';

/**
 * QuickHit Ladder page.
 */
function Ladder(props: TTDataPropsType) {
    const [ladderStyle, toggleLadderStyle] = useState<LadderStyle>('horizontal');
    const [hideZeroGamePlayers, setHideZeroGamePlayers] = useState<boolean>(true);
    const [forceRefreshOnNextRender, setForceRefreshOnNextRender] = useState<boolean>(false);

    const renderPlayers = (): JSX.Element[] => {
        const playerItems: JSX.Element[] = [];
        Array.from(props.loaderData.playersMap.values()).forEach((player) => {
            const winLoss = getWinLossForPlayer(player.id, props.loaderData.matches);

            const playerCard = (
                <PlayerCard player={player} winLoss={winLoss}/>
            );

            // If we are hiding zero game players, then only push if they have played a game
            if (hideZeroGamePlayers) {
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
        setForceRefreshOnNextRender(true);
    }

    // Use effect handler for force refresh, ensuring that it gets set to false after being set to true.
    useEffect(() => {
        if (forceRefreshOnNextRender) {
            setForceRefreshOnNextRender(false);
        }
    }, [forceRefreshOnNextRender])

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
                <Checkbox toggle defaultChecked onChange={()=>setHideZeroGamePlayers(!hideZeroGamePlayers)} />
            </div>
            <Transition visible={!props.loaderData.loading}>
                <span>
                    <span className={`players-area ${ladderStyle}`}>
                           {renderPlayers()}
                    </span>
                    <div className={"new-buttons"}>
                        <Button basic circular icon={ladderStyle === 'vertical' ? 'arrow right' : 'arrow down'} onClick={() => {toggleLadderStyle(ladderStyle === 'vertical' ? 'horizontal' : 'vertical')}}/>
                        <NewPlayer onNewPlayerAdded={refreshContent}/>
                        <NewGame players={Array.from(props.loaderData.playersMap.values())} onNewGameAdded={refreshContent}/>
                    </div>
            </span>
            </Transition>
        </div>
    );
}

export default Ladder;
