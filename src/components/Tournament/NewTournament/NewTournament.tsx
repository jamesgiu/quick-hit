import { useState } from "react";
import { Modal, Icon, Form, Table } from "semantic-ui-react";
import { QuickHitAPI } from "../../../api/QuickHitAPI";
import { DbPlayer, DbTournamentMatch, DbTournament } from "../../../types/database/models";
import { makeSuccessToast, makeErrorToast } from "../../Toast/Toast";
import { v4 as uuidv4 } from "uuid";
import { getISODate } from "../Tournament";
import "./NewTournament.css";

interface NewTournamentProps {
    onClose: () => void;
    isOpen: boolean;
    sortedPlayers: DbPlayer[];
}

function NewTournament(props: NewTournamentProps): JSX.Element {
    const [startingNewTournament, setStartingNewTournament] = useState<boolean>(false);
    const [newTournamentName, setNewTournamentName] = useState<string>("");

    const startNewTournament = (players: DbPlayer[], name: string) => {
        const onSuccess = () => {
            makeSuccessToast("Tournament started!", `A new tournament ${name} has been started!`);
            setStartingNewTournament(false);
            props.onClose();
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
    
        const newTournament: DbTournament = {
            "id": uuidv4(),
            name,
            "start_date": getISODate(),
            "matches": tournamentMatches
        };
    
        QuickHitAPI.addUpdateTournament(newTournament, onSuccess, onError);
    };

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

    return (
        <Modal
            onClose={props.onClose}
            open={props.isOpen}
            >
            <Modal.Header>
                Start new tournament <Icon name={"trophy"}/>
            </Modal.Header>
            <Modal.Content>
                <Form onSubmit={() => startNewTournament(props.sortedPlayers.slice(0, 8), newTournamentName)}>
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
                                {getLadderTableRows(props.sortedPlayers)}
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
    );
}

export default NewTournament;