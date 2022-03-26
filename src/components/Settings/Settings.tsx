import * as DarkReader from "darkreader";
import React, { useState } from "react";
import { Button, DropdownItemProps, Form, Icon, Menu, Modal } from "semantic-ui-react";
import { SettingsDispatchType } from "../../containers/Settings/Settings";
import { renderPlayerOption } from "../NewGame/NewGame";
import { DbPlayer } from "../../types/database/models";

export interface SettingsProps {
    hideZeroGamePlayers: boolean;
    showCards: boolean;
    disableMusic: boolean;
    currentUser?: DbPlayer;
    darkMode: boolean;
    players: DbPlayer[];
}

const DARKMODE_THEME = {
    brightness: 100,
    contrast: 90,
    sepia: 10,
};

/**
 * QuickHit Settings menu.
 */
function Settings(props: SettingsProps & SettingsDispatchType): JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    if (props.darkMode) {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable(DARKMODE_THEME);
    }

    return (
        <Modal
            open={isOpen}
            onClose={(): void => setIsOpen(false)}
            onOpen={(): void => setIsOpen(true)}
            trigger={<Menu.Item as={"a"} icon={"wrench"} />}
            closeIcon
        >
            <Modal.Header>
                <Icon name="wrench" />
                Settings
            </Modal.Header>
            <Modal.Content className={"options-form"}>
                <Form>
                    <Form.Group>
                        <Form.Field>
                            <Form.Select
                                label={"Player"}
                                options={props.players.map((player) => renderPlayerOption(player))}
                                search={(options, value): DropdownItemProps[] => {
                                    return options.filter((option) => {
                                        const player = JSON.parse(option.value as string);
                                        return player.name.toLowerCase().includes(value.toLowerCase());
                                    });
                                }}
                                defaultValue={JSON.stringify(props.currentUser)}
                                placeholder={"Average QuickHit user"}
                                onChange={(_, data): void => {
                                    const user = JSON.parse(data.value as string);
                                    props.setCurrentUser(user);
                                }}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group>
                        <Form.Radio
                            toggle
                            label={"Hide zero game players"}
                            checked={props.hideZeroGamePlayers}
                            onClick={(): void => {
                                props.setHideUnplacedPlayers(!props.hideZeroGamePlayers);
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Radio
                            toggle
                            label={"Show ladder as player cards"}
                            checked={props.showCards}
                            onClick={(): void => {
                                props.setShowCards(!props.showCards);
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Radio
                            toggle
                            label={"Make QuickHit even darker"}
                            checked={props.darkMode}
                            onClick={(): void => {
                                const newDarkMode = !props.darkMode;
                                props.setDarkMode(newDarkMode);
                                if (newDarkMode) {
                                    DarkReader.setFetchMethod(window.fetch);
                                    DarkReader.enable(DARKMODE_THEME);
                                } else {
                                    DarkReader.disable();
                                }
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Radio
                            toggle
                            label={"Disable music 😔"}
                            checked={props.disableMusic}
                            onClick={(): void => {
                                props.setDisableMusic(!props.disableMusic);
                            }}
                        />
                    </Form.Group>
                </Form>
                <Button
                    icon={"cross"}
                    onClick={(): void => {
                        setIsOpen(false);
                    }}
                >
                    Close
                </Button>
            </Modal.Content>
        </Modal>
    );
}

export default Settings;
