import React, {useState} from 'react';
import {Button, Form, Icon, Menu, Modal} from "semantic-ui-react";

interface KeyPromptProps {
    authKey?: string,
    setAuthKey: (newKey: string) => void,
}

/**
 * QuickHit KeyPrompt prompt.
 */
function KeyPrompt(props : KeyPromptProps) {
    const [key, setKey] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <Modal
            open={props.authKey === undefined || isOpen}
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            trigger={<Menu.Item as={"a"} icon={"key"}/>}
        >
            <Modal.Header>
                <Icon name='key'/>
                Enter key
            </Modal.Header>
            <Modal.Content className={"key-form"}>
                <Form warning>
                    <Form.Group widths={"equal"}>
                        <Form.Field>
                            <Form.Input fluid label='Key required to proceed' required placeholder='Key for table tennis service account'
                                        onChange={(event, data) => setKey(data.value)}/>
                        </Form.Field>
                    </Form.Group>
                </Form>
                <Button icon={"key"} onClick={()=> {
                    props.setAuthKey(key);
                    setIsOpen(false);
                    location.reload();
                }}>Proceed</Button>
            </Modal.Content>
        </Modal>
    );
}

export default KeyPrompt;
