import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header, Icon, Item, Statistic } from "semantic-ui-react";
import { HallOfFallenReduxProps } from "../../containers/HallOfFallen/HallOfFallen";
import { TTRefreshDispatchType } from "../../containers/shared";
import { DbPlayer } from "../../types/database/models";
import { BASE_PATH, QuickHitPage } from "../../util/QuickHitPage";
import { getExtraPlayerStats } from "../QHDataLoader/QHDataLoader";
import "./HallOfFallen.css";

/**
 * HallOfFallen component in QuickHit.
 */
function HallOfFallen(props: HallOfFallenReduxProps & TTRefreshDispatchType): JSX.Element {
    const [retirees, setRetirees] = useState<DbPlayer[]>([]);

    useEffect(() => setRetirees(props.players.filter(player => player.retired === true)), [props.players]);

    const renderItems = (): JSX.Element[] => {
        const retireeItems: JSX.Element[] = [];

        retirees.forEach(retiree => {
            const extras = getExtraPlayerStats(retiree.id, props.matches);
            retireeItems.push(
                <Link to={`${BASE_PATH()}${QuickHitPage.STATISTICS.replace(":playerId", retiree.id)}`}>
                    <Item image={<Icon name={retiree.icon}/>}
                          header={<Header as={"h2"} className={"retiree-header"}>{retiree.name}</Header>}
                          meta={<Statistic.Group size={"small"}>
                                    <Statistic label={"Min ELO"} value={extras.minELO} className={"min-elo"} />
                                    <Statistic label={"Final ELO"} value={retiree.elo} />
                                    <Statistic label={"Max ELO"} value={extras.maxELO} className={"max-elo"} />
                                </Statistic.Group>}
                          description={<span>
                                <Icon name={"trophy"} color={"yellow"} /> x {retiree.tournamentWins ?? 0}
                                <Icon name={"trophy"} color={"grey"} /> x {retiree.tournamentRunnerUps ?? 0}
                            </span>}
                    />
                </Link>
            );
        });

        return retireeItems;
    };

    return (
        <div className={"hall-container"}>
            <Header as={"h1"} color={"orange"}>Hall Of The Fallen</Header>
            <Item.Group className={"retiree-items-group"}>
                {renderItems()}
            </Item.Group>
        </div>
    );
}

export default HallOfFallen;
