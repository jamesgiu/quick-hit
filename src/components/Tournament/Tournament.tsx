import { useState } from "react";
import { Button, Header, Icon, Message, Modal, Table } from "semantic-ui-react";
import { TTDataPropsTypeCombined } from "../../containers/shared";
import { DbPlayer, DbTournament, DbTournamentMatch, getTodaysDate } from "../../types/database/models";
import "./Tournament.css";
import { getPlayersMap } from "../QHDataLoader/QHDataLoader";
import NewTournament from "./NewTournament/NewTournament";
import EnterTournamentGame from "./EnterTournamentGame/EnterTournamentGame";

// Run linter.
// Run prettier.
// Remove non-null assertions.
// Do run-through test.
// Add comments.

function Tournament(props: TTDataPropsTypeCombined): JSX.Element {
    const [newTournamentModalOpen, openNewTournamentModal] = useState<boolean>(false);
    const [enterGameModalOpen, openEnterGameModal] = useState<boolean>(false);
    const [homePlayerEntering, setHomePlayerEntering] = useState<string>("");
    const [awayPlayerEntering, setAwayPlayerEntering] = useState<string>("");
    const [matchEntering, setMatchEntering] = useState<DbTournamentMatch | undefined>(undefined);
    const [viewPastModalOpen, openViewPastModal] = useState<boolean>(false);
    // Music by Karl Casey @ White Bat Audio.
    const [pastTournamentsAudio] = useState<HTMLAudioElement>(new Audio(process.env.PUBLIC_URL + "/past-tournaments-music.mp3"));
    pastTournamentsAudio.volume = 0.5;
    const [secondPastModalOpen, openSecondPastModal] = useState<boolean>(false);
    const [pastTournamentBeingViewed, setViewedPastTournament] = useState<DbTournament | undefined>(undefined);

    const sortedPlayers = props.players.sort((p1, p2) => p2.elo - p1.elo)
    const sortedTournaments = props.tournaments.sort((t1, t2) => t2.start_date.localeCompare(t1.start_date));
    const playersMap = getPlayersMap(props.players);

    const getPlayerRank = (tournament: DbTournament, playerId: string): number => {
        if (tournament.matches[0].home_player_id === playerId) return 1;
        else if (tournament.matches[0].away_player_id === playerId) return 8;
        else if (tournament.matches[1].home_player_id === playerId) return 4;
        else if (tournament.matches[1].away_player_id === playerId) return 5;
        else if (tournament.matches[2].home_player_id === playerId) return 2;
        else if (tournament.matches[2].away_player_id === playerId) return 7;
        else if (tournament.matches[3].home_player_id === playerId) return 3;
        else return 6;
    };

    const homeWon = (match: DbTournamentMatch): boolean | undefined => {
        if (match && match.home_score !== undefined && match.away_score !== undefined) {
            return match.home_score > match.away_score;
        } else {
            return undefined;
        }
    }

    const getMatchBtn = (match: DbTournamentMatch): JSX.Element => {
        if (match && match.home_player_id && match.away_player_id) {
            if (match.home_score === undefined) {
                return <span className={"enter-game-score-vs"} onClick={() => {openGameEntryModal(match)}}>VS</span>;
            } else {
                return <span className={"enter-game-score-vs"}>{match.home_score}-{match.away_score}</span>;
            }
        } else {
            return <span className={"enter-game-score-vs"}>VS</span>;
        }
    };

    const getTeamItem = (match: DbTournamentMatch,
                         playersMap: Map<string, DbPlayer>,
                         tournament: DbTournament): JSX.Element => {
        return (
        <div>
            <span className={homeWon(match) === false ?  "match-loser" : undefined}>
                {match?.home_player_id
                 ? `(${getPlayerRank(tournament, match.home_player_id)}) ${playersMap.get(match.home_player_id)?.name}`
                 : "TBD"}
            </span>
            <span className={match &&
                             match.home_player_id &&
                             match.away_player_id &&
                             match.home_score === undefined ? "clickable-vs" : "vs"}>
                {getMatchBtn(match)}
            </span>
            <span className={homeWon(match) === true ? "match-loser" : undefined}>
                {match?.away_player_id
                 ? `(${getPlayerRank(tournament, match.away_player_id)}) ${playersMap.get(match.away_player_id)?.name}`
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

    const getWinner = (tournament: DbTournament): JSX.Element => {
        const finalMatch = tournament ? tournament.matches[6] : sortedTournaments[0].matches[6];

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

    const getPastTournamentsTableRows = (tournaments: DbTournament[]): JSX.Element[] => {
        const tableRows: JSX.Element[] = [];
        tournaments.forEach((tournament) => {
            tableRows.push(
                <Table.Row key={tournament.id}>
                    <Table.Cell selectable>
                        <div className={"past-tournament-expand"}
                             onClick={() => {
                                 setViewedPastTournament(tournament);
                                 openSecondPastModal(true);
                             }}>
                            {tournament.name} <Icon name={"external"}/>
                        </div>
                    </Table.Cell>
                    <Table.Cell>{tournament.start_date}</Table.Cell>
                    <Table.Cell>{tournament.end_date}</Table.Cell>
                    <Table.Cell>{getWinner(tournament)}</Table.Cell>
                </Table.Row>
            );
        });
        return tableRows;
    };

    const renderTournament = (tournament: DbTournament): JSX.Element => {
        return (
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
                        {getTeamItem(tournament.matches[0], playersMap, tournament)}
                    </li>
                    <li className="team-item" key={1}>
                        {getTeamItem(tournament.matches[1], playersMap, tournament)}
                    </li>
                    <li className="team-item" key={2}>
                        {getTeamItem(tournament.matches[2], playersMap, tournament)}
                    </li>
                    <li className="team-item" key={3}>
                        {getTeamItem(tournament.matches[3], playersMap, tournament)}
                    </li>
                    </ul>  
                    <ul className="bracket bracket-3">
                    <li className="team-item" key={4}>
                        {getTeamItem(tournament.matches[4], playersMap, tournament)}
                    </li>
                    <li className="team-item" key={5}>
                        {getTeamItem(tournament.matches[5], playersMap, tournament)}
                    </li>
                    </ul>  
                    <ul className="bracket bracket-4">
                    <li className="team-item" key={6}>
                        {getTeamItem(tournament.matches[6], playersMap, tournament)}
                    </li>
                    </ul>  

                    <ul className="bracket bracket-5">
                    <li className="team-item">
                        {getWinner(tournament)}
                    </li>
                    </ul>  
                </div>
            </div>
        );
    };

    const onNewTournamentClose = () => {
        openNewTournamentModal(false);
        props.setForceRefresh(true);
    }

    const onEnterTournamentGameClose = () => openEnterGameModal(false);

    return (
        <div>
        {sortedTournaments.length > 0 &&
         sortedTournaments[0].matches[6] &&
         sortedTournaments[0].matches[6].home_score !== undefined
            ? <div>
                <div className={"congrats-div"}>
                    Congratulations {getWinner(sortedTournaments[0])}!
                </div>
                <Button onClick={() => openNewTournamentModal(true)}
                      className={"new-tournament-button"}>
                    Start new tournament?
                </Button>
              </div>
            : <span/>
        }
        {sortedTournaments.length > 0 && sortedTournaments[0].matches.length > 0
            ?
        <div>
            <div className={"tournament-details"}>
                <Header content={sortedTournaments[0].name}
                        subheader={"Start date: " + sortedTournaments[0].start_date}/>
            </div>
            {renderTournament(sortedTournaments[0])}
            <Message id={"rules-msg"}
                     icon={"warning sign"}
                     header={"Remember the tournament rules!"}
                     content={"Play to 21, and you must win by 2!"}/>
            <Button onClick={() => {
                openViewPastModal(true);
                pastTournamentsAudio.play();
            }}
                    id={"past-tournaments-button"}>
                <Icon name={"backward"}/>View past tournaments
            </Button>
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
        <NewTournament onClose={onNewTournamentClose} isOpen={newTournamentModalOpen} sortedPlayers={sortedPlayers}/>
        <EnterTournamentGame onClose={onEnterTournamentGameClose}
                             isOpen={enterGameModalOpen}
                             refresh={() => props.setForceRefresh(true)}
                             matchEntering={matchEntering!}
                             currentTournament={sortedTournaments[0]}
                             homePlayerEntering={homePlayerEntering}
                             awayPlayerEntering={awayPlayerEntering}/>
        <Modal onClose={() => {
            openViewPastModal(false);
            pastTournamentsAudio.pause();
            pastTournamentsAudio.currentTime = 0;
        }}
                 open={viewPastModalOpen}
                 id={"past-tournaments-modal"}>
            <Modal.Header>Past tournaments</Modal.Header>
            <Modal.Content>
                <Table id={"past-tournaments-table"} color={"orange"} inverted>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Tournament name</Table.HeaderCell>
                            <Table.HeaderCell>Start date</Table.HeaderCell>
                            <Table.HeaderCell>End date</Table.HeaderCell>
                            <Table.HeaderCell>Winner</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {getPastTournamentsTableRows(sortedTournaments.slice(1))}
                    </Table.Body>
                </Table>
            </Modal.Content>

            <Modal onClose={() => openSecondPastModal(false)}
                   open={secondPastModalOpen}
                   id={"second-past-tournaments-modal"}>
                   <Modal.Header>{pastTournamentBeingViewed?.name}</Modal.Header>
                   <Modal.Content>
                       {pastTournamentBeingViewed ? renderTournament(pastTournamentBeingViewed) : <span/>}
                    </Modal.Content>
            </Modal>
        </Modal>
        </div>
    );
}

export const getISODate = (): string => {
    const startDateWrongFormat = getTodaysDate();
    return `${startDateWrongFormat.slice(6, 10)}-${startDateWrongFormat.slice(3, 5)}-${startDateWrongFormat.slice(0, 2)}`
};

export default Tournament;
