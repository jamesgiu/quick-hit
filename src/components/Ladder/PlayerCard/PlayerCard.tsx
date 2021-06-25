import {Card, Icon} from "semantic-ui-react";
import React from "react";
import "./PlayerCard.css";
import {Link} from "react-router-dom";
import {DbPlayer} from "../../../types/database/models";
import {WinLoss} from "../../../types/types";
import {BASE_PATH, QuickHitPage} from "../../../util/QuickHitPage";



interface PlayerCardProps {
    player: DbPlayer,
    winLoss?: WinLoss,
}
/**
 * QuickHit PlayerCard component.
 */
function PlayerCard(props: PlayerCardProps): JSX.Element {
    return (
        <Card as={"span"} className="player-card">
            <Card.Content>
                <Link to={`${BASE_PATH()}${QuickHitPage.STATISTICS.replace(":playerId", props.player.id)}`}>
                    <Card.Header>
                        <div>
                            <Icon name={props.player.icon} size={"big"}/>
                        </div>
                        {props.player.name}
                    </Card.Header>
                </Link>
            </Card.Content>
            <Card.Meta>
            </Card.Meta>
            {props.winLoss &&
            <Card.Content extra>
                <div>
                    {props.player.elo}
                </div>
                <span>
                    Wins: {props.winLoss.wins} Losses: {props.winLoss.losses}
                </span>
            </Card.Content>
            }
        </Card>
    )
}

export default PlayerCard;