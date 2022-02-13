import React, { useState } from "react";
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
import { fallDown as BurgerMenu } from "react-burger-menu";

interface WindowSize {
    width: number;
    height: number;
}

/**
 * QuickHit's navbar.
 */
function Navbar(): JSX.Element {
    const [windowSize, setWindowSize] = useState<WindowSize>({ width: window.innerWidth, height: window.innerWidth });
    const [burgerMenuOpen, setBurgerMenuOpen] = useState<boolean>(false);

    window.onresize = (): void => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const getLinks = (mobile: boolean): JSX.Element => {
        return (
            <Menu
                stackable
                inverted
                size={mobile ? "massive" : undefined}
                className={mobile ? "mobile-menu" : "desktop-menu"}
            >
                <Link to={`${BASE_PATH()}${QuickHitPage.HOME}`}>
                    <Menu.Item as={"a"} header className={"header"} onClick={(): void => setBurgerMenuOpen(false)}>
                        <Icon name={"table tennis"} size={"big"} />
                        <Icon name={"chevron right"} size={"tiny"} />
                        Quick<span className={"header-hit"}>Hit</span>
                    </Menu.Item>
                </Link>
                <Link to={`${BASE_PATH()}${QuickHitPage.HOME}`} onClick={(): void => setBurgerMenuOpen(false)}>
                    <Menu.Item as={"a"}>
                        <Icon name={"home"} />
                        Home
                    </Menu.Item>
                </Link>
                <Link to={`${BASE_PATH()}${QuickHitPage.LADDER}`} onClick={(): void => setBurgerMenuOpen(false)}>
                    <Menu.Item as={"a"}>
                        <Icon name={"list"} />
                        Ladder
                    </Menu.Item>
                </Link>
                <Link to={`${BASE_PATH()}${QuickHitPage.TOURNAMENT}`} onClick={(): void => setBurgerMenuOpen(false)}>
                    <Menu.Item as={"a"}>
                        <Icon name={"trophy"} />
                        Tournament
                    </Menu.Item>
                </Link>
                <Link to={`${BASE_PATH()}${QuickHitPage.HALL_OF_FALLEN}`} onClick={(): void => setBurgerMenuOpen(false)}>
                    <Menu.Item as={"a"}>
                        <Icon name={"users"} />
                        Hall of the fallen
                    </Menu.Item>
                </Link>
                <Link to={`${BASE_PATH()}${QuickHitPage.RECENT_GAMES}`} onClick={(): void => setBurgerMenuOpen(false)}>
                    <Menu.Item as={"a"}>
                        <Icon name={"history"} />
                        Recent games
                    </Menu.Item>
                </Link>
                <Menu.Menu position={"right"} onClick={(): void => setBurgerMenuOpen(false)}>
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
        );
    };

    return (
        <div className={"tt-navbar"}>
            {windowSize.width <= 800 ? (
                <div>
                    <Menu inverted size={"huge"}>
                        <Menu.Item as={"a"} header className={"header"}>
                            <Icon name={"sidebar"} size={"big"} />
                            Quick<span className={"header-hit"}>Hit</span>
                        </Menu.Item>
                        <BurgerMenu
                            isOpen={burgerMenuOpen}
                            onOpen={(): void => setBurgerMenuOpen(true)}
                            onClose={(): void => setBurgerMenuOpen(false)}
                            overlayClassName={"burger-overlay"}
                            burgerButtonClassName={"burger-button"}
                            styles={{
                                bmOverlay: {
                                    width: "200vw",
                                    height: "100vh",
                                },
                                bmBurgerBars: {
                                    width: "20px",
                                    height: "20px",
                                },
                            }}
                        >
                            {getLinks(true)}
                        </BurgerMenu>
                    </Menu>
                </div>
            ) : (
                <div>{getLinks(false)}</div>
            )}
        </div>
    );
}

export default Navbar;
