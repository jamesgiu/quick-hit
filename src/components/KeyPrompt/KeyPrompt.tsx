import React, { useEffect, useState } from "react";
import { Button, DropdownItemProps, Form, Icon, Menu, Modal } from "semantic-ui-react";
import { makeErrorToast, makeSuccessToast } from "../Toast/Toast";
import { DbInstance } from "../../types/database/models";
import { QuickHitAPI } from "../../api/QuickHitAPI";
import "./KeyPrompt.css";
import firebase from "firebase/compat";
import "firebase/auth";
import { AuthUserDetail } from "../../redux/types/AuthTypes";
import ReactGA from "react-ga";
export interface KeyPromptProps {
    chosenInstance?: DbInstance;
    authKey?: string;
    authDetail?: AuthUserDetail;
    setAuthKey: (newKey: string) => void;
    setChosenInstance: (newInstance: DbInstance) => void;
    setAuthDetail: (newAuthDetail?: AuthUserDetail) => void;
}

/**
 * QuickHit KeyPrompt prompt.
 */
function KeyPrompt(props: KeyPromptProps): JSX.Element {
    const [key, setKey] = useState<string>("");
    const [chosenInstance, setChosenInstance] = useState<DbInstance>(props.chosenInstance as DbInstance);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [instances, setInstances] = useState<DbInstance[]>([]);
    const [token, setToken] = useState<string>();
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");

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

    const signInWithGoogle = (): void => {
        const firebaseConfig = {
            apiKey: chosenInstance?.fb_api_key,
            authDomain: chosenInstance?.fb_project_id + ".firebaseapp.com",
            databaseURL: chosenInstance?.fb_project_id + ".firebaseio.com",
            projectId: chosenInstance?.fb_project_id,
        };

        if (!firebase.apps.length) {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
        }

        const auth = firebase.auth();

        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        auth.signInWithPopup(provider)
            .then((result) => {
                result.user?.getIdToken().then((token) => {
                    setToken(token);
                    setUserName(result.user?.displayName as string);
                    setEmail(result.user?.email as string);

                    ReactGA.event({
                        category: "Request",
                        action: `User ${result.user?.displayName} (${result.user?.email}) authenticated`,
                    });
                });
            })
            .catch((error) => {
                makeErrorToast("Unable to authenticate", "Could not sign in via Google! " + error.message);
            });
    };

    const renderInstanceOption = (instance: DbInstance): DropdownItemProps => {
        return {
            key: instance.fb_url,
            text: <span>{instance.name}</span>,
            value: JSON.stringify(instance),
        };
    };

    return (
        <Modal
            open={props.authKey === undefined || props.chosenInstance === undefined || isOpen}
            onClose={(): void => setIsOpen(false)}
            onOpen={(): void => setIsOpen(true)}
            closeOnDimmerClick={false}
            trigger={
                <Menu.Item
                    as={"a"}
                    icon={props.authDetail ? "key" : "exclamation mark"}
                    className={!props.authDetail ? "required-sign-in" : "signed-in"}
                ></Menu.Item>
            }
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
                        {
                            //TODO ensure users need to supply a secret _and_ login via google???
                            chosenInstance?.google_auth ? (
                                <Form.Field>
                                    <Form.Button
                                        className="google-button"
                                        onClick={signInWithGoogle}
                                        color={"google plus"}
                                    >
                                        <Icon name={"google"} />
                                        {!userName
                                            ? props.authDetail?.userName
                                                ? props.authDetail.userName
                                                : "Select an account with Google"
                                            : `${userName}`}
                                    </Form.Button>
                                </Form.Field>
                            ) : (
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
                            )
                        }
                    </Form.Group>
                </Form>
                <Button
                    disabled={userName == "" && key == ""}
                    onClick={(): void => {
                        props.setAuthKey(key);
                        props.setChosenInstance(chosenInstance);

                        if (token) {
                            props.setAuthDetail({ idToken: token, userName, email });
                            makeSuccessToast("Authenticated", "Signed in as " + userName);
                        }
                        // If no token granted here, then reset the redux token too.
                        else {
                            props.setAuthDetail(undefined);
                            setToken(undefined);
                        }
                        setIsOpen(false);
                        // Allow for the async Redux calls.
                        setTimeout(() => location.reload(), 500);
                    }}
                >
                    Save
                </Button>
            </Modal.Content>
        </Modal>
    );
}

export default KeyPrompt;
