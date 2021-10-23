import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { getGraphStatsForPlayer } from "../QHDataLoader/QHDataLoader";
import { DbMatch, DbPlayer } from "../../types/database/models";
import { ELOGraphStats } from "../../types/types";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface GraphParams {
    player: DbPlayer;
    matches: DbMatch[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>): JSX.Element | null => {
    if (active) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`Date: ${new Date(label).toLocaleString()}`}</p>
                <p className="info">{`ELO: ${payload?.[0].value}`}</p>
            </div>
        );
    }

    return null;
};

export default function ELOGraph(props: GraphParams): JSX.Element {
    const graphStats: ELOGraphStats[] = getGraphStatsForPlayer(props.player.id, props.matches);
    const minELO = Math.min(...graphStats.map((stat) => stat.ELO));
    const maxELO = Math.max(...graphStats.map((stat) => stat.ELO));

    return (
        <div>
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
                        <ReferenceLine
                            yAxisId={"1"}
                            y={maxELO}
                            label={{value: "All time high", fill: "white"}}
                            stroke={"green"}
                            strokeDasharray={"3 3"}
                        />
                        <ReferenceLine
                            yAxisId={"1"}
                            y={minELO}
                            label={{value: "All time low", fill: "white"}}
                            stroke={"red"}
                            strokeDasharray={"3 3"}
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
