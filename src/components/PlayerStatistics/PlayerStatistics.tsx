import React, {useState} from 'react';
import './PlayerStatistics.css';
import {RouteComponentProps} from "react-router";
import QHDataLoader, {getWinLossForPlayer, LoaderData} from "../QHDataLoader/QHDataLoader";
import {DB_Player} from "../../types/database/models";
import {Header, Icon, Statistic, Transition} from "semantic-ui-react";
import RecentGames from "../RecentGames/RecentGames";
import {WinLoss} from "../../types/types";

interface PlayerStatisticsParams {
    playerId: string
}

function PlayerStatistics(props: RouteComponentProps<PlayerStatisticsParams>) {
    const [loaderData, setLoaderData] = useState<LoaderData>({playersMap: new Map<string, DB_Player>(), matches: [], loading: true});

    const receiveDataFromLoader = (data: LoaderData) => {
        setLoaderData(data);
    }

    const player = loaderData.playersMap.get(props.match.params.playerId);
    const winLoss : WinLoss = player ? getWinLossForPlayer(player.id, loaderData.matches) : {wins: 0, losses: 0};

    return (
        <div className="player-statistics">
            <QHDataLoader dataReceivedCallback={receiveDataFromLoader}/>
            <Transition visible={!loaderData.loading}>
            {
            !player ?
                <span className={"error"}>
                    Player {props.match.params.playerId} does not exist.
                </span>
            :
                <span>
                    <Header as={"h2"} icon>
                        <Icon name={player.icon} circular/>
                        <Header.Content>{player.name}</Header.Content>
                    </Header>
                      <div className={"player-stats-wrapper"}>
                             <Statistic.Group className={"statistics-group"}>
                                <Statistic label={"Wins"} value={winLoss.wins} className={"wins"}/>
                                <Statistic label={"Losses"} value={winLoss.losses} className={"losses"}/>
                            </Statistic.Group>
                            <Statistic.Group horizontal className={"statistics-group"}>
                                <Statistic label={"W/L ratio"} value={`${(winLoss.wins / winLoss.wins + winLoss.losses) * 100}%`}/>
                                <Statistic label={"Games played"} value={winLoss.wins + winLoss.losses}/>
                            </Statistic.Group>
                        </div>
                    <RecentGames focusedPlayerId={player.id}/>
                </span>
            }
            </Transition>
        </div>
    );
}

export default PlayerStatistics;
