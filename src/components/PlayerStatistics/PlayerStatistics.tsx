import "./PlayerStatistics.css";
import { RouteComponentProps } from "react-router";
import { Grid, Header, Icon, Placeholder, Popup, Statistic, Transition } from "semantic-ui-react";
import { ExtraPlayerStats } from "../../types/types";
import { TTDataPropsTypeCombined } from "../../containers/shared";
import RecentGames from "../../containers/RecentGames";
import {
    getExtraPlayerStats,
    getPlayersMap,
    getRecordAgainstPlayer,
    getWinLossForPlayer,
} from "../QHDataLoader/QHDataLoader";
import PlayerCard from "../Ladder/PlayerCard/PlayerCard";
import NewEditPlayer from "../NewEditPlayer/NewEditPlayer";
import AchievementFeed from "../../containers/AchievementFeed";
import ELOGraph from "./ELOGraph";
import { getELOString, isUnderPlacement } from "../../types/database/models";

interface PlayerStatisticsParams {
    playerId: string;
}

interface PlayerStatisticsProps extends RouteComponentProps<PlayerStatisticsParams>, TTDataPropsTypeCombined {}

function PlayerStatistics(props: PlayerStatisticsProps): JSX.Element {
    const playersMap = getPlayersMap(props.players);
    const player = playersMap.get(props.match.params.playerId);
    const extraStats: ExtraPlayerStats = player
        ? getExtraPlayerStats(player.id, props.matches)
        : { wins: 0, losses: 0, minELO: 0, maxELO: 0, formGuide: "" };
    const victim = extraStats.victim ? playersMap.get(extraStats.victim) : undefined;
    const nemesis = extraStats.nemesis ? playersMap.get(extraStats.nemesis) : undefined;

    return (
        <div className="player-statistics">
            <Transition visible={!props.loading}>
                {!player ? (
                    <span className={"error"}>Player {props.match.params.playerId} does not exist.</span>
                ) : (
                    <span>
                        <Header as={"h2"} icon>
                            <Icon name={player.icon} circular />
                            <Header.Content>
                                <div>
                                    {player.name}
                                    <NewEditPlayer
                                        editingPlayer={player}
                                        customModalOpenElement={
                                            <Icon name={"pencil"} size={"tiny"} className={"edit-icon"} />
                                        }
                                        onRequestMade={(): void => props.setForceRefresh(true)}
                                    />
                                </div>
                            </Header.Content>
                        </Header>
                        <div className={"player-stats-wrapper"}>
                            {isUnderPlacement(extraStats.wins + extraStats.losses) ? (
                                <Placeholder inverted={true} fluid={true} className={"elo-placeholder"}>
                                    {getELOString(extraStats.wins + extraStats.losses, player.elo)}
                                </Placeholder>
                            ) : (
                                <ELOGraph player={player} matches={props.matches} players={props.players} />
                            )}
                            <div className={"tournament-win-count"}>
                                <Popup
                                    content={"Tournament wins"}
                                    trigger={
                                        <span>
                                            <Icon name={"trophy"} color={"yellow"} /> x {player.tournamentWins ?? 0}
                                        </span>
                                    }
                                    position={"bottom center"}
                                />
                                <Popup
                                    content={"Tournament runner ups"}
                                    trigger={
                                        <span>
                                            <Icon name={"trophy"} color={"grey"} /> x {player.tournamentRunnerUps ?? 0}
                                        </span>
                                    }
                                    position={"bottom center"}
                                />
                            </div>
                            {!isUnderPlacement(extraStats.wins + extraStats.losses) && (
                                <Statistic.Group className={"statistics-group"}>
                                    <Statistic label={"Min rating"} value={extraStats.minELO} className={"min-elo"} />
                                    <Statistic label={"Rating"} value={player.elo} />
                                    <Statistic label={"Max rating"} value={extraStats.maxELO} className={"max-elo"} />
                                </Statistic.Group>
                            )}
                            <Statistic.Group className={"statistics-group"}>
                                <Statistic label={"Wins"} value={extraStats.wins} className={"wins"} />
                                <Statistic label={"Losses"} value={extraStats.losses} className={"losses"} />
                                <Statistic
                                    label={"W/L ratio"}
                                    value={`${Math.round(
                                        (extraStats.wins / (extraStats.wins + extraStats.losses)) * 100
                                    )}%`}
                                />
                                <Statistic label={"Games played"} value={extraStats.wins + extraStats.losses} />
                            </Statistic.Group>
                            <Statistic.Group className={"statistics-group"}>
                                <Statistic
                                    label={"Victim"}
                                    value={
                                        victim ? (
                                            <PlayerCard
                                                player={victim}
                                                winLoss={getRecordAgainstPlayer(player.id, victim.id, props.matches)}
                                                matchesPlayed={getWinLossForPlayer(victim.id, props.matches).matches}
                                            />
                                        ) : (
                                            <PlayerCard
                                                player={player}
                                                winLoss={{
                                                    wins: extraStats.wins,
                                                    losses: extraStats.losses,
                                                    formGuide: extraStats.formGuide,
                                                    matches: extraStats.wins + extraStats.losses,
                                                }}
                                            />
                                        )
                                    }
                                    className={"victim"}
                                />

                                <Statistic
                                    label={"Nemesis"}
                                    value={
                                        nemesis ? (
                                            <PlayerCard
                                                player={nemesis}
                                                winLoss={getRecordAgainstPlayer(player.id, nemesis.id, props.matches)}
                                                matchesPlayed={getWinLossForPlayer(nemesis.id, props.matches).matches}
                                            />
                                        ) : (
                                            <PlayerCard
                                                player={player}
                                                winLoss={{
                                                    wins: extraStats.wins,
                                                    losses: extraStats.losses,
                                                    formGuide: extraStats.formGuide,
                                                    matches: extraStats.wins + extraStats.losses,
                                                }}
                                            />
                                        )
                                    }
                                    className={"nemesis"}
                                />
                            </Statistic.Group>
                        </div>
                        <Grid columns={2}>
                            <Grid.Column>
                                <RecentGames focusedPlayerId={player.id} />
                            </Grid.Column>
                            <Grid.Column>
                                <AchievementFeed focusedPlayerId={player.id} />
                            </Grid.Column>
                        </Grid>
                    </span>
                )}
            </Transition>
        </div>
    );
}

export default PlayerStatistics;
