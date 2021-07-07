import { Button, Card, Form, Icon, Modal, SemanticICONS } from "semantic-ui-react";
import React, { useState } from "react";
import "./NewEditPlayer.css";
import { FA_ICONS } from "../../../util/fa-icons";
import { makeErrorToast, makeSuccessToast } from "../../Toast/Toast";
import { DbPlayer } from "../../../types/database/models";
import { v4 as uuidv4 } from "uuid";
import { QuickHitAPI } from "../../../api/QuickHitAPI";

interface NewEditPlayerProps {
    editingPlayer?: DbPlayer;
    customModalOpenElement?: JSX.Element;
    onRequestMade?: () => void;
}

const renderIconOption = (icon: SemanticICONS) => {
    return { key: icon, text: <Icon name={icon} size={"big"} />, value: icon };
};

const iconOptions = FA_ICONS.map((icon) => renderIconOption(icon));

/**
 * QuickHit NewEditPlayer component.
 */
function NewEditPlayer(props: NewEditPlayerProps): JSX.Element {
    const [open, setModalOpen] = React.useState(false);
    const [icon, setIcon] = useState<string>(props.editingPlayer ? props.editingPlayer.icon : "");
    const [name, setName] = useState<string>(props.editingPlayer ? props.editingPlayer.name : "");

    const sendCreateRequest = () => {
        const onSuccess = () => {
            if (props.editingPlayer) {
                makeSuccessToast("Player updated!", `Welcome back, ${player.name}!`);
            } else {
                makeSuccessToast("Player added!", "Welcome to QuickHit!");
            }
            setModalOpen(false);

            if (props.onRequestMade) {
                props.onRequestMade();
            }
        };

        const onError = (errorMsg: string) => {
            if (props.editingPlayer) {
                makeErrorToast("Player not updated!", errorMsg);
            } else {
                makeErrorToast("Player not added!", errorMsg);
            }
        };

        const player: DbPlayer = {
            id: props.editingPlayer?.id ?? uuidv4(),
            name,
            icon: icon as SemanticICONS,
            /* Default ELO rank, or the updated player's ELO. */
            elo: props.editingPlayer?.elo ?? 1200,
        };

        QuickHitAPI.addOrUpdatePlayer(player, onSuccess, onError);
    };

    return (
        <Modal
            onClose={() => setModalOpen(false)}
            onOpen={() => setModalOpen(true)}
            open={open}
            trigger={
                props.customModalOpenElement ?? (
                    <Button inverted>
                        <Icon name={"user plus"} />
                        New player
                    </Button>
                )
            }
        >
            <Modal.Header>
                {props.editingPlayer ? (
                    <span>
                        <Icon name="pencil" />
                        Edit Player
                    </span>
                ) : (
                    <span>
                        <Icon name="plus" />
                        New Player
                    </span>
                )}
            </Modal.Header>
            <Modal.Content>
                <Form onSubmit={sendCreateRequest}>
                    <Form.Group widths="equal">
                        <Form.Input
                            fluid
                            label="Name"
                            required
                            placeholder="Name"
                            onChange={(event, data) => setName(data.value)}
                            value={name}
                        />
                        <Form.Select
                            fluid
                            label="Icon"
                            required
                            placeholder="user"
                            options={iconOptions}
                            search={(options, value) => {
                                return options.filter((option) => option.value?.toString().startsWith(value));
                            }}
                            onChange={(event, data) => setIcon(data.value as string)}
                            value={icon}
                        />
                    </Form.Group>
                    <Card>
                        Picture preview:{" "}
                        {icon ? (
                            <Icon
                                name={icon as SemanticICONS}
                                size={"huge"}
                                circular
                                style={{ margin: "auto", color: "orangered" }}
                            />
                        ) : (
                            "Select or type an icon name."
                        )}
                    </Card>
                    <Form.Group>
                        <a href={"https://react.semantic-ui.com/elements/icon/"} target="_blank" rel={"noreferrer"}>
                            <Icon name={"help"}>Icon search</Icon>
                        </a>
                    </Form.Group>
                    <Form.Button>{props.editingPlayer ? <span>Update</span> : <span>Create</span>}</Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

export default NewEditPlayer;
