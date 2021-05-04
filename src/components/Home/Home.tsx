import React from 'react';
import './Home.css';
import {Header, Icon, Transition} from "semantic-ui-react";

/**
 * QuickHit Home page.
 */
function Home() {
    return (
        <div className="home">
            <Transition transitionOnMount={true}>
                <Header as={"h2"} icon inverted>
                    <Icon name='table tennis' circular/>
                    Welcome to <Icon name={"chevron right"} size={"tiny"}/>Quick
                    <span className={"header-hit"}>HIT</span>
                </Header>
            </Transition>
        </div>
    );
}

export default Home;
