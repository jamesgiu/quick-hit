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

    useEffect(() => {
        const retirees = props.players.filter((player) => player.retired === true);
        retirees.push(...(props.doublesPairs.filter((doublesPair) => doublesPair.retired === true) as DbPlayer[]));
        setRetirees(retirees);
    }, [props.players, props.doublesPairs]);

    const renderItems = (): JSX.Element[] => {
        const retireeItems: JSX.Element[] = [];

        retirees.forEach((retiree) => {
            const extras = getExtraPlayerStats(retiree.id, props.matches);
            retireeItems.push(
                <Link to={`${BASE_PATH()}${QuickHitPage.STATISTICS.replace(":playerId", retiree.id)}`}>
                    <Item
                        image={<Icon name={retiree.icon} />}
                        header={
                            <Header as={"h2"} className={"retiree-header"}>
                                {retiree.name}
                            </Header>
                        }
                        meta={
                            <Statistic.Group size={"small"}>
                                <Statistic label={"Min ELO"} value={extras.minELO} className={"min-elo"} />
                                <Statistic label={"Final ELO"} value={retiree.elo} />
                                <Statistic label={"Max ELO"} value={extras.maxELO} className={"max-elo"} />
                            </Statistic.Group>
                        }
                        description={
                            <span>
                                <Icon name={"trophy"} color={"yellow"} /> x {retiree.tournamentWins ?? 0}
                                <Icon name={"trophy"} color={"grey"} /> x {retiree.tournamentRunnerUps ?? 0}
                            </span>
                        }
                    ></Item>
                </Link>
            );
        });

        return retireeItems;
    };

    return (
        <div className={"hall-container"}>
            <Header as={"h2"} icon>
                <Icon name="group" circular />
                <Header.Content>Hall Of The Fallen</Header.Content>
            </Header>
            {retirees.length > 0 ? (
                <div>
                    <Item.Group className={"retiree-items-group"}>{renderItems()}</Item.Group>
                </div>
            ) : (
                <div>Players that are retired will appear on this page. Let's hope it stays empty!</div>
            )}
        </div>
    );
}

export default HallOfFallen;
