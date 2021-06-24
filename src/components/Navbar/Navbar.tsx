import React from 'react';
import './Navbar.css';
import {Icon, Menu} from "semantic-ui-react";
import {Link} from 'react-router-dom';
import {BASE_PATH, QuickHitPage} from "../../util/QuickHitPage";
import NewPlayer from "../Ladder/NewPlayer/NewPlayer";
import KeyPrompt from "../../containers/KeyPrompt";

/**
 * QuickHit's navbar.
 */
function Navbar() : JSX.Element {
    return (
        <div className={"tt-navbar"}>
            <Menu stackable inverted>
                <Link to={`${BASE_PATH()}${QuickHitPage.HOME}`}>
                    <Menu.Item as={"a"} header className={"header"}>
                        <Icon name={"table tennis"} size={"big"}/>
                        <Icon name={"chevron right"} size={"tiny"}/>Quick<span className={"header-hit"}>HIT</span>
                    </Menu.Item>
                </Link>
                <Link to={`${BASE_PATH()}${QuickHitPage.HOME}`}>
                    <Menu.Item as={"a"}>
                        <Icon name={"home"}/>Home
                    </Menu.Item>
                </Link>
                <Link to={`${BASE_PATH()}${QuickHitPage.LADDER}`}>
                    <Menu.Item as={"a"}>
                        <Icon name={"trophy"}/>Ladder
                    </Menu.Item>
                </Link>
                <Link to={`${BASE_PATH()}${QuickHitPage.RECENT_GAMES}`}>
                    <Menu.Item as={"a"}>
                        <Icon name={"history"}/>Recent games
                    </Menu.Item>
                </Link>
                <Menu.Menu position={"right"}>
                    <NewPlayer customModalOpenElement={<Menu.Item as={"a"} icon={"user plus"}/>}/>
                    <KeyPrompt/>
                </Menu.Menu>
            </Menu>
        </div>
    );
}

export default Navbar;