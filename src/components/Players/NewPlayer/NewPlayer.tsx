import {Form, Modal, Icon, Card, Button} from "semantic-ui-react";
import React, {useState} from "react";
import "./NewPlayer.css";
import {QuickHitAPI} from "../../../api/QuickHitAPI";
import {DB_Player} from "../../../types/database/models";
import {v4 as uuidv4} from 'uuid';
import {makeErrorToast, makeSuccessToast} from "../../Toast/Toast";

interface NewPlayerProps {
    customModalOpenElement?: JSX.Element
}

/**
 * QuickHit NewPlayer component.
 */
function NewPlayer(props: NewPlayerProps) {
    const [icon, setIcon] = useState<string | any>("");
    const [name, setName] = useState<string>("");
    const [open, setOpen] = React.useState(false)

    const sendCreateRequest = () => {
        const onSuccess = () => {
            makeSuccessToast("Player added!", "Welcome to QuickHit!");

            // FIXME Replace this with firing an event to the parent to force a new request without refreshing
            // the application.
            setTimeout( () => {
                window.location.href = "/players";
            }, 1000);
        }

        const onError = (errorMsg: string) => {
            makeErrorToast("Player not added!", errorMsg);
        }

        const player : DB_Player = {
            id: uuidv4(),
            name,
            icon
        };

        QuickHitAPI.addNewPlayer(player, onSuccess, onError);
    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={props.customModalOpenElement ?? <Button inverted><Icon name={'user plus'}/>New player</Button>}
        >
            <Modal.Header>
                <Icon name='plus'/>
                New player
            </Modal.Header>
            <Modal.Content>
                <Form onSubmit={sendCreateRequest}>
                    <Form.Group widths='equal'>
                        <Form.Input fluid label='Name' placeholder='Name' onChange={(event, data) => setName(data.value)}/>
                        <Form.Input fluid label='Icon' placeholder='user' onChange={(event, data) => setIcon(data.value)} />
                        Check https://react.semantic-ui.com/elements/icon/ for icon values.
                    </Form.Group>
                    <Card>
                        Picture preview: {icon ? <Icon name={icon} size={"huge"} circular style={{margin: "auto", color: "orangered"}}/> : "Type an icon name."}
                    </Card>
                    <Form.Button>Create</Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

export default NewPlayer;