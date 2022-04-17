import { Button, Card, DropdownItemProps, Form, Icon, Modal, SemanticICONS } from "semantic-ui-react";
import React, { useState } from "react";
import "./NewEditPlayer.css";
import { FA_ICONS } from "../../util/fa-icons";
import { makeErrorToast, makeSuccessToast } from "../Toast/Toast";
import { DbDoublesPair, DbPlayer } from "../../types/database/models";
import { v4 as uuidv4 } from "uuid";
import { QuickHitAPI } from "../../api/QuickHitAPI";
import { renderPlayerOption } from "../NewGame/NewGame";
import { getPlayersMap } from "../QHDataLoader/QHDataLoader";

interface NewEditPlayerProps {
    editingPlayer?: DbPlayer | DbDoublesPair;
    customModalOpenElement?: JSX.Element;
    onRequestMade?: () => void;
    doublesOnly?: boolean;
    players?: DbPlayer[];
}

const renderIconOption = (icon: SemanticICONS): DropdownItemProps => {
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
    const [firstPlayer, setFirstPlayer] = useState<DbPlayer>();
    const [secondPlayer, setSecondPlayer] = useState<DbPlayer>();

    let playersMap;

    if (props.players) {
        playersMap = getPlayersMap(props.players);
    }

    const sendCreateRequest = (): void => {
        const onSuccess = (): void => {
            if (props.editingPlayer) {
                makeSuccessToast("Player updated!", `Welcome back, ${name}!`);
            } else {
                makeSuccessToast("Player added!", "Welcome to QuickHit!");
            }
            setModalOpen(false);

            if (props.onRequestMade) {
                props.onRequestMade();
            }
        };

        const onError = (errorMsg: string): void => {
            if (props.editingPlayer) {
                makeErrorToast("Player not updated!", errorMsg);
            } else {
                makeErrorToast("Player not added!", errorMsg);
            }
        };

        if (props.doublesOnly) {
            if (!firstPlayer || !secondPlayer) {
                makeErrorToast("Not enough team members", "You must specify two players to be a part of this duo!");
                return;
            }

            if (firstPlayer.id === secondPlayer.id) {
                makeErrorToast("Seriously?", "There's no I in team!");
                return;
            }

            const pair: DbDoublesPair = {
                id: props.editingPlayer?.id ?? uuidv4(),
                name,
                icon: icon as SemanticICONS,
                /* Default ELO rank, or the updated player's ELO. */
                elo: props.editingPlayer?.elo ?? 1200,
                player1_id: firstPlayer.id,
                player2_id: secondPlayer.id,
            };
            QuickHitAPI.addOrUpdateDoublesPair(pair, onSuccess, onError);
        } else {
            const player: DbPlayer = {
                id: props.editingPlayer?.id ?? uuidv4(),
                name,
                icon: icon as SemanticICONS,
                /* Default ELO rank, or the updated player's ELO. */
                elo: props.editingPlayer?.elo ?? 1200,
            };

            QuickHitAPI.addOrUpdatePlayer(player, onSuccess, onError);
        }
    };

    // Mark the current player as retired.
    const retirePlayer = (): void => {
        if (props.editingPlayer) {
            const onSuccess = (): void => {
                makeSuccessToast("Player retired!", `Sorry to see you go, ${name}.`);
                setModalOpen(false);

                if (props.onRequestMade) {
                    props.onRequestMade();
                }
            };

            const onError = (errorMsg: string): void => {
                makeErrorToast("Player not retired!", errorMsg);
            };

            if (props.doublesOnly) {
                QuickHitAPI.addOrUpdateDoublesPair(
                    { ...props.editingPlayer, retired: true } as DbDoublesPair,
                    onSuccess,
                    onError
                );
            } else {
                QuickHitAPI.addOrUpdatePlayer({ ...props.editingPlayer, retired: true }, onSuccess, onError);
            }
        }
    };

    // Mark the current player as active/unretired.
    const unretirePlayer = (): void => {
        if (props.editingPlayer) {
            const onSuccess = (): void => {
                makeSuccessToast("Player unretired!", `Glad you could join us again, ${name}.`);
                setModalOpen(false);

                if (props.onRequestMade) {
                    props.onRequestMade();
                }
            };

            const onError = (errorMsg: string): void => {
                makeErrorToast("Player not unretired!", errorMsg);
            };

            if (props.doublesOnly) {
                QuickHitAPI.addOrUpdateDoublesPair(
                    { ...props.editingPlayer, retired: false } as DbDoublesPair,
                    onSuccess,
                    onError
                );
            } else {
                QuickHitAPI.addOrUpdatePlayer({ ...props.editingPlayer, retired: false }, onSuccess, onError);
            }
        }
    };

    return (
        <Modal
            closeIcon
            onClose={(): void => setModalOpen(false)}
            onOpen={(): void => setModalOpen(true)}
            open={open}
            trigger={
                props.customModalOpenElement ?? (
                    <Button inverted>
                        <Icon name={"user plus"} />
                        {props.doublesOnly ? "New Doubles Team" : "New Player"}
                    </Button>
                )
            }
        >
            <Modal.Header>
                {props.editingPlayer ? (
                    <span>
                        <Icon name="pencil" />
                        {props.doublesOnly ? "Edit Doubles Team" : "Edit Player"}
                    </span>
                ) : (
                    <span>
                        <Icon name="plus" />
                        {props.doublesOnly ? "New Doubles Team" : "New Player"}
                    </span>
                )}
            </Modal.Header>
            <Modal.Content>
                <Form>
                    {props.doublesOnly && props.players && playersMap && (
                        <Form.Group>
                            <Form.Field>
                                <Form.Select
                                    label={"Player 1"}
                                    required
                                    options={
                                        props.players &&
                                        props.players
                                            .filter((player) => !player.retired)
                                            .map((player) => renderPlayerOption(player))
                                    }
                                    search={(options, value): DropdownItemProps[] => {
                                        return options.filter((option) => {
                                            const player = JSON.parse(option.value as string);
                                            return player.name.toLowerCase().includes(value.toLowerCase());
                                        });
                                    }}
                                    defaultValue={
                                        props.editingPlayer
                                            ? JSON.stringify(
                                                  playersMap.get((props.editingPlayer as DbDoublesPair)["player1_id"])
                                              )
                                            : undefined
                                    }
                                    placeholder={"Average QuickHit user"}
                                    onChange={(_, data): void => {
                                        const user = JSON.parse(data.value as string);
                                        setFirstPlayer(user);
                                    }}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Select
                                    label={"Player 2"}
                                    required
                                    options={
                                        props.players &&
                                        props.players
                                            .filter((player) => !player.retired)
                                            .map((player) => renderPlayerOption(player))
                                    }
                                    search={(options, value): DropdownItemProps[] => {
                                        return options.filter((option) => {
                                            const player = JSON.parse(option.value as string);
                                            return player.name.toLowerCase().includes(value.toLowerCase());
                                        });
                                    }}
                                    defaultValue={
                                        props.editingPlayer
                                            ? JSON.stringify(
                                                  playersMap.get((props.editingPlayer as DbDoublesPair)["player2_id"])
                                              )
                                            : undefined
                                    }
                                    placeholder={"Average QuickHit user"}
                                    onChange={(_, data): void => {
                                        const user = JSON.parse(data.value as string);
                                        setSecondPlayer(user);
                                    }}
                                />
                            </Form.Field>
                        </Form.Group>
                    )}
                    <Form.Group widths="equal">
                        <Form.Input
                            fluid
                            label={props.doublesOnly ? "Team name" : "Name"}
                            required
                            placeholder="Name"
                            onChange={(event, data): void => setName(data.value)}
                            value={name}
                        />
                        <Form.Select
                            fluid
                            label={props.doublesOnly ? "Team icon" : "Icon"}
                            required
                            placeholder="user"
                            options={iconOptions}
                            search={(options, value): DropdownItemProps[] => {
                                return options.filter((option) => option.value?.toString().startsWith(value));
                            }}
                            onChange={(event, data): void => setIcon(data.value as string)}
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
                    <Form.Group className={"action-btns"}>
                        {props.editingPlayer && !props.editingPlayer.retired && (
                            <Form.Button negative onClick={retirePlayer}>
                                Mark as retired
                            </Form.Button>
                        )}
                        {props.editingPlayer && props.editingPlayer.retired && (
                            <Form.Button primary onClick={unretirePlayer}>
                                Mark as unretired
                            </Form.Button>
                        )}
                        <Form.Button positive onClick={sendCreateRequest}>
                            {props.editingPlayer ? <span>Update</span> : <span>Create</span>}
                        </Form.Button>
                    </Form.Group>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

export default NewEditPlayer;
