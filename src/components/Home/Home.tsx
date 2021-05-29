import React, {useState} from 'react';
import './Home.css';
import {Button, ButtonGroup, Header, Icon, SegmentGroup, Transition} from "semantic-ui-react";
import { Link } from 'react-router-dom';
import {QuickHitPage} from "../../util/QuickHitPage";
import NewGame from "../Ladder/NewGame/NewGame";
import QHDataLoader, {getWinLossForPlayer, LoaderData} from "../QHDataLoader/QHDataLoader";
import {DB_Player} from "../../types/database/models";
import NewPlayer from "../Ladder/NewPlayer/NewPlayer";
import PlayerCard from "../Ladder/PlayerCard/PlayerCard";

/**
 * QuickHit Home page.
 */
function Home() {
    const [loaderData, setLoaderData] = useState<LoaderData>({playersMap: new Map<string, DB_Player>(), matches: [], loading: true});

    const receiveDataFromLoader = (data: LoaderData) => {
        setLoaderData(data);
    }

    const getCurrentChampion = () : DB_Player => {
        const players = Array.from(loaderData.playersMap.values());
        players.sort((player1, player2) => {return getWinLossForPlayer(player2.id, loaderData.matches).wins - getWinLossForPlayer(player1.id, loaderData.matches).wins});

        return players[0];
    }

    return (
        <div className="home">
            <QHDataLoader dataReceivedCallback={receiveDataFromLoader}/>
            <Transition transitionOnMount={true}>
                <Header as={"h2"} icon inverted>
                    <Icon name='table tennis' circular/>
                    Welcome to <Icon name={"chevron right"} size={"tiny"}/>Quick
                    <span className={"header-hit"}>HIT</span>
                </Header>
            </Transition>
            <Transition transitionOnMount={true}>
                <ButtonGroup horizontal className={"home-menu-buttons"}>
                    <Header as={"h3"} icon>
                        <Link to={QuickHitPage.LADDER}>
                            <Icon name='trophy' circular/>
                            <Header.Content>Ladder</Header.Content>
                        </Link>
                    </Header>
                    <Header as={"h3"} icon>
                        <Link to={QuickHitPage.RECENT_GAMES}>
                            <Icon name='history' circular/>
                            <Header.Content>Recent games</Header.Content>
                        </Link>
                    </Header>
                    <NewGame players={Array.from(loaderData.playersMap.values())} customModalOpenElement={
                        <Header as={"h3"} icon>
                            <Icon name='plus' circular/>
                            <Header.Content>Enter game</Header.Content>
                        </Header>
                    }/>
                    <NewPlayer customModalOpenElement={
                        <Header as={"h3"} icon>
                            <Icon name='add user' circular/>
                            <Header.Content>Sign up</Header.Content>
                        </Header>
                    }/>
                </ButtonGroup>
            </Transition>
            <Transition visible={!loaderData.loading} animation={"fly up"} duration={2000} unmountOnHide={true}>
                <div className={"champion-area"}>
                    <Header as={"h4"} inverted>
                        {loaderData.playersMap.size > 0 &&
                        <PlayerCard player={getCurrentChampion()}/>
                        }
                    </Header>
                    <Header.Subheader>
                        is the current <span className={"champion-text"}> champion </span>
                    </Header.Subheader>
                </div>
            </Transition>
        </div>
    );
}

export default Home;
