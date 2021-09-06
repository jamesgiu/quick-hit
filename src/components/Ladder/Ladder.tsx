import "./Ladder.css";
import { Button, Header, Icon, Table, Transition } from "semantic-ui-react";
import PlayerCard from "./PlayerCard/PlayerCard";
import NewEditPlayer from "../NewEditPlayer/NewEditPlayer";
import NewGame from "../../containers/NewGame";
import { getWinLossForPlayer } from "../QHDataLoader/QHDataLoader";
import { TTDataPropsTypeCombined } from "../../containers/shared";
import { BASE_PATH, QuickHitPage } from "../../util/QuickHitPage";
import { Link } from "react-router-dom";
import { ViewDispatchType } from "../../containers/Ladder/Ladder";
import { ViewStoreState } from "../../redux/types/ViewTypes";

export type LadderProps = ViewStoreState & TTDataPropsTypeCombined & ViewDispatchType;

/**
 * QuickHit Ladder page.
 */
function Ladder(props: LadderProps): JSX.Element {
    const renderPlayersAsCards = (): JSX.Element[] => {
        const playersLadder: JSX.Element[] = [];

        props.players.forEach((player) => {
            const winLoss = getWinLossForPlayer(player.id, props.matches);

            const playerCard = <PlayerCard player={player} winLoss={winLoss} />;

            // If we are hiding zero game players, then only push if they have played a game
            if (props.hideZeroGamePlayers) {
                if (winLoss.wins + winLoss.losses > 0) {
                    playersLadder.push(playerCard);
                }
            } else {
                playersLadder.push(playerCard);
            }
        });

        // Sorting the player items by elo.
        playersLadder.sort((player1, player2) => {
            return player2.props.player.elo - player1.props.player.elo;
        });

        return playersLadder;
    };

    const renderPlayersInTable = (): JSX.Element[] => {
        const playersLadder: JSX.Element[] = [];
        const playerTableRows: JSX.Element[] = [];

        const sortedPlayers = props.players.sort((player1, player2) => {
            return player2.elo - player1.elo;
        });

        sortedPlayers.forEach((player) => {
            const winLoss = getWinLossForPlayer(player.id, props.matches);
            let addPlayer = true;
            if (props.hideZeroGamePlayers && winLoss.losses + winLoss.wins == 0) {
                addPlayer = false;
            }
            if (addPlayer) {
                playerTableRows.push(
                    <Table.Row className={"player-row"}>
                        <Table.Cell className={"player-cell"}>
                            <Link
                                className={"player-row-link"}
                                to={`${BASE_PATH()}${QuickHitPage.STATISTICS.replace(":playerId", player.id)}`}
                            >
                                <span>
                                    <Icon name={player.icon} size={"small"} />
                                    {player.name}
                                </span>
                            </Link>
                        </Table.Cell>
                        <Table.Cell>{player.elo}</Table.Cell>
                        <Table.Cell>
                            {winLoss.wins}-{winLoss.losses}
                        </Table.Cell>
                    </Table.Row>
                );
            }
        });

        playersLadder.push(
            <Table unstackable celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Player</Table.HeaderCell>
                        <Table.HeaderCell>ELO</Table.HeaderCell>
                        <Table.HeaderCell>W-L</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{playerTableRows}</Table.Body>
            </Table>
        );
        return playersLadder;
    };

    const renderPlayers = (): JSX.Element[] => {
        if (props.showCards) {
            return renderPlayersAsCards();
        } else {
            return renderPlayersInTable();
        }
    };

    const refreshContent = (): void => {
        // Set the store force refresh flag, alerting QHDataLoader to do a new fetch.
        props.setForceRefresh(true);
    };

    return (
        <div className="players">
            <Header as={"h2"} icon>
                <Icon name="trophy" circular />
                <Header.Content>Ladder</Header.Content>
            </Header>
            <div className={"toggles"}>
                <Button
                    onClick={(): void => props.setHideZeroGamePlayers(!props.hideZeroGamePlayers)}
                    color={props.hideZeroGamePlayers ? "green" : "red"}
                >
                    {props.hideZeroGamePlayers ? (
                        <span>
                            <Icon name={"eye"} /> Show zero game players
                        </span>
                    ) : (
                        <span>
                            <Icon name={"eye slash"} /> Hide zero game players
                        </span>
                    )}
                </Button>
                <Button
                    onClick={(): void => props.setShowCards(!props.showCards)}
                    color={props.showCards ? "orange" : "yellow"}
                >
                    {props.showCards ? (
                        <span>
                            <Icon name={"table"} /> Show ladder table
                        </span>
                    ) : (
                        <span>
                            <Icon name={"address card"} /> Show player cards
                        </span>
                    )}
                </Button>
            </div>
            <Transition visible={!props.loading}>
                <span>
                    <span className={`players-area horizontal`}>{renderPlayers()}</span>
                    <div className={"new-buttons"}>
                        <NewEditPlayer onRequestMade={refreshContent} />
                        <NewGame />
                    </div>
                </span>
            </Transition>
        </div>
    );
}

export default Ladder;
