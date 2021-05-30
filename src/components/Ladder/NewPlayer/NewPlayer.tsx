import {Form, Modal, Icon, Card, Button} from "semantic-ui-react";
import {SemanticICONS} from "semantic-ui-react/dist/commonjs/generic";
import React, {useState} from "react";
import "./NewPlayer.css";
import {QuickHitAPI} from "../../../api/QuickHitAPI";
import {DB_Player} from "../../../types/database/models";
import {v4 as uuidv4} from 'uuid';
import {makeErrorToast, makeSuccessToast} from "../../Toast/Toast";
import {FA_ICONS} from "../../../util/fa-icons";
import {QuickHitPage} from "../../../util/QuickHitPage";

interface NewPlayerProps {
    customModalOpenElement?: JSX.Element
}

const renderIconOption = (icon: SemanticICONS) => {
    return { key: icon, text: <Icon name={icon} size={"big"}/>, value: icon }
}

const iconOptions = FA_ICONS.map((icon) => renderIconOption(icon));

/**
 * QuickHit NewPlayer component.
 */
function NewPlayer(props: NewPlayerProps) {
    const [open, setModalOpen] = React.useState(false)
    const [icon, setIcon] = useState<string | any>("");
    const [name, setName] = useState<string>("");

    const sendCreateRequest = () => {
        const onSuccess = () => {
            makeSuccessToast("Player added!", "Welcome to QuickHit!");
            setModalOpen(false);

            // FIXME Replace this with firing an event to the parent to force a new request without refreshing
            // the application.
            setTimeout( () => {
                window.location.href = QuickHitPage.LADDER;
            }, 1000);
        }

        const onError = (errorMsg: string) => {
            makeErrorToast("Player not added!", errorMsg);
        }

        const player : DB_Player = {
            id: uuidv4(),
            name,
            icon,
            /* Default ELO rank */
            elo: 1200
        };

        QuickHitAPI.addOrUpdatePlayer(player, onSuccess, onError);
    }

    return (
        <Modal
            onClose={() => setModalOpen(false)}
            onOpen={() => setModalOpen(true)}
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
                        <Form.Input fluid label='Name' required placeholder='Name'
                                    onChange={(event, data) => setName(data.value)}/>
                        <Form.Select fluid label='Icon' required placeholder='user'
                                     options={iconOptions}
                                     search={(options, value) => {return options.filter((option) => option.value?.toString().startsWith(value))}}
                                     onChange={(event, data) => setIcon(data.value)} />
                    </Form.Group>
                    <Card>
                        Picture preview: {icon ? <Icon name={icon} size={"huge"} circular style={{margin: "auto", color: "orangered"}}/> : "Select or type an icon name."}
                    </Card>
                    <Form.Group><a href={"https://react.semantic-ui.com/elements/icon/"} target="_blank" rel={"noreferrer"}><Icon name={"help"}>Icon search</Icon></a></Form.Group>
                    <Form.Button>Create</Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

export default NewPlayer;