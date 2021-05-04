import React from 'react';
import './Ladder.css';
import {Header, Icon} from "semantic-ui-react";

/**
 * Ladder page for QuickHit.
 */
function Ladder() {
    return (
        <div className="ladder">
            <Header as={"h2"} icon>
                <Icon name='trophy' circular/>
                <Header.Content>Ladder</Header.Content>
            </Header>
        </div>
    );
}

export default Ladder;
