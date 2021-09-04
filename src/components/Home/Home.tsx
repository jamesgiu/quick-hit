import React from "react";
import "./Home.css";
import { Button, ButtonGroup, Header, Icon, Segment, Transition } from "semantic-ui-react";
import { Link } from "react-router-dom";
import NewGame from "../../containers/NewGame";
import NewEditPlayer from "../Ladder/NewEditPlayer/NewEditPlayer";
import PlayerCard from "../Ladder/PlayerCard/PlayerCard";
import { TTDataPropsTypeCombined } from "../../containers/shared";
import { DbHappyHour, DbPlayer } from "../../types/database/models";
import { BASE_PATH, QuickHitPage } from "../../util/QuickHitPage";

/**
 * QuickHit KeyPrompt page.
 */
function Home(props: TTDataPropsTypeCombined): JSX.Element {
    const getCurrentChampion = (): DbPlayer => {
        const players = props.players;
        players.sort((player1, player2) => {
            return player2.elo - player1.elo;
        });

        return players[0];
    };

    const refreshContent = (): void => {
        // Set the store force refresh flag, alerting QHDataLoader to do a new fetch.
        props.setForceRefresh(true);
    };

    return (
        <div className="home">
            <Transition transitionOnMount={true}>
                <Header as={"h2"} icon inverted className={"welcome-header"}>
                    <Icon name="table tennis" circular />
                    <div>Welcome to</div>
                    <div className={"quick-hit-splash"}>
                        <Icon name={"chevron right"} size={"tiny"} />
                        Quick<span className={"header-hit"}>Hit</span>
                    </div>
                    <Header.Subheader>A table tennis ELO-tracking application</Header.Subheader>
                </Header>
            </Transition>
            <Transition transitionOnMount={true}>
                <ButtonGroup horizontal className={"home-menu-buttons"}>
                    <Header as={"h3"} icon>
                        <Link to={`${BASE_PATH()}${QuickHitPage.LADDER}`}>
                            <Icon name="list" circular />
                            <Header.Content>Ladder</Header.Content>
                        </Link>
                    </Header>
                    <Header as={"h3"} icon>
                        <Link to={`${BASE_PATH()}${QuickHitPage.TOURNAMENT}`}>
                            <Icon name="trophy" circular />
                            <Header.Content>Tournament</Header.Content>
                        </Link>
                    </Header>
                    <Header as={"h3"} icon>
                        <Link to={`${BASE_PATH()}${QuickHitPage.RECENT_GAMES}`}>
                            <Icon name="history" circular />
                            <Header.Content>Recent games</Header.Content>
                        </Link>
                    </Header>
                    <NewGame
                        customModalOpenElement={
                            <Header as={"h3"} icon>
                                <Icon name="plus" circular />
                                <Header.Content>Enter game</Header.Content>
                            </Header>
                        }
                    />
                    <NewEditPlayer
                        onRequestMade={refreshContent}
                        customModalOpenElement={
                            <Header as={"h3"} icon>
                                <Icon name="add user" circular />
                                <Header.Content>Sign up</Header.Content>
                            </Header>
                        }
                    />
                </ButtonGroup>
            </Transition>
            <Segment inverted className={"github-area"}>
                <Header as={"h3"} icon circular inverted>
                    <Icon name="github" />
                </Header>
                <Header.Content>
                    QuickHit is an open source project made by{" "}
                    <a href={"https://github.com/jamesgiu/quick-hit/graphs/contributors"}>cool people</a>.
                </Header.Content>
                <ButtonGroup className={"github-buttons"}>
                    <a href={"https://github.com/jamesgiu/quick-hit#getting-started-with-firebase"}>
                        <Button color={"teal"}>Host it yourself</Button>
                    </a>
                    <a href={"https://github.com/jamesgiu/quick-hit/issues/new/choose"}>
                        <Button color={"red"}>Report an issue</Button>
                    </a>
                </ButtonGroup>
            </Segment>
            <Transition visible={!props.loading} animation={"fly up"} duration={2000} unmountOnHide={true}>
                <Segment inverted className={"champion-area"}>
                    <div>
                        {props.players.length > 0 && <PlayerCard player={getCurrentChampion()} />} is the current{" "}
                        <span className={"champion-text"}> champion </span>
                    </div>
                </Segment>
            </Transition>
            <Transition visible={!props.loading} animation={"fade"} duration={2000} unmountOnHide={true}>
                <span className={"happy-hour"}>
                    <Header>{props.happyHour?.multiplier}x happy hour!</Header>
                    <span>
                        Today's <span className={"happy-hour-highlight"}>happy hour</span> is starting at{" "}
                        <span className={"happy-hour-highlight"}>{renderDateString(props.happyHour)}</span>
                    </span>
                </span>
            </Transition>
        </div>
    );
}

const renderDateString = (happyHour: DbHappyHour): string => {
    const date = new Date();
    date.setHours(happyHour.hourStart, 0, 0);

    return date.toLocaleTimeString();
};

export default Home;
