import {Form, Modal, Icon, Button} from "semantic-ui-react";
import React from "react";
import {v4 as uuidv4} from 'uuid';
import {DB_Match, DB_Player} from "../../../types/database/models";
import {QuickHitAPI} from "../../../api/QuickHitAPI";
import {makeErrorToast, makeSuccessToast} from "../../Toast/Toast";

interface NewGameProps {
    players: DB_Player[],
}

/**
 * QuickHit NewPlayer component.
 */
function NewGame(props: NewGameProps) {
    const [open, setModalOpen] = React.useState<boolean>(false)
    const [winningPlayerId, setWinningPlayerId] = React.useState<string>("")
    const [losingPlayerId, setLosingPlayerId] = React.useState<string>("")
    const [winningPlayerScore, setWinningPlayerScore] = React.useState<number>(0)
    const [losingPlayerScore, setLosingPlayerScore] = React.useState<number>(0)

    const sendCreateRequest =  ()  => {
        const onSuccess = () => {
            makeSuccessToast("Game added!", "Back to work?");
            setModalOpen(false);

            // FIXME Replace this with firing an event to the parent to force a new request without refreshing
            // the application.
            setTimeout( () => {
                window.location.href = "/players";
            }, 1000);
        }

        const onError = (errorMsg: string) => {
            makeErrorToast("Game not added!", errorMsg);
        }

        if (winningPlayerScore < losingPlayerScore)
        {
            makeErrorToast("Come on man", "Winning player score must be higher than losing player score");
            return;
        }

        const matchToAdd : DB_Match = {
            id: uuidv4(),
            date: new Date().toDateString(),
            winning_player_id: winningPlayerId,
            winning_player_score: winningPlayerScore,
            losing_player_id: losingPlayerId,
            losing_player_score: losingPlayerScore
        }

        QuickHitAPI.addNewMatch(matchToAdd, onSuccess, onError);
    }

    const renderPlayerOption = (player: DB_Player) => {
        return { key: player.id, text: <span><Icon name={player.icon} size={"small"}/>{player.name}</span>, value: player.id}
    }

    return (
        <Modal
            onClose={() => setModalOpen(false)}
            onOpen={() => setModalOpen(true)}
            open={open}
            trigger={<Button inverted><Icon name={'trophy'}/>Enter game</Button>}
        >
            <Modal.Header>
                <Icon name='plus'/>
                New game
            </Modal.Header>
            <Modal.Content>
                <Form onSubmit={sendCreateRequest}>
                    <Form.Group widths='equal'>
                        <Form.Select
                            fluid
                            label={<b>Winning player<Icon name={"trophy"}/></b>}
                            options={props.players.map((player) => renderPlayerOption(player))}
                            placeholder='Chicken Dinner'
                            required
                            onChange={(event, data) => setWinningPlayerId(data.value as string)}
                        />
                        <Form.Field>
                            <label>Winning player score</label>
                            <input type={"number"} min={0} required
                                   onChange={(event) => setWinningPlayerScore(parseInt(event.target.value))}
                            />
                        </Form.Field>
                        <Form.Select
                            fluid
                            label={<b>Losing player<Icon name={"close"}/></b>}
                            options={props.players.map((player) => renderPlayerOption(player))}
                            placeholder='Big Dog'
                            required
                            onChange={(event, data) => setLosingPlayerId(data.value as string)}
                        />
                        <Form.Field>
                            <label>Losing player score</label>
                            <input type={"number"} min={0} required
                            onChange={(event) => setLosingPlayerScore(parseInt(event.target.value))}/>
                        </Form.Field>
                    </Form.Group>
                    <Form.Button>GG</Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

export default NewGame;