import React from 'react';
import './Navbar.css';
import {Menu} from "semantic-ui-react";
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {QuickHitPage} from "../../util/QuickHitPage";

/**
 * QuickHit's navbar.
 */
function Navbar() {
    return (
        <div className={"tt-navbar"}>
            <Menu stackable inverted>
                <Link to={QuickHitPage.HOME}>
                    <Menu.Item as={"a"} header className={"header"}>
                        <Icon name={"table tennis"} size={"big"}/>
                        <Icon name={"chevron right"} size={"tiny"}/>Quick<span className={"header-hit"}>HIT</span>
                    </Menu.Item>
                </Link>
                <Link to={QuickHitPage.HOME}>
                    <Menu.Item as={"a"}>
                        <Icon name={"home"}/>Home
                    </Menu.Item>
                </Link>
                <Link to={QuickHitPage.LADDER}>
                    <Menu.Item as={"a"}>
                        <Icon name={"numbered list"}/>Ladder
                    </Menu.Item>
                </Link>
                <Menu.Menu position={"right"}>
                    <Link to={QuickHitPage.PLAYERS}>
                        <Menu.Item as={"a"} icon={"user"}/>
                    </Link>
                </Menu.Menu>
            </Menu>
        </div>
    );
}

export default Navbar;