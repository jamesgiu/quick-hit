import React from 'react';
import './PlayerStatistics.css';
import {RouteComponentProps} from "react-router";
import {Header, Icon, Statistic, Transition} from "semantic-ui-react";
import {WinLoss} from "../../types/types";
import {TTDataPropsType} from "../../containers/shared";
import RecentGames from "../../containers/RecentGames";
import {getPlayersMap, getWinLossForPlayer} from "../QHDataLoader/QHDataLoader";

interface PlayerStatisticsParams {
    playerId: string
}

interface PlayerStatisticsProps extends RouteComponentProps<PlayerStatisticsParams>, TTDataPropsType {
}

function PlayerStatistics(props: PlayerStatisticsProps) {
    const player = getPlayersMap(props.players).get(props.match.params.playerId);
    const winLoss: WinLoss = player ? getWinLossForPlayer(player.id, props.matches) : {wins: 0, losses: 0};

    return (
        <div className="player-statistics">
            <Transition visible={!props.loading}>
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
                                  <Statistic label={"Rating"} value={player.elo}/>
                              </Statistic.Group>
                             <Statistic.Group className={"statistics-group"}>
                                <Statistic label={"Wins"} value={winLoss.wins} className={"wins"}/>
                                <Statistic label={"Losses"} value={winLoss.losses} className={"losses"}/>
                            </Statistic.Group>
                            <Statistic.Group horizontal className={"statistics-group"}>
                                <Statistic label={"W/L ratio"}
                                           value={`${Math.round(winLoss.wins / (winLoss.wins + winLoss.losses) * 100)}%`}/>
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
