import { useState } from "react";
import { Modal, Form, Icon } from "semantic-ui-react";
import { QuickHitAPI } from "../../../api/QuickHitAPI";
import { DbTournament, DbTournamentMatch } from "../../../types/database/models";
import { makeSuccessToast, makeErrorToast } from "../../Toast/Toast";
import { getISODate } from "../Tournament";
import "./EnterTournamentGame.css";

interface EnterTournamentGameProps {
    onClose: () => void;
    isOpen: boolean;
    refresh: () => void;
    matchEntering: DbTournamentMatch | undefined;
    currentTournament: DbTournament;
    homePlayerEntering: string;
    awayPlayerEntering: string;
}

function EnterTournamentGame(props: EnterTournamentGameProps): JSX.Element {
    const [homePlayerEnteringScore, setHomePlayerEnteringScore] = useState<number | undefined>(undefined);
    const [awayPlayerEnteringScore, setAwayPlayerEnteringScore] = useState<number | undefined>(undefined);
    const [confirmingMatchScore, setConfirmingMatchScore] = useState<boolean>(false);

    const updateMatchAndTournament = () => {
        const onSuccess = () => {
            setHomePlayerEnteringScore(undefined);
            setAwayPlayerEnteringScore(undefined);
            makeSuccessToast("Game entered!", "The tournament marches on!");
            props.onClose();
            setConfirmingMatchScore(false);
            props.refresh();
        };

        const onError = (errorMsg: string) => {
            makeErrorToast("Game not entered!", errorMsg);
            setConfirmingMatchScore(false);
            props.refresh();
        };

        setConfirmingMatchScore(true);

        if (!props.matchEntering) {
            makeErrorToast("Come on man", "You've got to be entering a score");
            return;
        }

        if (!homePlayerEnteringScore || !awayPlayerEnteringScore) {
            makeErrorToast("Come on man", "You've got to enter a score");
            props.refresh();
            return;
        }

        if (homePlayerEnteringScore === awayPlayerEnteringScore) {
            makeErrorToast("Come on man", "Winning player score must be higher than losing player score");
            props.refresh();
            return;
        }

        props.matchEntering.home_score = homePlayerEnteringScore;
        props.matchEntering.away_score = awayPlayerEnteringScore;

        const homeWon = homePlayerEnteringScore > awayPlayerEnteringScore;
        const matchWinnerId = homeWon ? props.matchEntering.home_player_id : props.matchEntering.away_player_id;

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
                props.currentTournament.end_date = getISODate();
                break;
        }

        QuickHitAPI.addUpdateTournament(props.currentTournament, onSuccess, onError);
    };

    const updateFutureTournamentMatch = (futureMatchIndex: number,
                                         previousMatchWinnerId: string, 
                                         winnerWillBeHome: boolean) => {
        if (props.currentTournament.matches[futureMatchIndex]) {
            if (winnerWillBeHome) {
                props.currentTournament.matches[futureMatchIndex].home_player_id = previousMatchWinnerId;
            } else {
                props.currentTournament.matches[futureMatchIndex].away_player_id = previousMatchWinnerId;
            }
        } else {
            if (winnerWillBeHome) {
                props.currentTournament.matches[futureMatchIndex] = {
                    match_number: futureMatchIndex,
                    home_player_id: previousMatchWinnerId,
                    away_player_id: ""
                };
            } else {
                props.currentTournament.matches[futureMatchIndex] = {
                    match_number: futureMatchIndex,
                    home_player_id: "",
                    away_player_id: previousMatchWinnerId
                };
            }
        }
    };

    return (
        <Modal
            onClose={props.onClose}
            open={props.isOpen}
            >
            <Modal.Header>
                Enter tournament game
            </Modal.Header>
            <Modal.Content>
                <Form onSubmit={updateMatchAndTournament}>
                    <Form.Group widths="equal">
                        <Form.Input className={"tournament-score-input"}
                                    label={props.homePlayerEntering + "'s score"}
                                    type={"number"}
                                    min={0}
                                    value={homePlayerEnteringScore}
                                    onChange={(event, data) => setHomePlayerEnteringScore(parseInt(data.value))}
                                    required/>
                        <Form.Input className={"tournament-score-input"}
                                    label={props.awayPlayerEntering + "'s score"}
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
    );
}

export default EnterTournamentGame;