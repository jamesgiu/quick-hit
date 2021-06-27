import './PlayerStatistics.css';
import {RouteComponentProps} from "react-router";
import {Header, Icon, Statistic, Transition} from "semantic-ui-react";
import {ExtraPlayerStats} from "../../types/types";
import {TTDataPropsTypeCombined} from "../../containers/shared";
import RecentGames from "../../containers/RecentGames";
import {getExtraPlayerStats, getPlayersMap, getRecordAgainstPlayer} from "../QHDataLoader/QHDataLoader";
import PlayerCard from '../Ladder/PlayerCard/PlayerCard';
import NewEditPlayer from '../Ladder/NewEditPlayer/NewEditPlayer';

interface PlayerStatisticsParams {
    playerId: string
}

interface PlayerStatisticsProps extends RouteComponentProps<PlayerStatisticsParams>, TTDataPropsTypeCombined {
}

function PlayerStatistics(props: PlayerStatisticsProps) : JSX.Element {
    const playersMap = getPlayersMap(props.players);
    const player = playersMap.get(props.match.params.playerId);
    const extraStats: ExtraPlayerStats = player ? getExtraPlayerStats(player.id, props.matches) : {wins: 0, losses: 0, minELO: 0, maxELO: 0};
    const victim = extraStats.victim ? playersMap.get(extraStats.victim) : undefined;
    const nemesis = extraStats.nemesis ? playersMap.get(extraStats.nemesis) : undefined;

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
                        <Header.Content>
                            <div>
                                {player.name}
                                <NewEditPlayer editingPlayer={player}
                                               customModalOpenElement={
                                               <Icon name={"pencil"}
                                                  size={"tiny"}
                                                  className={"edit-icon"}/>
                                               }
                                               onRequestMade={() => props.setForceRefresh(true)}/>
                            </div>
                        </Header.Content>
                    </Header>
                      <div className={"player-stats-wrapper"}>
                              <Statistic.Group className={"statistics-group"}>
                                  <Statistic label={"Min rating"} value={extraStats.minELO} className={"minELO"}/>
                                  <Statistic label={"Rating"} value={player.elo}/>
                                  <Statistic label={"Max rating"} value={extraStats.maxELO} className={"maxELO"}/>
                              </Statistic.Group>
                             <Statistic.Group className={"statistics-group"}>
                                 <Statistic label={"Wins"} value={extraStats.wins} className={"wins"}/>
                                 <Statistic label={"Losses"} value={extraStats.losses} className={"losses"}/>
                                 <Statistic label={"W/L ratio"}
                                            value={`${Math.round(extraStats.wins / (extraStats.wins + extraStats.losses) * 100)}%`}/>
                                 <Statistic label={"Games played"} value={extraStats.wins + extraStats.losses}/>
                            </Statistic.Group>
                            <Statistic.Group className={"statistics-group"}>
                             <Statistic label={"Victim"}
                                        value={victim
                                            ? <PlayerCard player={victim}
                                                          winLoss={getRecordAgainstPlayer(player.id,
                                                              victim.id,
                                                              props.matches)}/>
                                            : <PlayerCard player={player}
                                                          winLoss={{wins: extraStats.wins, losses: extraStats.losses}}/>}
                                        className={"victim"}/>

                             <Statistic label={"Nemesis"}
                                        value={nemesis
                                            ? <PlayerCard player={nemesis}
                                                          winLoss={getRecordAgainstPlayer(player.id,
                                                              nemesis.id,
                                                              props.matches)}/>
                                            : <PlayerCard player={player}
                                                          winLoss={{wins: extraStats.wins, losses: extraStats.losses}}/>}
                                        className={"nemesis"}/>
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
