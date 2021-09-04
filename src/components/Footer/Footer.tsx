import React from "react";
import "./Footer.css";
import { Icon } from "semantic-ui-react";

/**
 * Footer component in QuickHit.
 */
function Footer(): JSX.Element {
    return (
        <div className="footer">
            Copyright (c) 2021 quick-hit
            <span className={"report-issue"}>
                <a href={"https://github.com/jamesgiu/quick-hit"}>
                    <Icon name={"github"} color={"orange"} size={"large"} />
                </a>
                <a href={"https://github.com/jamesgiu/quick-hit/issues/new/choose"}>
                    <Icon name={"warning circle"} color={"red"} size={"large"} />
                </a>
            </span>
        </div>
    );
}

export default Footer;
