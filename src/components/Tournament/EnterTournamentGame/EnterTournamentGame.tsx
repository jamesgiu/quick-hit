import { useEffect, useState } from "react";
import { Modal, Form, Icon } from "semantic-ui-react";
import { QuickHitAPI } from "../../../api/QuickHitAPI";
import { DbPlayer, DbTournament, DbTournamentMatch } from "../../../types/database/models";
import { generateTournamentAchievements } from "../../Achievements/AchievementChecker";
import { TournamentType } from "../../../types/types";
import { makeSuccessToast, makeErrorToast } from "../../Toast/Toast";
import { getISODate } from "../Tournament";
import "./EnterTournamentGame.css";

interface EnterTournamentGameProps {
    onClose: () => void;
    isOpen: boolean;
    refresh: () => void;
    // In theory, the below three will never be undefined.
    matchEntering: DbTournamentMatch | undefined;
    homePlayerEntering: DbPlayer | undefined;
    awayPlayerEntering: DbPlayer | undefined;
    currentTournament: DbTournament;
    playersMap: Map<string, DbPlayer>;
}

function EnterTournamentGame(props: EnterTournamentGameProps): JSX.Element {
    const [homePlayerEnteringScore, setHomePlayerEnteringScore] = useState<number | undefined>(undefined);
    const [awayPlayerEnteringScore, setAwayPlayerEnteringScore] = useState<number | undefined>(undefined);
    const [confirmingMatchScore, setConfirmingMatchScore] = useState<boolean>(false);

    useEffect(() => {
        if (props.awayPlayerEntering?.retired) {
            setHomePlayerEnteringScore(21);
            setAwayPlayerEnteringScore(0);
        } else if (props.homePlayerEntering?.retired && !props.awayPlayerEntering?.retired) {
            setHomePlayerEnteringScore(0);
            setAwayPlayerEnteringScore(21);
        }
    }, [props.homePlayerEntering, props.awayPlayerEntering]);

    const endTournament = (
        matchEntering: DbTournamentMatch,
        homeWon: boolean,
        onError: (errorMsg: string) => void
    ): void => {
        const matchWinnerId = homeWon ? matchEntering.home_player_id : matchEntering.away_player_id;
        const matchLoserId = homeWon ? matchEntering.away_player_id : matchEntering.home_player_id;

        props.currentTournament.end_date = getISODate();
        const tournamentWinner = props.playersMap.get(matchWinnerId);
        const tournamentRunnerUp = props.playersMap.get(matchLoserId);
        if (tournamentWinner && tournamentRunnerUp) {
            if (tournamentWinner.tournamentWins) {
                ++tournamentWinner.tournamentWins;
            } else {
                tournamentWinner.tournamentWins = 1;
            }

            if (tournamentRunnerUp.tournamentRunnerUps) {
                ++tournamentRunnerUp.tournamentRunnerUps;
            } else {
                tournamentRunnerUp.tournamentRunnerUps = 1;
            }

            const onPlayerUpdateFailure = (errorMsg: string): void => {
                onError(errorMsg);
                return;
            };

            QuickHitAPI.addOrUpdatePlayer(
                tournamentWinner,
                () => {
                    /* Do nothing on success. */
                },
                onPlayerUpdateFailure
            );

            QuickHitAPI.addOrUpdatePlayer(
                tournamentRunnerUp,
                () => {
                    /* Do nothing on success. */
                },
                onPlayerUpdateFailure
            );

            generateTournamentAchievements(props.currentTournament.name, tournamentWinner, tournamentRunnerUp, onError);
        }
    };

    const updateMatchAndTournament = (): void => {
        const onSuccess = (): void => {
            setHomePlayerEnteringScore(undefined);
            setAwayPlayerEnteringScore(undefined);
            makeSuccessToast("Game entered!", "The tournament marches on!");
            props.onClose();
            setConfirmingMatchScore(false);
            props.refresh();
        };

        const onError = (errorMsg: string): void => {
            makeErrorToast("Game not entered!", errorMsg);
            setConfirmingMatchScore(false);
            props.refresh();
        };

        setConfirmingMatchScore(true);

        // Should never be true.
        if (!props.matchEntering) {
            makeErrorToast("Come on man", "You've got to be entering a score");
            setConfirmingMatchScore(false);
            return;
        }

        // Also should never be true.
        if (homePlayerEnteringScore === undefined || awayPlayerEnteringScore === undefined) {
            makeErrorToast("Come on man", "You've got to enter a score");
            setConfirmingMatchScore(false);
            props.refresh();
            return;
        }

        if (homePlayerEnteringScore === awayPlayerEnteringScore) {
            makeErrorToast("Come on man", "Winning player score must be higher than losing player score");
            setConfirmingMatchScore(false);
            props.refresh();
            return;
        }

        props.matchEntering.home_score = homePlayerEnteringScore;
        props.matchEntering.away_score = awayPlayerEnteringScore;

        const homeWon = homePlayerEnteringScore > awayPlayerEnteringScore;
        const matchWinnerId = homeWon ? props.matchEntering.home_player_id : props.matchEntering.away_player_id;
        const matchLoserId = homeWon ? props.matchEntering.away_player_id : props.matchEntering.home_player_id;

        if (props.currentTournament.type && props.currentTournament.type === TournamentType.DOUBLE) {
            // Add the winner's ID (and loser's ID, if it's their first loss) to their next match.
            switch (props.matchEntering.match_number) {
                case 0:
                    updateFutureTournamentMatch(6, matchWinnerId, true);
                    updateFutureTournamentMatch(4, matchLoserId, true);
                    break;
                case 1:
                    updateFutureTournamentMatch(6, matchWinnerId, false);
                    updateFutureTournamentMatch(4, matchLoserId, false);
                    break;
                case 2:
                    updateFutureTournamentMatch(7, matchWinnerId, true);
                    updateFutureTournamentMatch(5, matchLoserId, true);
                    break;
                case 3:
                    updateFutureTournamentMatch(7, matchWinnerId, false);
                    updateFutureTournamentMatch(5, matchLoserId, false);
                    break;
                case 4:
                    updateFutureTournamentMatch(9, matchWinnerId, false);
                    break;
                case 5:
                    updateFutureTournamentMatch(8, matchWinnerId, false);
                    break;
                case 6:
                    updateFutureTournamentMatch(11, matchWinnerId, true);
                    updateFutureTournamentMatch(8, matchLoserId, true);
                    break;
                case 7:
                    updateFutureTournamentMatch(11, matchWinnerId, false);
                    updateFutureTournamentMatch(9, matchLoserId, true);
                    break;
                case 8:
                    updateFutureTournamentMatch(10, matchWinnerId, false);
                    break;
                case 9:
                    updateFutureTournamentMatch(10, matchWinnerId, true);
                    break;
                case 10:
                    updateFutureTournamentMatch(12, matchWinnerId, false);
                    break;
                case 11:
                    updateFutureTournamentMatch(13, matchWinnerId, true);
                    updateFutureTournamentMatch(12, matchLoserId, true);
                    break;
                case 12:
                    updateFutureTournamentMatch(13, matchWinnerId, false);
                    break;
                case 13:
                    // If the last game is being entered, then the tournament is over, and we can add its end date.
                    endTournament(props.matchEntering, homeWon, onError);
                    break;
            }
        } else if (props.currentTournament.type && props.currentTournament.type === TournamentType.AFL) {
            // Add the winner's ID (and loser's ID, if it's they have the double chance) to their next match.
            switch (props.matchEntering.match_number) {
                case 0:
                    updateFutureTournamentMatch(6, matchWinnerId, true);
                    updateFutureTournamentMatch(4, matchLoserId, true);
                    break;
                case 1:
                    updateFutureTournamentMatch(4, matchWinnerId, false);
                    break;
                case 2:
                    updateFutureTournamentMatch(5, matchWinnerId, false);
                    break;
                case 3:
                    updateFutureTournamentMatch(7, matchWinnerId, true);
                    updateFutureTournamentMatch(5, matchLoserId, true);
                    break;
                case 4:
                    updateFutureTournamentMatch(7, matchWinnerId, false);
                    break;
                case 5:
                    updateFutureTournamentMatch(6, matchWinnerId, false);
                    break;
                case 6:
                    updateFutureTournamentMatch(8, matchWinnerId, true);
                    break;
                case 7:
                    updateFutureTournamentMatch(8, matchWinnerId, false);
                    break;
                case 8:
                    // If the grand final is being entered, then the tournament is over, and we can add its end date.
                    endTournament(props.matchEntering, homeWon, onError);
                    break;
            }
        } else {
            // Add the winner's ID to their next match.
            switch (props.matchEntering.match_number) {
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
                case 6:
                    // If the last game is being entered, then the tournament is over, and we can add its end date.
                    endTournament(props.matchEntering, homeWon, onError);
                    break;
            }
        }

        QuickHitAPI.addUpdateTournament(props.currentTournament, onSuccess, onError);
    };

    const updateFutureTournamentMatch = (
        futureMatchIndex: number,
        futurePlayerId: string,
        winnerWillBeHome: boolean
    ): void => {
        // If the future match already exists, just add the winner's ID to it. Otherwise, make the new match, with the winner's ID.
        if (props.currentTournament.matches[futureMatchIndex]) {
            if (winnerWillBeHome) {
                props.currentTournament.matches[futureMatchIndex].home_player_id = futurePlayerId;
            } else {
                props.currentTournament.matches[futureMatchIndex].away_player_id = futurePlayerId;
            }
        } else {
            if (winnerWillBeHome) {
                props.currentTournament.matches[futureMatchIndex] = {
                    match_number: futureMatchIndex,
                    home_player_id: futurePlayerId,
                    away_player_id: "",
                };
            } else {
                props.currentTournament.matches[futureMatchIndex] = {
                    match_number: futureMatchIndex,
                    home_player_id: "",
                    away_player_id: futurePlayerId,
                };
            }
        }
    };

    return (
        <Modal closeIcon onClose={props.onClose} open={props.isOpen}>
            <Modal.Header>Enter tournament game</Modal.Header>
            <Modal.Content>
                <Form onSubmit={updateMatchAndTournament}>
                    <Form.Group widths="equal">
                        <Form.Input
                            className={"tournament-score-input"}
                            label={props.homePlayerEntering?.name + "'s score"}
                            type={"number"}
                            min={0}
                            value={homePlayerEnteringScore}
                            onChange={(event, data): void => setHomePlayerEnteringScore(parseInt(data.value))}
                            disabled={props.homePlayerEntering?.retired || props.awayPlayerEntering?.retired}
                            required
                        />
                        <Form.Input
                            className={"tournament-score-input"}
                            label={props.awayPlayerEntering?.name + "'s score"}
                            type={"number"}
                            min={0}
                            value={awayPlayerEnteringScore}
                            onChange={(event, data): void => setAwayPlayerEnteringScore(parseInt(data.value))}
                            disabled={props.homePlayerEntering?.retired || props.awayPlayerEntering?.retired}
                            required
                        />
                    </Form.Group>
                    <Form.Button
                        className={"confirm-score-button"}
                        disabled={
                            homePlayerEnteringScore === undefined ||
                            awayPlayerEnteringScore === undefined ||
                            confirmingMatchScore
                        }
                    >
                        {`Confirm score  `}
                        {confirmingMatchScore ? <Icon loading name={"spinner"} /> : <span />}
                    </Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

export default EnterTournamentGame;
