import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getGraphStatsForPlayer } from "../QHDataLoader/QHDataLoader";
import { DbMatch, DbPlayer } from "../../types/database/models";
import { ELOGraphStats } from "../../types/types";

interface GraphParams {
    player: DbPlayer;
    matches: DbMatch[];
}

// eslint-disable-next-line
const CustomTooltip = ({ active, payload, label }: any): JSX.Element | null => {
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
    const minELO = Math.min(...graphStats.map((stat) => stat.ELO));
    const maxELO = Math.max(...graphStats.map((stat) => stat.ELO));

    return (
        <div>
            <div className={"elo-graph"}>
                <ResponsiveContainer width={"80%"} height={"100%"}>
                    <LineChart data={graphStats}>
                        <XAxis dataKey={"date"} type={"category"} />
                        <YAxis yAxisId={"1"} domain={[minELO - 50, maxELO + 50]} />
                        <Line type={"monotone"} dataKey={"ELO"} stroke={"#8884d8"} yAxisId={"1"} />
                        <Tooltip content={<CustomTooltip />} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
