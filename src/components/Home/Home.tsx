import React from 'react';
import './Home.css';
import {ButtonGroup, Header, Icon, Transition} from "semantic-ui-react";
import {Link} from 'react-router-dom';
import NewGame from "../Ladder/NewGame/NewGame";
import NewPlayer from "../Ladder/NewPlayer/NewPlayer";
import PlayerCard from "../Ladder/PlayerCard/PlayerCard";
import {TTDataPropsType} from "../../containers/shared";
import {DbPlayer} from "../../types/database/models";
import {BASE_PATH, QuickHitPage} from "../../util/QuickHitPage";


/**
 * QuickHit KeyPrompt page.
 */
function Home(props: TTDataPropsType) {
    const getCurrentChampion = (): DbPlayer => {
        const players = props.players;
        players.sort((player1, player2) => {
            return player2.elo - player1.elo
        });

        return players[0];
    }

    const refreshContent = () => {
        // Set the store force refresh flag, alerting QHDataLoader to do a new fetch.
        props.setForceRefresh(true);
    }

    return (
        <div className="home">
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
                        <Link to={`${BASE_PATH()}${QuickHitPage.LADDER}`}>
                            <Icon name='trophy' circular/>
                            <Header.Content>Ladder</Header.Content>
                        </Link>
                    </Header>
                    <Header as={"h3"} icon>
                        <Link to={`${BASE_PATH()}${QuickHitPage.RECENT_GAMES}`}>
                            <Icon name='history' circular/>
                            <Header.Content>Recent games</Header.Content>
                        </Link>
                    </Header>
                    <NewGame players={props.players} onNewGameAdded={refreshContent} customModalOpenElement={
                        <Header as={"h3"} icon>
                            <Icon name='plus' circular/>
                            <Header.Content>Enter game</Header.Content>
                        </Header>
                    }/>
                    <NewPlayer onNewPlayerAdded={refreshContent} customModalOpenElement={
                        <Header as={"h3"} icon>
                            <Icon name='add user' circular/>
                            <Header.Content>Sign up</Header.Content>
                        </Header>
                    }/>
                </ButtonGroup>
            </Transition>
            <Transition visible={!props.loading} animation={"fly up"} duration={2000} unmountOnHide={true}>
                <div className={"champion-area"}>
                    <Header as={"h4"} inverted>
                        {props.players.length > 0 &&
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
