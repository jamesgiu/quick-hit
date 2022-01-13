import React from "react";
import "./Home.css";
import { Button, ButtonGroup, Header, Icon, Segment, Transition } from "semantic-ui-react";
import { Link } from "react-router-dom";
import NewGame from "../../containers/NewGame";
import NewEditPlayer from "../NewEditPlayer/NewEditPlayer";
import PlayerCard from "../Ladder/PlayerCard/PlayerCard";
import { TTDataPropsTypeCombined } from "../../containers/shared";
import { DbHappyHour, DbPlayer } from "../../types/database/models";
import { BASE_PATH, QuickHitPage } from "../../util/QuickHitPage";
import RecentGamesTicker from "../RecentGames/RecentGamesTicker/RecentGamesTicker";
import { turnMatchIntoFeedItems } from "../RecentGames/RecentGames";
import AnimatedLogo from "./AnimatedLogo/AnimatedLogo";

const SVG_WAVE = (
    <svg viewBox="0 -30 500 80" width="100%" height="50" preserveAspectRatio="none" className={"svg-wave"}>
        <path
            transform="translate(0, -15)"
            d="M0,2 c30,-22 240,0 350,18 c90,17 230,7.5 350,-20 v50 h-700"
            fill="rgba(255,69,0,0.5)"
        />
        <path d="M0,2 c30,-18 230,-12 350,7 c80,13 230,17 350,-5 v100 h-700z" fill="#1b1c1d" />
    </svg>
);

const SVG_WAVE_BOTTOM = (
    <svg viewBox="0 -30 80 500" width="100%" height="50" preserveAspectRatio="none" className={"svg-wave-bottom"}>
        <path d="M0,5 c60,-18 230,-12 350,7 c80,13 230,17 120,-10 v100 h-700z" fill="#1b1c1d" />
        <path
            transform="translate(0, -30)"
            d="M0,5 c100,-22 100,0 180,18 c90,3 80,3 180,-20 v50 h-700"
            fill="rgba(255,69,0,0.5)"
        />
    </svg>
);

/**
 * QuickHit Home page.
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
            <Transition visible={props.matches.length > 1} animation={"fade up"} duration={2000} unmountOnHide={true}>
                <div className={"feed-area-wrapper"}>
                    <RecentGamesTicker feedItems={turnMatchIntoFeedItems(props.matches, props.players, 0, 10)} />
                    <ul className={"instance-title"}>{`${props.chosenInstance?.name}`}</ul>
                </div>
            </Transition>
            <AnimatedLogo />
            <Transition transitionOnMount={true}>
                <Header as={"h2"} icon inverted className={"welcome-header"}>
                    <span className={"welcome-to-text"}>Welcome to</span>
                    <div className={"quick-hit-splash"}>
                        <Icon name={"chevron right"} size={"tiny"} />
                        Quick<span className={"header-hit"}>Hit</span>
                    </div>
                    <span className={"welcome-to-text"}>A table tennis ELO-tracking application</span>
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
            {SVG_WAVE}
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
            {SVG_WAVE_BOTTOM}
            <Transition visible={!props.loading} animation={"fade up"} duration={2000} unmountOnHide={true}>
                <Segment inverted className={"champion-area"}>
                    <div>
                        {props.players.length > 0 && <PlayerCard player={getCurrentChampion()} />} is the current{" "}
                        <span className={"champion-text"}> champion </span>
                    </div>
                </Segment>
            </Transition>
            <Transition visible={!props.loading} animation={"fade up"} duration={2000} unmountOnHide={true}>
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
