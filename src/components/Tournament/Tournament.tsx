import { useState } from "react";
import { Button, Form, Icon, Input, List, Modal } from "semantic-ui-react";
import { QuickHitAPI } from "../../api/QuickHitAPI";
import { TTDataPropsTypeCombined } from "../../containers/shared";
import { DbMatch, DbPlayer, DbTournament, DbTournamentMatch, getTodaysDate } from "../../types/database/models";
import { makeErrorToast, makeSuccessToast } from "../Toast/Toast";
import { v4 as uuidv4 } from "uuid";
import "./Tournament.css";
import { getPlayersMap } from "../QHDataLoader/QHDataLoader";

// Make VS show as score if match is finished
// Add start new tournament down the bottom if the tournament is finished, showing the players who would be in it.
// Fix CSS making the lines connecting the matches not look right.
// Allow to enter game scores.
// Add warning to play to 21 and win by 2.
// Add strikethrough to game losers.

function Tournament(props: TTDataPropsTypeCombined): JSX.Element {
    const [newTournamentModalOpen, openNewTournamentModal] = useState<boolean>(false);
    const [newTournamentName, setNewTournamentName] = useState<string>("");
    const [enterGameModalOpen, openEnterGameModal] = useState<boolean>(false);
    const [homePlayerEntering, setHomePlayerEntering] = useState<string>("");
    const [awayPlayerEntering, setAwayPlayerEntering] = useState<string>("");
    const [homePlayerEnteringScore, setHomePlayerEnteringScore] = useState<number | undefined>(undefined);
    const [awayPlayerEnteringScore, setAwayPlayerEnteringScore] = useState<number | undefined>(undefined);
    const [matchEntering, setMatchEntering] = useState<DbTournamentMatch | undefined>(undefined);
    const sortedPlayers = props.players.sort((p1, p2) => p2.elo - p1.elo)
    const sortedTournaments = props.tournaments.sort((t1, t2) => t2.start_date.localeCompare(t1.start_date));
    const playersMap = getPlayersMap(props.players);

    const startNewTournament = (players: DbPlayer[], name: string) => {
        const tournamentMatches: DbTournamentMatch[] = [];
        tournamentMatches.push({
            "match_number": 0,
            "home_player_id": players[0].id,
            "away_player_id": players[7].id
        }, {
            "match_number": 1,
            "home_player_id": players[1].id,
            "away_player_id": players[6].id
        }, {
            "match_number": 2,
            "home_player_id": players[2].id,
            "away_player_id": players[5].id
        }, {
            "match_number": 3,
            "home_player_id": players[3].id,
            "away_player_id": players[4].id
        });
    
        const startDateWrongFormat = getTodaysDate();
    
        const newTournament: DbTournament = {
            "id": uuidv4(),
            name,
            "start_date": `${startDateWrongFormat.slice(6, 10)}-${startDateWrongFormat.slice(3, 5)}-${startDateWrongFormat.slice(0, 2)}`,
            "matches": tournamentMatches
        };
    
        QuickHitAPI.addUpdateTournament(
            newTournament, 
            () => {
                makeSuccessToast("Tournament started!", `A new tournament ${name} has been started!`);
                props.setForceRefresh(true);
            },
            (errorString) => makeErrorToast("Could not start tournament", errorString));
    };

    const getTeamItem = (match: DbTournamentMatch, playersMap: Map<string, DbPlayer>): JSX.Element => {
        return (
        <div>
            {match ? playersMap.get(match.home_player_id)?.name : ""} 
            <span className={match && match.home_score === undefined ? "clickable-vs" : "vs"}>
                {match
                ? match.home_score !== undefined
                  ? <span>{match.home_score}-{match.away_score}</span>
                  : <span onClick={() => openGameEntryModal(match)}>VS</span>
                : <span>VS</span>
                }
            </span>
            {match ? playersMap.get(match.away_player_id)?.name : ""}
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
            props.setForceRefresh(true);
        };

        const onError = (errorMsg: string) => {
            makeErrorToast("Game not entered!", errorMsg);
        };

        if (homePlayerEnteringScore === awayPlayerEnteringScore) {
            makeErrorToast("Come on man", "Winning player score must be higher than losing player score");
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
    

    return (
        <div>
        {sortedTournaments.length > 0
            ?
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
                <li className="team-item">European Champions</li>
                </ul>  
            </div>
        </div>
            : <Button onClick={() => openNewTournamentModal(true)}
                      className={"new-tournament-button"}>
                Start new tournament!
              </Button>
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
                <Input label={"Tournament name"} onChange={(event, data) => setNewTournamentName(data.value)}></Input>
                <div>Current ladder positions:</div>
                <List ordered>
                    {getLadderListItems(sortedPlayers)}
                </List>
                <Button onClick={() => {
                    startNewTournament(sortedPlayers.slice(0, 8), newTournamentName);
                    openNewTournamentModal(false);
                    props.setForceRefresh(true);
                }}>
                    Start tournament with these top 8 players
                </Button>
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
                <Input className={"tournament-score-input"}
                       label={homePlayerEntering + "'s score"}
                       type={"number"}
                       min={0}
                       value={homePlayerEnteringScore}
                       onChange={(event, data) => setHomePlayerEnteringScore(parseInt(data.value))}/>
                <Input className={"tournament-score-input"}
                       label={awayPlayerEntering + "'s score"}
                       type={"number"}
                       min={0}
                       value={awayPlayerEnteringScore}
                       onChange={(event, data) => setAwayPlayerEnteringScore(parseInt(data.value))}/>
                <Button className={"confirm-score-button"} onClick={updateMatchAndTournament}>Confirm score</Button>
            </Modal.Content>
        </Modal>
        : <span></span>}
        </div>
    );
}

const getLadderListItems = (players: DbPlayer[]): JSX.Element[] => {
    const listItems: JSX.Element[] = [];
    for (let i = 0; i < players.length; ++i) {
        listItems.push(
        <List.Item className={i <= 7 ? "qualified-player" : "eliminated-player"}>
            <Icon name={players[i].icon}/> {players[i].name}
        </List.Item>);
        if (i === 7) {
            listItems.push(<div>--------------------------------------------</div>);
        }
    }
    return listItems;
};

export default Tournament;
