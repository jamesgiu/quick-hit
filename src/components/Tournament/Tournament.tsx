import { useState } from "react";
import { Button, Dropdown, Header, Icon, Label, Message, Modal, Table } from "semantic-ui-react";
import { TTDataPropsTypeCombined } from "../../containers/shared";
import { DbPlayer, DbTournament, DbTournamentMatch, getTodaysDate } from "../../types/database/models";
import "./Tournament.css";
import { getPlayersMap } from "../QHDataLoader/QHDataLoader";
import NewTournament from "./NewTournament/NewTournament";
import EnterTournamentGame from "./EnterTournamentGame/EnterTournamentGame";
import { TournamentParticipantsType, TournamentType } from "../../types/types";

function Tournament(props: TTDataPropsTypeCombined): JSX.Element {
    const [newTournamentModalOpen, openNewTournamentModal] = useState<boolean>(false);
    const [enterGameModalOpen, openEnterGameModal] = useState<boolean>(false);
    const [recapModalOpen, openRecapModal] = useState<boolean>(false);
    const [homePlayerEntering, setHomePlayerEntering] = useState<string>("");
    const [awayPlayerEntering, setAwayPlayerEntering] = useState<string>("");
    const [matchEntering, setMatchEntering] = useState<DbTournamentMatch | undefined>(undefined);
    const [viewPastModalOpen, openViewPastModal] = useState<boolean>(false);
    // Music by Karl Casey @ White Bat Audio.
    const [pastTournamentsAudioSynth] = useState<HTMLAudioElement>(
        new Audio(process.env.PUBLIC_URL + "/past-tournaments-music-synth.mp3")
    );
    // Music by Luxury Elite.
    const [pastTournamentsAudioVapour] = useState<HTMLAudioElement>(
        new Audio(process.env.PUBLIC_URL + "/past-tournaments-music-vapour.mp3")
    );
    // Music by HOME.
    const [recapAudio] = useState<HTMLAudioElement>(new Audio(process.env.PUBLIC_URL + "/recap-audio.mp3"));
    // Music by tuddmusic.
    const [arcadeAudioSynth] = useState<HTMLAudioElement>(new Audio(process.env.PUBLIC_URL + "/arcade-synth.mp3"));
    // Music by Kannibal.
    const [arcadeAudioVapour] = useState<HTMLAudioElement>(new Audio(process.env.PUBLIC_URL + "/arcade-vapour.mp3"));
    pastTournamentsAudioSynth.volume = 0.2;
    pastTournamentsAudioVapour.volume = 0.2;
    recapAudio.volume = 0.5;
    arcadeAudioSynth.volume = 0.2;
    arcadeAudioVapour.volume = 0.2;
    pastTournamentsAudioVapour.loop = true;
    pastTournamentsAudioSynth.loop = true;
    recapAudio.loop = true;
    arcadeAudioSynth.loop = true;
    arcadeAudioVapour.loop = true;
    const [secondPastModalOpen, openSecondPastModal] = useState<boolean>(false);
    const [pastTournamentBeingViewed, setViewedPastTournament] = useState<DbTournament | undefined>(undefined);
    const [synth, setSynth] = useState<boolean>(true);
    const [pastTournamentView, setPastTournamentView] = useState<string>("table");

    // We have to sort the retrieved players and tournaments because using the Firebase REST API's query parameters does
    // not guarantee order. Make sure to filter out players who have never played a game, too.
    const sortedPlayers = props.players
        .sort((p1, p2) => p2.elo - p1.elo)
        .filter((player) =>
            props.matches.some((match) => match.winning_player_id === player.id || match.losing_player_id === player.id)
        );
    const sortedTournaments = props.tournaments.sort((t1, t2) => t2.start_date.localeCompare(t1.start_date));
    const playersMap = getPlayersMap(props.players);

    // Determine what rank the player was in the supplied tournament.
    const getPlayerRank = (tournament: DbTournament, playerId: string): number => {
        if (tournament.type && tournament.type === TournamentType.AFL) {
            if (tournament.matches[0].home_player_id === playerId) return 1;
            else if (tournament.matches[0].away_player_id === playerId) return 4;
            else if (tournament.matches[1].home_player_id === playerId) return 5;
            else if (tournament.matches[1].away_player_id === playerId) return 8;
            else if (tournament.matches[2].home_player_id === playerId) return 6;
            else if (tournament.matches[2].away_player_id === playerId) return 7;
            else if (tournament.matches[3].home_player_id === playerId) return 2;
            else return 3;
        } else {
            if (tournament.matches[0].home_player_id === playerId) return 1;
            else if (tournament.matches[0].away_player_id === playerId) return 8;
            else if (tournament.matches[1].home_player_id === playerId) return 4;
            else if (tournament.matches[1].away_player_id === playerId) return 5;
            else if (tournament.matches[2].home_player_id === playerId) return 2;
            else if (tournament.matches[2].away_player_id === playerId) return 7;
            else if (tournament.matches[3].home_player_id === playerId) return 3;
            else return 6;
        }
    };

    const homeWon = (match: DbTournamentMatch): boolean | undefined => {
        if (match && match.home_score !== undefined && match.away_score !== undefined) {
            return match.home_score > match.away_score;
        } else {
            return undefined;
        }
    };

    // Returns the VS button differently depending on the match state. If the match has its players determined, but the match
    // has not yet been played, make the button clickable to enter the score. If the match has already been played, make the
    // button display the score, and be unclickable. Lastly, if the players for the match are not yet defined, just display
    // an unclickable VS.
    const getMatchBtn = (match: DbTournamentMatch): JSX.Element => {
        if (match && match.home_player_id && match.away_player_id) {
            if (match.home_score === undefined) {
                return (
                    <span
                        className={"enter-game-score-vs"}
                        onClick={(): void => {
                            openGameEntryModal(match);
                        }}
                    >
                        VS
                    </span>
                );
            } else {
                return (
                    <span className={"enter-game-score-vs"}>
                        {match.home_score}-{match.away_score}
                    </span>
                );
            }
        } else {
            return <span className={"enter-game-score-vs"}>VS</span>;
        }
    };

    const getMatchItem = (
        match: DbTournamentMatch,
        playersMap: Map<string, DbPlayer>,
        tournament: DbTournament,
        homeTbdText?: string,
        awayTbdText?: string
    ): JSX.Element => {
        return (
            <div>
                <span className={homeWon(match) === false ? "match-loser home-player" : "home-player"}>
                    {match?.home_player_id ? (
                        `(${getPlayerRank(tournament, match.home_player_id)}) ${
                            playersMap.get(match.home_player_id)?.name
                        }`
                    ) : homeTbdText ? (
                        <span className={"custom-tbd"}>{homeTbdText}</span>
                    ) : (
                        "TBD"
                    )}
                </span>
                <span
                    className={
                        match && match.home_player_id && match.away_player_id && match.home_score === undefined
                            ? "clickable-vs"
                            : "vs"
                    }
                >
                    {getMatchBtn(match)}
                </span>
                <span className={homeWon(match) === true ? "match-loser" : undefined}>
                    {match?.away_player_id ? (
                        `(${getPlayerRank(tournament, match.away_player_id)}) ${
                            playersMap.get(match.away_player_id)?.name
                        }`
                    ) : awayTbdText ? (
                        <span className={"custom-tbd"}>{awayTbdText}</span>
                    ) : (
                        "TBD"
                    )}
                </span>
            </div>
        );
    };

    const openGameEntryModal = (match: DbTournamentMatch): void => {
        setMatchEntering(match);
        setHomePlayerEntering(playersMap.get(match.home_player_id)?.name as string);
        setAwayPlayerEntering(playersMap.get(match.away_player_id)?.name as string);
        openEnterGameModal(true);
    };

    // Returns the icon and name of the winner of the given tournament.
    const getWinner = (tournament: DbTournament): JSX.Element => {
        let finalMatch;
        if (tournament.type && tournament.type === TournamentType.DOUBLE) {
            finalMatch = tournament.matches[13];
        } else if (tournament.type && tournament.type === TournamentType.AFL) {
            finalMatch = tournament.matches[8];
        } else {
            finalMatch = tournament.matches[6];
        }

        if (finalMatch && finalMatch.home_score !== undefined && finalMatch.away_score !== undefined) {
            const homeWon = finalMatch.home_score > finalMatch.away_score;
            return (
                <span>
                    <Icon
                        name={playersMap.get(homeWon ? finalMatch.home_player_id : finalMatch.away_player_id)?.icon}
                    />
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
                        <div
                            className={"past-tournament-expand"}
                            onClick={(): void => {
                                setViewedPastTournament(tournament);
                                openSecondPastModal(true);
                            }}
                        >
                            {tournament.name} <Icon name={"external"} />
                        </div>
                    </Table.Cell>
                    <Table.Cell>{tournament.participants ?? TournamentParticipantsType.STANDARD}</Table.Cell>
                    <Table.Cell>{tournament.type ?? TournamentType.SINGLE}</Table.Cell>
                    <Table.Cell>{tournament.start_date}</Table.Cell>
                    <Table.Cell>{tournament.end_date}</Table.Cell>
                    <Table.Cell>{getWinner(tournament)}</Table.Cell>
                </Table.Row>
            );
        });
        return tableRows;
    };

    const getHeaders = (tournament: DbTournament): JSX.Element[] => {
        const headers: JSX.Element[] = [];

        if (tournament.type && tournament.type === TournamentType.DOUBLE) {
            headers.push(
                <h3>Round 1</h3>,
                <h3>Quarter-Finals</h3>,
                <h3>Semi-Finals</h3>,
                <h3>Finals</h3>,
                <h3>
                    Winner <Icon name="trophy" />
                </h3>
            );
        } else if (tournament.type && tournament.type === TournamentType.AFL) {
            headers.push(
                <h3>Finals Week 1</h3>,
                <h3>Semi Finals</h3>,
                <h3>Preliminary Finals</h3>,
                <h3>Grand Final</h3>,
                <h3>
                    Winner <Icon name="trophy" />
                </h3>
            );
        } else {
            headers.push(
                <h3>Quarter-Finals</h3>,
                <h3>Semi-Finals</h3>,
                <h3>Final</h3>,
                <h3>
                    Winner <Icon name="trophy" />
                </h3>
            );
        }

        return headers;
    };

    const getBrackets = (tournament: DbTournament): JSX.Element[] => {
        const brackets: JSX.Element[] = [];

        if (tournament.type && tournament.type === TournamentType.DOUBLE) {
            brackets.push(
                <ul className="bracket bracket-1">
                    <li className="match-item" key={0}>
                        <span className={"watermark"}>1</span>
                        {getMatchItem(tournament.matches[0], playersMap, tournament)}
                    </li>
                    <li className="match-item" key={1}>
                        <span className={"watermark"}>2</span>
                        {getMatchItem(tournament.matches[1], playersMap, tournament)}
                    </li>
                    <li className="match-item" key={2}>
                        <span className={"watermark"}>3</span>
                        {getMatchItem(tournament.matches[2], playersMap, tournament)}
                    </li>
                    <li className="match-item" key={3}>
                        <span className={"watermark"}>4</span>
                        {getMatchItem(tournament.matches[3], playersMap, tournament)}
                    </li>
                    <li className="match-item loser" key={4}>
                        <span className={"watermark"}>5</span>
                        {getMatchItem(tournament.matches[4], playersMap, tournament, "G1 Loser", "G2 Loser")}
                    </li>
                    <li className="match-item loser" key={5}>
                        <span className={"watermark"}>6</span>
                        {getMatchItem(tournament.matches[5], playersMap, tournament, "G3 Loser", "G4 Loser")}
                    </li>
                </ul>,
                <ul className="bracket bracket-2">
                    <li className="match-item" key={6}>
                        <span className={"watermark"}>7</span>
                        {getMatchItem(tournament.matches[6], playersMap, tournament, "G1 Winner", "G2 Winner")}
                    </li>
                    <li className="match-item" key={7}>
                        <span className={"watermark"}>8</span>
                        {getMatchItem(tournament.matches[7], playersMap, tournament, "G3 Winner", "G4 Winner")}
                    </li>
                    <li className="match-item loser" key={9}>
                        <span className={"watermark"}>10</span>
                        {getMatchItem(tournament.matches[9], playersMap, tournament, "G8 Loser", "G5 Winner")}
                    </li>
                    <li className="match-item loser" key={8}>
                        <span className={"watermark"}>9</span>
                        {getMatchItem(tournament.matches[8], playersMap, tournament, "G7 Loser", "G6 Winner")}
                    </li>
                </ul>,
                <ul className="bracket bracket-3">
                    <li className="match-item" key={11}>
                        <span className={"watermark"}>12</span>
                        {getMatchItem(tournament.matches[11], playersMap, tournament, "G7 Winner", "G8 Winner")}
                    </li>
                    <li className="match-item loser" key={10}>
                        <span className={"watermark"}>11</span>
                        {getMatchItem(tournament.matches[10], playersMap, tournament, "G10 Winner", "G9 Winner")}
                    </li>
                </ul>,
                <ul className="bracket bracket-4">
                    <li className="match-item" key={13}>
                        <span className={"watermark"}>14</span>
                        {getMatchItem(tournament.matches[13], playersMap, tournament, "G12 Winner", "G13 Winner")}
                    </li>
                    <li className="match-item loser" key={12}>
                        <span className={"watermark"}>13</span>
                        {getMatchItem(tournament.matches[12], playersMap, tournament, "G12 Loser", "G11 Winner")}
                    </li>
                </ul>,
                <ul className="bracket bracket-5">
                    <li className="match-item">{getWinner(tournament)}</li>
                </ul>
            );
        } else if (tournament.type && tournament.type === TournamentType.AFL) {
            brackets.push(
                <ul className="bracket bracket-1">
                    <li className="match-item" key={0}>
                        <span className={"watermark"}>QF1</span>
                        {getMatchItem(tournament.matches[0], playersMap, tournament)}
                    </li>
                    <li className="match-item" key={1}>
                        <span className={"watermark"}>EF1</span>
                        {getMatchItem(tournament.matches[1], playersMap, tournament)}
                    </li>
                    <li className="match-item" key={2}>
                        <span className={"watermark"}>EF2</span>
                        {getMatchItem(tournament.matches[2], playersMap, tournament)}
                    </li>
                    <li className="match-item" key={3}>
                        <span className={"watermark"}>QF2</span>
                        {getMatchItem(tournament.matches[3], playersMap, tournament)}
                    </li>
                </ul>,
                <ul className="bracket bracket-2">
                    <li className="match-item" key={4}>
                        <span className={"watermark"}>SF1</span>
                        {getMatchItem(tournament.matches[4], playersMap, tournament, "QF1 Loser", "EF1 Winner")}
                    </li>
                    <li className="match-item" key={5}>
                        <span className={"watermark"}>SF2</span>
                        {getMatchItem(tournament.matches[5], playersMap, tournament, "QF2 Loser", "EF2 Winner")}
                    </li>
                </ul>,
                <ul className="bracket bracket-3">
                    <li className="match-item" key={6}>
                        <span className={"watermark"}>PF1</span>
                        {getMatchItem(tournament.matches[6], playersMap, tournament, "QF1 Winner", "SF2 Winner")}
                    </li>
                    <li className="match-item" key={7}>
                        <span className={"watermark"}>PF2</span>
                        {getMatchItem(tournament.matches[7], playersMap, tournament, "QF2 Winner", "SF1 Winner")}
                    </li>
                </ul>,
                <ul className="bracket bracket-4">
                    <li className="match-item" key={8}>
                        <span className={"watermark"}>GF</span>
                        {getMatchItem(tournament.matches[8], playersMap, tournament, "PF1 Winner", "PF2 Winner")}
                    </li>
                </ul>,
                <ul className="bracket bracket-5">
                    <li className="match-item">{getWinner(tournament)}</li>
                </ul>
            );
        } else {
            brackets.push(
                <ul className="bracket bracket-2">
                    <li className="match-item" key={0}>
                        {getMatchItem(tournament.matches[0], playersMap, tournament)}
                    </li>
                    <li className="match-item" key={1}>
                        {getMatchItem(tournament.matches[1], playersMap, tournament)}
                    </li>
                    <li className="match-item" key={2}>
                        {getMatchItem(tournament.matches[2], playersMap, tournament)}
                    </li>
                    <li className="match-item" key={3}>
                        {getMatchItem(tournament.matches[3], playersMap, tournament)}
                    </li>
                </ul>,
                <ul className="bracket bracket-3">
                    <li className="match-item" key={4}>
                        {getMatchItem(tournament.matches[4], playersMap, tournament)}
                    </li>
                    <li className="match-item" key={5}>
                        {getMatchItem(tournament.matches[5], playersMap, tournament)}
                    </li>
                </ul>,
                <ul className="bracket bracket-4">
                    <li className="match-item" key={6}>
                        {getMatchItem(tournament.matches[6], playersMap, tournament)}
                    </li>
                </ul>,
                <ul className="bracket bracket-5">
                    <li className="match-item">{getWinner(tournament)}</li>
                </ul>
            );
        }

        return brackets;
    };

    const renderTournament = (tournament: DbTournament): JSX.Element => {
        return (
            <div className="tournament-container">
                <div className="tournament-headers">{getHeaders(tournament)}</div>
                <div
                    className={
                        tournament.type && tournament.type !== TournamentType.SINGLE
                            ? "tournament-brackets watermarked"
                            : "tournament-brackets single"
                    }
                >
                    {getBrackets(tournament)}
                </div>
            </div>
        );
    };

    const onNewTournamentClose = (): void => {
        openNewTournamentModal(false);
        props.setForceRefresh(true);
    };

    const onEnterTournamentGameClose = (): void => openEnterGameModal(false);

    const tournamentIsFinished = (tournament: DbTournament): boolean => {
        if (tournament.type && tournament.type === TournamentType.DOUBLE) {
            return tournament.matches[13] && tournament.matches[13].home_score !== undefined;
        } else if (tournament.type && tournament.type === TournamentType.AFL) {
            return tournament.matches[8] && tournament.matches[8].home_score !== undefined;
        } else {
            return tournament.matches[6] && tournament.matches[6].home_score !== undefined;
        }
    };

    const getRecapMatchLabels = (match: DbTournamentMatch, winnerRank: number, loserRank: number): JSX.Element[] => {
        const labels: JSX.Element[] = [];

        if (match.home_score !== undefined && match.away_score !== undefined) {
            if (match.home_score === 0 || match.away_score === 0) {
                labels.push(
                    <Label color={"red"}>
                        <Icon name={"tint"} /> FATALITY
                    </Label>
                );
            }
            if (Math.abs(match.home_score - match.away_score) < 5) {
                labels.push(
                    <Label color={"yellow"}>
                        <Icon name={"bolt"} /> THRILLER
                    </Label>
                );
            }
            if (winnerRank > loserRank) {
                labels.push(
                    <Label color={"orange"}>
                        <Icon name={"exclamation"} /> UPSET
                    </Label>
                );
            }
            if (match.home_score > 21 || match.away_score > 21) {
                labels.push(
                    <Label color={"grey"}>
                        <Icon name={"hourglass"} /> MARATHON
                    </Label>
                );
            }
        }

        return labels;
    };

    const getMatchName = (match: DbTournamentMatch, tournamentType: TournamentType): string => {
        switch (tournamentType) {
            case TournamentType.SINGLE:
                switch (match.match_number) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        return "Quarter Final";
                    case 4:
                    case 5:
                        return "Semi Final";
                    case 6:
                        return "Final";
                }
                break;
            case TournamentType.DOUBLE:
                return "Game " + (match.match_number + 1).toString();
            case TournamentType.AFL:
                if (match.match_number === 0) return "Qualifying Final 1";
                if (match.match_number === 1) return "Elimination Final 1";
                if (match.match_number === 2) return "Elimination Final 2";
                if (match.match_number === 3) return "Qualifying Final 2";
                if (match.match_number === 4) return "Semi Final 1";
                if (match.match_number === 5) return "Semi Final 2";
                if (match.match_number === 6) return "Preliminary Final 1";
                if (match.match_number === 7) return "Preliminary Final 2";
                if (match.match_number === 8) return "Grand Final";
        }
        return "";
    };

    const getRecapMatches = (): JSX.Element[] => {
        const recapMatches: JSX.Element[] = [];

        recapMatches.push(<p className={"recap-match"}>{sortedTournaments[0].name}</p>);

        sortedTournaments[0].matches.forEach((match: DbTournamentMatch) => {
            // The scores should always be defined, because we've finished the tournament if we're showing a recap.
            if (match.home_score !== undefined && match.away_score !== undefined) {
                const homeWon = match.home_score > match.away_score;
                const winnerId = homeWon ? match.home_player_id : match.away_player_id;
                const loserId = homeWon ? match.away_player_id : match.home_player_id;
                const winnerName = playersMap.get(winnerId)?.name;
                const loserName = playersMap.get(loserId)?.name;
                const winnerScore = homeWon ? match.home_score : match.away_score;
                const loserScore = homeWon ? match.away_score : match.home_score;
                const winnerRank = getPlayerRank(sortedTournaments[0], winnerId);
                const loserRank = getPlayerRank(sortedTournaments[0], loserId);

                recapMatches.push(
                    <p className={"recap-match"}>
                        {getMatchName(match, sortedTournaments[0].type ?? TournamentType.SINGLE)}
                        <br />({winnerRank}) {winnerName} defeated ({loserRank}) {loserName}, {winnerScore}-{loserScore}
                        <br />
                        {getRecapMatchLabels(match, winnerRank, loserRank)}
                    </p>
                );
            }
        });
        recapMatches.push(<p className={"recap-match"}>Congratulations, {getWinner(sortedTournaments[0])}!</p>);
        return recapMatches;
    };

    const playPastTableAudio = (): void => {
        if (synth) {
            arcadeAudioSynth.pause();
            pastTournamentsAudioSynth.play();
        } else {
            arcadeAudioVapour.pause();
            pastTournamentsAudioVapour.play();
        }
    };

    const playPastArcadeAudio = (): void => {
        if (synth) {
            pastTournamentsAudioSynth.pause();
            arcadeAudioSynth.play();
        } else {
            pastTournamentsAudioVapour.pause();
            arcadeAudioVapour.play();
        }
    };

    const getPastWinners = (tournaments: DbTournament[]): JSX.Element[] => {
        const pastWinners: JSX.Element[] = [];

        tournaments.forEach((tournament: DbTournament) => {
            pastWinners.push(<p className={"past-winner"}>{getWinner(tournament)}</p>);
        });

        return pastWinners;
    };

    const getHighScoresTableRows = (): JSX.Element[] => {
        const tableRows: JSX.Element[] = [];
        const playerPointsWon: Map<string, number> = new Map<string, number>();

        sortedTournaments.slice(1).forEach((tournament: DbTournament) => {
            tournament.matches.forEach((match: DbTournamentMatch) => {
                if (match.home_score !== undefined && match.away_score !== undefined) {
                    if (playerPointsWon.has(match.home_player_id)) {
                        playerPointsWon.set(
                            match.home_player_id,
                            (playerPointsWon.get(match.home_player_id) ?? 0) + match.home_score
                        );
                    } else {
                        playerPointsWon.set(match.home_player_id, match.home_score);
                    }
                    if (playerPointsWon.has(match.away_player_id)) {
                        playerPointsWon.set(
                            match.away_player_id,
                            (playerPointsWon.get(match.away_player_id) ?? 0) + match.away_score
                        );
                    } else {
                        playerPointsWon.set(match.away_player_id, match.away_score);
                    }
                }
            });
        });

        props.players
            .sort(
                (p1, p2) =>
                    (p2.tournamentWins ?? 0) - (p1.tournamentWins ?? 0) ||
                    (playerPointsWon.get(p2.id) ?? 0) - (playerPointsWon.get(p1.id) ?? 0)
            )
            .slice(0, synth ? 10 : 3)
            .forEach((player: DbPlayer) => {
                tableRows.push(
                    <tr>
                        <td>{player.name}</td>
                        <td>{player.tournamentWins ?? 0}</td>
                        <td>{playerPointsWon.get(player.id) ?? 0}</td>
                    </tr>
                );
            });

        return tableRows;
    };

    return (
        <div>
            {sortedTournaments.length > 0 && tournamentIsFinished(sortedTournaments[0]) ? (
                <div>
                    <div className={"congrats-div"}>Congratulations {getWinner(sortedTournaments[0])}!</div>
                    <div className={"new-tournament-div"}>
                        <Button
                            onClick={(): void => {
                                openRecapModal(true);
                                recapAudio.play();
                            }}
                            id={"recapButton"}
                        >
                            View tournament recap
                        </Button>
                        <Button onClick={(): void => openNewTournamentModal(true)} className={"new-tournament-button"}>
                            Start new tournament?
                        </Button>
                    </div>
                    <Modal
                        closeIcon
                        onClose={(): void => {
                            openRecapModal(false);
                            recapAudio.pause();
                            recapAudio.currentTime = 0;
                        }}
                        open={recapModalOpen}
                        id={"recapModal"}
                    >
                        <Modal.Header>Tournament recap</Modal.Header>
                        <Modal.Content>
                            <div>{getRecapMatches()}</div>
                        </Modal.Content>
                    </Modal>
                </div>
            ) : (
                <span />
            )}
            {sortedTournaments.length > 0 && sortedTournaments[0].matches.length > 0 ? (
                <div>
                    <div className={"tournament-details"}>
                        <Header
                            content={
                                <span>
                                    {sortedTournaments[0].name}
                                    <Label color={"orange"}>
                                        {(
                                            sortedTournaments[0].participants ?? TournamentParticipantsType.STANDARD
                                        ).toUpperCase()}
                                    </Label>
                                    <Label color={"orange"}>
                                        {(sortedTournaments[0].type ?? TournamentType.SINGLE).toUpperCase()}
                                    </Label>
                                </span>
                            }
                            subheader={"Start date: " + sortedTournaments[0].start_date}
                        />
                    </div>
                    {renderTournament(sortedTournaments[0])}
                    <Message
                        id={"rulesMsg"}
                        icon={"warning sign"}
                        header={"Remember the tournament rules!"}
                        content={
                            <div className={"rules-content-wrapper"}>
                                <ul>
                                    <li>Play to 21, and you must win by 2!</li>
                                    <li>Swap sides when the total score adds up to 20!</li>
                                </ul>
                            </div>
                        }
                    />
                    <Button
                        onClick={(): void => {
                            openViewPastModal(true);
                            if (synth && pastTournamentView === "table") {
                                pastTournamentsAudioSynth.play();
                            } else if (synth) {
                                arcadeAudioSynth.play();
                            } else if (pastTournamentView === "table") {
                                pastTournamentsAudioVapour.play();
                            } else {
                                arcadeAudioVapour.play();
                            }
                        }}
                        id={synth ? "pastTournamentsButtonSynth" : "pastTournamentsButtonVapour"}
                    >
                        <Icon name={"backward"} />
                        View past tournaments <Icon name={"music"} />
                    </Button>
                </div>
            ) : (
                <div className={"new-tournament-div"}>
                    {!props.loading ? (
                        <Button onClick={(): void => openNewTournamentModal(true)} className={"new-tournament-button"}>
                            Start new tournament!
                        </Button>
                    ) : (
                        <span />
                    )}
                </div>
            )}
            <NewTournament
                onClose={onNewTournamentClose}
                isOpen={newTournamentModalOpen}
                sortedPlayers={sortedPlayers}
            />
            <EnterTournamentGame
                onClose={onEnterTournamentGameClose}
                isOpen={enterGameModalOpen}
                refresh={(): void => props.setForceRefresh(true)}
                matchEntering={matchEntering}
                currentTournament={sortedTournaments[0]}
                homePlayerEntering={homePlayerEntering}
                awayPlayerEntering={awayPlayerEntering}
                playersMap={playersMap}
            />
            <Modal
                closeIcon
                onClose={(): void => {
                    openViewPastModal(false);
                    pastTournamentsAudioSynth.pause();
                    pastTournamentsAudioVapour.pause();
                    arcadeAudioSynth.pause();
                    arcadeAudioVapour.pause();
                }}
                open={viewPastModalOpen}
                id={synth ? "pastTournamentsModalSynth" : "pastTournamentsModalVapour"}
            >
                <Modal.Header>
                    <span>Past tournaments</span>
                    {synth ? (
                        <Button.Group id={"pastModalButtons"} color={"orange"}>
                            <Button
                                active={pastTournamentView === "table"}
                                onClick={(): void => {
                                    setPastTournamentView("table");
                                    playPastTableAudio();
                                }}
                            >
                                Table
                            </Button>
                            <Button
                                active={pastTournamentView === "winners"}
                                onClick={(): void => {
                                    setPastTournamentView("winners");
                                    playPastArcadeAudio();
                                }}
                            >
                                Winners
                            </Button>
                            <Button
                                active={pastTournamentView === "high-scores"}
                                onClick={(): void => {
                                    setPastTournamentView("high-scores");
                                    playPastArcadeAudio();
                                }}
                            >
                                High Scores
                            </Button>
                        </Button.Group>
                    ) : (
                        <Dropdown
                            id={"pastModalDropdown"}
                            onChange={(e, { value }): void => {
                                setPastTournamentView(value as string);
                                if ((value as string) === "table") playPastTableAudio();
                                else playPastArcadeAudio();
                            }}
                            options={[
                                { text: "Table", value: "table" },
                                { text: "Winners", value: "winners" },
                                { text: "High Scores", value: "high-scores" },
                            ]}
                            value={pastTournamentView}
                        />
                    )}
                </Modal.Header>
                <Modal.Content>
                    {pastTournamentView === "table" ? (
                        <Table
                            id={synth ? "pastTournamentsTableSynth" : "pastTournamentsTableVapour"}
                            color={synth ? "orange" : "pink"}
                            inverted
                        >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Tournament name</Table.HeaderCell>
                                    <Table.HeaderCell>Tournament participants</Table.HeaderCell>
                                    <Table.HeaderCell>Tournament type</Table.HeaderCell>
                                    <Table.HeaderCell>Start date</Table.HeaderCell>
                                    <Table.HeaderCell>End date</Table.HeaderCell>
                                    <Table.HeaderCell>Winner</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>{getPastTournamentsTableRows(sortedTournaments.slice(1))}</Table.Body>
                        </Table>
                    ) : (
                        <span />
                    )}
                    {pastTournamentView === "winners" ? (
                        <div id={synth ? "pastWinnersSynth" : "pastWinnersVapour"}>
                            <div id={"pastWinnersTitle"}>10 MOST RECENT TOURNAMENT WINNERS</div>
                            {getPastWinners(sortedTournaments.slice(1, 11))}
                        </div>
                    ) : (
                        <span />
                    )}
                    {pastTournamentView === "high-scores" ? (
                        <div id={synth ? "highScoresSynth" : "highScoresVapour"}>
                            <div id={"highScoresTitle"}>TOURNAMENT HIGH SCORES TOP {synth ? 10 : 3}</div>
                            <table id={"highScoresTable"}>
                                <tr>
                                    <th>{synth ? "Player name" : "Name"}</th>
                                    <th>{synth ? "Tournament wins" : "Tourn. Ws"}</th>
                                    <th>{synth ? "Points won" : "Pts won"}</th>
                                </tr>
                                {getHighScoresTableRows()}
                            </table>
                        </div>
                    ) : (
                        <span />
                    )}
                    <div>
                        <Button
                            id={synth ? "vapourToggle" : "synthToggle"}
                            onClick={(): void => {
                                if (synth && pastTournamentView === "table") {
                                    pastTournamentsAudioSynth.pause();
                                    pastTournamentsAudioVapour.play();
                                } else if (synth) {
                                    arcadeAudioSynth.pause();
                                    arcadeAudioVapour.play();
                                } else if (pastTournamentView === "table") {
                                    pastTournamentsAudioVapour.pause();
                                    pastTournamentsAudioSynth.play();
                                } else {
                                    arcadeAudioVapour.pause();
                                    arcadeAudioSynth.play();
                                }
                                setSynth(!synth);
                            }}
                        >
                            {synth ? "Change to Vapour" : "Change to Synth"}
                        </Button>
                    </div>
                </Modal.Content>

                <Modal
                    closeIcon
                    onClose={(): void => openSecondPastModal(false)}
                    open={secondPastModalOpen}
                    id={synth ? "secondPastTournamentsModalSynth" : "secondPastTournamentsModalVapour"}
                >
                    <Modal.Header>{pastTournamentBeingViewed?.name}</Modal.Header>
                    <Modal.Content>
                        {pastTournamentBeingViewed ? renderTournament(pastTournamentBeingViewed) : <span />}
                    </Modal.Content>
                </Modal>
            </Modal>
        </div>
    );
}

export const getISODate = (): string => {
    const startDateWrongFormat = getTodaysDate();
    return `${startDateWrongFormat.slice(6, 10)}-${startDateWrongFormat.slice(3, 5)}-${startDateWrongFormat.slice(
        0,
        2
    )}`;
};

export default Tournament;
