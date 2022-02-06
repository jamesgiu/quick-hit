import { DbMatch } from "../../../types/database/models";
import HeatMap, { HeatMapValue } from "@uiw/react-heat-map";
import { Popup } from "semantic-ui-react";
import React from "react";
import "./RecentGamesStatistics.css";

interface RecentGamesStatisticsProps {
    matches: DbMatch[];
}

function RecentGamesStatistics(props: RecentGamesStatisticsProps): JSX.Element {
    // Returns as yyyy/mm/dd
    const formatDate = (date: Date): string => {
        const splitDate = date.toLocaleString().split(",")[0].split("/");
        return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
    };

    // Time from now minus 1 year
    const getStartDate = (): Date => {
        const dateNow = new Date(Date.now());
        const month =
            dateNow.getMonth().toString().length === 1 ? `0${dateNow.getMonth() + 1}` : dateNow.getMonth() + 1;
        return new Date(`${dateNow.getFullYear() - 1}-${month}-${dateNow.getDate()} 00:00:00.000Z`);
    };

    const getMatchesByDay = (): HeatMapValue[] => {
        // Sort list from newest to oldest
        const sortedMatches = props.matches.sort((matchA, matchB) => {
            return new Date(matchB.date).getTime() - new Date(matchA.date).getTime();
        });

        const matchesByDay: HeatMapValue[] = [];

        if (props.matches.length > 0) {
            let currentDate = formatDate(new Date(sortedMatches[0].date));
            let count = 0;

            sortedMatches.forEach((match) => {
                if (match.date) {
                    const nextDate = formatDate(new Date(match.date));
                    if (currentDate === nextDate) {
                        // Same day, so increment the count.
                        count++;
                    } else {
                        // Day finished, so push this into matchesByDay.
                        matchesByDay.push({ date: currentDate, count, content: "" });
                        // Reset the count and currentDate, as we're on another day now.
                        currentDate = nextDate;
                        count = 0;
                    }
                }
            });

            // After completing the loop, add the last date's results to the matchesByDay if it is different.
            if (currentDate !== formatDate(new Date(sortedMatches[0].date))) {
                matchesByDay.push({ date: currentDate, count, content: "" });
            }
        }
        return matchesByDay;
    };

    return (
        <div className={"recent-games-statistics-wrapper"}>
            {props.matches.length > 0 && (
                <HeatMap
                    value={getMatchesByDay()}
                    rectSize={13}
                    height={"100%"}
                    rectProps={{ rx: 5 }}
                    legendCellSize={20}
                    startDate={getStartDate()}
                    endDate={new Date(new Date(Date.now()))}
                    style={{ color: "darkorange" }}
                    panelColors={{
                        0: "#f4decd",
                        2: "#f8ccb1",
                        4: "#ea9c7d",
                        10: "#f8613d",
                        20: "#e53e19",
                        30: "#ab2003",
                    }}
                    rectRender={(props, data): JSX.Element => {
                        return (
                            <Popup
                                content={
                                    <div>
                                        <div>Date: {`${new Date(data.date).toDateString()}`}</div>
                                        <div>Games played: {`${data.count || 0}`}</div>
                                    </div>
                                }
                                trigger={<rect {...props} />}
                            />
                        );
                    }}
                />
            )}
        </div>
    );
}

export default RecentGamesStatistics;
