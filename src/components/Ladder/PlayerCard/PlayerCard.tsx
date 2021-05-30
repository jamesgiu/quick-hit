import {Card, Icon} from "semantic-ui-react";
import React from "react";
import {DB_Player} from "../../../types/database/models";
import {WinLoss} from "../../../types/types";
import "./PlayerCard.css";
import {QuickHitPage} from "../../../util/QuickHitPage";
import { Link } from "react-router-dom";

interface PlayerCardProps {
    player: DB_Player,
    winLoss?: WinLoss,
}
/**
 * QuickHit PlayerCard component.
 */
function PlayerCard(props: PlayerCardProps) {
    return (
        <Card as={"span"} className="player-card">
            <Card.Content>
                <Link to={QuickHitPage.STATISTICS.replace(":playerId", props.player.id)}>
                    <Card.Header>
                        <div>
                            <Icon name={props.player.icon} size={"big"}/>
                        </div>
                        {props.player.name}
                    </Card.Header>
                </Link>
            </Card.Content>
            <Card.Meta>
                {props.player.elo}
            </Card.Meta>
            {props.winLoss &&
            <Card.Content extra>
                <span>
                    Wins: {props.winLoss.wins} Losses: {props.winLoss.losses}
                </span>
            </Card.Content>
            }
        </Card>
    )
}

export default PlayerCard;