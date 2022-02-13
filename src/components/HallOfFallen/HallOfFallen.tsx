import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header, Icon, Item } from "semantic-ui-react";
import { HallOfFallenReduxProps } from "../../containers/HallOfFallen/HallOfFallen";
import { TTRefreshDispatchType } from "../../containers/shared";
import { DbPlayer } from "../../types/database/models";
import { BASE_PATH, QuickHitPage } from "../../util/QuickHitPage";
import { getExtraPlayerStats } from "../QHDataLoader/QHDataLoader";
import "./HallOfFallen.css";

/**
 * HallOfFallen component in QuickHit.
 * 
 * TODO Needs styling.
 * TODO Maybe change link to cover whole item once styled.
 * TODO Music?
 */
function HallOfFallen(props: HallOfFallenReduxProps & TTRefreshDispatchType): JSX.Element {
    const [retirees, setRetirees] = useState<DbPlayer[]>([]);

    useEffect(() => {
        setRetirees(props.players.filter(player => player.retired === true));
    }, props.players);

    const renderItems = (): JSX.Element[] => {
        const retireeItems: JSX.Element[] = [];

        retirees.forEach(retiree => {
            const extras = getExtraPlayerStats(retiree.id, props.matches);
            retireeItems.push(
                <Item image={<Icon name={retiree.icon}/>}
                    header={<Link
                        className={"player-row-link"}
                        to={`${BASE_PATH()}${QuickHitPage.STATISTICS.replace(":playerId", retiree.id)}`}
                    > {retiree.name} </Link>}
                    meta={`Final ELO: ${retiree.elo}, max: ${extras.maxELO}, min: ${extras.minELO}`}
                    description={<span>
                        <Icon name={"trophy"} color={"yellow"} /> x {retiree.tournamentWins ?? 0}
                        <Icon name={"trophy"} color={"grey"} /> x {retiree.tournamentRunnerUps ?? 0}
                    </span>} />
            );
        });

        return retireeItems;
    };

    return (
        <div>
            <Header as={"h1"} color={"orange"}>Hall Of The Fallen</Header>
            <Item.Group>
                {renderItems()}
            </Item.Group>
        </div>
    );
}

export default HallOfFallen;
