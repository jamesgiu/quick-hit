import { useState } from "react";
import { Modal, Icon, Form, Table, Grid } from "semantic-ui-react";
import { QuickHitAPI } from "../../../api/QuickHitAPI";
import { DbPlayer, DbTournamentMatch, DbTournament } from "../../../types/database/models";
import { makeSuccessToast, makeErrorToast } from "../../Toast/Toast";
import { v4 as uuidv4 } from "uuid";
import { getISODate } from "../Tournament";
import "./NewTournament.css";
import { TournamentParticipantsType, TournamentType } from "../../../types/types";

interface NewTournamentProps {
    onClose: () => void;
    isOpen: boolean;
    sortedPlayers: DbPlayer[];
}

function NewTournament(props: NewTournamentProps): JSX.Element {
    const [startingNewTournament, setStartingNewTournament] = useState<boolean>(false);
    const [newTournamentName, setNewTournamentName] = useState<string>("");
    const [newTournamentParticipantsType, setParticipantsType] = useState<TournamentParticipantsType>(
        TournamentParticipantsType.STANDARD
    );
    const [newTournamentType, setTournamentType] = useState<TournamentType>(TournamentType.SINGLE);

    const startNewTournament = (): void => {
        const onSuccess = (): void => {
            makeSuccessToast("Tournament started!", `A new tournament ${name} has been started!`);
            setStartingNewTournament(false);
            props.onClose();
        };

        const onError = (errorMsg: string): void => {
            makeErrorToast("Could not start tournament", errorMsg);
            setStartingNewTournament(false);
        };

        setStartingNewTournament(true);

        const players: DbPlayer[] = [...props.sortedPlayers];
        if (newTournamentParticipantsType === TournamentParticipantsType.REVERSE) {
            players.reverse();
        }

        const tournamentMatches: DbTournamentMatch[] = [];
        if (newTournamentType === TournamentType.AFL) {
            tournamentMatches.push(
                {
                    match_number: 0,
                    home_player_id: players[0].id,
                    away_player_id: players[3].id,
                },
                {
                    match_number: 1,
                    home_player_id: players[4].id,
                    away_player_id: players[7].id,
                },
                {
                    match_number: 2,
                    home_player_id: players[5].id,
                    away_player_id: players[6].id,
                },
                {
                    match_number: 3,
                    home_player_id: players[1].id,
                    away_player_id: players[2].id,
                }
            );
        } else {
            tournamentMatches.push(
                {
                    match_number: 0,
                    home_player_id: players[0].id,
                    away_player_id: players[7].id,
                },
                {
                    match_number: 1,
                    home_player_id: players[3].id,
                    away_player_id: players[4].id,
                },
                {
                    match_number: 2,
                    home_player_id: players[1].id,
                    away_player_id: players[6].id,
                },
                {
                    match_number: 3,
                    home_player_id: players[2].id,
                    away_player_id: players[5].id,
                }
            );
        }

        const newTournament: DbTournament = {
            id: uuidv4(),
            name: newTournamentName,
            start_date: getISODate(),
            matches: tournamentMatches,
            participants: newTournamentParticipantsType,
            type: newTournamentType,
        };

        QuickHitAPI.addUpdateTournament(newTournament, onSuccess, onError);
    };

    const getLadderTableRows = (): JSX.Element[] => {
        const ladderPlayers: DbPlayer[] = [...props.sortedPlayers];
        if (newTournamentParticipantsType === TournamentParticipantsType.REVERSE) {
            ladderPlayers.reverse();
        }
        const tableRows: JSX.Element[] = [];
        for (let i = 0; i < ladderPlayers.length; ++i) {
            tableRows.push(
                <Table.Row positive={i <= 7} negative={i >= 8}>
                    <Table.Cell>{i + 1}</Table.Cell>
                    <Table.Cell>
                        <Icon name={ladderPlayers[i].icon} /> {ladderPlayers[i].name}
                    </Table.Cell>
                    <Table.Cell>{ladderPlayers[i].elo}</Table.Cell>
                </Table.Row>
            );
        }
        return tableRows;
    };

    return (
        <Modal closeIcon onClose={props.onClose} open={props.isOpen}>
            <Modal.Header>
                Start new tournament <Icon name={"trophy"} />
            </Modal.Header>
            <Modal.Content>
                <Grid id={"contentGrid"} divided>
                    <Grid.Column className={"content-column"}>
                        <Form onSubmit={(): void => startNewTournament()}>
                            <Form.Input
                                label={"Tournament name"}
                                onChange={(event, data): void => setNewTournamentName(data.value)}
                                required
                            />
                            <Form.Group inline>
                                <label>Tournament participants</label>
                                <Form.Radio
                                    label={"Standard"}
                                    value={TournamentParticipantsType.STANDARD}
                                    checked={newTournamentParticipantsType === TournamentParticipantsType.STANDARD}
                                    onChange={(event, { value }): void =>
                                        setParticipantsType(value as TournamentParticipantsType)
                                    }
                                />
                                <Form.Radio
                                    label={"Reverse"}
                                    value={TournamentParticipantsType.REVERSE}
                                    checked={newTournamentParticipantsType === TournamentParticipantsType.REVERSE}
                                    onChange={(event, { value }): void =>
                                        setParticipantsType(value as TournamentParticipantsType)
                                    }
                                />
                            </Form.Group>
                            <Form.Field label={"Tournament type"} />
                            <Form.Radio
                                label={"Single elimination"}
                                value={TournamentType.SINGLE}
                                checked={newTournamentType === TournamentType.SINGLE}
                                onChange={(event, { value }): void => setTournamentType(value as TournamentType)}
                            />
                            <Form.Radio
                                label={"Double elimination"}
                                value={TournamentType.DOUBLE}
                                checked={newTournamentType === TournamentType.DOUBLE}
                                onChange={(event, { value }): void => setTournamentType(value as TournamentType)}
                            />
                            <Form.Radio
                                label={"AFL-style"}
                                value={TournamentType.AFL}
                                checked={newTournamentType === TournamentType.AFL}
                                onChange={(event, { value }): void => setTournamentType(value as TournamentType)}
                            />
                            <Form.Button disabled={!newTournamentName || startingNewTournament} id={"newTournamentBtn"}>
                                {`Start tournament with these top 8 players  `}
                                {startingNewTournament ? <Icon loading name={"spinner"} /> : <span />}
                            </Form.Button>
                        </Form>
                    </Grid.Column>
                    <Grid.Column className={"content-column"}>
                        <div id={"newTournamentLadderScroller"}>
                            <Table id={"newTournamentLadderTable"}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Ladder position</Table.HeaderCell>
                                        <Table.HeaderCell>Player name</Table.HeaderCell>
                                        <Table.HeaderCell>Player ELO</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>{getLadderTableRows()}</Table.Body>
                            </Table>
                        </div>
                    </Grid.Column>
                </Grid>
            </Modal.Content>
        </Modal>
    );
}

export default NewTournament;
