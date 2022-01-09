import React, { useState } from "react";
import { Button, Form, Icon, Menu, Modal } from "semantic-ui-react";
import { SettingsDispatchType } from "../../containers/Settings/Settings";
import { useDarkreader } from "react-darkreader";

export interface SettingsProps {
    hideZeroGamePlayers: boolean;
    showCards: boolean;
    disableMusic: boolean;
    username: string;
    darkMode: boolean;
}

/**
 * QuickHit Settings menu.
 */
function Settings(props: SettingsProps & SettingsDispatchType): JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isDarkMode, { toggle }] = useDarkreader(props.darkMode);

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
                            <Form.Input
                                label={"Set username (e.g. for chat)"}
                                onChange={(event, data): void => {
                                    if (data.value.length <= 128) {
                                        props.setUsername(data.value);
                                    }
                                }}
                                value={decodeURIComponent(props.username)}
                                maxlength="128"
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group>
                        <Form.Radio
                            toggle
                            label={"Hide zero game players"}
                            checked={props.hideZeroGamePlayers}
                            onClick={(): void => {
                                props.setHideZeroGamePlayers(!props.hideZeroGamePlayers);
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
                            checked={isDarkMode}
                            onClick={(): void => {
                                props.setDarkMode(!props.darkMode);
                                toggle();
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
