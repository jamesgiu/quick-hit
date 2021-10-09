import React from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { getGraphStatsForPlayer } from "../QHDataLoader/QHDataLoader";
import { DbMatch, DbPlayer } from "../../types/database/models";
import { ELOGraphStats } from "../../types/types";

interface GraphParams {
    player: DbPlayer,
    matches: DbMatch[];
}

// eslint-disable-next-line
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`Date: ${label}`}</p>
                <p className="info">{`ELO: ${payload?.[0].value}`}</p>
            </div>
        );
    }

    return null;
};

export default function ELOGraph(props: GraphParams): JSX.Element {
    const graphStats: ELOGraphStats[] = getGraphStatsForPlayer(props.player.id, props.matches);

    return (
        <div>
            <div className={"elo-graph"}>
                <LineChart width={800} height={400} data={graphStats}
                           margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <XAxis dataKey={"date"} type={"category"} />
                    <YAxis yAxisId={"1"} />
                    <Line type={"monotone"} dataKey={"ELO"} stroke={"#8884d8"} yAxisId={"1"} />
                    <Tooltip content={<CustomTooltip />} />
                </LineChart>
            </div>
        </div>
    );
}
