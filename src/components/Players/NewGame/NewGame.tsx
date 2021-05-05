import {Form, Modal, Icon, Button} from "semantic-ui-react";
import React from "react";
import {DB_Player} from "../../../types/database/models";

interface NewGameProps {
    players: DB_Player[],
}

/**
 * QuickHit NewPlayer component.
 */
function NewGame(props: NewGameProps) {
    const [open, setOpen] = React.useState(false)

    const sendCreateRequest = () => {
        //TODO add new game API call here
    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
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
                            label='Player 1'
                            options={props.players.map((player) => {
                                return { key: player.id, text: <span><Icon name={player.icon} size={"small"}/>{player.name}</span>, value: player.id} })}
                            placeholder='Travis'
                        />
                        <Form.Field>
                            <label>Player 1 score</label>
                            <input type={"number"}/>
                        </Form.Field>
                        <Form.Select
                            fluid
                            label='Player 2'
                            options={props.players.map((player) => {
                                return { key: player.id, text: <span><Icon name={player.icon} size={"small"}/>{player.name}</span>, value: player.id} })}
                            placeholder='Big Dog'
                        />
                        <Form.Field>
                            <label>Player 2 score</label>
                            <input type={"number"}/>
                        </Form.Field>
                    </Form.Group>
                    <Form.Button>GG</Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

export default NewGame;