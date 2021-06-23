import React from 'react';
import './NotFound.css';
import {Header, Icon} from "semantic-ui-react";

function NotFound() : JSX.Element {
    return (
        <div className="not-found">
            <Header as={"h2"} icon>
                <Icon name='warning' circular/>
                <Header.Content>Page not found</Header.Content>
            </Header>
        </div>
    );
}

export default NotFound;
