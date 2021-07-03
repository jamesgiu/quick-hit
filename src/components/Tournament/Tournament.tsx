import { useState } from "react";
import { Button, Form, Header, Icon, Message, Modal, Table } from "semantic-ui-react";
import { QuickHitAPI } from "../../api/QuickHitAPI";
import { TTDataPropsTypeCombined } from "../../containers/shared";
import { DbPlayer, DbTournament, DbTournamentMatch, getTodaysDate } from "../../types/database/models";
import { makeErrorToast, makeSuccessToast } from "../Toast/Toast";
import { v4 as uuidv4 } from "uuid";
import "./Tournament.css";
import { getPlayersMap } from "../QHDataLoader/QHDataLoader";

// Looks like the match is updated on the UI even if the request fails.
// Make sure new tournament form validation works.
// Add past tournaments.
// Look at query param sorting for tournaments rather than doing it client side.
// Sometimes difficult to click confirm match button.

// DO LAST:
// Pull in main.
// Run linter.
// Run prettier.

function Tournament(props: TTDataPropsTypeCombined): JSX.Element {
    const [newTournamentModalOpen, openNewTournamentModal] = useState<boolean>(false);
    const [newTournamentName, setNewTournamentName] = useState<string>("");
    const [enterGameModalOpen, openEnterGameModal] = useState<boolean>(false);
    const [homePlayerEntering, setHomePlayerEntering] = useState<string>("");
    const [awayPlayerEntering, setAwayPlayerEntering] = useState<string>("");
    const [homePlayerEnteringScore, setHomePlayerEnteringScore] = useState<number | undefined>(undefined);
    const [awayPlayerEnteringScore, setAwayPlayerEnteringScore] = useState<number | undefined>(undefined);
    const [matchEntering, setMatchEntering] = useState<DbTournamentMatch | undefined>(undefined);
    const [confirmingMatchScore, setConfirmingMatchScore] = useState<boolean>(false);
    const [startingNewTournament, setStartingNewTournament] = useState<boolean>(false);

    const sortedPlayers = props.players.sort((p1, p2) => p2.elo - p1.elo)
    const sortedTournaments = props.tournaments.sort((t1, t2) => t2.start_date.localeCompare(t1.start_date));
    const playersMap = getPlayersMap(props.players);

    const playerRanksMap = new Map<string, number>();

    if (sortedTournaments[0]?.matches) {
        playerRanksMap.set(sortedTournaments[0].matches[0].home_player_id, 1);
        playerRanksMap.set(sortedTournaments[0].matches[0].away_player_id, 8);
        playerRanksMap.set(sortedTournaments[0].matches[1].home_player_id, 4);
        playerRanksMap.set(sortedTournaments[0].matches[1].away_player_id, 5);
        playerRanksMap.set(sortedTournaments[0].matches[2].home_player_id, 2);
        playerRanksMap.set(sortedTournaments[0].matches[2].away_player_id, 7);
        playerRanksMap.set(sortedTournaments[0].matches[3].home_player_id, 3);
        playerRanksMap.set(sortedTournaments[0].matches[3].away_player_id, 6);
    }

    const startNewTournament = (players: DbPlayer[], name: string) => {
        const onSuccess = () => {
            makeSuccessToast("Tournament started!", `A new tournament ${name} has been started!`);
            setStartingNewTournament(false);
            openNewTournamentModal(false);
            props.setForceRefresh(true);
        };

        const onError = (errorMsg: string) => {
            makeErrorToast("Could not start tournament", errorMsg);
            setStartingNewTournament(false);
        };

        setStartingNewTournament(true);

        const tournamentMatches: DbTournamentMatch[] = [];
        tournamentMatches.push({
            "match_number": 0,
            "home_player_id": players[0].id,
            "away_player_id": players[7].id
        }, {
            "match_number": 1,
            "home_player_id": players[3].id,
            "away_player_id": players[4].id
        }, {
            "match_number": 2,
            "home_player_id": players[1].id,
            "away_player_id": players[6].id
        }, {
            "match_number": 3,
            "home_player_id": players[2].id,
            "away_player_id": players[5].id
        });
    
        const startDateWrongFormat = getTodaysDate();
    
        const newTournament: DbTournament = {
            "id": uuidv4(),
            name,
            "start_date": `${startDateWrongFormat.slice(6, 10)}-${startDateWrongFormat.slice(3, 5)}-${startDateWrongFormat.slice(0, 2)}`,
            "matches": tournamentMatches
        };
    
        QuickHitAPI.addUpdateTournament(newTournament, onSuccess, onError);
    };

    const homeWon = (match: DbTournamentMatch): boolean | undefined => {
        if (match && match.home_score !== undefined && match.away_score !== undefined) {
            return match.home_score > match.away_score;
        } else {
            return undefined;
        }
    }

    const getTeamItem = (match: DbTournamentMatch, playersMap: Map<string, DbPlayer>): JSX.Element => {
        return (
        <div>
            <span className={homeWon(match) === false ?  "match-loser" : undefined}>
                {match?.home_player_id
                 ? `(${playerRanksMap.get(match.home_player_id)}) ${playersMap.get(match.home_player_id)?.name}`
                 : "TBD"}
            </span>
            <span className={match &&
                             match.home_player_id &&
                             match.away_player_id &&
                             match.home_score === undefined ? "clickable-vs" : "vs"}>
                {match && match.home_player_id && match.away_player_id
                ? match.home_score !== undefined
                  ? <span>{match.home_score}-{match.away_score}</span>
                  : <span onClick={() => openGameEntryModal(match)}>VS</span>
                : <span>VS</span>
                }
            </span>
            <span className={homeWon(match) === true ? "match-loser" : undefined}>
                {match?.away_player_id
                 ? `(${playerRanksMap.get(match.away_player_id)}) ${playersMap.get(match.away_player_id)?.name}`
                 : "TBD"}
            </span>
        </div>
        );
    };

    const openGameEntryModal = (match: DbTournamentMatch) => {
        setMatchEntering(match);
        setHomePlayerEntering(playersMap.get(match.home_player_id)?.name as string);
        setAwayPlayerEntering(playersMap.get(match.away_player_id)?.name as string);
        openEnterGameModal(true);
    };

    const updateMatchAndTournament = () => {
        const onSuccess = () => {
            setHomePlayerEnteringScore(undefined);
            setAwayPlayerEnteringScore(undefined);
            makeSuccessToast("Game entered!", "The tournament marches on!");
            openEnterGameModal(false);
            setConfirmingMatchScore(false);
            props.setForceRefresh(true);
        };

        const onError = (errorMsg: string) => {
            makeErrorToast("Game not entered!", errorMsg);
            setConfirmingMatchScore(false);
            props.setForceRefresh(true);
        };

        setConfirmingMatchScore(true);

        if (homePlayerEnteringScore === awayPlayerEnteringScore) {
            makeErrorToast("Come on man", "Winning player score must be higher than losing player score");
            props.setForceRefresh(true);
            return;
        }

        matchEntering!.home_score = homePlayerEnteringScore;
        matchEntering!.away_score = awayPlayerEnteringScore;

        const homeWon = homePlayerEnteringScore! > awayPlayerEnteringScore!;
        const matchWinnerId = homeWon ? matchEntering!.home_player_id : matchEntering!.away_player_id;

        switch (matchEntering!.match_number) {
            case 0:
                updateFutureTournamentMatch(4, matchWinnerId, true);
                break;
            case 1:
                updateFutureTournamentMatch(4, matchWinnerId, false);
                break;
            case 2:
                updateFutureTournamentMatch(5, matchWinnerId, true);
                break;
            case 3:
                updateFutureTournamentMatch(5, matchWinnerId, false);
                break;
            case 4:
                updateFutureTournamentMatch(6, matchWinnerId, true);
                break;
            case 5:
                updateFutureTournamentMatch(6, matchWinnerId, false);
                break;
        }

        QuickHitAPI.addUpdateTournament(sortedTournaments[0], onSuccess, onError);
    }

    const updateFutureTournamentMatch = (futureMatchIndex: number,
                                         previousMatchWinnerId: string, 
                                         winnerWillBeHome: boolean) => {
        if (sortedTournaments[0].matches[futureMatchIndex]) {
            if (winnerWillBeHome) {
                sortedTournaments[0].matches[futureMatchIndex].home_player_id = previousMatchWinnerId;
            } else {
                sortedTournaments[0].matches[futureMatchIndex].away_player_id = previousMatchWinnerId;
            }
        } else {
            if (winnerWillBeHome) {
                sortedTournaments[0].matches[futureMatchIndex] = {
                    match_number: futureMatchIndex,
                    home_player_id: previousMatchWinnerId,
                    away_player_id: ""
                };
            } else {
                sortedTournaments[0].matches[futureMatchIndex] = {
                    match_number: futureMatchIndex,
                    home_player_id: "",
                    away_player_id: previousMatchWinnerId
                };
            }
        }
    };

    const getWinner = (): JSX.Element => {
        const finalMatch = sortedTournaments[0].matches[6];

        if (finalMatch && finalMatch.home_score !== undefined && finalMatch.away_score !== undefined) {
            const homeWon = finalMatch.home_score > finalMatch.away_score;
            return (
                <span>
                    <Icon name={playersMap.get(homeWon ? finalMatch.home_player_id : finalMatch.away_player_id)?.icon}/> 
                    {playersMap.get(homeWon ? finalMatch.home_player_id : finalMatch.away_player_id)?.name}
                </span>
            );
        } else {
            return <span>Who will it be?</span>;
        }
    };

    return (
        <div>
        {sortedTournaments.length > 0 &&
         sortedTournaments[0].matches[6] &&
         sortedTournaments[0].matches[6].home_score !== undefined
            ? <div>
                <div className={"congrats-div"}>
                    Congratulations {getWinner()}!
                </div>
                <Button onClick={() => openNewTournamentModal(true)}
                      className={"new-tournament-button"}>
                    Start new tournament?
                </Button>
              </div>
            : <span/>
        }
        {sortedTournaments.length > 0
            ?
        <div>
            <div className={"tournament-details"}>
                <Header content={sortedTournaments[0].name}
                        subheader={"Start date: " + sortedTournaments[0].start_date}/>
            </div>
            <div className="tournament-container">
                <div className="tournament-headers">
                    <h3>Quarter-Finals</h3>
                    <h3>Semi-Finals</h3>
                    <h3>Final</h3>
                    <h3>Winner <Icon name="trophy"/></h3>
                </div>

                <div className="tournament-brackets">
                    <ul className="bracket bracket-2">
                    <li className="team-item" key={0}>
                        {getTeamItem(sortedTournaments[0].matches[0], playersMap)}
                    </li>
                    <li className="team-item" key={1}>
                        {getTeamItem(sortedTournaments[0].matches[1], playersMap)}
                    </li>
                    <li className="team-item" key={2}>
                        {getTeamItem(sortedTournaments[0].matches[2], playersMap)}
                    </li>
                    <li className="team-item" key={3}>
                        {getTeamItem(sortedTournaments[0].matches[3], playersMap)}
                    </li>
                    </ul>  
                    <ul className="bracket bracket-3">
                    <li className="team-item" key={4}>
                        {getTeamItem(sortedTournaments[0].matches[4], playersMap)}
                    </li>
                    <li className="team-item" key={5}>
                        {getTeamItem(sortedTournaments[0].matches[5], playersMap)}
                    </li>
                    </ul>  
                    <ul className="bracket bracket-4">
                    <li className="team-item" key={6}>
                        {getTeamItem(sortedTournaments[0].matches[6], playersMap)}
                    </li>
                    </ul>  

                    <ul className="bracket bracket-5">
                    <li className="team-item">
                        {getWinner()}
                    </li>
                    </ul>  
                </div>
            </div>
            <Message id={"rules-msg"}
                     icon={"warning sign"}
                     header={"Remember the tournament rules!"}
                     content={"Play to 21, and you must win by 2!"}/>
        </div>
            : <div>{!props.loading
                ?
                <Button onClick={() => openNewTournamentModal(true)}
                      className={"new-tournament-button"}>
                Start new tournament!
                </Button>
                : <span/>
            }</div>
        }
        {newTournamentModalOpen
        ? <Modal
            onClose={() => openNewTournamentModal(false)}
            open={newTournamentModalOpen}
            >
            <Modal.Header>
                Start new tournament <Icon name={"trophy"}/>
            </Modal.Header>
            <Modal.Content>
                <Form onSubmit={() => startNewTournament(sortedPlayers.slice(0, 8), newTournamentName)}>
                    <Form.Input className={"tournament-name-input"}
                                label={"Tournament name"}
                                onChange={(event, data) => setNewTournamentName(data.value)}
                                required/>
                    <div id={"new-tournament-ladder-scroller"}>
                        <Table id={"new-tournament-ladder-table"}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Ladder position</Table.HeaderCell>
                                    <Table.HeaderCell>Player name</Table.HeaderCell>
                                    <Table.HeaderCell>Player ELO</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {getLadderTableRows(sortedPlayers)}
                            </Table.Body>
                        </Table>
                    </div>
                    <Form.Button disabled={!newTournamentName || startingNewTournament} id={"new-tournament-btn"}>
                        {`Start tournament with these top 8 players  `}
                        {startingNewTournament
                        ? <Icon loading name={"spinner"}/>
                        : <span/>
                        }
                    </Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
        : <span></span>}
        {enterGameModalOpen
        ? <Modal
            onClose={() => openEnterGameModal(false)}
            open={enterGameModalOpen}
            >
            <Modal.Header>
                Enter tournament game
            </Modal.Header>
            <Modal.Content>
                <Form onSubmit={updateMatchAndTournament}>
                    <Form.Group widths="equal">
                        <Form.Input className={"tournament-score-input"}
                                    label={homePlayerEntering + "'s score"}
                                    type={"number"}
                                    min={0}
                                    value={homePlayerEnteringScore}
                                    onChange={(event, data) => setHomePlayerEnteringScore(parseInt(data.value))}
                                    required/>
                        <Form.Input className={"tournament-score-input"}
                                    label={awayPlayerEntering + "'s score"}
                                    type={"number"}
                                    min={0}
                                    value={awayPlayerEnteringScore}
                                    onChange={(event, data) => setAwayPlayerEnteringScore(parseInt(data.value))}
                                    required/>
                    </Form.Group>
                    <Form.Button className={"confirm-score-button"}
                                 disabled={homePlayerEnteringScore === undefined ||
                                           awayPlayerEnteringScore === undefined ||
                                           confirmingMatchScore}>
                        {`Confirm score  `}
                        {confirmingMatchScore
                        ? <Icon loading name={"spinner"}/>
                        : <span/>
                        }
                    </Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
        : <span></span>}
        </div>
    );
}

const getLadderTableRows = (players: DbPlayer[]): JSX.Element[] => {
    const tableRows: JSX.Element[] = [];
    for (let i = 0; i < players.length; ++i) {
        tableRows.push(
            <Table.Row positive={i <= 7} negative={i >= 8}>
                <Table.Cell>{i + 1}</Table.Cell>
                <Table.Cell><Icon name={players[i].icon}/> {players[i].name}</Table.Cell>
                <Table.Cell>{players[i].elo}</Table.Cell>
            </Table.Row>
        );

    }
    return tableRows;
};

export default Tournament;
