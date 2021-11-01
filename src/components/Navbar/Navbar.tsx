import React from "react";
import "./Navbar.css";
import { Icon, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { BASE_PATH, QuickHitPage } from "../../util/QuickHitPage";
import NewEditPlayer from "../NewEditPlayer/NewEditPlayer";
import KeyPrompt from "../../containers/KeyPrompt";
import NewGame from "../../containers/NewGame";
import Settings from "../../containers/Settings";
import Chat from "../../containers/Chat/Chat";
import Comparator from "../../containers/Comparator";

/**
 * QuickHit's navbar.
 */
function Navbar(): JSX.Element {
    return (
        <div className={"tt-navbar"}>
            <Menu stackable inverted>
                <Link to={`${BASE_PATH()}${QuickHitPage.HOME}`}>
                    <Menu.Item as={"a"} header className={"header"}>
                        <Icon name={"table tennis"} size={"big"} />
                        <Icon name={"chevron right"} size={"tiny"} />
                        Quick<span className={"header-hit"}>Hit</span>
                    </Menu.Item>
                </Link>
                <Link to={`${BASE_PATH()}${QuickHitPage.HOME}`}>
                    <Menu.Item as={"a"}>
                        <Icon name={"home"} />
                        Home
                    </Menu.Item>
                </Link>
                <Link to={`${BASE_PATH()}${QuickHitPage.LADDER}`}>
                    <Menu.Item as={"a"}>
                        <Icon name={"list"} />
                        Ladder
                    </Menu.Item>
                </Link>
                <Link to={`${BASE_PATH()}${QuickHitPage.TOURNAMENT}`}>
                    <Menu.Item as={"a"}>
                        <Icon name={"trophy"} />
                        Tournament
                    </Menu.Item>
                </Link>
                <Link to={`${BASE_PATH()}${QuickHitPage.RECENT_GAMES}`}>
                    <Menu.Item as={"a"}>
                        <Icon name={"history"} />
                        Recent games
                    </Menu.Item>
                </Link>
                <Menu.Menu position={"right"}>
                    <Chat />
                    <NewEditPlayer customModalOpenElement={<Menu.Item as={"a"} icon={"user plus"} />} />
                    <NewGame
                        customModalOpenElement={
                            <Menu.Item as={"a"}>
                                <span className={"new-game-icon-navbar"}>
                                    <Icon name={"game"} />
                                    <Icon name={"plus"} size={"tiny"} />
                                </span>
                            </Menu.Item>
                        }
                    />
                    <Comparator />
                    <Settings />
                    <KeyPrompt />
                </Menu.Menu>
            </Menu>
        </div>
    );
}

export default Navbar;
