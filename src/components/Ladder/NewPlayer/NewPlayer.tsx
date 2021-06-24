import {Button, Card, Form, Icon, Modal, SemanticICONS} from "semantic-ui-react";
import React, {useState} from "react";
import "./NewPlayer.css";
import {FA_ICONS} from "../../../util/fa-icons";
import {makeErrorToast, makeSuccessToast} from "../../Toast/Toast";
import {DbPlayer} from "../../../types/database/models";
import { v4 as uuidv4 } from 'uuid';
import {QuickHitAPI} from "../../../api/QuickHitAPI";

interface NewPlayerProps {
    customModalOpenElement?: JSX.Element
    onNewPlayerAdded?: ()=>void,
}

const renderIconOption = (icon: SemanticICONS) => {
    return { key: icon, text: <Icon name={icon} size={"big"}/>, value: icon }
}

const iconOptions = FA_ICONS.map((icon) => renderIconOption(icon));

/**
 * QuickHit NewPlayer component.
 */
function NewPlayer(props: NewPlayerProps) : JSX.Element {
    const [open, setModalOpen] = React.useState(false)
    const [icon, setIcon] = useState<string>("");
    const [name, setName] = useState<string>("");

    const sendCreateRequest = () => {
        const onSuccess = () => {
            makeSuccessToast("Player added!", "Welcome to QuickHit!");
            setModalOpen(false);

            if (props.onNewPlayerAdded) {
                props.onNewPlayerAdded();
            }
        }

        const onError = (errorMsg: string) => {
            makeErrorToast("Player not added!", errorMsg);
        }

        const player : DbPlayer = {
            id: uuidv4(),
            name,
            icon: icon as SemanticICONS,
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
                                     onChange={(event, data) => setIcon(data.value as string)} />
                    </Form.Group>
                    <Card>
                        Picture preview: {icon ? <Icon name={icon as SemanticICONS} size={"huge"} circular style={{margin: "auto", color: "orangered"}}/> : "Select or type an icon name."}
                    </Card>
                    <Form.Group><a href={"https://react.semantic-ui.com/elements/icon/"} target="_blank" rel={"noreferrer"}><Icon name={"help"}>Icon search</Icon></a></Form.Group>
                    <Form.Button>Create</Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

export default NewPlayer;