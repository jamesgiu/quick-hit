import { Card, Icon } from "semantic-ui-react";
import React from "react";
import "./PlayerCard.css";
import { Link } from "react-router-dom";
import {DbPlayer, getELOString} from "../../../types/database/models";
import { WinLoss } from "../../../types/types";
import { BASE_PATH, QuickHitPage } from "../../../util/QuickHitPage";
import { NUM_OF_FORM_GUIDE_MATCHES } from "../Ladder";

interface PlayerCardProps {
    player: DbPlayer;
    winLoss?: WinLoss;
}
/**
 * QuickHit PlayerCard component.
 */
function PlayerCard(props: PlayerCardProps): JSX.Element {
    const formStr =
        props.winLoss && props.winLoss.formGuide.substr(0, NUM_OF_FORM_GUIDE_MATCHES).split("").reverse().join("");

    return (
        <Card as={"span"} className="player-card">
            <Card.Content>
                <Link to={`${BASE_PATH()}${QuickHitPage.STATISTICS.replace(":playerId", props.player.id)}`}>
                    <Card.Header className="player-card-header">
                        <div>
                            <Icon name={props.player.icon} size={"big"} />
                        </div>
                        {props.player.name}
                    </Card.Header>
                </Link>
            </Card.Content>
            {props.winLoss && (
                <Card.Content extra className="extras">
                    <div>{getELOString(props.winLoss.wins + props.winLoss.losses, props.player.elo)}</div>
                    <span>
                        Wins: {props.winLoss.wins} Losses: {props.winLoss.losses}
                    </span>
                    <div>Form: {formStr !== "" ? formStr : "N/A"}</div>
                </Card.Content>
            )}
        </Card>
    );
}

export default PlayerCard;
