import "./Ladder.css";
import {Button, Header, Icon, Table, Transition} from "semantic-ui-react";
import PlayerCard from "./PlayerCard/PlayerCard";
import NewEditPlayer from "../NewEditPlayer/NewEditPlayer";
import NewGame from "../../containers/NewGame";
import { getWinLossForPlayerOrPair } from "../QHDataLoader/QHDataLoader";
import { TTDataPropsTypeCombined } from "../../containers/shared";
import { BASE_PATH, QuickHitPage } from "../../util/QuickHitPage";
import { Link } from "react-router-dom";
import { ViewDispatchType } from "../../containers/Ladder/Ladder";
import { ViewStoreState } from "../../redux/types/ViewTypes";
import {DbDoublesPair, DbPlayer, getELOString, isUnderPlacement} from "../../types/database/models";
import * as H from "history";

export type LadderProps = ViewStoreState & TTDataPropsTypeCombined & ViewDispatchType & {
    location: H.Location;
};

export const NUM_OF_FORM_GUIDE_MATCHES = 5;

/**
 * QuickHit Ladder page.
 */
function Ladder(props: LadderProps): JSX.Element {
    const isDoubles = props.location.pathname === QuickHitPage.DOUBLES_LADDER;

    const renderPlayersAsCards = (): JSX.Element[] => {
        const ladder: JSX.Element[] = [];

        const iterable = isDoubles ? props.doublesPairs : props.players;

        iterable.forEach((playerOrDoublesPair) => {
            if (!playerOrDoublesPair.retired) {
                const winLoss = getWinLossForPlayerOrPair(playerOrDoublesPair.id, props.matches);

                const playerCard = <PlayerCard player={playerOrDoublesPair} winLoss={winLoss} matchesPlayed={winLoss.matches} />;

                // If we are hiding zero game players, then only push if they have played a game
                if (props.hideUnplacedPlayers) {
                    if (!isUnderPlacement(winLoss.wins + winLoss.losses)) {
                        ladder.push(playerCard);
                    }
                } else {
                    ladder.push(playerCard);
                }
            }
        });

        // Sorting the player items by elo.
        ladder.sort((player1, player2) => {
            return player2.props.player.elo - player1.props.player.elo;
        });

        return ladder;
    };

    const renderPlayersInTable = (): JSX.Element[] => {
        const ladder: JSX.Element[] = [];
        const tableRows: JSX.Element[] = [];

        const iterable = isDoubles ? props.doublesPairs : props.players;

        const sortedIterable = iterable.sort((playerOrPair1, playerOrPair2) => {
            return playerOrPair2.elo - playerOrPair1.elo;
        });

        const unplacedPairRows = [];

        for (let i = 0; i < sortedIterable.length; i++) {
            const playerOrPair = sortedIterable[i];
            const winLoss = getWinLossForPlayerOrPair(playerOrPair.id, props.matches);
            let addPlayerOrPair = true;

            if (
                (props.hideUnplacedPlayers && isUnderPlacement(winLoss.wins + winLoss.losses)) ||
                playerOrPair.retired === true
            ) {
                addPlayerOrPair = false;
            }

            if (addPlayerOrPair) {
                const formStr =
                    winLoss && winLoss.formGuide.substr(0, NUM_OF_FORM_GUIDE_MATCHES).split("").reverse().join("");

                const row = (
                    <Table.Row className={"player-row"}>
                        <Table.Cell className={"player-cell"}>
                            <Link
                                className={"player-row-link"}
                                to={`${BASE_PATH()}${QuickHitPage.STATISTICS.replace(":playerId", playerOrPair.id)}`}
                            >
                                <span>
                                    {generateLadderTrendIcon(playerOrPair, i, sortedIterable)}
                                    <Icon name={playerOrPair.icon} size={"small"} />
                                    {playerOrPair.name}
                                </span>
                            </Link>
                        </Table.Cell>
                        <Table.Cell>{getELOString(winLoss.wins + winLoss.losses, playerOrPair.elo)}</Table.Cell>
                        <Table.Cell>
                            {winLoss.wins}-{winLoss.losses}
                        </Table.Cell>
                        <Table.Cell>{formStr !== "" ? formStr : "N/A"}</Table.Cell>
                    </Table.Row>
                );

                if (isUnderPlacement(winLoss.wins + winLoss.losses)) {
                    unplacedPairRows.push(row);
                } else {
                    tableRows.push(row);
                }
            }
        }

        ladder.push(
            <Table unstackable celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Player</Table.HeaderCell>
                        <Table.HeaderCell>ELO</Table.HeaderCell>
                        <Table.HeaderCell>W-L</Table.HeaderCell>
                        <Table.HeaderCell>Form</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tableRows}
                    {unplacedPairRows}
                </Table.Body>
            </Table>
        );
        return ladder;
    };

    const generateLadderTrendIcon = (
        playerOrPair: DbPlayer | DbDoublesPair,
        positionOnLadder: number,
        sortedPlayersOrPairs: DbPlayer[] | DbDoublesPair[]
    ): JSX.Element => {
        let mostRecentMatch;
        let iconToReturn: JSX.Element = <Icon color={"orange"} name={"minus"} />;

        // Find player's most recent match (assumes matches already sorted by newest)
        for (let i = 0; i < props.matches.length; i++) {
            const match = props.matches[i];
            if (match.winning_player_id === playerOrPair.id || match.losing_player_id === playerOrPair.id) {
                mostRecentMatch = match;
                break;
            }
        }

        const winLoss = getWinLossForPlayerOrPair(playerOrPair.id, props.matches);

        if (isUnderPlacement(winLoss.wins + winLoss.losses)) {
            iconToReturn = <Icon color={"yellow"} name={"question"} />;
        } else if (mostRecentMatch) {
            // If the most recent match was a loss
            if (mostRecentMatch.losing_player_id === playerOrPair.id) {
                if (positionOnLadder !== 0) {
                    let wentDown = false;
                    // Get the player above them
                    const playerAboveOnLadder = sortedPlayersOrPairs[positionOnLadder - 1];

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
                const playerBelowOnLadder = sortedPlayersOrPairs[positionOnLadder + 1];
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
                {isDoubles ?
                    <span>
                        <Icon children={
                            <span>
                                <Icon name={"child"} className={"first-child"}/>
                                <Icon name={"child"} className={"second-child"}/>
                            </span>
                        } circular/>
                        <Header.Content>Doubles ladder</Header.Content>
                    </span>
                    :
                    <span>
                        <Icon name="list" circular />
                        <Header.Content>Singles ladder</Header.Content>
                    </span>
                }
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
                        <NewGame doublesOnly={isDoubles} />
                    </div>
                </span>
            </Transition>
        </div>
    );
}

export default Ladder;
