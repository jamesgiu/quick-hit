import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { getGraphStatsForPlayer } from "../QHDataLoader/QHDataLoader";
import { DbMatch, DbPlayer } from "../../types/database/models";
import { ELOGraphStats } from "../../types/types";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { Accordion, Icon } from "semantic-ui-react";
import { useState } from "react";
import "./ELOGraph.css";

interface GraphParams {
    player: DbPlayer;
    matches: DbMatch[];
    players: DbPlayer[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>): JSX.Element | null => {
    if (active) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`Date: ${new Date(label).toLocaleString()}`}</p>
                <p className="info">{`ELO: ${payload?.[0].value}`}</p>
                <p className={"info"}>{payload?.[0].payload.matchStr}</p>
            </div>
        );
    }

    return null;
};

export default function ELOGraph(props: GraphParams): JSX.Element {
    const graphStats: ELOGraphStats[] = getGraphStatsForPlayer(props.player.id, props.matches, props.players);
    const minELO = Math.min(...graphStats.map((stat) => stat.ELO));
    const maxELO = Math.max(...graphStats.map((stat) => stat.ELO));

    const [showEloGraph, setShowEloGraph] = useState<boolean>(true);
    function toggleEloGraph(): void {
        setShowEloGraph(!showEloGraph);
    }

    return (
        <div>
            <Accordion className={"elo-graph-acc"}>
                <Accordion.Title active={showEloGraph} onClick={toggleEloGraph}>
                    <span className={"elo-graph-label"}>
                        <Icon name="dropdown" />
                        Elo/Time
                        <Icon name="line graph" />
                    </span>
                </Accordion.Title>
                <Accordion.Content active={showEloGraph}>
                    <div className={"elo-graph"}>
                        <ResponsiveContainer width={"80%"} height={"100%"}>
                            <LineChart data={graphStats}>
                                <XAxis
                                    dataKey={"date"}
                                    type={"category"}
                                    minTickGap={500}
                                    tickFormatter={(tickItem): string => new Date(tickItem).toLocaleString()}
                                />
                                <YAxis yAxisId={"1"} domain={[minELO - 50, maxELO + 50]} />
                                <Line type={"monotone"} dataKey={"ELO"} stroke={"#8884d8"} yAxisId={"1"} />
                                {graphStats.length > 1 && (
                                    <ReferenceLine
                                        yAxisId={"1"}
                                        y={maxELO}
                                        label={{ value: "All time high", fill: "white" }}
                                        stroke={"#21ba45"}
                                        strokeDasharray={"3 3"}
                                    />
                                )}
                                {graphStats.length > 1 && (
                                    <ReferenceLine
                                        yAxisId={"1"}
                                        y={minELO}
                                        label={{ value: "All time low", fill: "white" }}
                                        stroke={"red"}
                                        strokeDasharray={"3 3"}
                                    />
                                )}
                                <Tooltip content={<CustomTooltip />} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Accordion.Content>
            </Accordion>
        </div>
    );
}
