import React, { useEffect, useState } from "react";
import { Button, DropdownItemProps, Form, Icon, Menu, Modal } from "semantic-ui-react";
import { makeErrorToast } from "../Toast/Toast";
import { DbInstance } from "../../types/database/models";
import { QuickHitAPI } from "../../api/QuickHitAPI";
import "./KeyPrompt.css";

export interface KeyPromptProps {
    chosenInstance?: DbInstance;
    authKey?: string;
    setAuthKey: (newKey: string) => void;
    setChosenInstance: (newInstance: DbInstance) => void;
}

/**
 * QuickHit KeyPrompt prompt.
 */
function KeyPrompt(props: KeyPromptProps): JSX.Element {
    const [key, setKey] = useState<string>(props.authKey ?? "");
    const [chosenInstance, setChosenInstance] = useState<DbInstance>(props.chosenInstance as DbInstance);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [instances, setInstances] = useState<DbInstance[]>([]);

    const getInstances = (): void => {
        const onFailure = (error: string): void => {
            makeErrorToast("Could not load instances catalogue!", error);
        };

        const onSuccess = (instances: DbInstance[]): void => {
            setInstances(instances);
        };

        QuickHitAPI.getInstances(onSuccess, onFailure);
    };

    useEffect(() => {
        getInstances();
    }, []);

    const renderInstanceOption = (instance: DbInstance): DropdownItemProps => {
        return {
            key: instance.fb_url,
            text: <span>{instance.name}</span>,
            value: JSON.stringify(instance),
        };
    };

    return (
        <Modal
            open={props.authKey === undefined || isOpen}
            onClose={(): void => setIsOpen(false)}
            onOpen={(): void => setIsOpen(true)}
            trigger={<Menu.Item as={"a"} icon={"key"} />}
            closeIcon
        >
            <Modal.Header>
                <Icon name="key" />
                Enter key
            </Modal.Header>
            <Modal.Content className={"key-form"}>
                <Form warning>
                    <Form.Group widths={"equal"}>
                        <Form.Select
                            className={"instance-select"}
                            fluid
                            label={
                                <b>
                                    Instance
                                    <Icon name={"location arrow"} />
                                </b>
                            }
                            options={instances.map((instance) => renderInstanceOption(instance))}
                            search={(options, value): DropdownItemProps[] => {
                                return options.filter((option) => {
                                    const instance = JSON.parse(option.value as string);
                                    return instance.name.toLowerCase().includes(value.toLowerCase());
                                });
                            }}
                            placeholder="Select an instance"
                            required
                            onChange={(event, data): void => setChosenInstance(JSON.parse(data.value as string))}
                            value={chosenInstance ? renderInstanceOption(chosenInstance).value : ""}
                        />
                        <Form.Field>
                            <Form.Input
                                fluid
                                label="Key required to proceed"
                                required
                                placeholder="Key to access this instance"
                                type="password"
                                onChange={(event, data): void => setKey(data.value)}
                            />
                        </Form.Field>
                    </Form.Group>
                </Form>
                <Button
                    icon={"key"}
                    onClick={(): void => {
                        props.setAuthKey(key);
                        if (chosenInstance) {
                            props.setChosenInstance(chosenInstance);
                        }
                        setIsOpen(false);
                        location.reload();
                    }}
                >
                    Save
                </Button>
            </Modal.Content>
        </Modal>
    );
}

export default KeyPrompt;
