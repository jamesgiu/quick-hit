import {Card, Icon} from "semantic-ui-react";
import React from "react";
import {DB_Player} from "../../../types/database/models";
import {WinLoss} from "../../../types/types";

interface PlayerCardProps {
    player: DB_Player,
    winLoss: WinLoss,
}
/**
 * QuickHit PlayerCard component.
 */
function PlayerCard(props: PlayerCardProps) {
    return (
        <Card as={"span"}>
            <Card.Content>
                <Card.Header>
                    <div>
                        <Icon name={props.player.icon} size={"big"}/>
                    </div>
                    {props.player.name}
                </Card.Header>
            </Card.Content>
            <Card.Content extra>
                <span>
                    Wins: {props.winLoss.wins} Losses: {props.winLoss.losses}
                </span>
            </Card.Content>
        </Card>
    )
}

export default PlayerCard;