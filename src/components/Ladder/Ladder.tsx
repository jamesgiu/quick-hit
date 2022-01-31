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
import {DbPlayer, getELOString, isUnderPlacement} from "../../types/database/models";

export type LadderProps = ViewStoreState & TTDataPropsTypeCombined & ViewDispatchType;
export const NUM_OF_FORM_GUIDE_MATCHES = 5;

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
            if (props.hideUnplacedPlayers) {
                if (!isUnderPlacement(winLoss.wins + winLoss.losses)) {
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

        const unplacedPlayerRows = [];

        for (let i = 0; i < sortedPlayers.length; i++) {
            const player = sortedPlayers[i];
            const winLoss = getWinLossForPlayer(player.id, props.matches);
            let addPlayer = true;

            if (props.hideUnplacedPlayers && isUnderPlacement(winLoss.wins + winLoss.losses)) {
                addPlayer = false;
            }

            if (addPlayer) {
                const formStr =
                    winLoss && winLoss.formGuide.substr(0, NUM_OF_FORM_GUIDE_MATCHES).split("").reverse().join("");

                const row = <Table.Row className={"player-row"}>
                    <Table.Cell className={"player-cell"}>
                        <Link
                            className={"player-row-link"}
                            to={`${BASE_PATH()}${QuickHitPage.STATISTICS.replace(":playerId", player.id)}`}
                        >
                                <span>
                                    {generateLadderTrendIcon(player, i, sortedPlayers)}
                                    <Icon name={player.icon} size={"small"} />
                                    {player.name}
                                </span>
                        </Link>
                    </Table.Cell>
                    <Table.Cell>{getELOString(winLoss.wins + winLoss.losses, player.elo)}</Table.Cell>
                    <Table.Cell>
                        {winLoss.wins}-{winLoss.losses}
                    </Table.Cell>
                    <Table.Cell>{formStr !== "" ? formStr : "N/A"}</Table.Cell>
                </Table.Row>

                if (isUnderPlacement(winLoss.wins + winLoss.losses)) {
                    unplacedPlayerRows.push(row);
                } else {
                    playerTableRows.push(row);
                }
            }
        }

        playersLadder.push(
            <Table unstackable celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Player</Table.HeaderCell>
                        <Table.HeaderCell>ELO</Table.HeaderCell>
                        <Table.HeaderCell>W-L</Table.HeaderCell>
                        <Table.HeaderCell>Form</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{playerTableRows}{unplacedPlayerRows}</Table.Body>
            </Table>
        );
        return playersLadder;
    };

    const generateLadderTrendIcon = (
        player: DbPlayer,
        positionOnLadder: number,
        sortedPlayers: DbPlayer[]
    ): JSX.Element => {
        let mostRecentMatch;
        let iconToReturn: JSX.Element = <Icon color={"orange"} name={"minus"} />;

        // Find player's most recent match (assumes matches already sorted by newest)
        for (let i = 0; i < props.matches.length; i++) {
            const match = props.matches[i];
            if (match.winning_player_id === player.id || match.losing_player_id === player.id) {
                mostRecentMatch = match;
                break;
            }
        }

        const winLoss = getWinLossForPlayer(player.id, props.matches);

        if(isUnderPlacement(winLoss.wins + winLoss.losses)) {
            iconToReturn = <Icon color={"yellow"} name={"question"}/>;
        } else if (mostRecentMatch) {
            // If the most recent match was a loss
            if (mostRecentMatch.losing_player_id === player.id) {
                if (positionOnLadder !== 0) {
                    let wentDown = false;
                    // Get the player above them
                    const playerAboveOnLadder = sortedPlayers[positionOnLadder - 1];

                    // If the player above them was the player they versed, then use that player's original elo.
                    if (
                        playerAboveOnLadder.id === mostRecentMatch.winning_player_id &&
                        // If the pre-match elo was higher than the player above, and now it's not, then this means the
                        // target player went down on the ladder.
                        mostRecentMatch.losing_player_original_elo >= mostRecentMatch.winning_player_original_elo
                    ) {
                        wentDown = true;
                    }
                    // Otherwise just use the above player's current elo.
                    else {
                        // If the pre-match elo was higher than the player above, and now it's not, then this means the
                        // target player went down on the ladder.
                        if (mostRecentMatch.losing_player_original_elo >= playerAboveOnLadder.elo) {
                            wentDown = true;
                        }
                    }

                    if (wentDown) {
                        iconToReturn = <Icon color={"red"} name={"arrow down"} />;
                    }
                }
            }
            // Otherwise, match was a win
            else {
                // Get the player below them
                const playerBelowOnLadder = sortedPlayers[positionOnLadder + 1];
                let wentUp = false;

                // If the player below them was the player they versed, then use that player's original elo.
                if (
                    playerBelowOnLadder.id === mostRecentMatch.losing_player_id &&
                    // If the pre-match elo was lower than the player below, and now it's not, then this means the
                    // target player went up on the ladder.
                    mostRecentMatch.winning_player_original_elo <= mostRecentMatch.losing_player_original_elo
                ) {
                    wentUp = true;
                } else {
                    // If the pre-match elo was lower than the player below, and now it's not, then this means
                    // the target player went up the ladder.
                    if (playerBelowOnLadder.elo >= mostRecentMatch.winning_player_original_elo) {
                        wentUp = true;
                    }
                }

                if (wentUp) {
                    iconToReturn = <Icon color={"green"} name={"arrow up"} />;
                }
            }
        }

        return iconToReturn;
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
                    onClick={(): void => props.setHideUnplacedPlayers(!props.hideUnplacedPlayers)}
                    color={props.hideUnplacedPlayers ? "green" : "red"}
                >
                    {props.hideUnplacedPlayers ? (
                        <span>
                            <Icon name={"eye"} /> Show unplaced players
                        </span>
                    ) : (
                        <span>
                            <Icon name={"eye slash"} /> Hide unplaced players
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
